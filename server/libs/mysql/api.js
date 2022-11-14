/** ****************************************************************************
 *
 * Public interface for the MySQL database.
 *
 * api.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getArgs                    returns the decoded passed-in arguments,
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
const mysql = require('mysql');


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the decoded passed-in arguments.
 *
 * @function ([arg1], [arg2])
 * @private
 * @param {Array}           the query values or null,
 * @param {Function}        the function to call at the completion,
 * @returns {Array}         returns an array with the query, params, and callback,
 * @since 0.0.0
 */
function _getArgs(...args) {
  let params = []
    , fn = null
    ;

  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'object') {
      params = args[i];
    } else if (typeof args[i] === 'function') {
      fn = args[i];
    }
  }
  return [params, fn];
}


// -- Public Static Methods ----------------------------------------------------

const MQ = {

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
    return _getArgs(...args);
  },

  /**
   * Creates a pool of connections to the database.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
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
    this.pool = mysql.createPool({
      host,
      port,
      connectionLimit,
      database,
      user,
      password,
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
      this.pool.getConnection((err, connection) => {
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
    const [params, callback] = _getArgs(...args);
    return new Promise((resolve, reject) => {
      cn.query(query, params, (err, results, fields) => {
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
   * Release the connection to the pool.
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
};


// -- Export
module.exports = MQ;
