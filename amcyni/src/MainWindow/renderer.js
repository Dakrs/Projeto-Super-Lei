import $ from 'jquery';
window.$ = $;
require('bootstrap/js/dist/modal');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Vue from 'vue';
import Sortable from 'sortablejs';

const Store = require('electron-store');
const store = new Store();

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


Vue.component('todo-info',{
  props: {
    todo: Object,
    callback_completed: Function,
    callback_cancel: Function,
  },
  template: `
  <div class="card mb-3 nomove">
    <div class="card-body" style="padding: 15px; padding-bottom:10px;">
      <h5 class="card-title" style="margin:0;margin-bottom: 0.75rem;text-align: center;">{{ todo.name }}</h5>
      <template v-if="verifyProperty(todo.description)">
        <span>Description:</span>
        <p class="text-muted justify">{{ todo.description }}</p>
      </template>
      <span>Details:</span>
      <table class="table table-borderless" style="margin-bottom:0">
        <tbody>
          <tr v-if="verifyProperty(todo.priority)">
            <td class="details text-left grey">Priority</td>
            <td class="details text-right">{{ todo.priority }}</td>
          </tr>
          <tr v-if="verifyProperty(todo.date)">
            <td class="details text-left grey">Expire Date</td>
            <td class="details text-right">{{ timeConv(todo.date) }}</td>
          </tr>
          <tr v-if="verifyProperty(todo.origin)">
            <td class="details text-left grey">Origin</td>
            <td class="details text-right">{{ todo.origin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer text-muted specfooter" align="center">
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" @click="complete()" class="btn btn-outline-success">Complete</button>
        <button type="button" @click="cancel()" class="btn btn-outline-danger">Cancel</button>
      </div>
    </div>
  </div>
  `,
  methods: {
    complete: function (){
      this.callback_completed(this.todo.id);
    },
    cancel: function (){
      this.callback_cancel(this.todo.id);
    },
    verifyProperty: function(data){
      return (typeof data !== 'undefined');
    },
    timeConv: function (time){
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(time);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(time);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(time);

      return da + ' ' + mo + ' ' + ye;
    }
  }
})



Vue.component('api-modal',{
  props: {
    todo: Object,
  },
  template: `
  <div class="modal fade" id="API-MODAL" data-backdrop="static" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Google API Key</h5>
        </div>
        <div class="modal-body">
          In order to access and colect usefull data for your application we need to access some producers.
        </div>
        <form style="margin-left: 10%; margin-right: 10%;" onsubmit="event.preventDefault()">
          <div class="form-group">
            <label for="GOOGLE_API_KEY">API KEY</label>
            <input type="text" class="form-control" id="INPUT_API_KEY">
          </div>
        </form>
        <div class="modal-footer">
          <button id="SUBMIT_API_KEY" type="button" class="btn btn-dark">Send</button>
        </div>
      </div>
    </div>
  </div>
  `
})


function API_KEY_REQUEST(){
  const USER_KEY = $('#INPUT_API_KEY').val();
  $('#INPUT_API_KEY').val('');
  console.log(USER_KEY);
  if (USER_KEY.length > 6){
    SAVE_API_KEY(USER_KEY);
    setTimeout(() => {
      api_controller.has_GOOGLE_API_KEY = true;
    },1000);
  }
  else{
    alert('KEY TOO SHORT');
  }
}

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


var api_controller = new Vue({
  el: '#VUE-MODEL',
  data: {
    has_GOOGLE_API_KEY: API_KEY_EXISTS(),
  },
  watch: {
    has_GOOGLE_API_KEY: function (val) {
      if (val){
        alert('API KEY Validated');
        $('#API-MODAL').modal('hide');
      }
      else {
        $('#API-MODAL').modal('show');
      }
    }
  },
  mounted: function (){
    this.$nextTick(function () {
      if (!this.has_GOOGLE_API_KEY){
        $('#API-MODAL').modal('show');
        document.getElementById('SUBMIT_API_KEY').addEventListener('click',API_KEY_REQUEST);
      }
    })
  }
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
        //this.todos = new_Array;
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


//verifica se é preciso pedir a chave para a api no modal
function API_KEY_EXISTS(){
  var key = store.get('GOOGLE_API_KEY');
  console.log(key);

  return (typeof key !== 'undefined');
}

//guardar a key localmente.
function SAVE_API_KEY(key){
  store.set('GOOGLE_API_KEY',key);
  //escrita na BD do backend;
}


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

function sortByOrigin(list){
  var new_Array = [];
  var groupby = new Map();
  list.forEach((item, i) => {
    if (!groupby.has(item.origin))
      groupby.set(item.origin,[])
    groupby.get(item.origin).push(item);
  });
  for (const [key,value] of groupby.entries()){
    value.forEach((item, i) => {
      new_Array.push(item);
    });
  }

  return new_Array;
}

function sortByDate(list){
  var new_Array = [];
  list.forEach((item, i) => {
    new_Array.push(item);
  });
  new_Array.sort((a,b) => {
    if (!a.hasOwnProperty('date')){
      return 1;
    }
    if (!b.hasOwnProperty('date')){
      return -1;
    }

    return (a.date.getTime() - b.date.getTime());
  });

  return new_Array;
}

function sortByNormal(list){
  var new_Array = [];

  const [p_index, f_index] = list.reduce( ([p,f], e) => (e.hasOwnProperty('index') ? [[...p,e],f] : [p,[...f,e]]), [[],[]] );
  const [p_date, f_date] = f_index.reduce( ([p,f], e) => (e.hasOwnProperty('date') ? [[...p,e],f] : [p,[...f,e]]), [[],[]] );

  p_index.sort((a,b) => (a.index - b.index));
  p_date.sort((a,b) => (a.date.getTime() - b.date.getTime()));
  f_date.sort((a,b) => (a.name.localeCompare(b.name)));

  p_index.forEach((item, i) => {
    new_Array.push(item);
  });
  p_date.forEach((item, i) => {
    new_Array.push(item);
  });
  f_date.forEach((item, i) => {
    new_Array.push(item);
  });
  return new_Array;
}

function updateIndex(list){
  list.forEach((item, i) => {
    item.index = i;
  });
}

//sortable.option("disabled", true);

console.log('👋 This message is being logged by "renderer.js", included via webpack');
