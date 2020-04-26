const router = require('express').Router();
const _ = require('underscore');
const GitHub = require('github-api');
var nanoid = require('nanoid');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
var Task = require('../controllers/tasks');
const Credential = require('../controllers/credentials');

const oauth2 = require('simple-oauth2').create({
  client: {
    id: keys.github.clientID,
    secret: keys.github.clientSecret
  },
  auth: {
    authorizeHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token'
  }
});

function getAuthUrl() {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:4545/github/login/return',
    scope: keys.github.scope
  });
  return authorizationUri;
}

router.get('/url',async function(req,res){
  var url = await getAuthUrl()
  res.jsonp(url)
});

router.get('/verify', function(req,res){
  Credential.get("GITHUB")
  .then(dados =>{
      if(dados.length>0)
    res.jsonp(true)
      else
      res.jsonp(false)
  })
  .catch(erro => res.jsonp(false))

})

// callback route for github to redirect to
// hand control to passport to use code to grab profile info
router.get('/login/return', async function(req, res, next) {
    // Get auth code
  const code = req.query.code;
  console.log("CODE ",code);

  // If code is present, use it
  if (code) {
    try {
      await getTokenFromCode(code);
      // Redirect to home
      res.jsonp("Close the window")
    } catch (err) {
      res.jsonp(false)
    }
  } else {
    // Otherwise complain
    res.jsonp(false)
  }
});


router.get('/issues', async function(req, res, next) {
    task = {}

    let githubData;
    const accessToken = await getAccessToken();

    if(accessToken){
      let gh = new GitHub({
        token: accessToken
      });

      let me = await gh.getUser();
      const requestProfile = me.getProfile();
      requestProfile.then(function(val){
        return val.data.login;
      });
      let user = await requestProfile;
      const username = user.data.login;

      try {
        const headers = {
          "Authorization" : "Token " + accessToken
        }   
        const url = "https://api.github.com/issues?q=author:" + username + " type:issue";
        const response = await fetch(url, {
          "method": "GET",
          "headers": headers
        });
        
        const result =  await response.json();
        console.log(result);
        
        result.forEach(function(res) {
            Task.findByIdOrigin(res.id,"GITHUB")
              .then(response =>{  
                if(response.length===0){
                  task._id = nanoid()
                  task.idOrigin = res.id
                  task.name = res.title
                  task.description = res.body
                  task.origin = "GITHUB"
                  task.owner = res.user.id
                  task.state = 0
                  
                  Task.insert(task)
                  .then(dados => console.log("inseri task do github"))
                }
              })
        });

        res.jsonp(result);

      } catch (error) {
        console.log(error);
        githubData = { error: error }
      }
    } else {
      res.redirect(getAuthUrl());
    }
    
});

// auth logout
router.get('/logoff', function(req, res, next) {
  clearCookies(res);
  // Redirect to home
  res.redirect('/github/login/return');
});

async function getTokenFromCode(auth_code) {
  var creden = {} 
  var tokenAux = {}
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: 'http://localhost:4545/github/login/return',
    scope: keys.github.scope
  });

  const token = oauth2.accessToken.create(result);
  
  creden.type = "GITHUB"
  creden.owner ="me"
  tokenAux.access_token = token.token.access_token
  tokenAux.scope = token.token.scope
  tokenAux.token_type=token.token.token_type
  creden.token = tokenAux

  await Credential.insert(creden);

  return token.token.access_token;
}

async function getAccessToken() {
  // Do we have an access token cached?
  var token = await Credential.get("GITHUB");

  if (token.length>0) {
      return token[0].token.access_token;
    }

    // Either no token or it's expired, do we have a
    // refresh token?
    const refresh_token = token[0].token.refresh_token
    if (refresh_token) {
      const newToken = await oauth2.accessToken.create({refresh_token: refresh_token}).refresh();
      var tokenAux = {}
      tokenAux.access_token = newToken.token.access_token
      tokenAux.refresh_token =newToken.token.refresh_token
      tokenAux.scope = newToken.token.scope
      tokenAux.token_type=newToken.token.token_type
      tokenAux.expiry_date = newToken.token.expires_at.getTime()
      Credential.update("GITHUB",tokenAux)
      return newToken.token.access_token;
    }
  
  // Nothing in the cookies that helps, return empty
  return null;
}


module.exports = router;