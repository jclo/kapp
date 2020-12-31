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
  describe('Test the Authentication APIs:', () => {
    it('Expects "POST /api/v1/auth/login" with a wrong username to be refused.', (done) => {
      request
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({ user: 'jdoo', password: 'jdo' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('You are NOT a referenced user!');
          done();
        });
    });

    it('Expects "POST /api/v1/auth/login" with a wrong password to be refused.', (done) => {
      request
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({ user: 'jdo', password: 'jdoo' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('You provided a wrong password!');
          done();
        });
    });

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

    it('Expects "GET /api/v1/auth/logout" to confirm a logout.', (done) => {
      request
        .get('/api/v1/auth/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('You are now disconnected!');
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to refuse the request.', (done) => {
      request
        .get('/api/v1/system/version')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.text).to.contain('This request requires an user authentication!');
          done();
        });
    });

    it('Expects "POST /api/v1/auth/login" with a locked account to be refused.', (done) => {
      request
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send({ user: 'jhe', password: 'jhe' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('Your account is locked');
          done();
        });
    });
  });
};
