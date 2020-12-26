/** ****************************************************************************
 *
 * Manages users account.
 *
 * account.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . getCredentials              checks if the user has the right credentials,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0,
  object-curly-newline: 0 */


// -- Vendor Modules


// -- Local Modules
const crypto = require('../libs/crypto/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Public Methods -----------------------------------------------------------

const Account = {

  /**
   * Checks if the user has the right credentials.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database interface object,
   * @param {String}        the user name,
   * @param {String}        the user password,
   * @param {Function}      the function to call at completion,
   * @returns {}            -,
   * @since 0.0.0
   */
  async getCredentials(dbi, user, pass, callback) {
    const resp = await dbi.getUser(user);
    if (resp) {
      const match = await crypto.compare(pass, resp.user_hash);
      if (match) {
        callback(true);
        return;
      }
    }
    callback(false);
  },
};


// -- Export
module.exports = Account;
