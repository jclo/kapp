/** ****************************************************************************
 *
 * Starts the WebSocket Server and listens.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . start                       starts processing connections,
 *
 *
 * Public Static Methods:
 *  . start                       starts the websocket server,
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
const KZlog = require('@mobilabs/kzlog')
    , WS    = require('ws')
    ;


// -- Local Modules
const config = require('../../../config')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_custom/socketservers/websocketserver/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Starts processing connections.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6, arg7)
 * @private
 * @param {Object}          the http server,
 * @param {Object}          the https server,
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @param {Object}          the Mongodb db,
 * @returns {Object}        returns this,
 * @since 0.0.0
 */
function _start(http, httpsapp, i18n, dbi, dbn/* , dbm */) {
  const wss = new WS.WebSocketServer({ server: process.env.KAPP_WEBSOCKET_SERVER_HTTPS === 'true' ? https : http });

  /**
   * Waits for a connection request.
   *
   */
  wss.on('connection', (ws, req) => {
    log.info('socket connection established!');

    // This example shows how to accept connections only
    // from logged in clients:
    dbn.find({ _cookie: req.headers.cookie }).toArray((err, doc) => {
      if (doc.length === 0) {
        log.warn('the client attempting to connect is not logged in. Connection refused!');
        ws.close();
        return;
      }

      /**
       * Listens on error.
       */
      ws.on('error', () => {
        log.error('a socket error occured!');
      });

      /**
       * Listens for a message from client.
       */
      ws.on('message', (data) => {
        log.info('received: %s', data);
      });

      /**
       * Listens for a close request;
       */
      ws.on('close', () => {
        log.info('received a request to close a socket connection!');
      });

      /**
       * Sends data to connected clients.
       */
      ws.send('something');
    });
  });
}


// -- Public Static Methods ----------------------------------------------------

const WebSock = {

  /**
   * Starts the WebSocket Server.
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
  start(http, https, app, i18n, dbi, dbn, dbm) {
    if (process.env.KAPP_WEBSOCKET_SERVER_ENABLED === 'true') {
      log.info('starting the web socket server ...');
      _start(http, https, app, i18n, dbi, dbn, dbm);
      return this;
    }
    log.warn('the web socket server is NOT authorized to start!');
    return this;
  },
};


// -- Export
module.exports = WebSock;
