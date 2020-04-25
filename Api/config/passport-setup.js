const passport = require('passport');
const GitHub = require('github-api');
const GithubStrategy = require('passport-github').Strategy;
const keys = require('./keys');
const Credential = require('../models/credentials');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    Credential.findById(id).then((user) => {
        done(null, user);
    });
});

let scopes = ['notifications', 'user', 'read:org', 'repo'];
passport.use(
    new GithubStrategy({
        // options for google strategy
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: 'http://localhost:4545/github/login/return',
        scope: scopes.join(' ')
    }, 
    async (acesstoken, refreshToken, profile, done) => {
      try{
        console.log('profile', profile);
        console.log('accessToken', acesstoken);
        console.log('refreshToken', refreshToken);
        console.log('OLA TOU AQUI');
  
        const currentUser = await Credential.findOne({owner: profile.id});
         if (currentUser){
            done(null, currentUser);
          }
          else {
            const tok = {
              access_token : acesstoken,
              refresh_token : refreshToken,
              scope : scopes.join(' '),
            };
            const newUser = new Credential({
              type: "GITHUB",
              token: tok,
              owner: profile.id
            });
            await newUser.save();
            console.log(newUser);
            done(null, newUser); 
          }
        }
        catch(error) {
          done(error, false, error.message);
        }
      }));       
