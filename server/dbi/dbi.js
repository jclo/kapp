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
 *  . end                         free the database (specific to mysql),
 *  . isTableNoCnx                checks if a db has a table,
 *
 *  . isDbEmpty                   returns true if the database is empty,
 *  . isTable                     returns true if the table exists,
 *  . getTableStructure           returns the table structure,
 *  . isTableEmpty                checks if the table is empty,
 *  . count                       returns the number of tables or rows or columns,
 *  . getLastInsertedId           returns the latest inserted id during the user session,
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
const SQlite             = require('./sqlite')
    , MySQL              = require('./mysql')
    , PgSQL              = require('./pgsql')
    , { db }             = require('../../.env')
    , custpdbimethods    = require('../_custom/sql')
    ;


// -- Local Constants


// -- Local Variables
let dbimethods;


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
      return [SQlite.Cstor, _extend(
        SQlite.methods,
        SQlite.tmethods,
        custpdbimethods,
      )];

    case 'mysql':
      return [MySQL.Cstor, _extend(
        MySQL.methods,
        MySQL.tmethods,
        custpdbimethods,
      )];

    case 'pgsql':
      return [PgSQL.Cstor, _extend(
        PgSQL.methods,
        PgSQL.tmethods,
        custpdbimethods,
      )];

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
  const [Cstor, libmethods] = _get(type);
  const obj = Object.create(
    _extend(
      dbimethods,
      libmethods,
    ),
  );
  Cstor.call(obj, db[type]);
  return obj;
};


// -- Public Methods -----------------------------------------------------------

dbimethods = {

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

  /**
   * Checks if a db has a table.
   *
   * @method (arg1)
   * @public
   * @param {String}        the requested table,
   * @returns {Boolean}     returns true if the table exists,
   * @since 0.0.0
   */
  async isTableNoCnx(/* table */) {
    return this;
  },


  // The methods are primitive methods. They perform a simple but usefull
  // operation. Thus, they must be called inside another method as
  // they don't open and close the database.

  /**
   * Checks if the database is empty.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isDbEmpty() {
    return true;
  },

  /**
   * Checks if the table exists.
   * (must be be overwritten)
   *
   * @method (arg1)
   * @public
   * @param {String}        the name of the table,
   * @returns {Boolean}     returns true if the table exists otherwise false,
   * @since 0.0.0
   */
  async isTable(table) {
    return table;
  },

  /**
   * Returns the table structure.
   * (must be be overwritten)
   *
   * @method (arg1)
   * @public
   * @param {String}        the name of the table,
   * @returns {Array}       returns the structure of the table,
   * @since 0.0.0
   */
  async getTableStructure(table) {
    return table;
  },

  /**
   * Checks if the table is empty.
   * (must be be overwritten)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isTableEmpty(table) {
    return table;
  },

  /**
   * Counts the number of tables or the number of rows and columns.
   * (must be be overwritten)
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        what to count ('tables', 'rows', columns),
   * @returns {Number}      returns the counted number,
   * @since 0.0.0
   */
  async count(what, table) {
    return table;
  },

  /**
   * Returns the latest inserted id during the user session.
   * (must be be overwritten)
   *
   * @method (arg1)
   * @public
   * @param {Object}        the database connection,
   * @returns {Number}      returns the latest created id,
   * @since 0.0.0
   */
  async getLastInsertedId() {
    return this;
  },
};


// -- Export
module.exports = DBI;
