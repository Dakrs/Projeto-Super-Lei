const { ipcMain   } = require('electron');
const axios = require('axios');
var nanoid = require('nanoid');

const Store = require('electron-store');
const store = new Store();


function getTrue() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
}

export default function setIpc(){
  ipcMain.handle('verify-outlook-key',async (event,arg) => {
    //perguntar à api se a key do outlook existe
    var response=false
    try {
      var aux = await axios.get('http://localhost:4545/outlook/verify',)
      response=aux.data;
    }
    catch(err){
      console.error("Erro",err)
    }
    if (response === true)
      store.set('OUTLOOK_API_KEY',true);
    //store.set('OUTLOOK_API_KEY',true);
    return response;
   })

   ipcMain.handle('verify-github-key',async (event,arg) => {
    var response=false
    try {
      var aux = await axios.get('http://localhost:4545/github/verify',)
      response=aux.data;
    }
    catch(err){
      console.error("Erro",err)
    }
    if (response === true)
      store.set('GITHUB_API_KEY',true);
    return response;
   });

  ipcMain.handle('url-outlook',async (event,arg) => {
    let response = await axios.get('http://localhost:4545/outlook/url');
    var url = response.data;
    return url
  });

  ipcMain.handle('url-google',async (event,arg) => {
    let response = await axios.get('http://localhost:4545/google/url');
    var url = response.data;
    return url
  });

  ipcMain.handle('url-github',async (event,arg) => {
    let response = await axios.get('http://localhost:4545/github/url');
    var url = response.data;
    console.log(url);
    return url
  });

  ipcMain.handle('store_google_api_key', async (event, ...args) => {
    var response=false
    try {
       var aux = await axios.post('http://localhost:4545/google/code',{
         code : args[0]
       })
       response = aux.data
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       store.set('GOOGLE_API_KEY',true);
    }
    catch(err) {
          console.error("Erro",err)
      }
    return response
  });

  ipcMain.handle('complete_todo_id', async (event, ...id) => {

    var response=false
    try {
       response = await axios.put('http://localhost:4545/api/state/'+id+'?state=1')
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response=true;
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
    await axios.get('http://localhost:4545/github/issues')
    let response = await axios.get('http://localhost:4545/api')
    response.data.forEach(element => {
         if(element.date)
             element.date= new Date(element.date)
       });
    return response.data
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

  ipcMain.handle('log-in', async (event, ...args) => {
    var response;

    try{
      response = await axios.post('https://amcyni.herokuapp.com/login',{
        email: args[0],
        pwd: args[1]
      })
    }
    catch(err){
      return err.response.status;
    }

    if (response.status === 200){
      store.set('JWT_TOKEN',response.data.token);
    }

    return response.status;
  });
  ipcMain.handle('register', async (event, ...args) => {
    var response;

    try{
      response = await axios.post('https://amcyni.herokuapp.com/register',{
        email: args[0],
        pwd: args[1]
      });
    }
    catch(err){
      return err.response.status;
    }

    return response.status;
  });

  /*
  ipcMain.handle('history', async (event) => {
    const result = await somePromise()
    return result
  });*/
}

function sync(){
  if(!store.has('JWT_TOKEN')) {
    return null;
  }
}
