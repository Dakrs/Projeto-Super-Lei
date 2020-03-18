var Task = require('../models/tasks')


module.exports.insert = task => {
    var novo = new Task(task)
    return novo.save()
}


module.exports.selectAll = () =>{
    return Task
           .find()
           .exec() 
}

module.exports.selectAllByOwner = owner => {
    return Task
           .find({owner : owner})
           .exec() 
}




module.exports.selectById = id =>{
    return Task.findOne({_id : id}).exec()

}

module.exports.findByIdOrigin = (idFont, font) =>{
    return Task.find({idOrigin:idFont,  origin : font }).exec()
}


module.exports.updateById = task => {
    return Task.findByIdAndUpdate({_id :task._id},task,{new:true})        
} 


module.exports.removeById = id =>{
    return Task.deleteOne({_id:id})
}


