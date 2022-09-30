/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * use_7_save.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _savePreferences            saves the preferences of the connected user,
 *  . _registerLogin              registers this new login,
 *
 *
 * Public Static Methods:
 *  . registerLogin               registers this new login,
 *  . savePreferences             saves the preferences of the connected user,
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
const KZlog = require('@mobilabs/kzlog');


// -- Local Modules
const config = require('../../../../../../config')
    , U1     = require('../../../../../_utils/util1')
    ;


// -- Local Constants
const { level }   = config
    , log         = KZlog('_kadmin/admin/dbi/common/users/private/use_7_save.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Saves the preferences of the connected user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {Object}          the connected user,
 * @param {Object}          the parameters of the user to save,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or null,
 * @since 0.0.0
 */
async function _savePreferences(dbi, cn, cuser, params/* , sqlite */) {
  if (typeof params === 'object') {
    await dbi._lib.query(
      cn,
      'UPDATE admin_users SET preferences = ? WHERE id = ?',
      [JSON.stringify(params), cuser.id],
    );
  }
  return [null];
}

/**
 * Registers this new login.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user executing the operation,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or null,
 * @since 0.0.0
 */
async function _registerLogin(dbi, cn, cuser/* , sqlite */) {
  const sql = 'UPDATE admin_users SET last_login = ? WHERE id = ?';
  await dbi._lib.query(cn, sql, [U1.getDateTime(new Date()), cuser.id]);
  return [null];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Registers this new login,
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or null,
   * @since 0.0.0
   */
  registerLogin(dbi, cn, username, sqlite) {
    return _registerLogin(dbi, cn, username, sqlite);
  },

  /**
   *  Saves the preferences of the connected user.

   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the parameters of the user to save,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or null,
   * @since 0.0.0
   */
  savePreferences(dbi, cn, cuser, params, sqlite) {
    return _savePreferences(dbi, cn, cuser, params, sqlite);
  },
};


// -- Export
module.exports = methods;
