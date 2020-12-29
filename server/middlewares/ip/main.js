/** ****************************************************************************
 *
 * Defines the middleware that filters IPs.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . filterHost                  restricts the access to the server,
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
    , log       = KZlog('middlewares/ip/main.js', level, false)
    ;


// -- Local Variables


// -- Public -------------------------------------------------------------------

/**
 * Restricts the access to the server.
 *
 * @method (arg1)
 * @public
 * @param {}                -,
 * @returns {Function}      returns the middleware that filters host access,
 * @since 0.0.0
 */
function FilterIP(net) {
  return function(req, res, next) {
    if (!config.cors && !config.cors.hostname && !Array.isArray(config.cors.hostname)) {
      log.trace(`1: the connection is accepted for ${req.hostname}.`);
      next();
      return;
    }

    // By default, authorize the connection from the localhost:
    if (req.hostname.includes('localhost')
        || req.hostname === net.ip
        || req.hostname === '127.0.0.1'
    ) {
      log.trace(`2: the connection is accepted for ${req.hostname}.`);
      next();
      return;
    }

    for (let i = 0; i < config.cors.hostname.length; i++) {
      if (req.hostname === config.cors.hostname[i]) {
        log.trace(`3: the connection is accepted for ${req.hostname}.`);
        next();
        return;
      }
    }
    res.status(403).send({ status: 403, message: 'You are not authorized to access to this server!' });
    log.warn(`The connection from "${req.hostname}" was rejected!`);
  };
}


// -- Export
module.exports = FilterIP;
