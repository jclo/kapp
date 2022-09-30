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

  describe('Test POST /api/v1/admin/users/one (dbi.adminUserAddOrUpdateOne - update):', () => {
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


    // ADD AND UPDATE AN USER
    let user_up_5_1_1;
    it('Expects "POST /api/v1/admin/users/one" to return an object with an id.', (done) => {
      request
        .post('/api/v1/admin/users/one')
        .set('content-type', 'application/json')
        .send({
          user_name: 'user_up_5_1_1',
          user_pwd: '123',
          last_name: 'user_up_5_1_1',
        })
        .end((err, res) => {
          user_up_5_1_1 = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object').that.own.property('id');
          done();
        });
    });

    let user_up_5_1_2;
    it('Expects "POST /api/v1/admin/users/one" to return an object with an id.', (done) => {
      request
        .post('/api/v1/admin/users/one')
        .set('content-type', 'application/json')
        .send({
          id: user_up_5_1_1.id,
          last_name: 'user_add_5_1_1_bis',
        })
        .end((err, res) => {
          user_up_5_1_2 = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object').that.own.property('id');
          done();
        });
    });

    it('Expects the second object to return the same id as the first object.', () => {
      expect(user_up_5_1_1.id).to.be.equal(user_up_5_1_2.id);
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
