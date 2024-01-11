// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;

// -- Local Modules
const CKeys = require('../../server/libs/cryptokeys/main');


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = () => {
  describe('Test the CryptoKeys lib:', () => {
    it('Expects the library to be an object.', () => {
      expect(CKeys).to.be.an('object');
    });

    it('Expects this object to own four properties.', () => {
      expect(Object.keys(CKeys)).to.be.an('array').that.has.lengthOf(4);
    });

    it('Expects this object to own "generateKeys" property that is a function.', () => {
      expect(CKeys).to.own.property('generateKeys').that.is.a('function');
    });

    it('Expects this object to own "getKeys" property that is a function.', () => {
      expect(CKeys).to.own.property('getKeys').that.is.a('function');
    });

    it('Expects this object to own "getPublicKey" property that is a function.', () => {
      expect(CKeys).to.own.property('getPublicKey').that.is.a('function');
    });

    it('Expects this object to own "addKeysToEnv" property that is a function.', () => {
      expect(CKeys).to.own.property('addKeysToEnv').that.is.a('function');
    });

    let VAPidKeys;
    it('Expects CryptoKeys.getKeys to return an object.', () => {
      VAPidKeys = CKeys.getKeys();
      expect(CKeys.getKeys()).to.be.an('object');
    });

    it('Expects this object to own two properties.', () => {
      expect(Object.keys(VAPidKeys)).to.be.an('array').that.has.lengthOf(2);
    });

    it('Expects this object to own "publicKey" property that is a string.', () => {
      expect(VAPidKeys).to.own.property('publicKey').that.is.a('string');
    });

    it('Expects this object to own "privateKey" property that is a string.', () => {
      expect(VAPidKeys).to.own.property('privateKey').that.is.a('string');
    });

    let GENKeys;
    it('Expects CryptoKeys.generateKeys() to return an object.', () => {
      GENKeys = CKeys.generateKeys();
      expect(GENKeys).to.be.an('object');
    });

    it('Expects this object to own "publicKey" property that has the same value as the one returned by getKeys.', () => {
      expect(GENKeys).to.own.property('publicKey').that.is.equal(VAPidKeys.publicKey);
    });

    it('Expects this object to own "privateKey" that has the same value as the one returned by getKeys.', () => {
      expect(GENKeys).to.own.property('privateKey').that.is.equal(VAPidKeys.privateKey);
    });

    it('Expects CryptoKeys.getPublicKey() to return the publicKey returned by getKeys.', () => {
      expect(CKeys.getPublicKey()).to.own.property('publicKey').that.is.equal(VAPidKeys.publicKey);
    });

    let addKeysToEnvResp;
    it('Expects CryptoKeys.addKeysToEnv() to return an object.', (done) => {
      CKeys.addKeysToEnv((res) => {
        addKeysToEnvResp = res;
        expect(addKeysToEnvResp).to.be.an('object');
        done();
      });
    });

    it('Expects this object to own two properties.', () => {
      expect(Object.keys(addKeysToEnvResp)).to.be.an('array').that.has.lengthOf(2);
    });

    it('Expects this object to own "error_code" property that is a null.', () => {
      expect(addKeysToEnvResp).to.own.property('error_code').that.is.a('null');
    });

    it('Expects this object to own "message" property that is "The VAPID keys are already defined in .env.js!".', () => {
      expect(addKeysToEnvResp).to.own.property('message').that.is.equal('The VAPID keys are already defined in .env.js!');
    });
  });
};

// -- oOo --
