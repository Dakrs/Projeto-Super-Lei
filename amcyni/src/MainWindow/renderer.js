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
description: 'Aula que acontece todas as segundas feiras e é preciso aparecer para poder aprender.',
priority: 2,
index:, !!!Pode ser null
*/



var date = new Date();
var todosAux = [];

todosAux.push({
  id: 1,
  date: new Date(2017,1,1),
  name: 'Aula PSD',
  origin: 'Outlook',
  description: 'Aula que acontece todas as segundas feiras e é preciso aparecer para poder aprender.',
  priority: 2,
  index: 0,
})
todosAux.push({
  id: 2,
  //date: new Date(2015,1,1),
  name: 'Aula CPD',
  origin: 'Gmail',
  description: 'Aula das terças e super secante.',
  priority: 5,
  index: 1,
})
todosAux.push({
  id: 3,
  date: new Date(2016,1,1),
  name: 'Missao UD',
  origin: 'Outlook',
  description: 'Missão semanal para o desenvolvimento pessoal',
  priority: 1,
  index: 2,
})
todosAux.push({
  id: 4,
  date: new Date(2014,1,1),
  name: 'Entrega KAK',
  origin: 'Google Task',
  description: 'Entrega para do PLEI KAK',
  priority: 3,
  index: 3,
})


var alltodos = new Vue({
  el: '#MAIN_COMP',
  data: {
    todos: todosAux,
    toggled: null,
    sortedBy: 0,
    todos_main: todosAux,
    sortableJS: null,
  },
  methods: {
    toggleInfo: function (id) {
      this.toggled = this.todos.find(item => item.id === id);
    },
    // botão complete todo main comp
    complete: function (id,index){
      if (this.toggled === index){
        this.toggled = null;
      }
      this.todos = this.todos.filter((item) => item.id !== id);
      //metodo para comunicar ao back end que o item foi aprovado. !!!FALTA
    },
    // botão cancel todo main comp
    cancel: function (id,index){
      if (this.toggled === index){
        this.toggled = null;
      }
      this.todos = this.todos.filter((item) => item.id !== id);
      //metodo para comunicar ao back end que o item foi cancelado. !!!FALTA
    },
    // para lidar com os botões do todo que está a ser mostrado nos details
    complete_toggle: function(id){
      this.toggled = null;
      this.todos = this.todos.filter((item) => item.id !== id);
      //metodo para comunicar ao back end que o item foi aprovado. !!!FALTA
    },
    // para lidar com os botões do todo que está a ser mostrado nos details
    cancel_toggle: function(id){
      this.toggled = null;
      this.todos = this.todos.filter((item) => item.id !== id);
      //metodo para comunicar ao back end que o item foi cancelado. !!!FALTA
    },
    //metodo para atualizar a ordem da lista quando old_index é menor que new_index
    rev_DaD_update: function(old_index,new_index){
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
      this.todos = new_Array;
    },
    //metodo para atualizar a ordem da lista quando old_index é maior que new_index
    nor_DaD_update: function(old_index,new_index){
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
      this.todos = new_Array;
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
    sync: function(type){

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
