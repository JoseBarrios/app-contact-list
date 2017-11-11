var querystring = require('querystring');
var bcrypt = require('bcryptjs');
var express = require('express');
const User = require(`${global.APP_ROOT}/controllers/user`);
var userController = require(`${global.APP_ROOT}/controllers/user`);
var mailerController = require(`${global.APP_ROOT}/controllers/mailer`);
var dbController = require(`${global.APP_ROOT}/controllers/database`);
//Ensures login/:param ensures that public files are served from /, instead of login/
var router = express.Router({mergeParams: true});
const COLLECTION = 'users'
const request = require('request');
const axios = require('axios');


/////////////////////////////////////
//PARAMS
////////////////////////////////////
router.param('userID', function (req, res, next, userID) {
  let identifier = userID;
  dbController.findOne(COLLECTION, {identifier}).then(user => {
    req.user = user;
    req.userID = userID;
    next();
  }).catch(error => {
    res.render('user/404');
    next(error);
  })
});


/**
 * Render the registration page.
 */
router.route('/user/create')

//////////////////////
// USER GET
/////////////////////
  .get((req, res) => {
    var withLocals = {};
    withLocals.givenName = req.query.givenName
    withLocals.familyName = req.query.familyName
    withLocals.email = req.query.email
    withLocals.csrfToken = req.csrfToken();
    res.render('user/create', withLocals);
  })

  .post((req, res) => {
    let user = new User(req.body);
    let userModel = User.assignedProperties(user);
    let data = querystring.stringify(userModel);
    axios.post(`http://localhost:3000/api/v1/users`, data)
      .then(response => {
        userController.createUserSession(req, res, userModel);
        res.redirect('/dashboard');
      })
			.catch(error => {
				let withLocals = {};
				withLocals.email = user.email;
				withLocals.givenName = user.givenName;
        withLocals.csrfToken = req.csrfToken();
				withLocals.familyName = user.familyName;
				withLocals.errorMessage = error.response.data.message;
				res.render('user/create', withLocals);
			})
	});
/////////////END: Registration










/**
 * Render the login page.
 */
router.route('/user/login')

	.get((req, res) => {
		var withLocals = {};
		withLocals.email = req.query.email
		withLocals.csrfToken = req.csrfToken();
		res.render('user/login', withLocals);
	})

	.post((req, res) => {
		dbController.findOne(COLLECTION, {email:req.body.email})
      .then(userModel => {
        bcrypt.compare(req.body.password, userModel.password)
          .then(function(match) {
            if(match){
              userController.createUserSession(req, res, userModel);
              res.redirect('/dashboard');
            }else{
              res.render('login', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
            }
          })
          .catch(error => {
            console.log('ERROR', error)
          })
      })
      .catch(error => {
        console.log('SOME ERROR', error)
        res.render('login', { email: req.body.email, error: "Incorrect email / password.", csrfToken: req.csrfToken() });
      })
  });


/**
 * Render the login page.
 */
router.get('/user/password-reset', function(req, res) {
  res.render('user/password-reset', { csrfToken: req.csrfToken() });
});


/**
 * Log a user into their account.
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/user/password-reset', function(req, res) {
  Account.findOne({ email: req.body.email }, 'firstName lastName email password data', function(err, user) {
    if (!user) {
      res.render('user/password-reset', { email: req.body.email, error: `Email not associated with any account`, csrfToken: req.csrfToken() });
    } else {
        //UTILS for creating a password reset link
      //userController.createUserSession(req, res, user);
      res.render('user/password-reset', { success: "Please check your email.", csrfToken: req.csrfToken() });
    }
  });
});


/**
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/user/logout', function(req, res) {
  if (req.session) {
    req.session.reset();
  }
  res.redirect('/');
});

module.exports = router;
