var express = require('express');
var router = express.Router();
var Task = require('../controllers/tasks')
var nanoid = require('nanoid')

router.get('/',function(req, res, next) {
    Task.selectAll()
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.get('/owner/:owner',function(req, res, next) {
    Task.selectAllByOwner(req.params.owner)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.get('/origin',function(req, res, next) {
    Task.sortByOrigin()
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})
router.get('/date',function(req, res, next) {
    Task.sortByTime()
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})


router.get('/historic',function(req, res, next) {
    Task.historic()
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})





router.get('/:id',function(req, res, next) {
    Task.selectById(req.params.id)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})



router.put('/',function(req, res, next) {
    var todos = req.body.todos[0]
    todos.forEach(element => {
            Task.updateById(element)
    });
    res.jsonp(todos)
    

})

router.put('/state/:id',function(req, res, next) {
    var state = req.query.state
    Task.updateState(req.params.id,state)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.delete('/:id',function(req, res, next) {
    Task.removeById(req.params.id)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.post('/',function(req,res){
    req.body._id = nanoid();
    req.body.owner = "me"
    req.body.state =0
    Task.insert(req.body)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))


})


module.exports = router;