/** ****************************************************************************
 *
 * Implements a few utility methods.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _amIAdmin                   checks if this user is an admin,
 *
 *
 * Public Static Methods:
 *  . amIAdmin                    checks if this user is an admin,
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
const R = require('./constants').roles;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Checks if this user is a master admin.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the connected user,
 * @returns {Array}         returns an error message or null,
 * @since 0.0.0
 */
function _amIAdmin(cuser) {
  return cuser.role_id === R.ROLE_ADMINISTRATOR
    ? [null, true]
    : ['Operation refused. You do not have the necessary authorization!'];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Checks if this user is an admin.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the connected user,
   * @returns {Array}       returns an error message or null,
   * @since 0.0.0
   */
  amIAdmin(cuser) {
    return _amIAdmin(cuser);
  },

};


// -- Export
module.exports = methods;
