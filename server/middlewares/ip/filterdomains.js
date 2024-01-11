/** ****************************************************************************
 *
 * Defines the middleware that filters domains.
 *
 * filterdomains.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
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
    , log       = KZlog('middlewares/ip/filterdomains.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Restricts the access to the server.
 *
 * @function (arg1)
 * @public
 * @param {}                -,
 * @returns {Function}      returns the middleware that filters host access,
 * @since 0.0.0
 */
function FilterDomains(net) {
  const domains = process.env.KAPP_NETWORK_FILTER_DOMAINS.split(',');

  return function(req, res, next) {
    if (process.env.KAPP_NETWORK_FILTER_DOMAINS === 'false') {
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

    // Authorize connections from listed domains:
    if (domains.indexOf(req.hostname) > -1) {
      log.trace(`3: the connection is accepted for ${req.hostname}.`);
      next();
      return;
    }

    res.status(403).send({ status: 403, message: 'You are not authorized to access this server!' });
    log.warn(`The connection from "${req.hostname}" was rejected!`);
  };
}


// -- Export
module.exports = FilterDomains;
