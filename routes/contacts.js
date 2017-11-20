var dbController = require(`${global.APP_ROOT}/controllers/database`);
var express = require('express');
var router = express.Router();
var moment = require('moment');

const COLLECTION = 'people';

/////////////////////////////////////
//
//  PARAMS: personID, display
//
////////////////////////////////////
router.param('personID', function (req, res, next, personID) {
	let _id = dbController.ObjectID(personID);
	dbController.getDocumentByID(COLLECTION, _id)
		.then(person => {
			if(person._id){ delete person._id; }
			person.identifier = personID;
			req.personID = personID;
			req.person = person;
			next();
		})
		.catch(error => {
			console.log('ERROR', error)
			next(error);
		})
});
//Client can let the client know what it's prefered media display is
router.param('display', function (req, res, next, display) {
	req.display = display.toLowerCase() === "mobile"? "mobile" : "desktop";
	req.onMobile = (req.display === "mobile");
	next();
});



/////////////////////////////////////
//
//  CREATE
//
////////////////////////////////////
router.route('/contacts/create/:display?')

//Client only requests this page if its mobile
	.get((req, res) =>{
		let locals = {};
		locals.person = {};
		//Sends mobile-first view
		res.render("contacts/card", locals);
	})


//Create a new contact in the db
	.post((req, res) =>{
		let emergencyContact = {};
		emergencyContact.givenName = req.body.emergencyGivenName;
		emergencyContact.familyName = req.body.emergencyFamilyName;
		emergencyContact.telephone = req.body.emergencyTelephone;

		let person = {};
		person.knows = [];
		person.givenName = req.body.givenName;
		person.familyName = req.body.familyName;
		person.telephone = req.body.telephone;
		person.email = req.body.email;
		person.knows.push(emergencyContact);

		person.meta = {};
		person.meta.createdOn = Date.now();
		person.meta.updatedOn = null;

		//TODO: Replace with more sophisticated validation
		let hasName = person.givenName || person.familyName;
		let hasInfo = person.telephone || person.email;
		let hasContact = emergencyContact.givenName || emergencyContact.familyName || emergencyContact.telephone;
		let isValid = (hasName || hasInfo || hasContact);

		if(isValid) {
			let _id = dbController.ObjectID();
			person._id = _id;
			person.identifier = _id.toString();
			dbController.insertOne(COLLECTION, person)
				.then(person => {
					let locals = {};
					locals.person = person;
					locals.personID = person.identifer;
					locals.csrfToken = req.csrfToken();
					req.onMobile?  res.render("contacts/card", locals) : res.redirect('/contacts?select='+person.identifier)
				})
			//DB Error
				.catch(error => {
					//TODO: return error page
					console.log('500 error: /contacts/create', error)
					res.sendStatus(500)
				})
		}
		else {
			//422 Unprocessable
			//Entity The request was formatted correctly but cannot be processed in its current form.
			//TODO: let client know what, exactly, was not
			res.sendStatus(422)
		}
	})

/////////////////////////////////////
//
//  READ
//
////////////////////////////////////
router.get('/contacts', function(req, res) {
	//Default values
	var sortPrimary = 'givenName';
	let sortSecondary = 'familyName';
	let search = null;
	//Check query and adjust default values accordingly
	if(req.query.sort){ sortPrimary = req.query.sort; }
	if(req.query.search){ search = req.query.search; }
	sortSecondary = sortPrimary === 'givenName'? 'familyName':'givenName';

	dbController.getDocuments(COLLECTION)
		.then(cursor => {
			let params = {};
			params[sortPrimary] = 1;
			params[sortSecondary] = 1;
			cursor.sort(params)
				.toArray()
				.then(people => {
					let locals = {};
					locals.csrfToken = req.csrfToken();
					locals.sortPrimary = sortPrimary;
					locals.sortSecondary = sortSecondary;
					locals.search = search;
					locals.people = people;
					locals.person = people[0];
					res.render("contacts/", locals);
				})
		})
		.catch(error => {
			//TODO: return error page
			console.log('500 error: /contacts', error)
			res.sendStatus(500);
		})
});


router.route('/contacts/:personID')
	.get((req, res) =>{
		let locals = {};
		locals.personID = req.personID;
		locals.person = req.person;
		locals.csrfToken = req.csrfToken();
		res.render("contacts/card", locals);
	})


/////////////////////////////////////
//
//  UPDATE
//
////////////////////////////////////
router.route('/contacts/:personID/update/:display?')
	.post((req, res) =>{
		let person = {};
		person.knows = req.person.knows || [];
		person.meta = req.person.meta || {};
		person.givenName = req.body.givenName;
		person.familyName = req.body.familyName;
		person.email = req.body.email;
		person.telephone = req.body.telephone;

		let emergencyContact = {};
		emergencyContact.givenName = req.body.emergencyGivenName;
		emergencyContact.familyName = req.body.emergencyFamilyName;
		emergencyContact.telephone = req.body.emergencyTelephone;
		person.knows.unshift(emergencyContact);

		person.meta = {};
		person.meta.updatedOn = Date.now();

		let id = dbController.ObjectID(req.personID);
		dbController.updateDocument(COLLECTION, id, person)
			.then(result => {
				req.onMobile?  res.redirect('/contacts/'+req.personID) : res.redirect('/contacts?select='+req.personID)
			})
			.catch(error => {
				//TODO: return error page
				console.log('500 error: /contacts/update', error)
				res.sendStatus(500);
			})
	})


/////////////////////////////////////
//
//  DELETE
//
////////////////////////////////////
router.route('/contacts/:personID/delete')
	.post((req, res) =>{
		let id = dbController.ObjectID(req.personID);
		dbController.deleteDocument(COLLECTION, id)
			.then(result => {
				res.redirect('/contacts');
			})
			.catch(error => {
				//TODO: return error page
				console.log('500 error: /contacts/delete', error)
				res.sendStatus(500);
			})
	})




module.exports = router;
