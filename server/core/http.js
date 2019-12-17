/** ****************************************************************************
 *
 * Starts the HTTP and HTTPS servers.
 *
 *
 * Private Methods:
 *  . _certificates               returns the SSL certificates,
 *
 *
 * Public Methods:
 *  . startHttp                   starts the HTTP server,
 *  . startHttps                  Starts the HTTPS server,
 *
 *
 *
 * @exports   servers
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Node Modules
const fs      = require('fs')
    , http    = require('http')
    , https   = require('https')
    , KZlog   = require('@mobilabs/kzlog');


// -- Project Modules
const config = require('../config.js');


// -- Local constants
const { level } = config
    , log       = KZlog('core/http.js', level, false)
    ;


// Local variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the SSL certificates.
 *
 * @function (arg1)
 * @private
 * @param {String}          the root path,
 * @returns {Object}        returns the private key and the public certificate,
 * @since 0.0.0
 */
const _certificates = function(base) {
  return {
    key: fs.readFileSync(`${base}/ssl/server-key.pem`, 'utf8'),
    cert: fs.readFileSync(`${base}/ssl/server-cert.pem`, 'utf8'),
  };
};


// -- Public Methods -----------------------------------------------------------

const servers = {

  /**
   * Starts the HTTP server.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the express.js app,
   * @returns {}            -,
   * @since 0.0.0
  */
  startHttp(app) {
    http.createServer(app)
      .on('error', (e) => {
        if (e.code === 'EACCES') {
          log.error(`You don't have the privileges to listen the port: ${config.env.httpport}.`);
        } else {
          log.error(e);
        }
      })
      // '127.0.0.1' means allowing access to the local machine only. If you
      // want to authorize the server to listen any machines on the
      // network, replace '127.0.0.1' by '0.0.0.0'.
      .listen(config.env.httpport, '127.0.0.1', () => {
        log.info(`http listening on port ${config.env.httpport}.`);
      });
  },

  /**
   * Starts the HTTPS server.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the express.js app,
   * @param {String}        the server root path,
   * @returns {}            -,
   * @since 0.0.0
  */
  startHttps(app, base) {
    https.createServer(_certificates(base), app)
      .on('error', (e) => {
        if (e.code === 'EACCES') {
          log.error(`You don't have the privileges to listen the port: ${config.env.httpsport}.`);
        } else {
          log.error(e);
        }
      })
      .listen(config.env.httpsport, '127.0.0.1', () => {
        log.info(`https listening on port ${config.env.httpsport}.`);
      });
  },
};


// -- Export
module.exports = servers;
