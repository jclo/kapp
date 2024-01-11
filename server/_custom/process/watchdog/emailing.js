/** ****************************************************************************
 *
 * Processes alert emails.
 *
 * emailing.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _login                      requests a connection to Hermes,
 *  . _logout                     releases the connection from Hermes,
 *  . _send                       sends a simple alert email,
 *
 *
 * Public Static Methods:
 *  . send                        sends a simple alert email,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0 */


// -- Vendor Modules
const KZlog = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../../config')
    , FTK    = require('../../../libs/fetch/token')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kmaster/process/watchdog/emailing.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Requests a connection to Hermes.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Array}         return the connection token or an error,
 * @since 0.0.0
 */
async function _login() {
  const server     = `${process.env.HERMES_PROTOCOL}://${process.env.HERMES_URL}:${process.env.HERMES_PORT}`
      , authserver = process.env.KAPP_POD_AUTH_SERVER
      , user       = process.env.KAPP_POD_USERNAME
      , password   = process.env.KAPP_POD_PASSWORD
      ;

  let err
    , resp
    ;

  try {
    [err, resp] = await FTK.login(server, user, password, authserver);
    if (err) {
      log.warn(`${err || `error_code: ${resp.message.error_code}, message: ${resp.message.message}`}`);
      return [err];
    }
    if ((resp.status === 401 || resp.status === 403) && typeof resp.message === 'string') {
      log.warn(`status: ${resp.status}, message: ${resp.message}`);
      return [resp];
    }
    if (resp.status === 401 && resp.message.error_code) {
      log.warn(`status: ${resp.status}, error_code: ${resp.message.error_code}, message: ${resp.message.message}`);
      return [resp];
    }
  } catch (e) {
    log.warn(`error_code: ${e.code}, message: The connection to Hermes server fails!`);
    return [{
      error_code: e.code,
      message: 'The connection to Hermes server fails!',
    }];
  }

  return [null, resp];
}

/**
 * Releases the connection from Hermes.
 *
 * @function (arg1)
 * @private
 * @param {String}          the connection token,
 * @returns {Array}         return a response or error,
 * @since 0.0.0
 */
async function _logout(token) {
  try {
    await FTK.logout(token.access_token, `${process.env.HERMES_PROTOCOL}://${process.env.HERMES_URL}:${process.env.HERMES_PORT}`);
  } catch (e) {
    log.warn(`error_code: ${e.code}, message: The connection to Hermes server fails!`);
    return [{
      error_code: e.code,
      message: 'The connection to Hermes server fails!',
    }];
  }

  return [null];
}

/**
 * Sends a simple alert email.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the subject of the email,
 * @param {XMLString}       the body of the email,
 * @returns {Array}         return the response or an error,
 * @since 0.0.0
 */
async function _send(subject, html) {
  const hserver = `${process.env.HERMES_PROTOCOL}://${process.env.HERMES_URL}:${process.env.HERMES_PORT}`;

  const [err1, token] = await _login();
  if (err1) {
    return [err1];
  }

  let resp;
  try {
    resp = await FTK.POST(token.access_token, `${hserver}/api/v1/pods/emails/one`, {
      to: process.env.HERMES_ALERT_RECIPIENT,
      subject,
      html,
    });
  } catch (e) {
    log.warn(`error_code: ${e.code}, message: The connection to Hermes server fails!`);
    return [{
      error_code: e.code,
      message: 'The connection to Hermes server fails!',
    }];
  }

  if (resp.error_code) {
    log.warn(`error_code: ${resp.error_code}, message: ${resp.message}`);
    return [resp];
  }
  if (resp.status && resp.status === 403) {
    log.warn(`status: ${resp.status}, message: ${resp.message}`);
    return [resp];
  }

  const [err] = await _logout(token);
  if (err) {
    return [err];
  }

  return [null, { error_code: null, message: 'done!', info: resp.message }];
}


// -- Public Static Methods ----------------------------------------------------

const Email = {

  /**
   * Sends a simple alert email.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the subject of the email,
   * @param {XMLString}     the body of the email,
   * @returns {Object}      return the response or an error,
   * @since 0.0.0
   */
  send(subject, html) {
    return _send(subject, html);
  },
};


// -- Export
module.exports = Email;
