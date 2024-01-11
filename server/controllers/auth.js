/** ****************************************************************************
 *
 * Processes login, authentication, logout apis.
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
 *  . whoami                      finds the username of the current session,
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
    , WDog   = require('../libs/radio/main')
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
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the in-memory db object,
   * @param {Object}        express.js request object,
   * @param {Function}      the function to call at the completion,
   * @return {}             -,
   * @since 0.0.0
   */
  async login(dbi, dbn, req, callback) {
    const [, user] = await dbi.userGetMe(req.body.user)
        , d        = new Date()
        , server   = {
          ip: req.headers['x-real-ip'],
          date: d.toISOString(),
          timeZoneOffset: d.getTimezoneOffset(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          'req.headers': req.headers,
        }
        , browser  = {
          ip: req.body.ip,
          err: req.body.err,
          UTCDate: req.body.UTCDate,
          timeZoneOffset: req.body.timeZoneOffset,
          timeZone: req.body.timeZone,
        }
        ;

    if (process.env.KAPP_LOGIN_LOCKED === 'true') {
      WDog.fire('watchdog:login', {
        error_code: 'LoginLocked',
        user: req.body.user,
        browser,
        server,
        message: 'Login is locked!',
      });
      callback('Login is locked!');
      return;
    }

    if (!user) {
      WDog.fire('watchdog:login', {
        error_code: 'UnknownUser',
        user: req.body.user,
        browser,
        server,
        message: `The user "${req.body.user}" is not a referenced user!`,
      });
      callback('You are NOT a referenced user!');
      return;
    }

    const p = typeof req.body.password === 'number'
      ? req.body.password.toString()
      : req.body.password;
    const match = await Crypto.compare(p, user.user_hash);
    if (!match) {
      WDog.fire('watchdog:login', {
        error_code: 'WrongPwd',
        user: user.user_name,
        browser,
        server,
        message: `The user "${user.user_name}" provided a wrong password!`,
      });
      callback('You provided a wrong password!');
      return;
    }

    if (user.is_deleted === 1) {
      WDog.fire('watchdog:login', {
        error_code: 'DeletedAccount',
        user: user.user_name,
        browser,
        server,
        message: `The user "${user.user_name}" account is deleted!`,
      });
      callback('Your account is deleted!');
      return;
    }

    if (user.is_locked) {
      WDog.fire('watchdog:login', {
        error_code: 'LockedAccount',
        user: user.user_name,
        browser,
        server,
        message: `The user "${user.user_name}" account is locked!`,
      });
      callback('Your account is locked!');
      return;
    }

    // Ok. Register this new session:
    req.session.user_id = req.body.user;
    user._sessionID = req.sessionID;
    user._cookie = req.headers.cookie;
    user._date_connection = (new Date()).toISOString();
    user._timestamp_login = (new Date()).getTime();
    await dbn.insertOne(user);
    // This is for registering the user login into the database. This method
    // isn't available for KApp. You need to write it.
    if (dbi.adminUserRegisterLogin) await dbi.adminUserRegisterLogin(user);
    WDog.fire('watchdog:login', {
      error_code: null,
      user: user.user_name,
      browser,
      server,
      message: `The user "${user.user_name}" login succeeded!`,
    });
    log.warn(`${user.user_name} with session id: ${req.sessionID} connected from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}!`);
    callback(null);
  },

  /**
   * Finds the username of the user associated to the current session.
   *
   * @function (arg1, arg2)
   * @private
   * @param {Object}          the in-memory database,
   * @param {Object}          express request object,
   * @return {String}         the username of the user,
   * @since 0.0.0
   */
  async whoami(dbn, req) {
    let username;
    if (req.session.user_id) {
      username = req.session.user_id;
    } else if (req.headers && req.headers.authorization) {
      const doc = await dbn.find({ 'token.access_token': req.headers.authorization.split(' ')[1] }).toArray();
      username = doc[0].user_name;
    }
    return username;
  },

  /**
   * Processes the api 'api/v1/auth/logout'.
   *
   * @method (arg1, arg2)
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
    WDog.fire('watchdog:logout', {
      error_code: null,
      user: user ? user.user_name : undefined,
      ip: req.headers['x-real-ip'],
      login: user._date_connection,
      logout: new Date().toISOString(),
      timeZoneOffset: new Date().getTimezoneOffset(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      message: `The user "${user ? user.user_name : 'unknown'}" logout!`,
    });
    log.warn(`${user ? user.user_name : 'unknown user'} with session id: ${req.sessionID} disconnected from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}!`);
    callback(null);
  },
};


// -- Export
module.exports = Auth;
