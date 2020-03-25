var mongoose = require('mongoose');


var taskSchema = new mongoose.Schema({
    _id: String,
    idOrigin : String,
    date : Date,
    name : String,
    priority : String,
    origin : String,
    owner : String,
    state : Number, 
  });
    
  module.exports = mongoose.model('tasks', taskSchema)