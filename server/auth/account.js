/** ****************************************************************************
 *
 * Manages users account.
 *
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Methods:
 *  . getCredentials              checks if the user has the right credentials,
 *
 *
 *
 * @exports   Account
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0,
  object-curly-newline: 0 */


// -- Node Modules


// -- Project Modules


// -- Local constants
const db = [
  { user_name: 'jdo', user_pwd: 'jdo', first_name: 'John', last_name: 'Doe' },
  { user_name: 'jsn', user_pwd: 'jsn', first_name: 'John', last_name: 'Snow' },
];


// Local variables


// -- Public Methods -----------------------------------------------------------

const Account = {

  /**
   * Checks if the user has the right credentials.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {String}        the user name,
   * @param {String}        the user password,
   * @param {Function}      the function to call at completion,
   * @returns {}            -,
   * @since 0.0.0
   */
  getCredentials(user, pass, callback) {
    for (let i = 0; i < db.length; i++) {
      if (db[i].user_name === user && db[i].user_pwd === pass) {
        callback(db[i]);
        return;
      }
    }
    callback(false);
  },
};


// -- Export
module.exports = Account;
