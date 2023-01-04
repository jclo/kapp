/** ****************************************************************************
 *
 * Listens for messages sent by the client web App.
 *
 * routes.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . start                       starts listening requests from the client app,
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
const config = require('../config')
    , Api    = require('../api/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('core/routes.js', level, false)
    ;


// -- Local Variables


// -- Public Static Methods ----------------------------------------------------

const Routes = {

  /**
   * Starts listening requests from the client web site.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the express.js app,
   * @param {Object}        the message translator,
   * @param {Object}        the db interface object,
   * @param {Object}        the db for storing doc in memory,
   * @param {Object}        the Mongodb db,
   * @returns {}            -,
   * @since 0.0.0
   */
  start(app, i18n, dbi, dbn, dbm) {
    // Check if it is an https request:
    app.all('/api/*', (req, res, next) => {
      if (process.env.KAPP_HTTPS !== 'true') {
        log.info('Kapp is running in test mode, HTTP accesses are exceptionally authorized!');
        next();
      } else if (process.env.TRAVIS) {
        log.info('Kapp is running on Travis-CI, HTTP accesses are exceptionally authorized!');
        next();
      } else if (!req.secure) {
        res.statusMessage = 'HTTP accesses are not authorized!';
        res.status(401).send({ status: 401, message: 'HTTP accesses are not authorized!' });
        log.warn('HTTP accesses are not authorized!');
      } else {
        log.trace('It is an HTTPS request. Authorize it.');
        next();
      }
    });

    // Listen for the implemented api routes:
    Api.listen(app, i18n, dbi, dbn, dbm);

    // Unknown api:
    app.all('/api/*', (req, res) => {
      res.statusMessage = `${req.method} api "${req.url}" does not exist!`;
      res.status(403).send({ status: 401, message: `${req.method} api "${req.url}" does not exist!` });
      log.warn(`${req.method} api "${req.url}" does not exist!`);
    });

    // Forbidden routes:
    app.all('/*', (req, res) => {
      res.statusMessage = `The route "${req.originalUrl}" is forbidden!`;
      res.status(403).send({ status: 401, message: `The route "${req.originalUrl}" is forbidden!` });
      log.warn(`The route "${req.originalUrl}" is forbidden!`);
    });
  },
};


// -- Export
module.exports = Routes;
