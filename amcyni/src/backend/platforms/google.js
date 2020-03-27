
const fs = require('fs');
const path = require("path");
var auth2 = require('../authGoogle')
var nanoid = require('nanoid');
const {google} = require('googleapis');
var Todo = require('../controllers/tasks')
var Credential = require('../controllers/credentials')



 export async function connect_Google(){

  var file = await readFile();
  var credentials = await Credential.listar()
    if(file){
      var  file = JSON.parse(file)

        const {client_secret, client_id, redirect_uris} = file.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
      

      if(credentials.length >0){
          oAuth2Client.setCredentials(credentials[0].token)
          console.log('---------------------------')
           var x =await get_tasks(oAuth2Client)
          
          var tasks = await Todo.selectAll()
          console.log(tasks)

          var todos = JSON.parse(JSON.stringify(tasks))

          const promises= todos.map(async element => {
            if(element.date)
                  element.date= new Date(element.date)
            return element;     
            });

             todos = await Promise.all(promises)
            return todos
      }
      else{
        var url = await auth2.getNewToken(oAuth2Client)
        return url;
      }
    }
    else{
      return null; // ver melhor
    }
}
 
 
 async function readFile(){
   var content
   try {
     content = fs.readFileSync(path.resolve(__dirname, '../../src/backend/credentials.json'))
  }
  catch(err) {
    return console.log('Error loading client secret file:', err);
      }
    return content  
 }

 async function get_tasks(oAuth2Client){
   await insert_calendar(oAuth2Client)
   await insert_task(oAuth2Client)
   await insert_email(oAuth2Client)
   return ;
   
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
    tasklist:idList
  })
  return taskLists
}
    


async function insert_task(oAuth2Client){
  var task = {}
  
  var l_tasks = await list_tasks(oAuth2Client)
   
  var promises1= l_tasks.map( async element => {
    
    var items = element.data.items

    if(items){
        var promises2 = items.map(async t =>{
          
          var response = await Todo.findByIdOrigin(t.id,"Google Tasks")
          if (response.length===0){
              
              task._id=nanoid()
              task.idOrigin = t.id
              task.date= t.due
              task.name = t.title
              task.origin = "Google Tasks"
              task.owner = "me"
              task.state = 0
                                    
              var aux = await Todo.insert(task)
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

  return true

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
    const calendar = google.calendar({version: 'v3', auth});
    const calendarios = await calendar.events.list({
      calendarId: idCalendario
    })


         return calendarios.data.items
      
  }




async function insert_calendar(oAuth2Client){
  var task = {}

  var idCalendario = await listCalendars(oAuth2Client)
  var eventos = await listEvents(oAuth2Client,idCalendario)

  const promises = eventos.map(async element =>{
    var bool = await todoRegex(element.summary)
    if (bool){
        var response = await Todo.findByIdOrigin(element.id,"Google Calendar")
        if (response.length===0){
            
          task._id=nanoid()
          task.idOrigin = element.id
          task.date= element.start.date
          task.name = element.summary
          task.origin = "Google Calendar"
          task.owner = "me"
          task.state = 0
              
          var aux = await Todo.insert(task)

          return aux;  
        }

    }
    else
        return bool; 
                    
  });

  var tasks = await Promise.all(promises)

  return tasks
      
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

async function insert_email(oAuth2Client){
  var task = {}

  var emails = await list_emails(oAuth2Client)

  var promises1 = emails.map(async element =>{
    var headers = element.payload.headers
    
    
    var promises2= headers.map( async header => {
      
      if(header.name ==="Subject" && element.labelIds[element.labelIds.length-1] ==="INBOX"){
          
        var bool = await todoRegex(header.value)
        if(bool){
          
          var response = await Todo.findByIdOrigin(element.id,"Google Gmail") 
          if(response.length===0){
              
              task._id = nanoid()
              task.idOrigin = element.id
              task.name = header.value
              task.origin = "Google Gmail"
              task.owner = "me"
              task.state = 0
              
              var x = await Todo.insert(task)
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

  return aux
}
    







const TODO = new RegExp('^(\\[TODO\\])','i')


function todoRegex(title){
    return TODO.test(title)
}


export default { connect_Google}
