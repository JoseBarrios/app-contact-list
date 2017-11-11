process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();
let request = require('request')

chai.use(chaiHttp);

let userIDs = [];
let targetID = null;
let givenName = 'Josephino';
let familyName = 'Barrios-Prueva';
let email = 'testing-api-user@barrios.io';
let password = 'password';

let authEmail = 'root@barrios.io';
let authPassword = 1234;
let token = null;

describe('Users', () => {

  before((done) => { //Before each test we empty the database
    let email = authEmail;
    let password = authPassword;
    let body = {};
    body.form = {email, password};
    request.post('http://localhost:3000/api/v1/authentication', body, (err, res, body) => {
      if(err){ console.error('Could not authenticate', err) }
      else{
        body = JSON.parse(body);
        token = body.token;
        done()
      }
    })
  });

  describe('/POST users', () => {
    it('it should POST a new user', (done) => {
      let user = {};
      user.email = email;
      user.givenName = givenName;
      user.familyName = familyName;
      user.password = password;
      chai.request(server)
        .post('/api/v1/users')
        .type('form')
        .send(user)
        .then(res => {
          userIDs.push(res.body.identifier);
          res.should.have.status(201);
          res.should.have.header('Location', `/users/${res.body.identifier}`);
          targetID = res.body.identifier;
          done();
        })
        .catch(error => {
          done(new Error(error.status))
        })
    });

    it('it disallow posting duplicate users (by email)', (done) => {
      let user = {};
      user.email = email;
      user.givenName = givenName;
      user.familyName = familyName;
      user.password = password;
      chai.request(server)
        .post('/api/v1/users')
        .type('form')
        .send(user)
        .then(res => {
          done(new Error("Allowed multiple users with same email"));
        })
        .catch(error => {
          error.should.have.status(409)
          done()
        })
    });
  });

  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .set('x-access-token', token)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        }).catch(done)
    });
  });

  describe('/GET users/:identifier', () => {
    it('it should GET target users', (done) => {
      userIDs.forEach(ID => {
        chai.request(server)
          .get(`/api/v1/users/${ID}`)
          .set('x-access-token', token)
          .then(res => {
            res.should.have.status(200);
            done();
          })
          .catch(error => {
            console.log(error)
            done(error)
          })
      })
    });
  });

  describe('/GET users/:identifier/:property', () => {
    it('it should GET target user property', (done) => {
        chai.request(server)
          .get(`/api/v1/users/${targetID}/email`)
        .set('x-access-token', token)
          .then(res => {
            res.should.have.status(200);
            res.body.success.should.be.eql(true);
            res.body.data.should.be.eql(email);
            done();
          })
          .catch(error => {
            console.log(error)
            done(error)
          })
    });
  });

  describe('/PUT users/:identifier/:property', () => {
    it('it should UPDATE target user property', (done) => {
      let newName = 'Newname';
        chai.request(server)
          .put(`/api/v1/users/${targetID}/givenName`)
          .query({value: newName})
        .set('x-access-token', token)
          .then(res => {
            res.should.have.status(200);
            res.body.success.should.be.eql(true);
            done();
          })
          .catch(error => {
            console.log(error)
            done(error)
          })
    });
  });

  describe('/DELETE users/:identifier/:property', () => {
    it('it should DELETE target user property', (done) => {
        chai.request(server)
          .delete(`/api/v1/users/${targetID}/familyName`)
        .set('x-access-token', token)
          .then(res => {
            res.should.have.status(200);
            res.body.success.should.be.eql(true);
            done();
          })
          .catch(error => {
            console.log(error)
            done(error)
          })
    });
  });

  describe('/DELETE users/:identifier', () => {
    it('it should DELETE target users', (done) => {
      userIDs.forEach(ID => {
        chai.request(server)
          .delete(`/api/v1/users/${ID}`)
          .set('x-access-token', token)
          .then(res => {
            res.should.have.status(200);
            done();
          })
          .catch(error => {
            console.log(error)
            done(error)

          })
      })
    });
  });
});
