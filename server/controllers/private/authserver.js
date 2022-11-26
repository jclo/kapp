/** ****************************************************************************
 *
 * Communicates with an external server.
 *
 * authserver.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getMe                       requests credentials from external server,
 *
 *
 * Public Static Methods:
 *  . getMe                       requests credentials from external server,
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


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Requests the user credentials from an external server.
 *
 * @function (arg1, arg2, [arg3])
 * @private
 * @param {String}        the username of the user,
 * @param {String}        infos on the server,
 * @param {String}        the password,
 * @return {Object}       returns the credentials on the user or an error,
 * @since 0.0.0
 */
async function _getMe(username, auth/* , pwd */) {
  return [{
    error_code: 'ServerFails',
    message: `The server "${auth}" is unknown!`,
  }];
}


// -- Public Static Methods ----------------------------------------------------

const Auth0 = {

  /**
   * Requests the user credentials from an external server.
   *
   * @method (arg1, arg2, [arg3])
   * @public
   * @param {String}        the username of the user,
   * @param {String}        infos on the server,
   * @param {String}        the password,
   * @return {Object}       returns the credentials on the user or an error,
   * @since 0.0.0
   */
  getMe(username, auth, pwd) {
    return _getMe(username, auth, pwd);
  },
};


// -- Export
module.exports = Auth0;
