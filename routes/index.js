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


  // Email Newsletter

  router.post('/newsletter', (req, res) => {
    addEmailToMailchimp(req.body.email);
    res.redirect('/');
    req.flash('success_message', 'Thanks For Subscribe!');
  })

function addEmailToMailchimp(email) {
  const request = require("request");

  var options = {
    method: 'POST',
    url: 'https://us19.api.mailchimp.com/3.0/lists/1cc829acda/members',
    headers:
    {
      'postman-token': '8a629537-84dd-0a07-0d43-d73a2761c557',
      'cache-control': 'no-cache',
      authorization: 'Basic YW55c3RyaW5nOjVkODdmZWVkMjllZWIxZDAzZTk0ZjMxZTRlMTNjYmNiLXVzMTk=',
      'content-type': 'application/json'
    },
    body: { email_address: email, status: 'subscribed' },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // console.log(body);
  });

}

module.exports = router;
