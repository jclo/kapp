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
module.exports = (request, user, user2, user3, pack) => {
  describe('Test the token APIs, next ...:', () => {
    /**
     * Test concurrent tokens.
     * (same user logged twice)
     *
     */
    let token1;
    it('Expects "POST /api/v1/oauth2/token" to return a successful authentication for token 1.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          token1 = res.body;
          expect(res).to.have.status(200);
          expect(res.body.token_type).to.be.equal('Bearer');
          done();
        });
    });

    let token2;
    it('Expects "POST /api/v1/oauth2/token" to return a successful authentication for token 2.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          token2 = res.body;
          expect(res).to.have.status(200);
          expect(res.body.token_type).to.be.equal('Bearer');
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to accept the request for token 1.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${token1.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(pack.name);
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to accept the request for token 2.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${token2.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(pack.name);
          done();
        });
    });

    it('Expects "GET /api/v1/oauth2/revoke" to revoke the access token 1.', (done) => {
      request
        .get('/api/v1/oauth2/revoke')
        .set('Authorization', `Bearer ${token1.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(`access token ${token1.access_token} has been revoked`);
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to refuse the request for token 1.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${token1.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.text).to.contain('Your token is revoked!');
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to accept the request for token 2.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${token2.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(pack.name);
          done();
        });
    });

    it('Expects "GET /api/v1/oauth2/revoke" to revoke the access token for token 2.', (done) => {
      request
        .get('/api/v1/oauth2/revoke')
        .set('Authorization', `Bearer ${token2.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(`access token ${token2.access_token} has been revoked`);
          done();
        });
    });
  });
};
