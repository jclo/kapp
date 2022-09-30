// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;

// -- Local Modules


const MongoLib = require('../../../server/libs/mongodb/main4test')
    , env      = require('../../../.env').mongodb
    ;


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = () => {
  describe('Test MongoDB Lib:', () => {
    let dbm;
    it('Expects MongoLib(env) to return an object.', () => {
      dbm = MongoLib(env);
      expect(dbm).to.be.an('object');
    });

    it('Expects this object to own four properties.', () => {
      expect(Object.keys(dbm)).to.be.an('array').that.has.lengthOf(4);
    });

    it('Expects one property to be "_name" that is equal to "mongodb".', () => {
      expect(dbm).to.own.property('_name').that.is.equal('mongodb');
    });

    it('Expects one property to be "_dbname" that is an object".', () => {
      expect(dbm).to.own.property('_dbname').that.is.an('object');
    });

    it('Expects one property to be "_uri" that is equal to "mongodb://jc:jc@localhost:27017/vulcain_test".', () => {
      expect(dbm).to.own.property('_uri').that.is.equal('mongodb://jc:jc@localhost:27017/vulcain_test');
    });

    it('Expects one property to be "_uri" that is equal to "mongodb://jc:jc@localhost:27017/vulcain_test".', () => {
      expect(dbm).to.own.property('_uri').that.is.equal('mongodb://jc:jc@localhost:27017/vulcain_test');
    });

    it('Expects one property to be "_ObjectId" that is a function".', () => {
      expect(dbm).to.own.property('_ObjectId').that.is.a('function');
    });

    it('Expects dbm to inherit the property "_to" that is a function".', () => {
      expect(dbm._to).to.be.a('function');
    });

    it('Expects dbm to inherit the property "_dropAllCollections" that is a function".', () => {
      expect(dbm._dropAllCollections).to.be.a('function');
    });

    it('Expects dbm to inherit the property "connect" that is a function".', () => {
      expect(dbm.connect).to.be.a('function');
    });

    it('Expects dbm to inherit the property "collection" that is a function".', () => {
      expect(dbm.collection).to.be.a('function');
    });

    it('Expects dbm to inherit the property "close" that is a function".', () => {
      expect(dbm.close).to.be.a('function');
    });

    it('Expects await dm.connect() to add the property "_db" that is an object', async () => {
      await dbm.connect();
      expect(dbm).to.own.property('_db').that.is.an('object');
    });

    let collection;
    it('Expects dbm.collection("catalog") to return an object.', () => {
      collection = dbm.collection('catalog');
      expect(collection).to.be.an('object');
    });

    let resp;
    it('Expects await dbm._to(collection.findOne()) to return an array)', async () => {
      resp = await dbm._to(collection.findOne());
    });

    it('Expects this array to contain two elements.', () => {
      expect(resp).to.be.an('array').that.has.lengthOf(2);
    });

    it('Expects the first element to be a null.', () => {
      expect(resp[0]).to.be.equal(null);
    });

    it('Expects the second element to be an object.', () => {
      expect(resp[1]).to.be.an('object');
    });

    it('Expects this object to own the property "datasetid" among others.', () => {
      expect(resp[1]).to.own.property('datasetid');
    });

    it('Expects await dbm.close() to close the connection and set _client and _db t null.', async () => {
      await dbm.close();
      expect(dbm).to.own.property('_client').that.is.equal(null);
      expect(dbm).to.own.property('_db').that.is.equal(null);
    });
  });
};
