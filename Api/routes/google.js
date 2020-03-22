var express = require('express');
var router = express.Router();
const fs = require('fs');
var auth2 = require('../authGoogle')
var nanoid = require('nanoid');
const {google} = require('googleapis');
var Task = require('../controllers/tasks')
var Utility = require('../utility')



/* GET home page. */
router.get('/tasks', function(req, res) {
  task = {}

  fs.readFile('credentials.json',(err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    auth2.authorize(JSON.parse(content),function(response){
      list_tasks(response,function(tasks){
        res.jsonp(tasks) 
        tasks.forEach(element => {
          var items = element.data.items
          if(items){
            items.forEach(t => {
              Task.findByIdOrigin(t.id,"Google Tasks")
              .then(response => {
                if (response.length===0){
                  task._id=nanoid()
                  task.idOrigin = t.id
                  task.date= t.due
                  task.description = t.title
                  task.origin = "Google Tasks"
                  task.owner = "me"
                  task.state = 0
                        
                  Task.insert(task)
                  .then(dados =>console.log("Inseri task") )
                }
              })
            })
          }
        })
      })  
    })
  })
})

/* GET home page. */
router.get('/calendar', function(req, res) {
  task = {}
  fs.readFile('credentials.json',(err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    auth2.authorize(JSON.parse(content),function(response){
      listCalendars(response,function(idCalendario){
        listEvents(response,idCalendario,function(eventos){
          eventos.forEach(element => {
            var bool = Utility.todoRegex(element.summary)
            if (bool){
              Task.findByIdOrigin(element.id,"Google Calendar")
              .then(response => {
                if (response.length===0){
                  task._id=nanoid()
                  task.idOrigin = element.id
                  task.date= element.start.date
                  task.description = element.summary
                  task.origin = "Google Calendar"
                  task.owner = "me"
                  task.state = 0
                  
                  Task.insert(task)
                  .then(dados =>console.log("Inseri task") )
                }
              })
            }              
          });
          res.jsonp(eventos)    
        })  
      }) 
    })
  })
})

router.get('/emails', function(req, res) {
  task = {}
  fs.readFile('credentials.json',(err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    auth2.authorize(JSON.parse(content),function(response){
      list_emails(response,function(emails){
        emails.forEach(element =>{
          var headers = element.payload.headers
          headers.forEach(header => {
            if(header.name ==="Subject" && element.labelIds[element.labelIds.length-1] ==="INBOX"){
              if(Utility.todoRegex(header.value)){
                Task.findByIdOrigin(element.id,"Google Gmail")
                .then(response =>{  
                  if(response.length===0){
                    task._id = nanoid()
                    task.idOrigin = element.id
                    task.description = header.value
                    task.origin = "Google Gmail"
                    task.owner = "me"
                    task.state = 0
                  
                    Task.insert(task)
                    .then(dados =>console.log("Inseri task proveniente do gmail") )
                  }
                })
              }
            }
          })      
        })
      res.jsonp(emails)               
      })
    })
  })          
})




  async function list_emails(auth,callback) {
    const gmail = google.gmail({version: 'v1', auth});
   var result =  await gmail.users.messages.list({
      userId: 'me',
    })

      var emails = result.data.messages

      const promises = emails.map(async e => {
        var email = await getEmail(auth,e.id)
        return email
      })
    
      var emails = await Promise.all(promises)
      
   
    return callback(emails)
  }

  async function getEmail(auth,idEmail){
    const gmail = google.gmail({version: 'v1', auth});
   const result =  await gmail.users.messages.get({
      userId: 'me',
      id : idEmail
    })
    return result.data



  }




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

async function listCalendars(auth,callback){
  const service = google.calendar({version : 'v3',auth})
   const taskLists = await service.calendarList.list({
  })     
    return callback(taskLists.data.items[0].id) 
}





/**
 * 
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth,idCalendario,callback) {
    const calendar = google.calendar({version: 'v3', auth});
    const calendarios = await calendar.events.list({
      calendarId: idCalendario
    })


         return callback(calendarios.data.items)
      
  }


module.exports = router;