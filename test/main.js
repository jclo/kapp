// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    , request    = require('request')
    ;


// -- Local Modules
const app    = require('../server/app') // this file is required for the test coverage
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

describe('Test Kapp:', () => {
  describe('Test a connection:', () => {
    const url = `${server}/index.html`;
    it('Expects the connection to return an HTML page.', (done) => {
      request.get({ url }, (error, resp, data) => {
        expect(error).to.be.a('null');
        expect(data).to.a.a('string');
        done();
      });
    });
  });

  describe('Test the api /api/v1/getText:', () => {
    const url = `${server}/api/v1/getText`;

    it('Expects the api "/api/v1/getText" to return the string "Hello Text World!"', (done) => {
      request.get({ url }, (error, resp, data) => {
        expect(data).is.a('string').that.is.equal('Hello Text World!');
        done();
      });
    });
  });

  describe('Test the api /api/v1/getJSON:', () => {
    const url = `${server}/api/v1/getJSON`;

    it('Expects the api "/api/v1/getJSON" to return "{"a":"Hello JSON World!"}"', (done) => {
      request.get({ url }, (error, resp, data) => {
        expect(JSON.parse(data).a).is.a('string').that.is.equal('Hello JSON World!');
        done();
      });
    });
  });

  describe('Test the api /api/v1/posto:', () => {
    const url = `${server}/api/v1/posto`;

    it('Expects the api "/api/v1/posto" to return "{"a":1,"b":"This is a payload"}"', (done) => {
      request({
        url,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a: 1, b: 'This is a payload' }),
      }, (error, resp, data) => {
        expect(JSON.parse(data).b).is.a('string').that.is.equal('This is a payload');
        done();
      });
    });
  });
});
