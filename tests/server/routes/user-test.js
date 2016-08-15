// Instantiate all models
var expect = require('chai').expect;

var db = require('../../../server/db');

var supertest = require('supertest');
describe('Users Route', function () {


    var app, User;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        User = db.model('user');
    });

  describe('Unauthenticated request', function () {

    var guestAgent;

    beforeEach('Create guest agent', function () {
      guestAgent = supertest.agent(app);
    });

    it('should get a 401 response', function (done) {
      guestAgent.get('/api/members/secret-stash')
        .expect(401)
        .end(done);
    });

  });

  describe('Authenticated request', function () {

    var loggedInAgent;

    var userInfo = {
      email: 'joe@gmail.com',
      password: 'shoopdawoop'
    };

    beforeEach('Create a user', function (done) {
      return User.create(userInfo).then(function (user) {
                done();
            }).catch(done);
    });

    beforeEach('Create loggedIn user agent and authenticate', function (done) {
      loggedInAgent = supertest.agent(app);
      loggedInAgent.post('/login').send(userInfo).end(done);
    });

    it('should get with 200 response and with an array as the body', function (done) {
      loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        done();
      });
    });
  });

  describe('Admin request', function () {

    var adminAgent;

    var createUser = {
      email: 'joe@gmail.com',
      password: 'shoopdawoop',
      isAdmin: true
    };

    var userInfo = {
      email: 'joe@gmail.com',
      password: 'shoopdawoop'
    };

    beforeEach('Create a user', function (done) {
      return User.create(createUser).then(function () {
                done();
            }).catch(done);
    });

    beforeEach('Create loggedIn user agent and authenticate', function (done) {
      adminAgent = supertest.agent(app);
      adminAgent.post('/login').send(userInfo).end(done);
    });

    it('should get with 200 response and with an array as the body', function (done) {
      adminAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body).to.be.an('array');
        done();
      });
    });
  });
});
