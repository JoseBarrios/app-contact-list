var express = require('express');
var querystring = require('querystring');

var userController = require(`${global.APP_ROOT}/controllers/user`);
var dbController = require(`${global.APP_ROOT}/controllers/database`);
var router = express.Router();


/////////////////////////////////////
//
//  GET
//
////////////////////////////////////
router.route('/dashboard')
  .get((req, res) =>{
    let withLocals = {};
    withLocals.user = req.user;
    res.render("dashboard/", withLocals);
  })

module.exports = router;
