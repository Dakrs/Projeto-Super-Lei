const { ipcMain } = require('electron');

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

var google = {
  _id: 7,
  date: new Date(2018,4,2),
  name: 'Celebração',
  origin: 'Google',
  priority: 4,
}

export default function setIpc(){

  ipcMain.handle('store_google_api_key', async (event, ...args) => {
    const result = await getTrue();
    return result;
  });

  ipcMain.handle('complete_todo_id', async (event, ...args) => {
    const result = await getTrue();
    return result;
  });

  ipcMain.handle('cancel_todo_id', async (event, ...args) => {
    const result = await getTrue();
    return result;
  });

  ipcMain.handle('update_list_index', async (event, ...args) => {
    const result = await getTrue();
    return result;
  });

  ipcMain.handle('get_all_todos', async (event, ...args) => {
    const result = await getTrue();
    return todosAux;
  });

  ipcMain.handle('get_git_todos', async (event, ...args) => {
    const result = await getTrue();
    return [git];
  });

  ipcMain.handle('get_outlook_todos', async (event, ...args) => {
    const result = await getTrue();
    return [outlook];
  });

  ipcMain.handle('get_google_todos', async (event, ...args) => {
    const result = await getTrue();
    return [google];
  });

  /**

  ipcMain.handle('add_todo', async (event, ...args) => {
    const result = await somePromise()
    return result
  });

  ipcMain.handle('history', async (event) => {
    const result = await somePromise()
    return result
  });*/
}
