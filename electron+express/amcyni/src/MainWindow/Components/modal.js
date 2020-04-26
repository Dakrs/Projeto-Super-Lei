import $ from 'jquery';
import Vue from 'vue';
//import Ipc from '../Ipc';

Vue.component('google-key-modal',{
  props: {
    submit_fun: Function,
  },
  methods: {
    goToURL: function(){
      window.API.Ipc.triggerGOOGLE_URL();
    },
    submit: function(){
      const GOOGLE_KEY = $('#GOOGLE_INPUT_API_KEY').val();
      $('#GOOGLE_INPUT_API_KEY').val('');
      console.log(GOOGLE_KEY);
      if (GOOGLE_KEY.length > 6){
        this.submit_fun(GOOGLE_KEY,1);
      }
      else{
        alert('KEY TOO SHORT');
      }
    }
  },
  template:`
  <div class="modal fade" id="GOOGLE-MODAL" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Google API Key</h5>
        </div>
        <div class="modal-body">
          <p>In order to access and colect usefull data for your application we need to access some sources.</p>
          <span @click="goToURL()" style="text-align: center; cursor: pointer;">Link to generate API Key</span>
        </div>
        <form style="margin-left: 10%; margin-right: 10%;" onsubmit="event.preventDefault()">
          <div class="form-group">
            <label for="GOOGLE_API_KEY">API KEY</label>
            <input type="text" class="form-control" id="GOOGLE_INPUT_API_KEY">
          </div>
        </form>
        <div class="modal-footer">
          <button @click="submit()" type="button" class="btn btn-dark">Send</button>
        </div>
      </div>
    </div>
  </div>
  `
})

Vue.component('outlook-key-modal',{
  props: {
    submit_fun: Function,
  },
  methods: {
    goToURL: function(){
      window.API.Ipc.triggerOUTLOOK_URL();
    },
    submit: function(){
      this.submit_fun('Wele');
    }
  },
  template:`
  <div class="modal fade" id="OUTLOOK-MODAL" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Outlook API Key</h5>
        </div>
        <div class="modal-body">
          <p>In order to access and colect usefull data for your application we need to access some sources.</p>
          <span @click="goToURL()" style="text-align: center; cursor: pointer;">Link to generate API Key</span>
        </div>
        <div class="modal-footer">
          <button @click="submit()" type="button" class="btn btn-dark">Send</button>
        </div>
      </div>
    </div>
  </div>
  `
})

Vue.component('github-key-modal',{
  props: {
    submit_fun: Function,
  },
  methods: {
    goToURL: function(){
      //window.API.Ipc.triggerOUTLOOK_URL();
      window.API.Ipc.triggerGITHUB_URL();
    },
    submit: function(){
      this.submit_fun();
    }
  },
  template:`
  <div class="modal fade" id="GITHUB-MODAL" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Github API Key</h5>
        </div>
        <div class="modal-body">
          <p>In order to access and colect usefull data for your application we need to access some sources.</p>
          <span @click="goToURL()" style="text-align: center; cursor: pointer;">Link to generate API Key</span>
        </div>
        <div class="modal-footer">
          <button @click="submit()" type="button" class="btn btn-dark">Send</button>
        </div>
      </div>
    </div>
  </div>
  `
})
