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
  describe('Test the i18n APIs:', () => {
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

    it('Expects "GET /api/v1/i18n/list" to return a list of dictionaries.', (done) => {
      request
        .get('/api/v1/i18n/list')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.fr).to.contain('French');
          done();
        });
    });

    it('Expects "GET /api/v1/i18n/fr" to return the French dictionary.', (done) => {
      request
        .get('/api/v1/i18n/fr')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.Hello).to.contain('Bonjour');
          done();
        });
    });

    it('Expects "GET /api/v1/i18n/de" to return a warning message.', (done) => {
      request
        .get('/api/v1/i18n/de')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.message).to.contain('translation dictionary is not available');
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
