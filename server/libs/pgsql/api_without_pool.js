/** ****************************************************************************
 *
 * Public interface for the PostgreSQL database.
 * (this api doesn't use a pool - it is not used)
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
 *  . create                      establishes a connection to the database,
 *  . connect                     connects to the database,
 *  . query                       queries the database,
 *  . end                         removes the connection to the database,
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
   * @returns {Array}       returns an array with the query, params, and callback,
   * @since 0.0.0
   */
  _getArgs(...args) {
    return U1._getArgs(...args);
  },

  /**
   * Establishes a connection to the database.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {String}        the database server url,
   * @param {String}        the database,
   * @param {String}        the user,
   * @param {String}        the user's password,
   * @returns {}            -,
   * @since 0.0.0
   */
  createConnection(host, database, user, password) {
    this.db = new PG.Client({
      host,
      port: 5432,
      database,
      user,
      password,
    });
  },

  /**
   * Connects to the database.
   *
   * @method ([arg1])
   * @public
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  connect(callback) {
    return new Promise((resolve, reject) => {
      this.db.connect((err, result) => {
        if (err) {
          reject(err);
          if (callback) callback(err);
        } else {
          resolve(result);
          if (callback) callback(null, result);
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
  query(query, ...args) {
    const [params, convert, dump, callback] = this._getArgs(...args);

    let q = query;
    q = convert ? U1.convert(q, 'pgsql') : q;
    params.forEach((item, index) => { q = q.replace(/\?/, `$${index + 1}`); });
    if (dump) process.stdout.write(`${q}\n`);

    return new Promise((resolve, reject) => {
      this.db.query(query, params, (err, results, fields) => {
        if (err) {
          reject(err);
          if (callback) callback(err);
        } else {
          resolve(results);
          if (callback) callback(null, results, fields);
        }
      });
    });
  },

  /**
   * Removes the connection to the database.
   *
   * @method ([arg1])
   * @public
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  end(callback) {
    return new Promise((resolve, reject) => {
      this.db.end((err) => {
        if (err) {
          reject(err);
          if (callback) callback(err);
        } else {
          resolve(true);
          if (callback) callback(null);
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
