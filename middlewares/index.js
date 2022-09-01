const jwt = require('jsonwebtoken');

const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "You need to log in to access this page");
        res.redirect('/users/login');
    }
}

const checkIfOwner = (req, res, next) => {
    if (req.session.user.user_type_id === 1) {
        next()
    } else {
        req.flash('error_messages', 'You do not have permission to view this page.')
        res.redirect('back')
    }
}

const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, customer) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.customer = customer;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


module.exports = {
    checkIfAuthenticated,
    checkIfOwner,
    checkIfAuthenticatedJWT
}