const userMiddleware = require(`${global.APP_ROOT}/middleware/user.js`);
const authentication = require(`${global.APP_ROOT}/config/authentication-example.json`);
const mongoConfig = require(`${global.APP_ROOT}/config/mongo-example.json`);
const cookieConfig = require(`${global.APP_ROOT}/config/cookies-example.json`);

const bodyParser = require('body-parser');
const csrf = require('csurf');
const express = require('express');
const session = require('client-sessions');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

//CERT
const forceSSL = require('express-force-ssl');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const fs = require('fs');

const userRoutes = require(`${global.APP_ROOT}/routes/user`)
const landingRoutes = require(`${global.APP_ROOT}/routes/landing`)
const personRoutes = require(`${global.APP_ROOT}/routes/person`)
const contactRoutes = require(`${global.APP_ROOT}/routes/contact`)
const dashboardRoutes = require(`${global.APP_ROOT}/routes/dashboard`)
const emailRoutes = require(`${global.APP_ROOT}/routes/email`)
const errorRoutes = require(`${global.APP_ROOT}/routes/error`)


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

	const server = http.createServer(app);
	//TODO
	//const secureServer = https.createServer(sslOptions, app);

  // settings
  app.set('view engine', 'pug');
  app.set('authenticationKey', authentication.secretKey);

  // MIDDLEWARE
  app.use(bodyParser.urlencoded({ extended: true }));

	if(process.env.NODE === 'production'){ app.use(forceSSL) };

  app.use(session(cookieConfig));
  app.use(helmet());
  app.use(express.static('public'))
  //app.use(express.static(`${global.APP_ROOT}/bower_components`));
	let nodeModulesURL = `${global.APP_ROOT}/node_modules`;
	app.use(express.static(nodeModulesURL));

  if(process.env.NODE_ENV !== 'test'){ app.use(morgan('dev')); }

  //MIDDLEWARE
  app.use(userMiddleware);
  //app.use(authenticationMiddleware);

	//CSRF ROUTES
	//app.use(csrf());
  app.use(landingRoutes);
  app.use(emailRoutes);
  app.use(userRoutes);
  app.use(personRoutes);
  app.use(contactRoutes);
  app.use(dashboardRoutes);
  app.use(errorRoutes);

	server.listen(3000)
	//secureServer.listen(4000)
	console.log('Server listening in port 3000 (http), and 4000 (https)');

  return app;
};


