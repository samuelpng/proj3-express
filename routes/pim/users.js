const express = require("express");
const router = express.Router();
const crypto = require('crypto');

//hashed password
const hashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// import in the User model
const { User } = require('../../models');

const { createRegistrationForm, bootstrapField, createLoginForm } = require('../../forms');

router.get('/register', (req,res) => {
    // display the registration form
    const registrationForm = createRegistrationForm();
    res.render('users/register', {
        'form': registrationForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req, res) => {
    const registrationForm = createRegistrationForm();
    registrationForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': hashedPassword(form.data.password),
                'email': form.data.email,
                'date_created': new Date()
            });
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/users/login')
        },
        'error': (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req,res) => {
    const loginForm = createLoginForm();
    res.render('users/login', {
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', (req,res)=>{
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        'success': async (form) => {
            //process the login
            //...find the user by email and password
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require:false
            })
            if(!user) {
                //if user email does not exit in database
                req.flash('error_messages', 'Invalid username of password. Please try again')
                res.redirect('/users/login')
            }else {
                //check if the password matches
                if (user.get('password') === hashedPassword(form.data.password)) {
                    //add to the session that login succeed
                    //store the suer details
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email')
                    }
                    req.flash("success_messages", "Welcome back, " + user.get('username'))
                    res.redirect('/users/profile')
                }else {
                    req.flash('error_messages', 'Invalid username of password. Please try again.')
                    res.redirect('/users/login')
                }
            }
        },
        'error': (form) => {
            req.flash('error_messages', "There are some problems logging you in. Please fill in the form again")
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', (req,res) => {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'You do not have permission to access this page');
        res.redirect('users/login')
    } else {
        res.render('users/profile', {
            'user': user
        })
    }
})

router.get('/logout', (req,res) => {
    req.session.user = null;
    req.flash('success_messages', 'Goodbye')
    res.redirect('users/login')
})

module.exports = router;

