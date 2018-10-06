const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');
const config = require('../config');
const transporter = nodemailer.createTransport(config.mailer);
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'PPSCode - pair to pair code sharing' });
});

/* GET POST contact page. */
router.route('/contact')
  .get((req, res, next) => {
    res.render('contact', { title: 'PPSCode - Contact Us' });
  })

  .post((req, res, next) => {
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
      res.render('contact',{
        title: 'PPSCode - Contact Us',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    } else {
      const mailOptions = {
        from: 'PPSCode <no-reply@zuberabuki78@gmail.com>',
        to: 'zuberabuki78@gmail.com',
        subject: 'You got a new message from visitor 📩',
        text: req.body.message
      }
 
      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          return console.log(error);
        } else {
          res.render('thank', { title: 'PPSCode - Tanks for contacting us' });
        }
      });

    }
  });
/* GET Register login page. */
  router.get('/login', (req,res,next) => {
    res.render('login', {title: 'PPSCode - Login to your account'});
  });

  router.get('/register', (req,res,next) => {
    res.render('register', {title: 'PPSCode - Register new account'});
  });

module.exports = router;
