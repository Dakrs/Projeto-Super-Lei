import $ from 'jquery';
window.$ = $;
require('bootstrap/js/dist/modal');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Vue from 'vue';

Vue.component('todo-info',{
  props: {
    todo: Object,
  },
  template: `
  <div class="card mb-3 nomove">
    <div class="card-body" style="padding: 15px; padding-bottom:10px;">
      <h5 class="card-title" style="margin:0;margin-bottom: 0.75rem;text-align: center;">{{ todo.name }}</h5>
      <span>Description:</span>
      <p class="text-muted justify">{{ todo.description }}</p>
      <span>Details:</span>
      <table class="table table-borderless" style="margin-bottom:0">
        <tbody>
          <tr>
            <td class="details text-left grey">Priority</td>
            <td class="details text-right">{{ todo.priority }}</td>
          </tr>
          <tr>
            <td class="details text-left grey">Expire Date</td>
            <td class="details text-right">{{ todo.date }}</td>
          </tr>
          <tr>
            <td class="details text-left grey">Origin</td>
            <td class="details text-right">{{ todo.origin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer text-muted specfooter" align="center">
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success">Complete</button>
        <button type="button" class="btn btn-outline-danger">Cancel</button>
      </div>
    </div>
  </div>
  `
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
        <form style="margin-left: 10%; margin-right: 10%;">
          <div class="form-group">
            <label for="GOOGLE_API_KEY">API KEY</label>
            <input type="text" class="form-control" id="INPUT_API_KEY">
          </div>
        </form>
        <div class="modal-footer">
          <button id="SUBMIT_API_KEY" type="button" class="btn btn-primary">Send</button>
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
  setTimeout(() => {
    api_controller.has_GOOGLE_API_KEY = true;
  },1000);
}

function getDate(){
  const d = new Date();
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

  return da + ' ' + mo + ' ' + ye;
}

var date = new Date();
var todosAux = [];

todosAux.push({
  date: getDate(),
  name: 'Aula PSD',
  origin: 'Google Calender',
  description: 'Aula que acontece todas as segundas feiras e é preciso aparecer para poder aprender.',
  priority: 2,
})
todosAux.push({
  date: getDate(),
  name: 'Aula CPD',
  origin: 'Gmail',
  description: 'Aula das terças e super secante.',
  priority: 5,
})
todosAux.push({
  date: getDate(),
  name: 'Missao UD',
  origin: 'Outlook',
  description: 'Missão semanal para o desenvolvimento pessoal',
  priority: 1,
})
todosAux.push({
  date: getDate(),
  name: 'Entrega KAK',
  origin: 'Google Task',
  description: 'Entrega para do PLEI KAK',
  priority: 3,
})


var api_controller = new Vue({
  el: '#VUE-MODEL',
  data: {
    has_GOOGLE_API_KEY: false,
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
    todos:todosAux,
    toggled: null,
    sortedBy: 0,
  },
  methods: {
    toggleInfo: function (index) {
      this.toggled = index;
    }
  }
})

console.log('👋 This message is being logged by "renderer.js", included via webpack');
