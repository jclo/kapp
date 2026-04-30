/** ****************************************************************************
 *
 * Starts socket Servers.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . startWebSocketServer        starts the web socket server,
 *  . startTCPSocketServer        starts the tcp socket server
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


// -- Local Modules
import CWebSock from './websocketserver/main.js';
import CTCPSock from './tcpsocketserver/main.js';


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const Sock = {

  /**
   * Starts the Web Socket Server.
   *
   * @method (arg1, arg2, arg3, arg4, arg5, arg6, arg7)
   * @public
   * @param {Object}        the http server,
   * @param {Object}        the https server,
   * @param {Object}        the express.js app,
   * @param {Object}        the message translator,
   * @param {Object}        the db interface object,
   * @param {Object}        the db for storing doc in memory,
   * @param {Object}        the Mongodb db,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  startWebSocketServer(http, https, app, i18n, dbi, dbn, dbm) {
    CWebSock.start(http, https, app, i18n, dbi, dbn, dbm);
    return this;
  },

  /**
   * Starts the TCP Socket Server.
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
  startTCPSocketServer(app, i18n, dbi, dbn, dbm) {
    CTCPSock.start(app, i18n, dbi, dbn, dbm);
    return this;
  },
};


// -- Export
export default Sock;
