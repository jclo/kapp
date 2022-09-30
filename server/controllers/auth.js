/** ****************************************************************************
 *
 * Processes login, logout apis.
 *
 * auth.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . login                       processes the api 'api/v1/auth/login',
 *  . logout                      processes the api 'api/v1/auth/logout',
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
const KZlog = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../config')
    , Crypto = require('../libs/crypto/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('server/controllers/auth.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const Auth = {

  /**
   * Processes the api 'api/v1/auth/login'.
   *
   * @function (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the in-memory db object,
   * @param {Object}        express.js request object,
   * @param {Function}      the function to call at the completion,
   * @return {}             -,
   * @since 0.0.0
   */
  async login(dbi, dbn, req, callback) {
    const [, user] = await dbi.userGetMe(req.body.user);
    if (!user) {
      callback('You are NOT a referenced user!');
      return;
    }

    const p = typeof req.body.password === 'number'
      ? req.body.password.toString()
      : req.body.password;
    const match = await Crypto.compare(p, user.user_hash);
    if (!match) {
      callback('You provided a wrong password!');
      return;
    }

    if (user.is_deleted === 1) {
      callback('Your account is deleted!');
      return;
    }

    if (user.is_locked) {
      callback('Your account is locked!');
      return;
    }

    // Ok. Register this new session:
    req.session.user_id = req.body.user;
    user._sessionID = req.sessionID;
    user._date_connection = (new Date()).toISOString();
    user._timestamp_login = (new Date()).getTime();
    await dbn.insertOne(user);
    // This is for registering the user login into the database. This method
    // isn't available for Kapp. You need to write it.
    if (dbi.adminUserRegisterLogin) await dbi.adminUserRegisterLogin(user);
    log.warn(`${user.user_name} with session id: ${req.sessionID} connected from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}!`);
    callback(null);
  },

  /**
   * Processes the api 'api/v1/auth/logout'.
   *
   * @function (arg1, arg2)
   * @public
   * @param {Object}        the in-memory db object,
   * @param {Object}        express.js request object,
   * @return {}             -,
   * @since 0.0.0
   */
  async logout(dbn, req, callback) {
    const [user] = await dbn.find({ _sessionID: req.sessionID }).toArray();
    await dbn.deleteOne({ _sessionID: req.sessionID });
    req._deleted_session_user_id = req.session.user_id;
    req.session.destroy();
    log.warn(`${user ? user.user_name : 'unknown user'} with session id: ${req.sessionID} disconnected from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}!`);
    callback(null);
  },
};


// -- Export
module.exports = Auth;
