var express = require('express');
var router = express.Router();
var authHelper = require('../authOutlook');



router.get('/', async function(req, res, next) {
    // Get auth code
    const code = req.query.code;
  
    // If code is present, use it
    if (code) {
      try {
        await authHelper.getTokenFromCode(code, res);
        // Redirect to home
        res.redirect('/')
      } catch (error) {
        res.status(500).jsonp(erro)
      }
    } else {
      // Otherwise complain
      res.status(500).jsonp(erro)
    }
  });

  /* GET /authorize/signout */
router.get('/signout', function(req, res, next) {
    authHelper.clearCookies(res);
  
    // Redirect to home
    res.redirect('/');
  });


module.exports = router;