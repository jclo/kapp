/** ****************************************************************************
 *
 * Defines Middlewares.
 *
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Methods:
 *  . filterHost                  restricts the access to the server,
 *
 *
 *
 * @exports   Middleware
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0 */


// -- Node Modules
const KZlog   = require('@mobilabs/kzlog');


// -- Project Modules
const config = require('../config')
    ;


// -- Local constants
const { level } = config
    , log       = KZlog('core/routes.js', level, false)
    ;


// Local variables


// -- Public Methods -----------------------------------------------------------

const Middleware = {

  /**
   * Restricts the access to the server.
   *
   * @method (rg1)
   * @public
   * @param {}              -,
   * @returns {Function}    returns the middleware that filters host access,
   * @since 0.0.0
   */

  filterHost() {
    return function(req, res, next) {
      if (!config.cors && !config.cors.hostname && !Array.isArray(config.cors.hostname)) {
        log.trace(`The connection is accepted for ${req.hostname}.`);
        next();
        return;
      }

      for (let i = 0; i < config.cors.hostname.length; i++) {
        if (req.hostname === config.cors.hostname[i]) {
          log.trace(`The connection is accepted for ${req.hostname}.`);
          next();
          return;
        }
      }
      res.status(403).send({ status: 'error', message: 'You are not authorized to access to this server!' });
      log.warn(`The connection from "${req.hostname}" was rejected!`);
    };
  },
};


// -- Export
module.exports = Middleware;
