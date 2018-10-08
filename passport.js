const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const config = require('./config');
const bcrypt = require("bcryptjs");


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    
    User.findOne({email: email}).then(user=>{
        if(!user) return done(null, false, {message: 'No user found'});


        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;

            if(matched){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect Password' });
            }
        });
    }).catch(error=>console.log(error));


}));

  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
    profileFields: ['profile'],
    passReqCallback: true 
  },
     (req, accessToken, refreshToken, profile, done) => {
      User.findOne({google: profile.id},(err,user)=>{
        if(err){ //network err 
            return done(err);
        }
        if(user){ //
            return done(null,user); //user object 
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.username = profile.displayName;
            newUser.email    = profile.emails;
            newUser.save((err)=>{
                if(err){
                  return done(null, false , { message: 'Something went wrong' })
                }
                return done(null,newUser);
            })
        }
      })
    }
  ));