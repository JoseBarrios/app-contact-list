const Person = require(`${global.APP_ROOT}/controllers/person`);
class User extends Person {

  static get type(){ return 'User'; }

  constructor(model){
    model = model || {};
		super(model);
		this.password = model.password;
	}

	get password(){ return this.model.password; }
	set password(value){
			this.model.password = value;
	}
};

/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */

User.createUserSession = function(req, res, userModel) {
  let user = new User(userModel);
  let cleanUser = user.clean();
  req.session.user = cleanUser;
  req.user = cleanUser;
  res.locals.user = cleanUser;
};


/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
User.requireLogin = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};


User.isSelf = function(req, res, next) {
  if (req.user.id === req.personID) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = User;
