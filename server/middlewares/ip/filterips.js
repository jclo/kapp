/** ****************************************************************************
 *
 * Defines the middleware that filters IPs.
 *
 * filterips.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _addRange                   adds a range of valid IPs,
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
const net     = require('net')
    , KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../config')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('middlewares/ip/filterips.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds a range of valid IPs.
 *
 * @function (arg1, arg2)
 * @public
 * @param {Array}           a list of ip,
 * @param {String}          a range of authorized ip,
 * @returns {}              -,
 * @since 0.0.0
 */
function _addRange(ip, cidr) {
  if (!cidr || typeof cidr !== 'string' || !cidr.includes('/')) {
    return;
  }

  const block   = cidr.split('/')
      , ipblock = block[0].split('.')
      ;

  if (block.length !== 2 || ipblock.length !== 4) {
    return;
  }

  let last = block[0];
  switch (block[1]) {
    case '0':
      break;

    case '8':
      last = `${ipblock[0]}.${ipblock[1]}.${ipblock[2]}.255`;
      break;

    case '16':
      last = `${ipblock[0]}.${ipblock[1]}.255.255`;
      break;

    case '24':
      last = `${ipblock[0]}.255.255.255`;
      break;

    default:
  }
  ip.addRange(block[0], last, 'ipv4');
}


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
function FilterIP(netip) {
  const ips = process.env.KAPP_NETWORK_FILTER_IPS.split(',')
      , ip  = new net.BlockList()
      ;

  _addRange(ip, process.env.KAPP_NETWORK_KUBE_IP_RANGE);

  return function(req, res, next) {
    if (process.env.KAPP_NETWORK_FILTER_IPS === 'false') {
      log.trace(`1: the connection is accepted for ${req.headers['x-real-ip'] || req.socket.remoteAddress}.`);
      next();
      return;
    }

    // By default, authorize the connection from the localhost:
    if (req.hostname.includes('localhost')
        || req.hostname === netip.ip
        || req.hostname === '127.0.0.1'
    ) {
      log.trace(`2: the connection is accepted for ${req.hostname}.`);
      next();
      return;
    }

    // Accept a request from a pod inside the same kubernetes cluster:
    if (!req.headers['x-real-ip'] && ip.check(req.socket.remoteAddress)) {
      log.trace(`3: the connection is accepted for ${req.socket.remoteAddress}.`);
      next();
      return;
    }

    // Authorize connections from listed ips:
    if (ips.indexOf(req.headers['x-real-ip']) > -1) {
      log.trace(`4: the connection is accepted for ${req.headers['x-real-ip']}.`);
      next();
      return;
    }

    res.status(403).send({ status: 403, message: 'You are not authorized to access this server!' });
    log.warn(`The connection from "${req.headers['x-real-ip'] || req.socket.remoteAddress}" was rejected!`);
  };
}


// -- Export
module.exports = FilterIP;
