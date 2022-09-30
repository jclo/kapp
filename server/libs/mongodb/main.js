/** ****************************************************************************
 *
 * Creates the MongoDB object.
 *
 * main.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Constructor:
 *  . MongoDB                     creates the object,
 *
 *
 * Public Methods:
 *  . _to                         catches a promise and returns an array err, value,
 *  . _dropAllCollections         drops all the collections from the connected database,
 *  . collection                  returns the collection object,
 *  . close                       closes the connection,
 *
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const { MongoClient } = require('mongodb')
    , { ObjectId }    = require('mongodb')
    ;


// -- Local Modules


// -- Local Constants


// -- Local Variables
let methods;


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Defines MongoDB constructor.
 * (do not modify it)
 *
 * @constructor (arg1)
 * @public
 * @param {Object}          the database parameters,
 * @returns {Object}        returns the database object,
 * @since 0.0.0
 */
const MongoDB = async function(env, callback) {
  const obj = Object.create(methods);
  obj._name = 'mongodb';
  obj._dbname = process.env.KAPP_TEST_MODE ? env.testdb : env.db;
  obj._uri = `mongodb://${obj._dbname.options.auth.user}:${obj._dbname.options.auth.password}@${env.host}/${obj._dbname.database}`;
  obj._ObjectId = ObjectId;

  obj._client = new MongoClient(
    obj._uri,
    { useUnifiedTopology: obj._dbname.options.useUnifiedTopology },
    { useNewUrlParser: obj._dbname.options.useNewUrlParser },
    { connectTimeoutMS: obj._dbname.options.connectTimeoutMS },
    { keepAlive: obj._dbname.options.keepAlive },
  );

  await obj._client.connect();
  obj._db = obj._client.db(obj._dbname.database);

  if (callback) {
    callback(obj);
  } else {
    return obj;
  }

  return null;
};


// -- Public Methods -----------------------------------------------------------

methods = {

  /**
   * Catches a promise and returns an array err, value.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the promise,
   * @returns {Array}       returns an array,
   * @since 0.0.0
   */
  _to(promise) {
    return promise.then((data) => [null, data]).catch((err) => [err]);
  },

  /**
   * Drops all the collections from the connected database.
   * (be carefull - only for testing purposes)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {}            -,
   * @since 0.0.0
   */
  async _dropAllCollections() {
    const collections = await this._db.listCollections({}).toArray();
    for (let i = 0; i < collections.length; i++) {
      /* eslint-disable-next-line */
      await this._db.dropCollection(collections[i].name);
    }
  },

  /**
   * Returns the collection object.
   *
   * @method (arg1)
   * @public
   * @param {String}        the collection to connect to,
   * @returns {Object}      returns the collection object,
   * @since 0.0.0
   */
  collection(collection) {
    return this._db.collection(collection);
  },

  /**
   * Closes the connection.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {}            -,
   * @since 0.0.0
   */
  async close() {
    await this._client.close();
    this._client = null;
    this._db = null;
  },
};


// -- Export
module.exports = MongoDB;
