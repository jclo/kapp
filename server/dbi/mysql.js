/** ****************************************************************************
 *
 * Interfaces MySQL/MariaDB database.
 *
 * mysql.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _isEmpty                    checks if the db is empty,
 *
 *
 * Constructor:
 *  . MySQL                       creates the database interface object,
 *
 *
 * Public Methods:
 *  . end                         free the pool of connections to the database,
 *  . isDbEmpty                   returns true if the database is empty,
 *  . isTable                     returns true if the table exists,
 *  . getTableStructure           returns the table structure,
 *  . isTableEmpty                checks if the table is empty,
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
const MQ       = require('../libs/mysql/api')
    , tmethods = require('./test/mysql')
    , pmethods = require('../_custom/mysql/api')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Defines MySQL constructor.
 * (do not modify it)
 *
 * @constructor (arg1)
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
const MySQL = function(params) {
  this._name = 'mysql';
  this._db = params.database;
  this._lib = MQ;
  MQ.createPool(
    params.host,
    params.connectionLimit,
    params.database,
    params.user,
    params.password,
  );
};


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Free the pool of connections to the database.
   * (mandatory - don't modify it)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if the database is released,
   * @since 0.0.0
   */
  end() {
    return this._lib.end();
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
   * @returns {Boolean}     returns true if empty otherwis false,
   * @since 0.0.0
   */
  async isTableEmpty(table) {
    return table;
  },
};


// -- Export
module.exports = {
  Cstor: MySQL,
  methods,
  tmethods,
  pmethods,
};
