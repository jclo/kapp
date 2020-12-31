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
  describe('Test the System APIs:', () => {
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

    it('Expects "GET /api/v1/system/version" to return the app version.', (done) => {
      request
        .get('/api/v1/system/version')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('@mobilabs/kapp');
          done();
        });
    });

    it('Expects "GET /api/v1/system/kapp-version" to return the Kapp version.', (done) => {
      request
        .get('/api/v1/system/kapp-version')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('Kapp');
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
