// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const chai       = require('chai')
    , { expect } = require('chai')
    , chaiHttp   = require('chai-http')
    ;


// -- Local Modules
const app    = require('../server/start')
    , config = require('../server/config')
    ;


// -- Local Constants


// -- Local Variables
let server;


// -- Main section -

// Set this environment variable orherwise 'request' does not accept self-signed
// certificates:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (process.env.TRAVIS || !config.env.https) {
  server = `http://localhost:${config.env.httpport}`;
} else {
  server = `https://localhost:${config.env.httpsport}`;
}

// Attach 'http-chai' to 'chai':
chai.use(chaiHttp);

// Create the request object:
const request = chai.request.agent(server);


describe('Test Kapp:', () => {
  describe('Test a connection:', () => {
    // request
    //   .get('/')
    //   .end((err, res) => {
    //     // console.log(res);
    //   });

    it('Should return "index.html" file.', (done) => {
      request
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('HTML5 boilerplate');
          done();
        });
    });
  });
});
