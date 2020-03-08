var express = require('express');
var router = express.Router();
const fs = require('fs');
var auth2 = require('../auth')
var nanoid = require('nanoid');
const {google} = require('googleapis');
var Task = require('../controllers/tasks')


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

/* GET home page. */
router.get('/lists', function(req, res) {
task = {}

  fs.readFile('../credentials.json',(err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
        auth2.authorize(JSON.parse(content),function(response){
          list_tasks(response,function(tasks){
            res.jsonp(tasks) 
            tasks.forEach(element => {
              var items = element.data.items
              if(items){
                items.forEach(t => {
                  task._id=nanoid()
                  task.date= t.due
                  task.description = t.title
                  task.origin = "GOOGLE"
                  task.owner = "me"
                  
        
                  Task.insert(task)
                  .then(dados =>console.log("Inseri task") )
                })
              }
            });
          })
        })  
      })
    
    })





async function tasks(auth,idList){
  task = {}
  const service = google.tasks({version : 'v1',auth})
   const taskLists = await service.tasks.list({
    tasklist:idList
  })
   

    
    return taskLists

  
  
}




/**
 * Lists the user's tasks
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function list_tasks(auth,callback) {
  const service = google.tasks({version : 'v1',auth})
  // O segredo está aqui
 const lista = await service.tasklists.list({
  }) 
    const taskLists = lista.data.items;
    const promises = taskLists.map(async fruit => {
      const numFruit = await tasks(auth,fruit.id)
      return numFruit
    })
  
    const numFruits = await Promise.all(promises)
    

    return  callback(numFruits)

}


module.exports = router;