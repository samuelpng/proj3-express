const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Customer, BlacklistedToken } = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares')
const {
    createCustomer
} = require('../../dal/customers')


// const generateAccessToken = (customer, secret, expiry) => {
//     return jwt.sign({
//         first_name: customer.get('first_name'),
//         last_name: customer.get('last_name'),
//         id: customer.get('id'),
//         email: customer.get('email')
//     }, secret, {
//         expiresIn: expiry
//     });
// }

const generateAccessToken = function (id, username, first_name, last_name, email, tokenSecret, expiry) {
    return jwt.sign(
        { id, username, first_name, last_name, email },
        tokenSecret,
        { expiresIn: expiry }
    );
};

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

//=== Routes ===

router.post('/register', async (req, res) => {
    let errorMsg = {};
    
    const username = req.body.username;
    if (username.length == 0 || username.length >20) {
        errorMsg.username = "Username must not be more than 20 characters long"
    }

    const first_name = req.body.first_name;
    if (first_name.length == 0 || first_name.length >45) {
        errorMsg.firstName = "First name must not be more than 45 characters long"
    }

    const last_name = req.body.last_name;
    if (last_name.length == 0 || last_name.length >45) {
        errorMsg.lastName = "Last name must not be more than 45 characters long"
    }

    const email = req.body.email;
    if (email.length == 0 || email.length >320) {
        errorMsg.email = "Please input a valid email address"
    }

    const password = req.body.password;
	if (password.length == 0 || password.length > 150) {
		error.password = 'Password must not be more than 150 characters long';
	}

    const contact_number = req.body.contact_number;
    if (contact_number.length == 0 || contact_number.length > 15) {
        errorMsg.contactNumber = "Please input a valid contact number"
    }

    //if there is an error in user input, return error response
    if (Object.keys(errorMsg).length > 0) {
		sendResponse(res, 400, error);
		return;
	}

    const customerData = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: getHashedPassword(password),
        contact_number: contact_number,
        created_date: new Date()
    }

    // const customer = new Customer(customerData);
	// await customer.save();

    const customer = new Customer();
    customer.set(customerData)
    await customer.save();
    res.status(201);
    res.json(customer)

    // try {
	// 	const customer = new Customer(customerData);
	//     await customer.save();

	// 	sendResponse(res, 201, { customer: customer });
	// } catch (error) {
	// 	console.log(error);

	// }

})


router.post('/login', async (req, res) => {
    let customer = await Customer.where({
        username: req.body.username
    }).fetch({
        require: false
    });

    if (customer && customer.get('password') == getHashedPassword(req.body.password)) {
        // const customerObject = {
        //     first_name: customer.get('first_name'),
        //     last_name: customer.get('last_name'),
        //     id: customer.get('id'),
        //     email: customer.get('email')
        // }
        let accessToken = generateAccessToken(customer.get('id'), customer.get('username'), customer.get('first_name'), customer.get('last_name'), customer.get('email'), process.env.TOKEN_SECRET, '15m');
        let refreshToken = generateAccessToken(customer.get('id'), customer.get('username'),customer.get('first_name'), customer.get('last_name'), customer.get('email'), process.env.REFRESH_TOKEN_SECRET, '7d');
        res.send({
            accessToken, refreshToken
        })
    } else {
        res.send({
            error: 'Invalid email or password'
        })
    }
})

router.post('/refresh', async function (req, res) {
    // get the refreshtoken from the body
    const refreshToken = req.body.refreshToken;

    if (refreshToken) {

        // check if the token is already blacklisted
        const blacklistedToken = await BlacklistedToken.where({
            'token': refreshToken
        }).fetch({
            require: false
        })

        // if the blacklistedToken is NOT null, then it means it exist
        if (blacklistedToken) {
            res.status(400);
            res.json({
                'error': 'Refresh token has been blacklisted'
            })
            return;
        }

        // verify if it is legit 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, tokenData) {
            if (!err) {
                // generate a new access token and send back
                const accessToken = generateAccessToken(
                    tokenData.id,
                    tokenData.username,
                    tokenData.first_name,
                    tokenData.last_name,
                    tokenData.email,
                    process.env.TOKEN_SECRET,
                    '1h');
                res.json({
                    accessToken
                })
            } else {
                res.status(400);
                res.json({
                    'error': 'Invalid refresh token'
                })
            }
        })
    } else {
        res.status(400);
        res.json({
            'error': 'No refresh token found'
        })
    }
})

router.post("/logout", async function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
        // add the refresh token to the black list
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function (err, tokenData) {
            if (!err) {
                // add the refresh token to the black list
                const token = new BlacklistedToken();
                token.set("token", refreshToken);
                token.set("date_created", new Date());
                await token.save();
                res.json({
                    message: "Logged out successfully",
                });
            }
        });
    } else {
        res.status(400);
        res.json({
            error: "No refresh token found!",
        });
    }
});

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const customer = req.customer;
    res.send(customer);
})

module.exports = router;
