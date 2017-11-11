const jwt = require('jsonwebtoken')
const config = require(`${global.APP_ROOT}/config/authentication`)
const User = require('@josebarrios/user');

/**
 * A simple authentication middleware for Express.
 *
 * This middleware will load users from session data, and handle all user
 * proxying for convenience.
 */
const authentication = function(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token']

  if(token){
    jwt.verify(token, config.secretKey, function(err, decoded){
      if(err){
        let response = {};
        response.success = false;
        response.message = "Failed to authenticate token"
        res.status(403).json(response);
      }else{
        req.authentication = decoded;
        next();
      }
    })
  } else {
    let response = {};
    response.success = false;
    response.message = "No token provided"
    res.status(403).json(response);
  }

};

const adminPermissions = function(req, res, next) {
  authentication(req, res, () => {
    let user = new User(req.authentication);
    if(user.role == 3){
      req.role = 3;
      next();
    } else if (user.role == 2){
      req.role = 2;
      next();
    } else {
      let response = {};
      response.success = false;
      response.message = "You don't have 'admin' permissions, sorry"
      res.status(403).json(response)
    }
  })
};

const rootPermissions = function(req, res, next) {
  authentication(req, res, () => {
    let user = new User(req.authentication);
    if(user.role === 'root'){
      req.role = 3;
      next();
    } else {
      let response = {};
      response.success = false;
      response.message = "You don't have 'root' permissions, sorry"
      res.status(403).json(response)
    }
  })
};



module.exports = {authentication, adminPermissions, rootPermissions}
