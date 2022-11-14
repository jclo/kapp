/** ****************************************************************************
 *
 * Starts the HTTP and HTTPS servers.
 *
 * http.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _certificates               returns the SSL certificates,
 *
 *
 * Public Static Methods:
 *  . startHttp                   starts the HTTP server,
 *  . startHttps                  Starts the HTTPS server,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const fs      = require('fs')
    , http    = require('http')
    , https   = require('https')
    , KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../config')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('core/http.js', level, false)
    ;


// -- Local Variables


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
const _getCertificates = function(base) {
  return {
    key: fs.readFileSync(`${base}/ssl/server-key.pem`, 'utf8'),
    cert: fs.readFileSync(`${base}/ssl/server-cert.pem`, 'utf8'),
  };
};


// -- Public Static Methods ----------------------------------------------------

const Servers = {

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
          log.error(`You don't have the privileges to listen the port: ${process.env.KAPP_HTTP_PORT}.`);
        } else {
          log.error(e);
        }
      })
      // '127.0.0.1' means allowing access to the local machine only. If you
      // want to authorize the server to listen any machines on the
      // network, replace '127.0.0.1' by '0.0.0.0'.
      .listen(process.env.KAPP_HTTP_PORT, process.env.KAPP_NETWORK, () => {
        log.info(`http listening on port ${process.env.KAPP_HTTP_PORT}.`);
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
    // Beware process.env.x converts everything to string!
    if (process.env.KAPP_HTTPS === 'true' && !process.env.TRAVIS) {
      https.createServer(_getCertificates(base), app)
        .on('error', (e) => {
          if (e.code === 'EACCES') {
            log.error(`You don't have the privileges to listen the port: ${process.env.KAPP_HTTPS_PORT}.`);
          } else {
            log.error(e);
          }
        })
        .listen(process.env.KAPP_HTTPS_PORT, process.env.KAPP_NETWORK, () => {
          log.info(`https listening on port ${process.env.KAPP_HTTPS_PORT}.`);
        });
    } else if (process.env.KAPP_HTTPS !== 'true') {
      log.info('config.env.https is false, the https server is not started!');
    } else {
      log.info('Kapp is runing on TRAVIS-CI, the https server is not started!');
    }
  },
};


// -- Export
module.exports = Servers;
