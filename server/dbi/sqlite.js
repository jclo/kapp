/** ****************************************************************************
 *
 * Interfaces SQLite database.
 *
 * sqlite.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Constructor:
 *  . SQLite                      creates the database interface object,
 *
 *
 * Public Methods:
 *  . _query                      processes a query on db (only for testing),
 *  . isDbEmpty                   returns true if the database is empty,
 *  . isTable                     returns true if the table exists,
 *  . getTableStructure           returns the table structure,
 *  . isTableEmpty                checks if the table is empty,
 *  . count                       counts the number of tables, rows, columns,
 *  . getLastInsertedId           returns the last inserted id during the session,
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
const SQ       = require('../libs/sqlite/api')
    , tmethods = require('./test/sqlite')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Defines SQLite constructor.
 * (do not modify it)
 *
 * @constructor (arg1)
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
const SQLite = function(params) {
  this._name = 'sqlite';
  this._db = process.env.KAPP_TEST_MODE ? params.testdb : params.database;
  this._lib = SQ;
};


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Processes a query on db.
   * (reserved for testing purpose)
   *
   * @method (arg1, [args])
   * @public
   * @param {String}        the SQL Query,
   * @param {Array}         the SQL Query params,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  async _query(sql, ...args) {
    const cn = await this._lib.open(this._db);
    const res = await this._lib.query(cn, sql, ...args);
    await this._lib.close(cn);
    return res;
  },

  // The below methods are primitive methods. They perform a simple but
  // usefull operation. Thus, they must be called inside another method as
  // they don't open and close the database.

  /**
   * Checks if the database is empty.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the connection to the db,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isDbEmpty(cn) {
    const SQL = 'SELECT count(*) FROM sqlite_master WHERE type = "table"';
    const resp = await this._lib.get(cn, SQL);
    return resp['count(*)'] === 0;
  },

  /**
   * Checks if the table exists.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connection to the db,
   * @param {String}        the name of the table,
   * @returns {Boolean}     returns true if the table exists otherwise false,
   * @since 0.0.0
   */
  async isTable(cn, table) {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`;
    const r = await this._lib.get(cn, sql);
    return typeof r === 'object' && r.name === table;
  },

  /**
   * Returns the table structure.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connection to the db,
   * @param {String}        the name of the table,
   * @returns {Array}       returns the structure of the table,
   * @since 0.0.0
   */
  async getTableStructure(cn, table) {
    const r = await this._lib.all(cn, `pragma table_info(${table})`);
    const struct = [];

    // Standardize:
    for (let i = 0; i < r.length; i++) {
      let def;
      switch (r[i].dflt_value) {
        case 'NULL':
          def = 'NULL';
          break;
        case null:
          def = 'None';
          break;
        default:
          def = r[i].dflt_value;
      }
      struct.push({
        column: r[i].cid,
        name: r[i].name,
        type: r[i].type,
        notNULL: r[i].notnull === 0 ? 'No' : 'Yes',
        default: def,
        key: r[i].pk === 1 ? 'primary' : '',
        extra: '',
      });
    }

    return struct;
  },

  /**
   * Checks if the table is empty.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the connection to the db,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isTableEmpty(cn, table) {
    const sql = `SELECT count(*) FROM ${table}`;
    const r = await this._lib.get(cn, sql);
    return r['count(*)'] === 0;
  },

  /**
   * Counts the number of tables, rows, columns.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the connection to the db,
   * @param {String}        what to count ('tables', 'rows', columns'),
   * @param {String}        the concerned table for rows or columns count,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async count(cn, what, table) {
    let sql
      , res
      ;

    switch (what) {
      case 'tables':
        sql = `
          SELECT count(*) FROM SQLITE_MASTER
            WHERE TYPE = 'table'
        `;
        res = await this._lib.all(cn, sql);
        return res[0]['count(*)'] - 1;

      case 'columns':
        sql = `
          SELECT * FROM pragma_table_info('${table}')
        `;
        res = await this._lib.all(cn, sql);
        return res.length;

      case 'rows':
        sql = `
        SELECT count(*) FROM ${table}
        `;
        res = await this._lib.all(cn, sql);
        return res[0]['count(*)'];

      default:
        return null;
    }
  },

  /**
   * Returns the latest inserted id during the user session.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the database connection,
   * @returns {Number}      returns the latest created id,
   * @since 0.0.0
   */
  async getLastInsertedId(cn) {
    const [res] = await this._lib.query(cn, 'SELECT LAST_INSERT_ROWID()');
    return res['LAST_INSERT_ROWID()'] || null;
  },
};


// -- Export
module.exports = { Cstor: SQLite, methods, tmethods };
