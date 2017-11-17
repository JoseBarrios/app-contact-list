var express = require('express');
var dbController = require(`${global.APP_ROOT}/controllers/database`);
var router = express.Router();
var moment = require('moment');

/**
 * Render the home page.
 */
router.get('/', function(req, res) {
  //Default values
  var sortPrimary = 'givenName';
  let sortSecondary = 'familyName';
	let search = null;
  //Check query and adjust default values accordingly
  if(req.query.sort){ sortPrimary = req.query.sort; }
  if(req.query.search){ search = req.query.search; }
  sortSecondary = sortPrimary === 'givenName'? 'familyName':'givenName';

  dbController.getDocuments('people').then(cursor => {
    let params = {};
    params[sortPrimary] = 1;
    params[sortSecondary] = 1;
    cursor.sort(params).toArray().then(people => {
      let locals = {};
      locals.sortPrimary = sortPrimary;
      locals.sortSecondary = sortSecondary;
      locals.search = search;
      locals.people = people;
      locals.csrfToken = req.csrfToken();;
			locals.person = people[0];
			//let isValidDate = lastUpdated !== 'Invalid date';
			//locals.lastUpdated = isValidDate? `Updated ${lastUpdated}` : '';
      locals.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      res.render("landing/", locals);
    })
  })
});

router.get('/contacts', function(req, res) {
  //Default values
  var sortPrimary = 'givenName';
  let sortSecondary = 'familyName';
	let search = null;
  //Check query and adjust default values accordingly
  if(req.query.sort){ sortPrimary = req.query.sort; }
  if(req.query.search){ search = req.query.search; }
  sortSecondary = sortPrimary === 'givenName'? 'familyName':'givenName';

  dbController.getDocuments('people').then(cursor => {
    let params = {};
    params[sortPrimary] = 1;
    params[sortSecondary] = 1;
    cursor.sort(params).toArray().then(people => {
      let locals = {};
      locals.sortPrimary = sortPrimary;
      locals.sortSecondary = sortSecondary;
      locals.search = search;
      locals.people = people;
      locals.csrfToken = req.csrfToken();;
			locals.person = people[0];
			//let isValidDate = lastUpdated !== 'Invalid date';
			//locals.lastUpdated = isValidDate? `Updated ${lastUpdated}` : '';
      locals.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      res.render("landing/", locals);
    })
  })
});



module.exports = router;
