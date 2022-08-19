const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { checkIfOwner } = require('../../middlewares');

const {
    getUsers,
    getAllUserTypes,
    getUserById,
    getUserByEmail
} = require('../../dal/users')

//hashed password
const hashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// import in the User model
const { User } = require('../../models');

const { createRegistrationForm,
    createLoginForm,
    updateUserForm,
    bootstrapField,
    changePasswordForm
} = require('../../forms');

router.get('/', async (req, res) => {
    const users = await getUsers()

    res.render('users/index', {
        users: users.toJSON()
    })
})

router.get('/register',  async (req, res) => {
    const registrationForm = createRegistrationForm(await getAllUserTypes());

    res.render('users/register', {
        form: registrationForm.toHTML(bootstrapField)
    })
})

router.post('/register', async (req, res) => {
    const registrationForm = createRegistrationForm(await getAllUserTypes());
    registrationForm.handle(req, {
        
        success: async (form) => {
            const user = new User({
                first_name: form.data.first_name,
                last_name: form.data.last_name,
                password: hashedPassword(form.data.password),
                email: form.data.email,
                user_type_id: form.data.user_type_id,
                date_created: new Date()
            });
            await user.save();
            req.flash("success_messages", "User registered successfully!");
            res.redirect('/users')
        },
        error: (form) => {
            res.render('users/register', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

//User update routes
router.get('/:user_id/update', async (req, res) => {
    const user = await getUserById(req.params.user_id)

    const userForm = updateUserForm(await getAllUserTypes())

    userForm.fields.first_name.value = user.get('first_name')
    userForm.fields.last_name.value = user.get('last_name')
    userForm.fields.email.value = user.get('email')
    userForm.fields.user_type_id.value = user.get('user_type_id')

    res.render('users/update', {
        form: userForm.toHTML(bootstrapField),
        user: user.toJSON(),
    })
})

router.post('/:user_id/update', async (req, res) => {

    const user = await getUserById(req.params.user_id)

    const userForm = updateUserForm(
        await getAllUserTypes()
    );

    userForm.handle(req, {
        success: async (form) => {
            user.set(form.data)
            await user.save();
            req.flash('success_messages', ` User details for "${user.get('email')}" updated succesffully.`)
            res.redirect('/users')
        },
        error: async (form) => {
            res.render('users/update', {
                user: user.toJSON(),
                userForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.post('/:user_id/delete', async (req, res) => {

    const user = await getUserById(req.params.user_id)

    await user.destroy();
    res.redirect('/users')
})

router.get('/login', (req, res) => {
    const loginForm = createLoginForm();

    if (req.session.user) {
        req.flash('You are already logged in')
        res.redirect('/users/profile')
    } else {
        res.render('users/login', {
            form: loginForm.toHTML(bootstrapField)
        })
    }

})

router.post('/login', (req, res) => {
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        success: async (form) => {
            //process the login
            //...find the user by email and password
            let user = await getUserByEmail(form.data.email)
            if (!user) {
                //if user email does not exit in database
                req.flash('error_messages', 'Invalid username of password. Please try again')
                res.redirect('/users/login')
            } else {
                //check if the password matches
                if (user.get('password') === hashedPassword(form.data.password)) {
                    //add to the session that login succeed
                    //store the suer details
                    req.session.user = user
                    req.flash("success_messages", "Welcome back, " + user.get('username'))
                    res.redirect('/users/profile')
                } else {
                    req.flash('error_messages', 'Invalid username of password. Please try again.')
                    res.redirect('/users/login')
                }
            }
        },
        error: (form) => {
            req.flash('error_messages', "There are some problems logging you in. Please fill in the form again")
            res.render('users/login', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'You do not have permission to access this page');
        res.redirect('/users/login')
    } else {
        res.render('users/profile', {
            user
        })
    }
})

router.get('/profile/change-password', async (req, res) => {
    const user = await getUserById(req.session.user.id)
    const passwordForm = await changePasswordForm()
    
    res.render('users/change-password', {
        form: passwordForm.toHTML(bootstrapField),
        user: user.toJSON(),
    })

})

router.get('/logout', (req, res) => {
    req.session.user = null;
    // req.flash('success_messages', 'Goodbye')
    res.redirect('/users/login')
})

module.exports = router;

