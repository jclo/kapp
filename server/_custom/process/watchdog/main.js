/** ****************************************************************************
 *
 * Starts a watchdog and listens watchdog events.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getIPLocation              requests the ip geolocation from geoip server,
 *  . _listenLogout               listens the logout,
 *  . _listenLogin                listens the login,
 *
 *
 * Public Static Methods:
 *  . start                       starts watchdog,
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
    , F      = require('../../../libs/fetch/cookie')
    , WDog   = require('../../../libs/radio/main')
    , E      = require('./emailing')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_custom/process/watchdog/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Requests the ip geolocation from GeoIP Server.
 *
 * @function (arg1)
 * @private
 * @param {String}          the ipv4 or ipv6 address,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _getIPLocation(ip) {
  const server = `${process.env.KAPP_GEOIP_PROTOCOL}://${process.env.KAPP_GEOIP_URL}:${process.env.KAPP_GEOIP_PORT}`
      ;

  try {
    const resp = await F.GET(null, `${server}/api/v1/ip/one/${ip}`);
    if (resp.status === 401) {
      log.error(`status: ${resp.status}, error_code: ${resp.message.error_code}, message: ${resp.message.message}`);
      return null;
    }
    return resp.geolocation;
  } catch (e) {
    log.error(`error_code: ${e.code}, acccess to GeoIP server refused!`);
    return null;
  }
}

/**
 * Listens the login.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the server data,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _sendEmailAlert(payload) {
  const geo       = await _getIPLocation(payload.server.ip)
      , city      = geo && geo.city && geo.city.names ? geo.city.names.en || 'Unknown' : 'Unknown'
      , country   = geo && geo.country && geo.country.names ? geo.country.names.en || 'Unknown' : 'Unknown'
      , continent = geo && geo.continent && geo.continent.names ? geo.continent.names.en || 'Unknown' : 'Unknown'
      , latitude  = geo && geo.location ? geo.location.latitude || '???' : '???'
      , longitude = geo && geo.location ? geo.location.longitude || '???' : '???'
      , subject   = `Attempt to login to ${process.env.KAPP_SERVER_NAME}`
      ;

  const html = `
    <h1>Login</h1>
    <div>Who: ${typeof payload.user === 'string' && payload.user.length === 0 ? '???' : payload.user}</div>
    <div>Client IP: ${payload.server.ip}</div>
    <div>From where: ${city}, ${country} - ${continent} - ${latitude}, ${longitude}</div>
    <div>When: ${payload.browser.UTCDate}</div>
    <div>Timezone offset (mn): ${payload.browser.timeZoneOffset}</div>
    <div>Timezone: ${payload.browser.timeZone}</div>
    <div>To: ${process.env.KAPP_SERVER_NAME}</div>
    <div>Error: ${payload.error_code}</div>
    <div>Message: ${payload.message}</div>
    <div>Browser: ${JSON.stringify(payload.browser)}</div>
    <div>Server: ${JSON.stringify(payload.server)}</div>
  `;

  await E.send(subject, html);
}

/**
 * Listens the logout.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the jGeoIP component,
 * @returns {}              -,
 * @since 0.0.0
 */
function _listenLogout() {
  WDog.listen('watchdog:logout', (/* payload */) => {
    // console.log(payload);
  });
}

/**
 * Listens the login.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
function _listenLogin() {
  WDog.listen('watchdog:login', (payload) => {
    _sendEmailAlert(payload);
  });
}


// -- Public Static Methods ----------------------------------------------------

const Watchdog = {

  /**
   * Starts watchdog(s).
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the express.js app,
   * @param {Object}        the message translator,
   * @param {Object}        the db interface object,
   * @param {Object}        the db for storing doc in memory,
   * @param {Object}        the Mongodb db,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  start(/* app, i18n, dbi, dbn, dbm */) {
    if (process.env.KAPP_WATCHDOG_ENABLED === 'true') {
      log.info('starting watchdog ...');
      _listenLogin();
      _listenLogout();
      return this;
    }
    log.warn('the watchdog is NOT authorized to start!');
    return this;
  },
};


// -- Export
module.exports = Watchdog;
