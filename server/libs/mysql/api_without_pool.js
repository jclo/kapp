/** ****************************************************************************
 *
 * Public interface for the MySQL database.
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
import mysql from 'mysql2';


// -- Local Modules
import U1 from '../../dbi/util.js';


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


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
   * @returns {Array}       returns an array with the query, params, and callback,
   * @since 0.0.0
   */
  _getArgs(...args) {
    return U1._getArgs(...args);
  },

  /**
   * Establishes a connection to the database.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {String}        the database server url,
   * @param {String}        the database,
   * @param {String}        the user,
   * @param {String}        the user's password,
   * @param {String}        the timezone,
   * @returns {}            -,
   * @since 0.0.0
   */
  createConnection(host, database, user, password, timezone) {
    this.db = mysql.createConnection({
      host,
      database,
      user,
      password,
      timezone,
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
          if (callback) { callback(err); }
        } else {
          resolve(result);
          if (callback) { callback(null, result); }
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
    q = convert ? U1.convert(q, 'mysql') : q;
    if (dump) { process.stdout.write(`${q}\n`); }

    return new Promise((resolve, reject) => {
      this.db.query(query, params, (err, results, fields) => {
        if (err) {
          reject(err);
          if (callback) { callback(err); }
        } else {
          resolve(results);
          if (callback) { callback(null, results, fields); }
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
          if (callback) { callback(err); }
        } else {
          resolve(true);
          if (callback) { callback(null); }
        }
      });
    });
  },
};


// -- Export
export default MQ;
