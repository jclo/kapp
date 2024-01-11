/** ****************************************************************************
 *
 * Starts processes(s).
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . start                       starts processes(s),
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
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config    = require('../../config')
    , Watchdog  = require('./watchdog/main')
    , Heartbeat = require('./heartbeat/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_custom/process/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const Process = {

  /**
   * Starts processe(s).
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
  start(app, i18n, dbi, dbn, dbm) {
    log.trace('starting processes ...');
    Watchdog.start(app, i18n, dbi, dbn, dbm);
    Heartbeat.start(app, i18n, dbi, dbn, dbm);
    return this;
  },
};


// -- Export
module.exports = Process;
