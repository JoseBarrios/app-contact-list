const mongoConfig = require(`${global.APP_ROOT}/config/mongo-secret.json`);
const cookieConfig = require(`${global.APP_ROOT}/config/cookies-secret.json`);

const bodyParser = require('body-parser');
const csrf = require('csurf');
const express = require('express');
const session = require('client-sessions');
const forceSSL = require('express-force-ssl');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const fs = require('fs');

const landingRoutes = require(`${global.APP_ROOT}/routes/landing`)
const contactRoutes = require(`${global.APP_ROOT}/routes/contacts`)
const errorRoutes = require(`${global.APP_ROOT}/routes/errors`)


/**
 * Create and initialize an Express application that is 'fully loaded' and
 * ready for usage!
 *
 * This will also handle setting up all dependencies (like database
 * connections).
 *
 * @returns {Object} - An Express app object.
 */
module.exports.initApplication = function() {

  var app = express();
	//TODO
	//const sslOptions = {
		//key: fs.readFileSync(`${global.APP_ROOT}/config/privkey.pem`),
		//cert: fs.readFileSync(`${global.APP_ROOT}/config/fullchain.pem`),
	//};

	//TODO
	const server = http.createServer(app);
	//const secureServer = https.createServer(sslOptions, app);

  // settings
  app.set('view engine', 'pug');

  // MIDDLEWARE
  app.use(bodyParser.urlencoded({ extended: true }));

	if(process.env.NODE === 'production'){ app.use(forceSSL) };

  app.use(session(cookieConfig));
  app.use(helmet());
  app.use(express.static('public'))
	let nodeModulesURL = `${global.APP_ROOT}/node_modules`;
	app.use(express.static(nodeModulesURL));

	//CSRF ROUTES
	app.use(csrf());
  app.use(landingRoutes);
  app.use(contactRoutes);
  app.use(errorRoutes);

	server.listen(3000)
	//secureServer.listen(4000)
	console.log('Server listening in port 3000 (http), and 4000 (https)');

  return app;
};
