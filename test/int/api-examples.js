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
module.exports = (request) => {
  describe('Test the APIs given in examples:', () => {
    it('Expects "GET /" to return the "index.html" file.', (done) => {
      request
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.contain('HTML5 boilerplate');
          done();
        });
    });

    it('Expects "GET /api/v1/text" to return the string "Hello Text World!".', (done) => {
      request
        .get('/api/v1/text')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.a('string').that.is.equal('Hello Text World!');
          done();
        });
    });

    it('Expects "GET /api/v1/json" to return "{"status":200,"message":{"a":"Hello JSON World!"}}" .', (done) => {
      request
        .get('/api/v1/json')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.a).to.be.a('string').that.is.equal('Hello JSON World!');
          done();
        });
    });

    it('Expects "POST /api/v1/posto" to return the payload "{ a: 1, b: "This is a payload" }" .', (done) => {
      request
        .post('/api/v1/posto')
        .set('content-type', 'application/json')
        .send({ a: 1, b: 'This is a payload' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.a).to.be.equal(1);
          expect(res.body.b).to.be.equal('This is a payload');
          done();
        });
    });
  });
};
