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
 *  . _dropAllCollections         Drops all the collections from the connected database,
 *  . connect                     connects to a db and returns the collection object,
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
const MongoDB = function(env) {
  const obj = Object.create(methods);
  obj._name = 'mongodb';
  obj._dbname = process.env.KAPP_TEST_MODE ? env.testdb : env.db;
  obj._uri = `mongodb://${obj._dbname.options.auth.user}:${obj._dbname.options.auth.password}@${env.host}/${obj._dbname.database}`;
  obj._ObjectId = ObjectId;
  return obj;
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
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  async _dropAllCollections() {
    const collections = await this._db.listCollections({}).toArray();
    for (let i = 0; i < collections.length; i++) {
      /* eslint-disable-next-line */
      await this._db.dropCollection(collections[i].name);
    }
    return this;
  },

  /**
   * Connects to MongoDB and returns the db object.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  async connect() {
    this._client = new MongoClient(
      this._uri,
      {
        useUnifiedTopology: this._dbname.options.useUnifiedTopology,
        useNewUrlParser: this._dbname.options.useNewUrlParser,
        connectTimeoutMS: this._dbname.options.connectTimeoutMS,
        keepAlive: this._dbname.options.keepAlive,
      },
    );

    await this._client.connect();
    this._db = this._client.db(this._dbname.database);
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
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  close() {
    this._client.close();
    this._client = null;
    this._db = null;
  },
};


// -- Export
module.exports = MongoDB;
