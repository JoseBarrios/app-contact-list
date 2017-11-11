const userController = require(`${global.APP_ROOT}/controllers/user.js`);
const dbController = require(`${global.APP_ROOT}/controllers/database.js`);
const COLLECTION = 'users';

/**
 * A simple authentication middleware for Express.
 *
 * This middleware will load users from session data, and handle all user
 * proxying for convenience.
 */
module.exports = function(req, res, next) {
  if (req.session && req.session.user) {
    dbController.findOne(COLLECTION, {email:req.session.user.email}).then(user =>{
      userController.createUserSession(req, res, user);
      next();
    })
  } else {
    next();
  }
};
