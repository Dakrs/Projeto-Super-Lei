var Credential = require('../models/credentials')

module.exports.listar = () => {
    return Credential
        .find()
        .exec()
}
module.exports.insert = t => {
    var novo = new Credential(t)
    return novo.save()
}
