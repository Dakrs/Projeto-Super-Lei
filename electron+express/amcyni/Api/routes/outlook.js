var express = require('express');
var router = express.Router();
var authHelper = require('../authOutlook');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
var nanoid = require('nanoid')
var Task = require('../controllers/tasks')
var Utility = require('../utility')



router.get('/url',async function(req,res){
  var url = await authHelper.getAuthUrl()
  res.jsonp(url)

})



router.get('/emails', async function(req, res, next) {
  
  task = {}
  const accessToken = await authHelper.getAccessToken();
  console.log(accessToken)
  if (accessToken) {
    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
          done(null, accessToken);
        }
    });
  
    try {
      // Get the 10 newest messages from inbox
      const result = await client
        .api('/me/mailfolders/inbox/messages')
        .top(1000000000)
        .orderby('receivedDateTime DESC')
        .get();
    
      var emails =  result.value;
      emails.forEach(element => {
        var bool = Utility.todoRegex(element.subject)
        if(bool){
          Task.findByIdOrigin(element.id,"Outlook emails")
          .then(response =>{  
            if(response.length===0){
              task._id = nanoid()
              task.idOrigin = element.id
              task.name = element.subject
              task.priority = 3
              task.origin = "Outlook emails"
              task.owner = "me"
              task.state = 0
              
              Task.insert(task)
              .then(dados => console.log("inseri task proveniente do email outlook"))
            }
          })
        } 
      });
      res.jsonp(result)
    } catch (err) {
      res.status(500).jsonp(erro)
      }
    
  } 
  else {
    // Redirect to home
    var x = authHelper.getAuthUrl()
    res.redirect(authHelper.getAuthUrl())
  }

  });

router.get('/calendar',async function(req, res, next){
  var task ={}
  const accessToken = await authHelper.getAccessToken();
  console.log(accessToken)
  if (accessToken) {
    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    // Set start of the calendar view to today at midnight
    const start = new Date(new Date().setHours(0,0,0));
    // Set end of the calendar view to 365 days from start
    const end = new Date(new Date(start).setDate(start.getDate() + 365));
      
    try {
      // Get the first 10 events for the coming week
      const result = await client
        .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
        .get();

      res.jsonp(result.value)
      var events =  result.value;
      events.forEach(element => {
        var bool = Utility.todoRegex(element.subject)
        if (bool){
          Task.findByIdOrigin(element.id,"Outlook Calendar")
          .then(response =>{  
            if(response.length===0){
              task._id = nanoid()
              task.idOrigin = element.id
              task.date = element.start.dateTime
              task.name = element.subject
              task.description = element.bodyPreview
              task.priority = 3
              task.origin = "Outlook Calendar"
              task.owner = "me"
              task.state = 0
              
              Task.insert(task)
              .then(dados => console.log("inseri task proveniente do CALENDARIO outlook"))
            }
          })
        }   
      });
    } catch (err) {
      res.status(500).jsonp(err)
    }
      
  } else {
    // Redirect to home
  var x = authHelper.getAuthUrl()
  res.redirect(authHelper.getAuthUrl())
  }
  
})

module.exports = router;