var express = require('express');
var router = express.Router();
var Task = require('../controllers/tasks')
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
  
router.get('/:id',function(req, res, next) {
    Task.selectById(req.params.id)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.delete('/:id',function(req, res, next) {
    Task.removeById(req.params.id)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})

router.put('/',function(req, res, next) {
    Task.updateById(req.body)
    .then(dados =>res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
})








  /* GET /authorize/signout */
router.get('/signout', function(req, res, next) {
    authHelper.clearCookies(res);
  
    // Redirect to home
    res.redirect('/');
  });

module.exports = router;