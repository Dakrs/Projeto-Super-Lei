var express = require('express');
var router = express.Router();
const fs = require('fs');
var auth2 = require('../auth')
var nanoid = require('nanoid');
const {google} = require('googleapis');



/* GET home page. */
router.get('/', function(req, res) {
task = {}

  fs.readFile('credentials.json',(err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
        auth2.authorize(JSON.parse(content),function(response){
        listCalendars(response,function(idCalendario){
              listEvents(response,idCalendario,function(eventos){
            res.jsonp(eventos)    
       })  
      })
    
    })
})
})


async function listCalendars(auth,callback){
  task = {}
  const service = google.calendar({version : 'v3',auth})
   const taskLists = await service.calendarList.list({
  })
   

    
    return callback(taskLists.data.items[0].id)

  
  
}





/**
 * Lists the user's tasks
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth,idCalendario,callback) {
    const calendar = google.calendar({version: 'v3', auth});
    const calendarios = await calendar.events.list({
      calendarId: idCalendario
    })
         return callback(calendarios)
      
  }

module.exports = router;