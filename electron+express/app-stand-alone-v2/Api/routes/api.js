var express = require('express');
var router = express.Router();
var Task = require('../controllers/tasks')
var Transaction = require('../controllers/transactions')
var Register = require('../controllers/register')
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

router.get('/register',function(req,res){
    Register.get()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.get('/transactions',function(req,res){
    Register.get()
    .then(register => {
            var local = register[0].local
            var global = register[0].global
            Transaction.getTransactionsWithInterval(local,global)
            .then(transactions => res.jsonp(transactions))
            .catch(erro => {
                console.log(erro)
                res.status(500).jsonp(erro)})            
        })
    .catch(erro =>{
            console.log(erro)
             res.status(500).jsonp(erro)})

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
    .then(dados =>{
        Task.selectById(req.params.id)
        .then(dados2 => {
            Register.get()
            .then(register=> {
            Register.incLocal(register[0]._id)
            .then(incLOCAL =>{
                console.log(register)
                var transactions = JSON.parse(JSON.stringify(dados2)); //new json object here
                transactions.idTask = dados2._id
                transactions.idOrigin = dados2._id
                transactions._id = nanoid()
                transactions.type = req.query.state==="1" ? "complete" : "false";
                transactions.timestamp = register[0].local
                console.log(transactions)
                Transaction.insert(transactions)
                .then(resp1 =>  res.jsonp(dados) )
                .catch(err => console.log(err))
               
            })
            .catch(err => console.log(err))
            
            })
        })
        .catch(err => console.log(err))
        
    })
    .catch(erro => res.status(500).jsonp(erro))
})


router.put('/register/:id',function(req,res,nex){
    var local = req.query.local
    var global=req.query.global
    var id = req.params.id
    Register.updateById(id,local,global)
    .then(dados =>res.jsonp(dados))
    .catch(erro =>{ 
        console.log(erro)
        res.status(500).jsonp(erro)})

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
    .then(dados =>{
        Register.get()
            .then(register=> {
            Register.incLocal(register[0]._id)
            .then(incLOCAL =>{
                console.log(register)
                var transactions = JSON.parse(JSON.stringify(dados)); //new json object here
                transactions.idTask = dados._id
                transactions.idOrigin = dados._id
                transactions._id = nanoid()
                transactions.type = "Post";
                transactions.timestamp = register[0].local
                console.log(transactions)
                Transaction.insert(transactions)
                .then(resp1 =>  res.jsonp(dados) )
                .catch(err => console.log(err))
        
            })
            .catch(err => console.log(err))
            
            })
    
    
    })
    .catch(erro => res.status(500).jsonp(erro))


})





module.exports = router;