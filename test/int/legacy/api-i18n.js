// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
import { expect } from 'chai';


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main section -

/**
 * Starts the tests.
 *
 * @function ()
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
function TestI18n(agent, user) {
  describe('Test the i18n APIs:', () => {
    it('Expects "POST /api/v1/auth/login" to return a successful authentication.', (done) => {
      agent
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('You are now connected!');
          done();
        });
    });

    it('Expects "GET /api/v1/i18n/list" to return a list of dictionaries.', (done) => {
      agent
        .get('/api/v1/i18n/list')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.fr).to.contain('French');
          done();
        });
    });

    it('Expects "GET /api/v1/i18n/fr" to return the French dictionary.', (done) => {
      agent
        .get('/api/v1/i18n/fr')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.Hello).to.contain('Bonjour');
          done();
        });
    });

    it('Expects "GET /api/v1/i18n/de" to return a warning message.', (done) => {
      agent
        .get('/api/v1/i18n/de')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('This translation dictionary is not available yet!');
          done();
        });
    });

    it('Expects "GET /api/v1/auth/logout" to confirm a logout.', (done) => {
      agent
        .get('/api/v1/auth/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('You are now disconnected!');
          done();
        });
    });
  });
};


// -- Export
export default TestI18n;
