/** ****************************************************************************
 *
 * Implements utility methods used by controllers.
 *
 * util.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _whoami                     finds the username of the user id,
 *
 *
 * Public Static Methods:
 *  . whoami                      returns the user associated to the session,
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
 * Finds the username of the user id.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object}          the in-memory database,
 * @param {Object}          express request object,
 * @return {String}         the username of the user,
 * @since 0.0.0
 */
async function _whoami(dbn, req) {
  let username;
  if (req.session.user_id) {
    username = req.session.user_id;
  } else if (req.headers && req.headers.authorization) {
    const doc = await dbn.find({ 'token.access_token': req.headers.authorization.split(' ')[1] }).toArray();
    username = doc[0].username;
  }
  return username;
}


// -- Public Methods -----------------------------------------------------------

const Util = {

  /**
   * Returns the user associated to the current session.
   *
   * @function (arg1, arg2)
   * @public
   * @param {Object}        the in-memory database,
   * @param {Object}        express request object,
   * @return {String}       the username of the user,
   * @since 0.0.0
   */
  whoami(dbn, req) {
    return _whoami(dbn, req);
  },
};


// -- Export
module.exports = Util;
