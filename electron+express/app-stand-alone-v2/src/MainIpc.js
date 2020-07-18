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

  async function sync(){
    if(!store.has('JWT_TOKEN')) {
      return null;
    }

    const token = store.get('JWT_TOKEN');

    var response;
    var register;

    try{
      response = await axios.get('http://localhost:4545/api/register');
      register = response.data[0];
    }
    catch(err){
      //libertar o lock
      return null;
    }
    // buscar as transações remote

    /**
    var transactions_from_global = [
      {
        _id: 'qQ2kCkERZQrkzmkjhKYEO',
        idOrigin: '5lev709aqkqnatbdjb41dh04l6',
        name: '[TODO] Test Google Cal',
        description: 'Este é um teste para o google calendar.',
        origin: 'Google Calendar',
        owner: 'ds@gmail.com',
        state: 0,
        priority: '3',
        __v: 0,
        idTask: 'vo_ZWlCIbujtRuEcSj8Ri',
        type: 'Post',
        timestamp: 0
      },
      {
        _id: 'TBtbR92cNsGJU_irJJDTQ',
        name: 'teste na app',
        priority: '3',
        description: '',
        origin: 'Mobile App',
        owner: 'ds@gmail.com',
        state: 0,
        __v: 0,
        idTask: 'YuPHAuesNMVdDjSWpUzp_',
        idOrigin: 'YuPHAuesNMVdDjSWpUzp_',
        type: 'Post',
        timestamp: 1,
      },
      {
        _id: 'VAFDHbliYzttLcuPUaVLb',
        idOrigin: '7mkngs1pptb5gbi25e1c8423cu',
        name: '[TODO] Test Cal',
        origin: 'Google Calendar',
        owner: 'ds@gmail.com',
        state: 0,
        priority: '3',
        __v: 0,
        idTask: 'wDwHZ3_qXWbsKMsJ6B9EH',
        type: 'Post',
        timestamp: 2
      },
      {
        _id: 'VAFDHbliYzttLcuPUdasdaVLb',
        idOrigin: '7mkngs1pptb5gbi25e1c8423cu',
        name: '[TODO] Test Cal',
        origin: 'Google Calendar',
        owner: 'ds@gmail.com',
        state: 0,
        priority: '3',
        __v: 0,
        idTask: 'wDwHZ3_qXWbsKMsJ6B9EH',
        type: 'cancel',
        timestamp: 3
      }
    ];*/


    var transactions_from_global = [];
    try{
      response = await axios.get('https://amcyni.herokuapp.com/api/transaction/' + register.global,{headers: {'x-access-token': token}});
      transactions_from_global = response.data;
    }
    catch(err){
      return null;
    }

    var list_trans_uncommited = [];
    try{
      response = await axios.get('http://localhost:4545/api/transactions',register);
      list_trans_uncommited = response.data;
    }
    catch(err){
      return null;
    }

    console.log(transactions_from_global);
    console.log('Passou');

    var transactions_to_update = [];
    var transactions_to_perform = [];

    for(var i = 0; i < transactions_from_global.length; i++){
      var dependency = false;
      for(var j = 0; j < list_trans_uncommited.length; j++){
        if(transactions_from_global[i].idOrigin === list_trans_uncommited[j].idOrigin){
          switch (transactions_from_global[i].type) {
            case 'Post':
              if (list_trans_uncommited[j].type === 'Post'){
                dependency = true;
                list_trans_uncommited.splice(j,1);
                console.log('entrei');
              }
              break;
            case 'confirm':
              if (list_trans_uncommited[j].type === 'confirm') {
                dependency = true;
                list_trans_uncommited.splice(j,1);
              }
              else if (list_trans_uncommited[j].type === 'cancel') {
                dependency = true;
                transactions_to_update.push({dep: transactions_from_global[i], id: list_trans_uncommited[j]._id});
                list_trans_uncommited.splice(j,1);
              }
              break;
            case 'cancel':
              if (list_trans_uncommited[j].type === 'cancel') {
                dependency = true;
                list_trans_uncommited.splice(j,1);
              }
              else if (list_trans_uncommited[j].type === 'confirm') {
                dependency = true;
                transactions_to_update.push({dep: transactions_from_global[i], id: list_trans_uncommited[j]._id});
                list_trans_uncommited.splice(j,1);
              }
              break;
            default:
          }
        }
        if (dependency){
          break;
        }
      }

      if(!dependency){
        transactions_to_perform.push(transactions_from_global[i]);
      }
    }

    for(var i = 0; i < transactions_to_perform.length; i++){
      try{
        await axios.post('http://localhost:4545/api/transactionTotask',transactions_to_perform[i]);
      }
      catch(err){
        console.log(err);
      }
    }

    for(var i = 0; i < transactions_to_update.length; i++){
      try{
        await axios.put('http://localhost:4545/api/updatetransaction',transactions_to_update[i]);
      }
      catch(err){
        console.log(err);
      }
    }

    console.log(transactions_to_perform);
    console.log(transactions_to_update);
    console.log(list_trans_uncommited);
  }


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
    var response2;

    try{
      response = await axios.post('https://amcyni.herokuapp.com/login',{
        email: args[0],
        pwd: args[1]
      })
    }
    catch(err){
      return err.response.status;
    }

    store.set('JWT_TOKEN',response.data.token);
    await sync();

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
}
