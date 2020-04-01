const { ipcMain   } = require('electron');
const axios = require('axios');
var nanoid = require('nanoid')


function getTrue() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
}

var date = new Date();
var todosAux = [];

todosAux.push({
  _id: 1,
  date: new Date(2017,1,1),
  name: 'Aula PSD',
  origin: 'Outlook',
  description: 'Aula que acontece todas as segundas feiras e é preciso aparecer para poder aprender.',
  priority: 2,
  index: 0,
})
todosAux.push({
  _id: 2,
  //date: new Date(2015,1,1),
  name: 'Aula CPD',
  origin: 'Gmail',
  description: 'Aula das terças e super secante.',
  priority: 5,
  index: 1,
})
todosAux.push({
  _id: 3,
  date: new Date(2016,1,1),
  name: 'Missao UD',
  origin: 'Outlook',
  description: 'Missão semanal para o desenvolvimento pessoal',
  priority: 1,
  index: 2,
})
todosAux.push({
  _id: 4,
  date: new Date(2014,1,1),
  name: 'Entrega KAK',
  origin: 'Google Task',
  description: 'Entrega para do PLEI KAK',
  priority: 3,
  index: 3,
})

var git = {
  _id: 5,
  date: new Date(2016,3,12),
  name: 'Merge',
  origin: 'Github',
  description: 'Merge mal realizado',
  priority: 3,
}

var outlook = {
  _id: 6,
  date: new Date(2019,1,12),
  name: 'Reunião Sede',
  origin: 'Outlook',
  priority: 3,
}

var google1 = {
  _id: 7,
  date: new Date(2018,4,2),
  name: 'Celebração',
  origin: 'Google',
  priority: 4,
}

export default function setIpc(){

  ipcMain.handle('URL_OUTLOOK',async (event,arg) => {
    let response = await axios.get('http://localhost:4545/outlook/url');
    var url = response.data;
    return url
  });

  ipcMain.handle('store_google_api_key', async (event, ...args) => {
    var response=true
    try {
       response = await axios.post('http://localhost:4545/google/code',{
         code : args[0]
       })
       // 0 - por fazer // 1 - completa  // 2 - cancelada
    }
    catch(err) {
          console.error("Erro",err)
      }
    

    return response.data;
  });

  ipcMain.handle('complete_todo_id', async (event, ...id) => {

    var response=false
    try {
       response = await axios.put('http://localhost:4545/api/state/'+id+'?state=1')
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response=true
    }
    catch(err) {
      console.error("Erro",err)
      }

    return response;

  });

  ipcMain.handle('cancel_todo_id', async (event, ...id) => {

    var response =false
    try {
        await axios.put('http://localhost:4545/api/state/'+id+'?state=2')
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response =true
    }
    catch(err) {
          console.error("Erro",err)
      }

    return response;

  });

  ipcMain.handle('update_list_index', async (event, ...todos) => {

    var response
    try {
        response = await axios.put('http://localhost:4545/api',{
          todos
        }) // 0 - por fazer // 1 - completa  // 2 - cancelada
    }

    catch(err) {
           return false
       }

     return true
  });

  ipcMain.handle('get_all_todos', async (event, ...args) => {

    let response = await axios.get('http://localhost:4545/api')
    response.data.forEach(element => {
          if(element.date)
              element.date= new Date(element.date)
        });
      return response.data

  });

  ipcMain.handle('get_git_todos', async (event, ...args) => {
    const result = await getTrue();
    return [git];
  });

  ipcMain.handle('get_outlook_todos', async (event, ...args) => {

    await axios.get('http://localhost:4545/outlook/calendar')
    await axios.get('http://localhost:4545/outlook/emails')
   let response = await axios.get('http://localhost:4545/api')
   response.data.forEach(element => {
         if(element.date)
             element.date= new Date(element.date)
       });
     return response.data
  });


  ipcMain.handle('get_google_todos', async (event, ...args) => {

    await axios.get('http://localhost:4545/google/tasks')
    await axios.get('http://localhost:4545/google/calendar')
    await axios.get('http://localhost:4545/google/emails')
   let response = await axios.get('http://localhost:4545/api')
   response.data.forEach(element => {
         if(element.date)
             element.date= new Date(element.date)
       });
     return response.data
  });

  ipcMain.handle('add_todo', async (event, ...args) => {
    var response

    try {

          response = await axios.post('http://localhost:4545/api',{
          name : args[0].name,
          priority : args[0].priority,
          description : args[0].description,
          origin : "metodo"

          })

    }
    catch(err) {
           return null
       }
       return response.data;

  });

  /*
  ipcMain.handle('history', async (event) => {
    const result = await somePromise()
    return result
  });*/
}
