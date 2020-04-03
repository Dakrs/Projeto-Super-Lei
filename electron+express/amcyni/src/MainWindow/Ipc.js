//const ipcRenderer = window.ipcRenderer
const { ipcRenderer } = require('electron')

export async function store_google_api_key(key){
  const result = await ipcRenderer.invoke('store_google_api_key',key);
  return result;
}

export async function cancel_todo_id(id){
  const result = await ipcRenderer.invoke('cancel_todo_id', id);
  return result;
}

export async function complete_todo_id(id){
  const result = await ipcRenderer.invoke('complete_todo_id', id);
  return result;
}

export async function update_list_index(list){
  const result = await ipcRenderer.invoke('update_list_index', list);
  return result;
}

export async function get_all_todos(){
  const result = await ipcRenderer.invoke('get_all_todos');
  return result;
}

export async function get_git_todos(){
  const result = await ipcRenderer.invoke('get_git_todos');
  return result;
}

export async function get_google_todos(){
  const result = await ipcRenderer.invoke('get_google_todos');
  return result;
}

export async function get_outlook_todos(){
  const result = await ipcRenderer.invoke('get_outlook_todos');
  return result;
}

export async function add_todo(todo){
  const result = await ipcRenderer.invoke('add_todo',todo);
  return result;
}

export async function history(){
  const result = await ipcRenderer.invoke('history');
  return result;
}

export function triggerGOOGLE_URL(){
  ipcRenderer.send('URL_GOOGLE');
}

export default {store_google_api_key,
                cancel_todo_id,
                complete_todo_id,
                update_list_index,
                get_all_todos,
                get_git_todos,
                get_google_todos,
                get_outlook_todos,
                add_todo,
                history,
                triggerGOOGLE_URL}
