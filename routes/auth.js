const express = require("express");
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

/* GET Register login page. */
  router.route('/login')
  .get((req,res,next) => {
    res.render('login', {title: 'PPSCode - Login to your account'});
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
  }));

  router.route('/register')
    .get((req,res,next) => {
        res.render('register', {title: 'PPSCode - Register new account'});
    })
    .post((req, res, next) => {
        req.checkBody('name', 'Empty Name').notEmpty();
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'Empty Password').notEmpty();
        req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            });
        } else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = user.encryptPassword(req.body.password);
            user.save(function (err) {
                if (err) {
                    res.render('register', { title: 'PPSCode - Register new account', errorMessages: err });
                } else {
                    res.redirect('/login');
                }
            });
        }
    });

    router.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
    });

    router.get('/google', passport.authenticate('google', {
        scope: ['profile']
    }));

    router.get('/google/redirect',passport.authenticate('google', {
        successRedirect: '/',
    	failureRedirect: '/login'
    }));

module.exports = router;