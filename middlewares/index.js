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


module.exports = {
    checkIfAuthenticated,
    checkIfOwner
}