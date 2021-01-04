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
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the database connection,
   * @param {String}        the name of the database,
   * @returns {Boolean}     returns true if the db is empty otherwise false,
   * @since 0.0.0
   */
  async isDbEmpty(cn, db) {
    const SQL = 'SELECT COUNT(DISTINCT `table_name`) AS TotalNumberOfTablesFROM `information_schema`.`columns` WHERE `table_schema` = ?';
    const resp = await this._lib.query(cn, SQL, [db]);
    return resp[0].TotalNumberOfTables === 0;
  },

  /**
   * Checks if the table exists.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the database connection,
   * @param {String}        the name of the table,
   * @returns {Boolean}     returns true if the table exists otherwise false,
   * @since 0.0.0
   */
  async isTable(cn, table) {
    const SQL = `SELECT * FROM information_schema.tables
      WHERE table_schema = '${this._db}' AND table_name = '${table}'`;
    const resp = await this._lib.query(cn, SQL);
    return resp.length > 0;
  },

  /**
   * Returns the table structure.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the database connection,
   * @param {String}        the name of the table,
   * @returns {Array}       returns the structure of the table,
   * @since 0.0.0
   */
  async getTableStructure(cn, table) {
    const r = await this._lib.query(cn, `SHOW COLUMNS FROM ${table}`);

    // Standardize:
    const struct = [];
    for (let i = 0; i < r.length; i++) {
      let def = 'NULL';
      if (r[i].Null === 'NO' && r[i].Default === null) {
        def = 'None';
      } else if (r[i].Null === 'NO') {
        def = r[i].Default;
      }
      struct.push({
        column: i,
        name: r[i].Field,
        type: r[i].Type.toUpperCase(),
        notNULL: r[i].Null === 'NO' ? 'Yes' : 'No',
        default: def,
        key: r[i].Key === 'PRI' ? 'primary' : '',
        extra: r[i].Extra,
      });
    }

    return struct;
  },

  /**
   * Checks if the table is empty.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the database connection,
   * @param {String}        the name of the table,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isTableEmpty(cn, table) {
    const resp = await this._lib.query(cn, `select count(*) from ${table}`);
    return resp[0]['count(*)'] === 0;
  },
};


// -- Export
module.exports = { Cstor: MySQL, methods, tmethods };
