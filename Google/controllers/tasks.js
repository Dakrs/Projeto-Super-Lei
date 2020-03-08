var Task = require('../models/tasks')


module.exports.insert = t => {
    var novo = new Task(t)
    return novo.save()
}