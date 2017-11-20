var express = require('express');
var querystring = require('querystring');
var router = express.Router();

router.route('/error/404')

  .get((req, res) =>{
    let vars = {};
    vars.csrfToken = req.csrfToken();
    res.render("error/404", vars);
  })

module.exports = router;
