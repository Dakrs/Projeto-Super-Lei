import $ from 'jquery';
window.$ = $;
//require('bootstrap/js/dist/modal');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Vue from 'vue';
import Sortable from 'sortablejs';
import './Components/todoinfo.js';
import './Components/apimodal.js';
import {  sortByOrigin,
          sortByDate,
          sortByNormal,
          updateIndex
        } from './Sorting';
import Ipc from './Ipc';

/**
Todo:
id: 1,
date: new Date(2017,1,1), !!!Pode ser null
name: 'Aula PSD',
origin: 'Outlook',
description: 'Aula que acontece todas as segundas feiras e é preciso aparecer para poder aprender.', !!! Pode ser null
priority: 2,
index:, !!!Pode ser null
*/



var alltodos = new Vue({
  el: '#MAIN_COMP',
  data: {
    todos: [],
    toggled: null,
    sortedBy: 0,
    sortableJS: null,
  },
  async mounted(){
    this.todos = await Ipc.get_all_todos();
    console.log(this.todos);
  },
  methods: {
    toggleInfo: function (id) {
      const todo = this.todos.find(item => item._id === id);
      if (this.toggled !== null && this.toggled._id === id){
        this.toggled = null;
      }
      else{
        this.toggled = todo;
      }
    },
    // botão complete todo main comp
    complete: async function (id){
      const result = await Ipc.complete_todo_id(id);
      if (result){
        if (this.toggled !== null && this.toggled._id === id){
          this.toggled = null;
        }
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    // botão cancel todo main comp
    cancel: async function (id){
      const result = await Ipc.cancel_todo_id(id);
      if (result){
        if (this.toggled !== null && this.toggled._id === id){
          this.toggled = null;
        }
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    // para lidar com os botões do todo que está a ser mostrado nos details
    complete_toggle: async function(id){
      const result = await Ipc.complete_todo_id(id);
      if (result){
        this.toggled = null;
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    // para lidar com os botões do todo que está a ser mostrado nos details
    cancel_toggle: async function(id){
      const result = await Ipc.cancel_todo_id(id);
      if (result){
        this.toggled = null;
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    //metodo para atualizar a ordem da lista quando old_index é menor que new_index
    rev_DaD_update: async function(old_index,new_index){
      var new_Array = [];

      this.todos.forEach((item, i) => {
        new_Array.push(item);
      });

      var temp = this.todos[old_index];
      for(var i = old_index; i < new_index && i < this.todos.length; i++)
      {
          new_Array[i] = this.todos[i+1];
      }
      new_Array[new_index] = temp;
      updateIndex(new_Array);

      const res = await Ipc.update_list_index(new_Array);
      if (res)
        this.todos = new_Array;
      else
        console.log('ERROR');
    },
    //metodo para atualizar a ordem da lista quando old_index é maior que new_index
    nor_DaD_update: async function(old_index,new_index){
      var new_Array = [];
      this.todos.forEach((item, i) => {
        new_Array.push(item);
      });

      var temp = this.todos[old_index];
      for(var i = old_index; i > new_index && i > 0; i--)
      {
        new_Array[i] = this.todos[i-1];
      }
      new_Array[new_index] = temp;
      updateIndex(new_Array);

      const res = await Ipc.update_list_index(new_Array);
      if (res)
        this.todos = new_Array;
      else
        console.log('ERROR');
    },
    verifyProperty: function(data){
      return (typeof data !== 'undefined');
    },
    sortBy: function(type){
      if (type !== this.sortedBy)
      {
        this.sortedBy = type;
        var new_Array = [];
        if (type === 0){
          this.todos = sortByNormal(this.todos);
          this.sortableJS.option("disabled", false);
        }
        else if (type === 1) {
          this.todos = sortByDate(this.todos);
          this.sortableJS.option("disabled", true);
        }
        else {
          this.todos = sortByOrigin(this.todos);
          this.sortableJS.option("disabled", true);
        }
      }
    },
    timeConversor: function (time){
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(time);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(time);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(time);

      return da + ' ' + mo + ' ' + ye;
    },
    // função para atualizar os items de um dado tipo: //0 - Github 1 - Google 2 - Outlook
    sync: async function(type){
      var new_todos = [];

      switch (type) {
        case 0:
          new_todos = await Ipc.get_git_todos();
          break;
        case 1:
          new_todos = await Ipc.get_google_todos();
          break;
        case 2:
          new_todos = await Ipc.get_outlook_todos();
          break;
        default:
      }

      var new_Array = [];
      this.todos.forEach((item, i) => {
        new_Array.push(item);
      });

      new_todos.forEach((item, i) => {
        new_Array.push(item);
      });

      switch (this.sortedBy) {
        case 0:
          this.todos = sortByNormal(new_Array);
          break;
        case 1:
          this.todos = sortByDate(new_Array);
          break;
        case 2:
          this.todos = sortByOrigin(new_Array);
          break;
        default:
      }
      alert(new_todos.length + ' new ToDos!');
    },
    test: function(){
      alert('Wele');
    },
  },
})


var el = document.getElementById('cards')
alltodos.sortableJS = Sortable.create(el,{
  animation: 150,
  onEnd: function (evt){
    if (evt.oldDraggableIndex < evt.newDraggableIndex){
      alltodos.rev_DaD_update(evt.oldDraggableIndex,evt.newDraggableIndex);
    }
    else if (evt.oldDraggableIndex > evt.newDraggableIndex) {
      alltodos.nor_DaD_update(evt.oldDraggableIndex,evt.newDraggableIndex);
    }
  },
});


/**
window.ipcRenderer.on('testing',(event,arg) => {
  console.log(arg);
})

window.ipcRenderer.send('test');*/

//sortable.option("disabled", true);

console.log('👋 This message is being logged by "renderer.js", included via webpack');
