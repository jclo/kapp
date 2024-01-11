/** ****************************************************************************
 *
 * Starts listening events sent by the database(s).
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . start                       starts listening events from the databases(s),
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
const config = require('../../config')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_custom/dbwatcher/main.js', level, false)
    ;


// -- Local Variables


// -- Public Static Methods ----------------------------------------------------

const Watch = {

  /**
   * Starts listening events from the databases(s).
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
    log.trace('starting to listen database(s) events ...');
    return this;
  },
};


// -- Export
module.exports = Watch;
