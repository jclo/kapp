/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-unused-vars: 0 */

// -- Node modules
const should     = require('chai').should()
    , { expect } = require('chai')
    , request    = require('request')
    ;


// -- Project modules
const app     = require('../server/app')
    , config  = require('../server/config')
    , release = require('../package.json').version
    ;


// -- Local constants
const server = `http://localhost:${config.env.httpport}`
    ;


// -- Local variables


// -- Main section -

describe('Test Kapp:', () => {
  describe('Test a connection:', () => {
    let body;

    const url = `${server}/index.html`;
    it('Expects the connection to return an HTML page.', (done) => {
      request.get({ url }, (error, resp, data) => {
        expect(error).to.be.a('null');
        expect(data).to.a.a('string');
        done();
      });
    });
  });

  describe('Test the api /v1/getText:', () => {
    const url = `${server}/v1/getText`;

    it('Expects the api "/v1/getText" to return the string "Hello Text World!"', (done) => {
      request.get({ url }, (error, resp, data) => {
        expect(data).is.a('string').that.is.equal('Hello Text World!');
        done();
      });
    });
  });

  describe('Test the api /v1/getJSON:', () => {
    const url = `${server}/v1/getJSON`;

    it('Expects the api "/v1/getJSON" to return "{"a":"Hello JSON World!"}"', (done) => {
      request.get({ url }, (error, resp, data) => {
        expect(JSON.parse(data).a).is.a('string').that.is.equal('Hello JSON World!');
        done();
      });
    });
  });

  describe('Test the api /v1/posto:', () => {
    const url = `${server}/v1/posto`;

    it('Expects the api "/v1/posto" to return "{"a":1,"b":"This is a payload"}"', (done) => {
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
