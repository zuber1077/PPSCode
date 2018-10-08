const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

/* GET Register login page. */
  router.get('/login', (req,res,next) => {
    res.render('login', {title: 'PPSCode - Login to your account'});
  });
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

 router.get('/register', (req,res,next) => {
        res.render('register', {title: 'PPSCode - Register new account'});
    })
router.post('/register', (req,res, next) =>{

    let errors = [];

    if(!req.body.name) {
        errors.push({message: 'please add a name'});
    }

    if(!req.body.email) {
        errors.push({message: 'please add an email'});
    }

    if(!req.body.password) {
        errors.push({message: 'please enter a password'});
    }


    if(!req.body.passwordConfirm) {
        errors.push({message: 'This field cannot be blank'});
    }


    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: "Password fields don't match"});
    }


    if(errors.length > 0){
        res.render('register', { // if err user back with data
            errors: errors,
            name: req.body.name,
            email: req.body.email,
        })
    } else {
    User.findOne({email: req.body.email}).then(user=>{ //find user from db
        if(!user){ //checking if the email is exist    
        const user = new User({ 
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

    bcrypt.genSalt(10, (err,salt)=>{ //hash the password using bcrypt
        bcrypt.hash(user.password, salt, (err, hash)=>{
            user.password = hash;

            req.flash('success_message', 'You are now registered');

            user.save().then(savedUser => {
                res.redirect('/');
            });            
        });
    });

    } else { //if user end here 
        req.flash('error_message', 'account with the email already exist please login');
        res.redirect('/login');
    } 
}).catch(error=>console.log(error)) // find user from db end here

    } //else err end here
});


    
    router.get('/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
    }));
    
    router.get('/google/redirect',passport.authenticate('google', {
        successRedirect: '/',
    	failureRedirect: '/login'
    }));
    
    router.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
    });
module.exports = router;