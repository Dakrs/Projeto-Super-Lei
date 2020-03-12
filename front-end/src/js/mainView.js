Vue.component('todo-info',{
  props: {
    todo: Object,
  },
  template: `
  <div class="ui cards" style="padding-top: 50%; -webkit-app-region: no-drag; -webkit-user-select: none;">
    <div class="card">
      <div class="content">
        <a class="ui red ribbon label">Info</a>
        <span class="title">{{ todo.name }}</span>
        <span>Description:</span>
        <div class="meta" style="padding-bottom: 1rem;">
          {{ todo.description }}
        </div>
        <span>Details:</span>
        <table cellspacing="0" cellpadding="0" style="width:100%; padding-top: 1rem;">
          <tr>
            <td class="detailsColumnLeft">Priority</td>
            <td class="detailsColumnRight">{{ todo.priority }}</td>
          </tr>
          <tr>
            <td class="detailsColumnLeft">Expire Date</td>
            <td class="detailsColumnRight">{{ todo.date }}</td>
          </tr>
          <tr>
            <td class="detailsColumnLeft">Origin</td>
            <td class="detailsColumnRight">{{ todo.origin }}</td>
          </tr>
        </table>
      </div>
      <div class="extra content">
        <div class="ui two buttons">
          <div class="ui basic green button">Complete</div>
          <div class="ui basic red button">Decline</div>
        </div>
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
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  `
})


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
    }
  },
  mounted: function (){
    this.$nextTick(function () {
    })
  }
})

var alltodos = new Vue({
  el: '#all-todos',
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
