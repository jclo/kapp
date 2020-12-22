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


// -- Vendor Modules
const bcrypt = require('bcrypt');


// -- Local Modules
const SQ = require('../sqlite/api')
    ;


// -- Local Constants
const PATH = './server/db/db.sqlite'
    ;


// -- Local Variables


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
  async getCredentials(user, pass, callback) {
    await SQ.open(PATH);
    const resp = await SQ.get(`SELECT * FROM users WHERE user_name="${user}"`);
    if (resp) {
      const match = await bcrypt.compare(pass, resp.user_hash);
      if (match) {
        callback(true);
        await SQ.close();
        return;
      }
    }
    callback(false);
    await SQ.close();
  },
};


// -- Export
module.exports = Account;
