// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;

// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = (request, user) => {
  describe('Test the users APIs:', () => {
    it('Expects "POST /api/v1/auth/login" to return a successful authentication.', (done) => {
      request
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.equal('You are now connected!');
          done();
        });
    });

    it('Expects "GET /api/v1/users?id=1&name=Doe" to return "{..., message: {query: {id: "1", name: "Doe"}}}" .', (done) => {
      request
        .get('/api/v1/users?id=1&name=Doe')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message.query.id).to.be.a('string').that.is.equal('1');
          expect(res.body.message.query.name).to.be.a('string').that.is.equal('Doe');
          done();
        });
    });

    it('Expects "GET /api/v1/users/:id/:name/:other" to return "{..., message: {variables: {id: "1", name: "Doe", other: "3"}}}" .', (done) => {
      request
        .get('/api/v1/users/1/Doe/3')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message.variables.id).to.be.a('string').that.is.equal('1');
          expect(res.body.message.variables.name).to.be.a('string').that.is.equal('Doe');
          expect(res.body.message.variables.other).to.be.a('string').that.is.equal('3');
          done();
        });
    });

    it('Expects "GET /api/v1/auth/logout" to confirm a logout.', (done) => {
      request
        .get('/api/v1/auth/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('You are now disconnected!');
          done();
        });
    });
  });
};
