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
 *  . _query                      processes a query on db (only for testing),
 *  . isTableNoCnx                checks if a db has a table,
 *
 *  . end                         free the pool of connections to the database,
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
 * @param {Object}          the database params from '.env.js',
 * @returns {}              -,
 * @since 0.0.0
 */
const MySQL = function(params) {
  this._name = 'mysql';
  this._db = process.env.KAPP_TEST_MODE
    ? params.testdb
    : process.env.KAPP_MYSQL_DATABASE
  ;

  this._lib = MQ;
  // MQ.createPool(
  //   params.host,
  //   params.connectionLimit,
  //   params.database,
  //   params.user,
  //   params.password,
  // );
  MQ.createPool(
    process.env.KAPP_MYSQL_URL,
    process.env.KAPP_MYSQL_PORT,
    process.env.KAPP_MYSQL_CNX_LIMIT,
    process.env.KAPP_MYSQL_DATABASE,
    process.env.KAPP_MYSQL_USER,
    process.env.KAPP_MYSQL_PASSWORD,
    process.env.KAPP_MYSQL_TIMEZONE,
  );
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
    const cn = await this._lib.getConnection();
    const res = await this._lib.query(cn, sql, ...args);
    await this._lib.release(cn);
    return res;
  },

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

  /**
   * Checks if the table exists.
   *
   * @method (arg1)
   * @public
   * @param {String}        the name of the table,
   * @returns {Boolean}     returns true if the table exists otherwise false,
   * @since 0.0.0
   */
  async isTableNoCnx(table) {
    const SQL = `SELECT * FROM information_schema.tables
      WHERE table_schema = '${this._db}' AND table_name = '${table}'`;
    const resp = await this._query(SQL, []);
    return resp.length > 0;
  },


  // The below methods are primitive methods. They perform a simple but
  // usefull operation. Thus, they must be called inside another method as
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
    const SQL = 'SELECT COUNT(DISTINCT `table_name`) AS TotalNumberOfTables FROM `information_schema`.`columns` WHERE `table_schema` = ?;';
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
    const resp = await this._lib.query(cn, `SELECT count(*) FROM ${table}`);
    return resp[0]['count(*)'] === 0;
  },

  /**
   * Counts the number of tables, rows, columns.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the database connection,
   * @param {String}        what to count ('tables', 'rows', columns'),
   * @param {String}        the concerned table for rows or columns count,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async count(cn, what, table) {
    let sql
      , params
      ;

    switch (what) {
      case 'tables':
        sql = `
          SELECT count(*) FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = ?
        `;
        params = [this._db];
        break;

      case 'columns':
        sql = `
          SELECT count(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        `;
        params = [this._db, table];
        break;

      case 'rows':
        sql = `
        SELECT count(*) FROM ${table}
        `;
        params = [];
        break;

      default:
        return null;
    }
    const res = await this._lib.query(cn, sql, params);
    return res[0]['count(*)'];
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
    const [res] = await this._lib.query(cn, 'SELECT LAST_INSERT_ID()');
    return res['LAST_INSERT_ID()'] || null;
  },
};


// -- Export
module.exports = { Cstor: MySQL, methods, tmethods };
