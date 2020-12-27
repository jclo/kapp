/** ****************************************************************************
 *
 * Interfaces the database.
 * (it aims to make the code independant from the chosen db)
 *
 * dbi.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _extend                     extends literal objects from left to right,
 *  . _get                        returns the constructor and methods of db server,
 *
 *
 * Constructor:
 *  . DBI                         creates the database interface object,
 *
 *
 * Public Methods:
 *  . end                         free the database,
 *
 *  TO BE REPLACED BY YOUR OWN:
 *  . isEmpty                     checks if the database is empty,
 *  . init                        initializes the database,
 *  . getUser                     returns the user credentials from the database,
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


// -- Local Modules
const SQlite = require('./sqlite')
    , MySQL  = require('./mysql')
    , { db } = require('../config')
    ;


// -- Local Constants


// -- Local Variables
let methods;


// -- Private Functions --------------------------------------------------------

/**
 * Extends literal objects from left to right.
 * (first level only - this is intended to overwrite methods)
 *
 * @function (...args)
 * @private
 * @param {Objects}         a set of methods,
 * @returns {Object}        returns an object of methods,
 * @since 0.0.0
 */
/* eslint-disable no-restricted-syntax, guard-for-in */
function _extend(...args) {
  const obj = {};
  let source
    , prop
    ;

  for (let i = 0; i < args.length; i++) {
    source = args[i];
    for (prop in source) {
      obj[prop] = source[prop];
    }
  }
  return obj;
}
/* eslint-enable no-restricted-syntax, guard-for-in */

/**
 * Returns the constructor and methods of the chosen db server.
 *
 * @function (args1)
 * @private
 * @param {String}          the name of the db server,
 * @returns {Array}         returns an array with the construtor and methods,
 * @since 0.0.0
 */
function _get(type) {
  switch (type) {
    case 'sqlite':
      return [SQlite.Cstor, SQlite.methods];

    case 'mysql':
      return [MySQL.Cstor, MySQL.methods];

    default:
      throw new Error(`The database server ${type} is not defined yet!`);
  }
}


// -- Public -------------------------------------------------------------------

/**
 * Returns the DB object.
 * (Prototypal Instantiation Pattern)
 *
 * @constructor (arg1)
 * @public
 * @param {String}          the database server name (sqlite, mysql, etc.),
 * @returns {Object}        returns the DB object,
 * @since 0.0.0
 */
const DBI = function(type) {
  const [Cstor, exmethods] = _get(type);
  const obj = Object.create(_extend(methods, exmethods));
  Cstor.call(obj, db[type]);
  return obj;
};


// -- Public Methods -----------------------------------------------------------

methods = {

  /**
   * Free the database.
   * (could be be overwritten)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if the database is released,
   * @since 0.0.0
   */
  async end() {
    //
  },


  // The methods below are given as examples how to interact with the
  // database to check it, add contents and retrieve data.
  //
  // You can delete and replace them by your methods.
  // Only the constructor and the method 'end' are mandatory.

  /**
   * Checks if the database is empty.
   * (must be overwritten)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isEmpty() {
    //
  },

  /**
   * Initializes the database.
   * (must be overwritten)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {}            -,
   * @since 0.0.0
   */
  async init() {
    //
  },

  /**
   * Returns the user credentials from the database.
   * (must be overwritten)
   *
   * @method (arg1)
   * @public
   * @param {String}        the username,
   * @returns {Object}      returns the user credentials or undefined,
   * @since 0.0.0
   */
  async getUser() {
    //
  },
};


// -- Export
module.exports = DBI;
