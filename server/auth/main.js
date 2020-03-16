/** ****************************************************************************
 *
 * Manages the session login.
 *
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Methods:
 *  . isSession                   authenticates the client,
 *  . login                       connects the authorized clients,
 *  . logout                      disconnects the connected client,
 *
 *
 *
 * @exports   Auth
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0 */


// -- Node Modules
const KZlog   = require('@mobilabs/kzlog');


// -- Project Modules
const config  = require('../config')
    , Account = require('./account')
    ;


// -- Local constants
const { level } = config
    , log       = KZlog('auth/main.js', level, false)
    ;


// Local variables


// -- Public Methods -----------------------------------------------------------

const Auth = {

  /**
   * Authenticates the client.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        Express.js request object,
   * @param {Object}        Express.js response object,
   * @param {Function}      the function to call at the completion,
   * @returns {}            -,
   * @since 0.0.0
   */
  isSession(req, res, next) {
    if (req.session.user_id) {
      // Ok. It's an open session with cookies. Let's go on!
      next();
    } else {
      // It's a request without authentication. Say no!
      res.status(401).send({ status: 'error', message: 'This request requires an user authentication!' });
      log.warn('This request requires an user authentication!');
    }
  },

  /**
   * Connects the authorized clients.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        Express.js request object,
   * @param {Object}        Express.js response object,
   * @returns {}            -,
   * @since 0.0.0
   */
  login(req, res) {
    log.trace(`user: ${req.body.user}, password: ${req.body.password}.`);
    Account.getCredentials(req.body.user, req.body.password, (user) => {
      if (user) {
        // Right username and right password:
        req.session.user_id = req.body.user;
        res.status(200).send({ status: 'Ok', message: 'You are now connected!' });
        log.trace(`req.session.user_id: ${req.session.user_id}.`);
        log.trace('You are now connected!');
      } else {
        // Wrong username and/or wrong passowrd:
        res.status(401).send({ status: 'error', message: `${req.body.user} and ${req.body.password} don't match!'` });
        log.warn(`${req.body.user} + ' doesn't exist or wrong password.`);
      }
    });
  },

  /**
   * Disconnects the connected client.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        Express.js request object,
   * @param {Object}        Express.js response object,
   * @returns {}            -,
   * @since 0.0.0
   */
  logout(req, res) {
    delete req.session.user_id;
    res.status(200).send({ status: 'Ok', message: 'You are now disconnected!' });
    log.trace('You are now disconnected!');
  },
};


// -- Export
module.exports = Auth;