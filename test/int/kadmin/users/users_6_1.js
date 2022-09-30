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

  describe('Test DELETE /api/v1/admin/users/one (dbi.adminUserDeleteOne):', () => {
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


    // ADD AND DELETE AN USER
    let user_del_6_1_1;
    it('Expects "POST /api/v1/admin/users/one" to return an object with an id.', (done) => {
      request
        .post('/api/v1/admin/users/one')
        .set('content-type', 'application/json')
        .send({
          user_name: 'user_del_6_1_1',
          user_pwd: '123',
          last_name: 'user_del_6_1_1',
        })
        .end((err, res) => {
          user_del_6_1_1 = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object').that.own.property('id');
          done();
        });
    });

    let user_del_6_1_2_db;
    it('Expects "DELETE /api/v1/admin/users/one?id="x"" to return an object with an id.', (done) => {
      request
        .delete(`/api/v1/admin/users/one?id=${user_del_6_1_1.id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object').that.own.property('id').that.is.equal(user_del_6_1_1.id);
          dbi._query(`SELECT * FROM ${admin_users} WHERE id = ?`, [res.body.id], (e, r) => {
            [user_del_6_1_2_db] = r;
            expect(e).to.be.a('null');
            expect(r).to.be.an('array').that.has.lengthOf(1);
            done();
          });
        });
    });

    it('Expects the deleted object in the db to have property is_deleted set to 1.', () => {
      expect(user_del_6_1_2_db.is_deleted).to.be.equal(1);
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
