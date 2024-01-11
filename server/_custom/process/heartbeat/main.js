/** ****************************************************************************
 *
 * Starts an heartbeat.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _send                       attempts to send an heartbeat to Chronos,
 *  . start                       starts the heartbeat,
 *
 *
 * Public Static Methods:
 *  . start                       starts the heartbeat,
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
    ;


// -- Local Constants
const DEFAULT_DELAY = 1000 * 60
    , { level }     = config
    , log           = KZlog('_custom/process/hearteat/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Attempts to send an heartbeat to Chronos.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the in-memory db object,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _send(dbn) {
  const server = `${process.env.CHRONOS_PROTOCOL}://${process.env.CHRONOS_URL}:${process.env.CHRONOS_PORT}`
      , doc    = await dbn.find({ server_boot_time_stamp: { $exists: true } }).toArray()
      ;

  if (doc.length === 0) {
    log.error('dbn does NOT contain any document with "server_boot_time_stamp" field!');
  } else if (doc.length > 1) {
    log.error('dbn does contain more than ONE document with "server_boot_time_stamp" field!');
  }

  try {
    const res = await F.POST(null, `${server}/api/v1/pods/state`, {
      pod_name: process.env.KAPP_POD_USERNAME,
      pod_pwd: process.env.KAPP_POD_PASSWORD,
      pod_boot_time: doc[0].server_boot_time_stamp,
    });
    if (res.error_code) {
      log.warn(`error_code: ${res.error_code}, message: ${res.message}`);
    } else {
      log.info(`error_code: ${res.error_code}, message: ${res.message}`);
    }
  } catch (e) {
    log.warn(`error_code: ${e.code}, message: ${e.message}`);
  }
}

/**
 * Starts the heartbeat.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the in-memory db object,
 * @returns {}              -,
 * @since 0.0.0
 */
function _start(dbn) {
  let delay = parseInt(process.env.KAPP_HEART_RATE, 10);
  delay = !Number.isNaN(delay) ? delay : DEFAULT_DELAY;

  setInterval(() => {
    _send(dbn);
  }, delay);
}


// -- Public Static Methods ----------------------------------------------------

const Heartbeat = {

  /**
   * Starts the heartbeat.
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
  start(app, i18n, dbi, dbn /* , dbm */) {
    if (process.env.KAPP_HEARTBEAT_ENABLED === 'true') {
      log.info('starting heartbeat ...');
      _start(dbn);
      return this;
    }
    log.warn('the heartbeat is NOT authorized to start!');
    return this;
  },
};


// -- Export
module.exports = Heartbeat;
