/** ****************************************************************************
 *
 * Public interface for the PostgreSQL database.
 *
 * api.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . _getArgs                    returns the decoded arguments (for testing),
 *  . createPool                  creates a pool of connections to the database,
 *  . getConnection               asks for a connection from the pool,
 *  . query                       queries the database,
 *  . release                     release the connection to the pool,
 *  . end                         closes all the connections in the pool,
 *
 *  . convertTypes                converts MySQL types to PgSQL,
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
const PG = require('pg');


// -- Local Modules
const U1 = require('../../dbi/util')
    , U2 = require('./util')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const PGSQL = {

  /**
   * Returns the decoded passed-in arguments.
   * (for testing purpose)
   *
   * @method (...args)
   * @public
   * @param {Array}         the query values,
   * @param {Function}      the callback function,
   * @returns {Array}       returns an array with the params, and callback,
   * @since 0.0.0
   */
  _getArgs(...args) {
    return U1.getArgs(...args);
  },

  /**
   * Creates a pool of connections to the database.
   *
   * @method (arg1, arg2, arg3, arg4, arg5, arg6)
   * @public
   * @param {String}        the database server url,
   * @param {Number}        the port,
   * @param {String}        the database,
   * @param {String}        the user,
   * @param {String}        the user's password,
   * @returns {}            -,
   * @since 0.0.0
   */
  createPool(host, port, connectionLimit, database, user, password) {
    this.pool = new PG.Pool({
      host,
      port,
      database,
      user,
      password,
      min: 5,
      max: connectionLimit,
      idleTimeoutMillis: 30000,
      query_timeout: 5000,
      connectionTimeoutMillis: 10000,
    });
    // For testing purpose:
    return this.pool;
  },

  /**
   * Asks for a connection from the pool.
   *
   * @method ([arg1])
   * @public
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  getConnection(callback) {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, connection) => {
        if (err) {
          reject(err);
          if (callback) callback(err);
        } else {
          resolve(connection);
          if (callback) callback(null, connection);
        }
      });
    });
  },

  /**
   * Queries the database.
   *
   * @method (arg1, [arg2], [arg3])
   * @public
   * @param {String}        the query operation,
   * @param {Array}         the values to insert into the query,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  query(cn, query, ...args) {
    const [params, convert, dump, callback] = this._getArgs(...args);

    let q = query;
    q = convert ? U1.convert(q, 'pgsql') : q;
    params.forEach((item, index) => { q = q.replace(/\?/, `$${index + 1}`); });
    if (dump) process.stdout.write(`${q}\n`);

    return new Promise((resolve, reject) => {
      cn.query(q, params, (err, results) => {
        if (err) {
          reject(err);
          if (callback) callback(err);
        } else {
          resolve(results.rows);
          if (callback) callback(null, results.rows, results);
        }
      });
    });
  },

  /**
   * Release the connection from the pool.
   * (returning a promise is not required. It is just for consistency).
   *
   * @method ([arg1])
   * @public
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  release(cn, callback) {
    return new Promise((resolve) => {
      cn.release();
      resolve(true);
      if (callback) callback(null, true);
    });
  },

  /**
   * Closes all the connections in the pool.
   *
   * @method ([arg1])
   * @public
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  end(callback) {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          reject(err);
          if (callback) callback(err);
        } else {
          resolve(true);
          if (callback) callback(null, true);
        }
      });
    });
  },

  // -- Specific to PgSQL ------------------------------------------------------

  /**
   * Converts MySQL types to PgSQL.
   *
   * @method (arg1)
   * @public
   * @param {String}        the SQL command for creating a table,
   * @returns {String}      returns the SQL command with PgSQL types,
   * @since 0.0.0
   */
  convertTypes(sql) {
    return U2.convertTypes(sql);
  },
};


// -- Export
module.exports = PGSQL;
