// B R U T E  F O R C E  M O D U L E
///////////////////////////////////////////////////////////////////////////////
const moment = require('moment');
const mongoConfig = require(`${global.APP_ROOT}/config/mongo-config.json`);
const Bruteforce = require('express-brute');
const BruteStore = require('express-brute-mongo')
const MongoClient = require('mongodb').MongoClient;
let store = new BruteStore(ready => {
  MongoClient.connect(mongoConfig.url, function(err, db){
    if(err) throw err;
    else ready(db.collection('posts.temp'));
  })
})

var failCallback = function (req, res, next, nextValidRequestDate) {
  let query = {};
  query.email = req.body.email;
  let timeLeft = moment(nextValidRequestDate).fromNow();
  query.error =`You've made too many failed attempts in a short period of time, please try again ${timeLeft}`;
  query = querystring.stringify(query);
  res.redirect(`/email/verification?${query}`)
}

var handleStoreError = function (error) {
	log.error(error); // log this error so we can figure out what went wrong
	// cause node to exit, hopefully restarting the process fixes the problem
	throw {
		message: error.message,
		parent: error.parent
	};
}

let options = {};
options.freeRetries = 6;
options.minWait = 3 * 1000;//3sec
options.maxWait = 1 * 60 * 60;//1min
options.failCallback = failCallback;
options.handleStoreError = handleStoreError;
var bruteforce = new Bruteforce(store, options);
///////////////////////////////////////////////////////////////////////////////






var bcrypt = require('bcryptjs');
var express = require('express');
var querystring = require('querystring');

var userController = require(`${global.APP_ROOT}/controllers/user`);
var mailerController = require(`${global.APP_ROOT}/controllers/mailer`);
var dbController = require(`${global.APP_ROOT}/controllers/database`);

//Ensures login/:param ensures that public files are served from /, instead of login/
var router = express.Router({mergeParams: true});
const COLLECTION = 'emails'

/////////////////////////////////////
//
// EMAIL VERIFICATION
//
////////////////////////////////////
router.route('/email/verification')
   /////////////////////////////
   // GET
   ///////////////////////////////////
  .get((req, res) => {
    let withLocals = {};
    withLocals.email = req.query.email;
    withLocals.error = req.query.error;
    withLocals.csrfToken = req.csrfToken();
    res.render('email/verification', withLocals);
  })
   /////////////////////////////
   // POST
   ///////////////////////////////////
  .post(bruteforce.prevent, (req, res) => {
    let code = Number(req.body.code);
    let email = req.body.email;
    let query = {code, email};
    dbController.findOne('codes.temp', query).then(doc => {
      query = querystring.stringify(query);
      res.redirect(`/user/create?${query}`)
    })
    //INCORRECT CODE
    .catch(error => {
      console.log(error)
      let query = {};
      query.email = req.body.email;
      query.error = 'Incorrect code, try again.'
      query = querystring.stringify(query);
      res.redirect(`/email/verification?${query}`)
    })
  });
//END: USER VERIFICATION

module.exports = router;
