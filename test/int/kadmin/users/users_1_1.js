// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, camelcase: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;

// -- Local Modules


// -- Local Constants
const USERS_ALL_QTY = 25 + 5 + 3;


// -- Local Variables


// -- Main section -
module.exports = (request, dbi, params, admin) => {
  const admin_users = 'admin_users';

  describe('Test GET /api/v1/admin/users/me (dbi.userGetMe):', () => {
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


    // GET ME
    let user_me_1_1;
    it('Expects "GET /api/v1/users/me" to return an object.', (done) => {
      request
        .get('/api/v1/users/me')
        .set('content-type', 'application/json')
        .end((err, res) => {
          user_me_1_1 = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.own.property('id').that.is.equal(1);
          done();
        });
    });

    it(`Expects this object to own ${USERS_ALL_QTY} properties.`, () => {
      expect(Object.keys(user_me_1_1)).to.be.an('array').that.has.lengthOf(USERS_ALL_QTY);
    });


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
