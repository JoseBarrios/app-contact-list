var express = require('express');
var querystring = require('querystring');
var Person = require(`${global.APP_ROOT}/controllers/person`);
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');

var userController = require(`${global.APP_ROOT}/controllers/user`);
var dbController = require(`${global.APP_ROOT}/controllers/database`);
var router = express.Router();
const COLLECTION = 'people';


/////////////////////////////////////
//
//  PARAMS
//
////////////////////////////////////
router.param('personID', function (req, res, next, personID) {
  let id = ObjectID(personID);
  dbController.getDocumentByID(COLLECTION, id).then(person => {
    req.person = person;
    if(req.person._id){ delete req.person._id; }
    req.personID = personID;
    next();
  }).catch(error => {
    console.log('ERROR', error)
    next(error);
  })
});


/////////////////////////////////////
//
//  CREATE
//
////////////////////////////////////
router.route('/person/create')
  .post((req, res) =>{
		console.log(req.body)

		let emergencyContact = {};
		emergencyContact.givenName = req.body.emergencyGivenName;
		emergencyContact.familyName = req.body.emergencyFamilyName;
		emergencyContact.telephone = req.body.emergencyTelephone;

		let person = {};
		person.givenName = req.body.givenName;
		person.familyName = req.body.familyName;
		person.telephone = req.body.telephone;
		person.email = req.body.email;
		person.knows = [];
		person.knows.push(emergencyContact);
		dbController.insertOne(COLLECTION, person).then(person => {
				res.redirect('/contacts?select='+person._id)
		}).catch(error => {
			console.log('ERROR', error)
		})
  })


/////////////////////////////////////
//
//  GET
//
////////////////////////////////////
router.route('/person/:personID')
  .get((req, res) =>{
    let locals = {};
  	locals.sortPrimary = 'givenName';
  	locals.sortSecondary = 'familyName';
    locals.personID = req.personID;
    locals.person = req.person;
    locals.personClass = Person;
    locals.csrfToken = req.csrfToken();
    let lastUpdated = moment(parseInt(locals.person.disambiguatingDescription)).fromNow();
    let isValidDate = lastUpdated !== 'Invalid date';
    locals.lastUpdated = isValidDate? `Updated ${lastUpdated}` : '';

    res.render("person/", locals);
  })


/////////////////////////////////////
//
//  UPDATE
//
////////////////////////////////////
router.route('/person/:personID/update')
  .post((req, res) =>{
    let person = {};
    person.givenName = req.body.givenName;
    person.familyName = req.body.familyName;
    person.email = req.body.email;
    person.telephone = req.body.telephone;
    person.knows = [];
    person.knows[0] = {};
    person.knows[0].givenName = req.body.emergencyGivenName;
    person.knows[0].familyName = req.body.emergencyFamilyName;
    person.knows[0].telephone = req.body.emergencyTelephone;
    let id = ObjectID(req.personID);
    dbController.updateDocument(COLLECTION, id, person)
      .then(result => {
				res.redirect('/contacts?select='+req.personID)
      })
  })

/////////////////////////////////////
//
//  DELETE
//
////////////////////////////////////
router.route('/person/:personID/delete')
  .post((req, res) =>{
    let id = ObjectID(req.personID);
    dbController.deleteDocument(COLLECTION, id)
      .then(result => {
				res.redirect('/contacts')
      })
			.catch(error => {
				console.log(error);
			})
  })



/**
 * AUTH EXAMPLE.
 */
//router.get('/dashboard', userController.requireLogin, function(req, res) {
//res.render('dashboard', { test:'Hello, world!' });
//});


module.exports = router;
