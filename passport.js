const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const config = require('./config');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id,done) => {
    User.findOne({_id: id}, (err, user) => {
        done(err, user);
    })
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    User.findOne({email: username}, (err, user) => {
      if (err) return done(err);
      if (!user || !user.validUserPassword(password)) {
        return done(null, false, {
          message: 'Email Does Not Exist or Password is Invalid'
        });
      }
      return done(null, user);
    })
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