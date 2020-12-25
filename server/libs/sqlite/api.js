/** ****************************************************************************
 *
 * Public interface for the SQlite database.
 *
 * api.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getArgs                    returns the decoded arguments,
 *  . _each                       returns the matching db rows one by one,
 *
 *
 * Public Static Methods:
 *  . _getArgs                    returns the decoded arguments (for testing),
 *  . open                        opens the database,
 *  . run                         executes a SQL query with no return,
 *  . get                         returns the first matching row,
 *  . all                         returns all the matching rows,
 *  . each                        returns the matching db rows one by one,
 *  . close                       closes the database,
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
const sqlite3 = require('sqlite3').verbose()
    ;


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the decoded arguments.
 *
 * Input could be:
 * (with params, f1, f1 optional)
 *  - param 1, param 2, ...  param n, f1, f2
 *  - [param 1, param 2, ..., param n], f1, f2
 *  - { p1: val, p1: val, ...}, f1, f2
 *
 * @function (...args)
 * @private
 * @param {...}             list of params, or array or object,
 * @param {Function}        first callback function,
 * @param {Function}        second callback function,
 * @returns {Array}         returns an array with params and callbacks 1 and 2,
 * @since 0.0.0
 */
function _getArgs(...args) {
  let params = []
    , f1     = null
    , f2     = null
    ;

  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'function') {
      if (!f1) {
        f1 = args[i];
      } else {
        f2 = args[i];
      }
    } else if (typeof args[i] === 'object') {
      params = args[i];
    } else {
      params.push(args[i]);
    }
  }

  return [params, f1, f2];
}

/**
 * Returns the matching db rows one by one.
 *
 * @function (arg1, arg2, ...args)
 * @private
 * @param {Object}          the sqlite object,
 * @param {String}          the SQL query,
 * @param {Array}           the SQL query params and callback(s),
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
function _each(db, query, ...args) {
  const [params, action, complete] = _getArgs(...args);

  return new Promise((resolve, reject) => {
    if (complete) {
      // with complete callback
      db.each(query, params, (err, row) => {
        if (err) {
          reject(err);
          if (action) action(err);
        } else {
          resolve(row);
          if (action) action(null, row);
        }
      }, (err, resp) => {
        complete(err, resp);
      });
    } else {
      // without complete callback
      db.each(query, params, (err, row) => {
        if (err) {
          reject(err);
          if (action) action(err);
        } else {
          resolve(row);
          if (action) action(null, row);
        }
      });
    }
  });
}


// -- Public Static Methods ----------------------------------------------------

const SQ = {

  /**
   * Returns the decoded passed-in arguments.
   * (for testing purpose)
   *
   * @method (...args)
   * @public
   * @param {...}           the sql params as a list or an array or an object,
   * @param {Function}      the first callback function,
   * @param {Function}      the second callback function,
   * @returns {Array}       returns an array with the params and the 2 callbacks,
   * @since 0.0.0
   */
  _getArgs(...args) {
    return _getArgs(...args);
  },

  /**
   * Opens the database.
   *
   * @method (arg1, [arg2])
   * @public
   * @param {String}        the database path,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  open(path, callback) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(path, (err) => {
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

  /**
   * Executes a SQL query that doesn't return a result.
   * ( like Insert, delete, update)
   *
   * Nota:
   * The SQL query paramters could be passed-in as:
   *  1) a list of args:
   *     - db.run('UPDATE tbl SET name = ? WHERE id = ?', 'bar', 2);
   *
   *  2) an array:
   *     - array: db.run('UPDATE tbl SET name = ? WHERE id = ?', ['bar', 2]);
   *
   *  3) an object:
   *      - db.run('UPDATE tbl SET name = $name WHERE id = $id',
   *          { $id: 2, $name: 'bar' });
   *
   * @method (arg1, [arg 2 to n], [arg n + 1])
   * @public
   * @param {String}        the SQL query,
   * @param {...}           the list of params,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  run(query, ...args) {
    const [params, callback] = _getArgs(...args);
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
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

  /**
   * Returns the first matching row.
   *
   * @method (arg1, [arg 2 to n], [arg n + 1])
   * @public
   * @param {String}        the SQL query,
   * @param {...}           the list of params,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  get(query, ...args) {
    const [params, callback] = _getArgs(...args);
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
        if (callback) callback(err, data);
      });
    });
  },

  /**
   * Returns all the matching rows.
   *
   * @method (arg1, [arg 2 to n], [arg n + 1])
   * @public
   * @param {String}        the SQL query,
   * @param {...}           the list of params,
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  all(query, ...args) {
    const [params, callback] = _getArgs(...args);
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
        if (callback) callback(err, data);
      });
    });
  },

  /**
   * Returns the matching db rows one by one.
   *
   * Nota:
   * The first callback returns the matching rows one by one. And, the
   * second callback returns the number of matching rows at the completion.
   *
   * @method (arg1, ...args)
   * @public
   * @param {String}        the SQL query,
   * @param {Array}         the SQL query params and the callback(s),
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  each(query, ...args) {
    return _each(this.db, query, ...args);
  },

  /**
   * Closes the database.
   *
   * @method ([arg1])
   * @public
   * @param {Function}      the function to call at the completion,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  close(callback) {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
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
module.exports = SQ;
