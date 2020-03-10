var express = require('express');
var router = express.Router();
var Credential = require('../controllers/credentials')
var auth2 = require('../auth')
const {google} = require('googleapis');
const fs = require('fs');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

/* GET home page. */
router.get('/lists', function(req, res) {

  fs.readFile('credentials.json',(err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Tasks API. 
        auth2.authorize(JSON.parse(content),function(response){
          taskLists(response,function(tasks){
            
            res.jsonp(tasks)
          })
        })  
      })
    })

router.get('/lists/:id',function(req,res){
  Credential.listar()
    .then(dados => {
      auth2.authorize(dados,function(response){
        listTasks(response,req.params.id,function(tasks){
          res.jsonp(tasks)
        })
      })
    })
    .catch(e => res.status(500).jsonp(e))  
  })






/*

function task(auth,idTasks,callback){
  const service = google.tasks({version : 'v1',auth})
  service.tasks.get({
    task:idTasks
  },(err,res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const taskLists = res.data.items;
    
    return callback(taskLists)
  })
}

*/
function listTasks(auth,idList,callback){
  const service = google.tasks({version : 'v1',auth})
  service.tasks.list({
    tasklist:idList
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const taskLists = res.data.items;
    
    return callback(taskLists)
  });
  
  
}




/**
 * Lists the user's tasks
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function taskLists(auth,callback) {
  const service = google.tasks({version : 'v1',auth})
  // O segredo está aqui
  service.tasklists.list({
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const taskLists = res.data.items;
    return  callback(taskLists)
  });

}
module.exports = router;