// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const net        = require('net')
    , { expect } = require('chai')
    ;

// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = () => {
  describe('Test the Connection to the TCP Socket Server:', () => {
    it('Expects a connection to the TCP Socket Servers to be terminated by a "close" event.', (done) => {
      const client = net.connect({ host: '127.0.0.1', port: 5000 }, () => {
        client.write(JSON.stringify({
          command: 'directive_1',
          payload: 'payload',
        }));

        client.on('data', (resp) => {
          // process.stdout.write(`response from server: ${resp.toString()}\n`);
          // client.end();
          expect(resp.toString()).to.be.a('string');
        });

        client.on('close', () => {
          // process.stdout.write('disconnected from server!\n');
          expect('close').to.be.equal('close');
          done();
        });
      });
    });
  });
};


/* -- oOo -- */
