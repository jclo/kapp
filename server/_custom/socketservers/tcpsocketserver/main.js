/** ****************************************************************************
 *
 * Creates a TCP server and processes the directives sent by clients.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _process                    processes the passed-in command,
 *  . _decodeAndProcess           decodes and processes the passed-in message,
 *  . _start                      creates a tcp socket server and starts listening,
 *
 * Public Static Methods:
 *  . start                       starts listening tcp sockets,
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
const net   = require('net')
    , KZlog = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../../config')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_custom/socketservers/tcpsocketserver/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Processes the passed-in command.
 *
  * @function (arg1, arg2, arg3, arg4, arg5, arg6, arg7)
 * @private
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @param {Object}          the Mongodb db,
 * @param {Object}          the irc object,
 * @param {Object}          the received data (command plus payload),
 * @returns {}              -,
 * @since 0.0.0
 */
async function _process(app, i18n, dbi, dbn, dbm, socket, data) {
  if (!data.command) {
    log.warn('I do NOT understand your request!');
    await socket.write('I do NOT understand your request!');
    return;
  }

  switch (data.command) {
    case 'directive_1':
      log.trace('processing directive 1 ...');
      // await do();
      log.trace('done!');
      await socket.write('Done!');
      break;

    case 'directive_2':
      log.trace('processing directive 1 ...');
      // await do();
      log.trace('done!');
      await socket.write('Done!');
      break;

    case 'directive_3':
      log.trace('processing directive 3 ...');
      // await do();
      log.trace('done!');
      await socket.write('Done!');
      break;

    default:
      log.warn(`the requested command "${data.command}" is NOT implemented!`);
      await socket.write(`The requested command "${data.command}" is NOT implemented!`);
  }
}

/**
 * Decodes and processes the passed-in message.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6, arg7)
 * @private
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @param {Object}          the Mongodb db,
 * @param {JSON}            the received message,
 * @param {Object}          the irc object,
 * @param {Function}        the function to call at the completion,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _decodeAndProcess(app, i18n, dbi, dbn, dbm, json, socket, callback) {
  try {
    const data = JSON.parse(json);
    await _process(app, i18n, dbi, dbn, dbm, socket, data);
    callback();
  } catch (e) {
    log.warn('I do NOT understand your request!');
    await socket.write('I do NOT understand your request!');
    callback();
  }
}

/**
 * Creates a TCP Socket Server and starts listening the clients.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @param {Object}          the Mongodb db,
 * @returns {}              -,
 * @since 0.0.0
 */
function _start(app, i18n, dbi, dbn, dbm) {
  const server = net.createServer((socket) => {
    socket.on('data', (json) => {
      log.trace('received data from a client.');
      socket.write('received!');
      socket.pipe(socket);
      _decodeAndProcess(app, i18n, dbi, dbn, dbm, json, socket, () => {
        socket.destroy();
      });
    });

    socket.on('end', () => {
      log.trace('client disconnected.');
    });

    socket.on('error', (error) => {
      log.warn(`connection error: ${error.message}`);
    });
  });

  server.listen({ host: '127.0.0.1', port: process.env.KAPP_TCPSOCKET_SERVER_PORT }, () => {
    log.trace('start listening to the messages from the local clients ...');
  });
}


// -- Public Static Methods ----------------------------------------------------

const SOCK = {

  /**
   * Starts listening TCP sockets.
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
  start(app, i18n, dbi, dbn, dbm) {
    if (process.env.KAPP_TCPSOCKET_SERVER_ENABLED === 'true') {
      log.info('starting the tcp socket server ...');
      _start(app, i18n, dbi, dbn, dbm);
      return this;
    }
    log.warn('the tcp socket server is NOT authorized to start!');
    return this;
  },
};


// -- Export
module.exports = SOCK;
