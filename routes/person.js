var express = require('express');
var Person = require(`${global.APP_ROOT}/controllers/person`);
var ObjectID = require('mongodb').ObjectID;
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
      console.log(error)
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
    locals.personID = req.personID;
    locals.person = req.person;
    locals.personClass = Person;
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
    locals.person = new Person(req.person);
    locals.personClass = Person;
    locals.updated = false;
    locals.csrfToken = req.csrfToken();
    res.render("person/update", locals);
  })
  .post((req, res) =>{
    let person = new Person(req.body);
    let document = Person.assignedProperties(person);
    let id = ObjectID(req.personID);
		//dbController.update goes here
  })


/**
 * AUTH EXAMPLE.
 */
//router.get('/dashboard', userController.requireLogin, function(req, res) {
//res.render('dashboard', { test:'Hello, world!' });
//});


module.exports = router;
