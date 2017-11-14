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
  .get((req, res) =>{
    let locals = {};
    res.render("person/create", locals);
  })
  .post((req, res) =>{
    req.body.identifier = 'Person';
    let person = new Person(req.body);
    let document = Person.assignedProperties(person);
    dbController.insertOne(COLLECTION, document).then(person => {
        res.redirect(`/person/${person._id}`)
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
  .get((req, res) =>{
    let locals = {};
    locals.personID = req.personID;
    locals.person = req.person;
    locals.personClass = Person;
    locals.csrfToken = req.csrfToken();
    let lastUpdated = moment(parseInt(locals.person.disambiguatingDescription)).fromNow();
    let isValidDate = lastUpdated !== 'Invalid date';
    locals.lastUpdated = isValidDate? `Updated ${lastUpdated}` : '';
    res.render("person/update", locals);
  })
  .post((req, res) =>{
    let person = {};
    person.disambiguatingDescription = req.body.personDisambiguatingDescription;
    person.givenName = req.body.personGivenName;
    person.familyName = req.body.personFamilyName;
    person.email = req.body.personEmail;
    person.telephone = req.body.personTelephone;
    person.knows = [];
    person.knows[0] = {};
    person.knows[0].givenName = req.body['personKnows0GivenName'];
    person.knows[0].familyName = req.body['personKnows0FamilyName'];
    person.knows[0].telephone = req.body['personKnows0Telephone'];
    let id = ObjectID(req.personID);
    dbController.updateDocument(COLLECTION, id, person)
      .then(result => {
        console.log(result);
				res.redirect('/person/'+req.personID);
      })
  })


/**
 * AUTH EXAMPLE.
 */
//router.get('/dashboard', userController.requireLogin, function(req, res) {
//res.render('dashboard', { test:'Hello, world!' });
//});


module.exports = router;
