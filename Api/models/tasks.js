var mongoose = require('mongoose');


var taskSchema = new mongoose.Schema({
    _id: String,
    idOrigin : String,
    date : String,
    description : String,
    priority : String,
    origin : String,
    owner : String
  });
    
  module.exports = mongoose.model('tasks', taskSchema)