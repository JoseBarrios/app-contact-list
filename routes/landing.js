var fs = require('fs');
var express = require('express');
var querystring = require('querystring');
var userController = require(`${global.APP_ROOT}/controllers/user`);
var router = express.Router();


/**
 * Render the home page.
 */
router.get('/', function(req, res) {
	res.render("landing/");
});

module.exports = router;
