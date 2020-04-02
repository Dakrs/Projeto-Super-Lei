var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path')
var auth2 = require('../authGoogle')
var nanoid = require('nanoid');
const {google} = require('googleapis');
var Task = require('../controllers/tasks')
var Utility = require('../utility')



router.get('/url',async function(req,res){
  var url

  var file = await readFile();
  if(file){
    url = await auth2.getURL_to_access(JSON.parse(file))
    res.jsonp(url)
    }
})

/* GET home page. */
router.get('/tasks', async function(req, res) {

  var file = await readFile();
  if(file){
    auth2.authorize(JSON.parse(file), async function(oAuth2Client){
  var l_tasks = await list_tasks(oAuth2Client)

  var promises1= l_tasks.map( async element => {

    var items = element.data.items

    if(items){
        var promises2 = items.map(async t =>{

          var response = await Task.findByIdOrigin(t.id,"Google Tasks")
          if (response.length===0){
            var task = {}
              task._id=nanoid()
              task.idOrigin = t.id
              task.date= t.due
              task.name = t.title
              if(t.notes)
              task.description = t.notes
              task.origin = "Google Tasks"
              task.owner = "me"
              task.state = 0
              task.priority=3

              var aux = await Task.insert(task)
              return aux
          }
          else
              return false;
        })

      await Promise.all(promises2)

    }

  return  true;
  })
  await Promise.all(promises1)
  res.jsonp(l_tasks)
    })

  }

})

/* GET home page. */
router.get('/calendar', async function(req, res) {
  var file = await readFile();
  if(file){
    auth2.authorize(JSON.parse(file), async function(oAuth2Client){

      var idCalendario = await listCalendars(oAuth2Client)
  var eventos = await listEvents(oAuth2Client,idCalendario)

  const promises = eventos.map(async element =>{
    var bool = await Utility.todoRegex(element.summary)
    if (bool){
        var response = await Task.findByIdOrigin(element.id,"Google Calendar")
        if (response.length===0){
            var task ={}
          task._id=nanoid()
          task.idOrigin = element.id
          task.date= element.start.date
          task.name = element.summary
          if(element.description)
          task.description=element.description
          task.origin = "Google Calendar"
          task.owner = "me"
          task.state = 0
          task.priority=3

          var aux = await Task.insert(task)

          return aux;
        }

    }
    else
        return bool;

  });

  var tasks = await Promise.all(promises)

  res.jsonp(eventos)
    })
  }
})

router.get('/emails', async function(req, res) {
  task = {}
  var file = await readFile();
  if(file){
    auth2.authorize(JSON.parse(file),async function(oAuth2Client){
      var emails = await list_emails(oAuth2Client)

      var promises1 = emails.map(async element =>{
        var headers = element.payload.headers


        var promises2= headers.map( async header => {

          if(header.name ==="Subject" && element.labelIds[element.labelIds.length-1] ==="INBOX"){

            var bool = await Utility.todoRegex(header.value)
            if(bool){

              var response = await Task.findByIdOrigin(element.id,"Google Gmail")
              if(response.length===0){

                  task._id = nanoid()
                  task.idOrigin = element.id
                  task.name = header.value
                  task.origin = "Google Gmail"
                  task.owner = "me"
                  task.state = 0
                  task.priority=3

                  var x = await Task.insert(task)
                  return x;
              }
              else
                  return false
            }
             else false
          }

        })
        await Promise.all(promises2)

      })
      var aux =await Promise.all(promises1)

      return res.jsonp(emails)
    })

      }

  })

router.post('/code',async (req,res) => {
      var code = req.body.code;
      var x
      var file = await readFile()
      response =await auth2.insertToken(code,JSON.parse(file))
     res.jsonp(response)
})



async function readFile(){
  var content
  try {
    console.log(__dirname)
    content = fs.readFileSync(path.resolve(__dirname, '../credentials.json'))
 }
 catch(err) {
   return console.log('Error loading client secret file:', err);
     }
   return content
}



async function list_emails(auth) {
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


  return emails
}

async function getEmail(auth,idEmail){
  const gmail = google.gmail({version: 'v1', auth});
  const result =  await gmail.users.messages.get({
    userId: 'me',
    id : idEmail
  })
  return result.data
}

/**
 * Lists the user's tasks
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function list_tasks(auth) {
  const service = google.tasks({version : 'v1',auth})
  // O segredo está
 const lista = await service.tasklists.list({
  })
    const taskLists = lista.data.items;
    const promises = taskLists.map(async x => {
      const t = await tasks(auth,x.id)
      return t
    })

    const ts = await Promise.all(promises)

    return  ts

}

async function tasks(auth,idList){
  const service = google.tasks({version : 'v1',auth})
   const taskLists = await service.tasks.list({
    tasklist:idList,
    dueMin : new Date()
  })
  return taskLists
}





async function listCalendars(auth){
  const service = google.calendar({version : 'v3',auth})
   const taskLists = await service.calendarList.list({
  })
    return taskLists.data.items[0].id
}





/**
 *
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth,idCalendario){
  const start = new Date(new Date().setHours(0,0,0));
    const calendar = google.calendar({version: 'v3', auth});
    const calendarios = await calendar.events.list({
      calendarId: idCalendario,
      timeMax: new Date(new Date(start).setDate(start.getDate() + 365)),
      timeMin: start
    })


         return calendarios.data.items

  }


module.exports = router;
