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
/* eslint-disable max-len */
async function MongoDB(env, callback) {
  const HOST      = process.env.KAPP_TEST_MODE ? env.host : process.env.KAPP_MONGO_URL
      , DATABASE  = process.env.KAPP_TEST_MODE ? env.testdb.database : process.env.process.env.KAPP_MONGO_DATABASE
      , USER      = process.env.KAPP_TEST_MODE ? env.testdb.options.auth.user : process.env.KAPP_MONGO_USER
      , PWD       = process.env.KAPP_TEST_MODE ? env.testdb.options.auth.password : process.env.KAPP_MONGO_PASSWORD
      , TOPO      = env.db.useUnifiedTopology
      , PARSER    = env.db.useNewUrlParser
      , TIMEOUT   = env.db.connectTimeoutMS
      , KEEPALIVE = env.db.keepAlive
      , obj       = Object.create(methods)
      ;

  obj._name = 'mongodb';
  obj._uri = `mongodb://${USER}:${PWD}@${HOST}/${DATABASE}`;
  obj._ObjectId = ObjectId;
  obj._client = new MongoClient(
    obj._uri,
    {
      useUnifiedTopology: TOPO,
      useNewUrlParser: PARSER,
      connectTimeoutMS: TIMEOUT,
      keepAlive: KEEPALIVE,
    },
  );

  await obj._client.connect();
  obj._db = obj._client.db(DATABASE);

  if (callback) {
    callback(obj);
  } else {
    return obj;
  }

  return null;
}
/* eslint-enable max-len */


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
