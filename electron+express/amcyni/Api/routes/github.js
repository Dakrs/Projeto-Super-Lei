const router = require('express').Router();
const passport = require('passport');
const _ = require('underscore');
const GitHub = require('github-api');
var nanoid = require('nanoid')
var Task = require('../controllers/tasks')

// auth with github
router.get('/auth', passport.authenticate('github'));

// callback route for github to redirect to
// hand control to passport to use code to grab profile info
router.get('/login/return', passport.authenticate('github'), (req,res) => {
    res.redirect('/github');
});

const authCheck = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/github/auth');
};

router.get('/', (req, res) => {
    res.send("ola");
});

require('dotenv').config();
const COOKIE = process.env.PROJECT_DOMAIN;

router.get('/setcookie', function(req, res) {
    console.log(req.session);
    let data = {
      //user: req.session.passport.user.profile._json,
      //token: req.session.passport.user.token
    }
    res.cookie(COOKIE, JSON.stringify(data))
    res.redirect('/')
  });

router.get('/issues', authCheck, async (req, res) => {
    
    let githubData
		try {
			githubData = await getIssuesREST(req._passport.session.user.token.access_token)
		} catch (error) {
      console.log(error);
			githubData = { error: error }
        }
    
    
    res.send(githubData);
});

// auth logout
router.get('/logoff', async (req, res) => {
    await req.logout();
    res.redirect('/github');
});

async function getIssuesREST(token) {
    task = {}
    let gh = new GitHub({
          token: token
      });
  
    let me = await gh.getUser();
    const requestProfile = me.getProfile();
    requestProfile.then(function(val){
      return val.data.login;
    });
    let user = await requestProfile;
    const username = user.data.login;
  
    const headers = {
      "Authorization" : "Token " + token
    }   
    const url = "https://api.github.com/issues?q=author:" + username + " type:issue";
    const response = await fetch(url, {
      "method": "GET",
      "headers": headers
    });
    const result =  await response.json();
    
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
              .then(dados => console.log("inseri task proveniente do github"))
            }
          })
    });
}


module.exports = router;