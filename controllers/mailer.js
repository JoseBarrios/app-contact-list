let config = require('../config/mailer-example.json')
const Mailer = require('api-mailer');
let mailer = new Mailer(config)
const pug = require('pug');


class EmailMessage{

	constructor(model){
		model = model || {};
		this.sender = model.sender;
		this.recipient = model.recipient;
		this.about = model.about;
		this.text = model.text;
		this.HTML = model.HTML;
	}

	get sender(){ return this.model.sender}
	set sender(value){ this.model.sender = value; }

	get recipient(){ return this.model.recipient}
	set recipient(value){ this.model.recipient = value; }

	get text(){ return this.model.text }
	set text(value){ this.model.text = value }

	get HTML(){ return this.model.HTML }
	set HTML(value){ this.model.HTML = value }
}


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

module.exports.emailVerification = function(recipient, validationCode) {
	return new Promise((resolve, reject) => {
		let vars = {};
		vars.validationCode = validationCode
		pug.renderFile(`${global.APP_ROOT}/views/email/code.pug`, vars, function(err, HTML){
			if(err){reject(err)}
			else {
				//SET UP EMAIL
				let email = new EmailMessage();
				email.sender = config.sender;
				email.recipient = recipient;
				email.text = `Copy and paste this link to your web-browser`
				email.HTML = HTML;
				email.about = 'Please verify your email';
        mailer.sendEmail(email).then(resolve);
      }
    })
  })
};
