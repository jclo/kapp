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
module.exports = (request, user, pack) => {
  describe('Test the token APIs:', () => {
    // This is what should be returned:
    /*
    body: {
       status: 200,
       message: {
         scope: '',
         token_type: 'Bearer',
         access_token: 'rw8ikRmUTnoP4RX2iVetPmQVjZ1AReeM',
         expires_in: 1800,
         expires_at: '2020-12-31T08:38:53.514Z',
         refresh_token: 'd7eI7gs9y6QP5veX20PE08LlI8U6SuHe',
         refresh_expires_at: '2021-01-01T08:08:53.514Z'
       }
     },
    */

    let token;
    it('Expects "POST /api/v1/oauth2/token" to return a successful authentication.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.token_type).to.be.equal('Bearer');
          token = res.body.message;
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to accept the request.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${token.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(pack.name);
          done();
        });
    });

    it('Expects "GET /api/v1/oauth2/revoke" to revoke the access token.', (done) => {
      request
        .get('/api/v1/oauth2/revoke')
        .set('Authorization', `Bearer ${token.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.contain(`access token ${token.access_token} has been revoked`);
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to refuse the request.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${token.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.text).to.contain('Your token is revoked!');
          done();
        });
    });

    // This is what it should be returned for a refresh token request:
    /*
    body: {
        status: 200,
        message: {
          scope: '',
          token_type: 'Bearer',
          access_token: 'pLgBaa0Sy5c5g8Hf2O16thC7LGVM9PsQ',
          expires_in: 1800000,
          expires_at: 1609405538623,
          is_access_token_revoked: true
        }
      },
      */

    let newtoken;
    it('Expects "POST /api/v1/oauth2/token" to return a new access token.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('refresh_token', token.refresh_token)
        .set('content-type', 'application/json')
        .send({ grant_type: 'refresh_token' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.token_type === 'Bearer');
          newtoken = res.body.message;
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to accept the request.', (done) => {
      request
        .get('/api/v1/system/version')
        .set('Authorization', `Bearer ${newtoken.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain(pack.name);
          done();
        });
    });

    it('Expects "GET /api/v1/oauth2/revoke" to revoke the access token.', (done) => {
      request
        .get('/api/v1/oauth2/revoke')
        .set('Authorization', `Bearer ${newtoken.access_token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.contain(`access token ${newtoken.access_token} has been revoked`);
          done();
        });
    });


    // Anomalies on token requests:

    it('Expects "POST /api/v1/oauth2/token" to return an error as the user credential are missing.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('user credentials are missing');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the grant_type is wrong.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'other' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('The Grant Type \'other\' is not supported');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the grant_type is mising.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('The Grant Type is not specified');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the user name is wrong.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${'jdoo'}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('The username "jdoo" is unknown!');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the user password is wrong.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${'jdoo'}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('You provided a wrong password');
          done();
        });
    });

    // Anomalies on refresh requests:
    it('Expects "POST /api/v1/oauth2/token" to return a successful authentication.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.token_type).to.be.equal('Bearer');
          token = res.body.message;
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the username is wrong.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${'jdoo'}:${user.password}`).toString('base64')}`)
        .set('refresh_token', token.refresh_token)
        .set('content-type', 'application/json')
        .send({ grant_type: 'refresh_token' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('The username "jdoo" is unknown');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the username password is wrong.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${'jdoo'}`).toString('base64')}`)
        .set('refresh_token', token.refresh_token)
        .set('content-type', 'application/json')
        .send({ grant_type: 'refresh_token' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('You provided a wrong password');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the account is locked.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${'jhe'}:${'jhe'}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('Your account is locked');
          done();
        });
    });

    it('Expects "POST /api/v1/oauth2/token" to return an error as the refresh token is wrong.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('refresh_token', 'aaa')
        .set('content-type', 'application/json')
        .send({ grant_type: 'refresh_token' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('You are NOT the owner of this refresh token');
          done();
        });
    });


    // Anomalies on token for requests requiring authentication:

    it('Expects "POST /api/v1/oauth2/token" to return a successful authentication.', (done) => {
      request
        .post('/api/v1/oauth2/token')
        .set('Authorization', `Basic ${Buffer.from(`${user.user}:${user.password}`).toString('base64')}`)
        .set('content-type', 'application/json')
        .send({ grant_type: 'client_credentials' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message.token_type).to.be.equal('Bearer');
          token = res.body.message;
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to refuse this request as the token is missing.', (done) => {
      request
        .get('/api/v1/system/version')
        // .set('Authorization', `Bearer ${token.access_token}`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('token is missing');
          done();
        });
    });

    it('Expects "GET /api/v1/system/version" to refuse this request as a wrong token is provided.', (done) => {
      request
        .get('/api/v1/system/version')
        // .set('Authorization', `Bearer ${token.access_token}`)
        .set('Authorization', `Bearer ${'token.access_token'}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.contain('token is NOT valid');
          done();
        });
    });
  });
};
