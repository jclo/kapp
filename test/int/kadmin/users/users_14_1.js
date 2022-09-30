// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, camelcase: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;

// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = (request, dbi, params, admin) => {
  const admin_users = 'admin_users';

  describe('Test GET /api/v1/users/preferences (dbi.adminUserSavePreferences):', () => {
    // LOGIN
    it('Expects "POST /api/v1/auth/login" to return a successful authentication.', (done) => {
      request
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({
          user: admin.user,
          password: admin.password,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.equal('You are now connected!');
          done();
        });
    });


    // SAVE PREFERENCES FOR AN USER
    // ...


    // LOGOUT
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
