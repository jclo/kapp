/** ****************************************************************************
 *
 * Listens for the System APIs.
 *
 *
 * Private Methods:
 *  . _auth                       authenticates the sender,
 *
 *
 * Public Methods:
 *  . Connect                     starts listening for login and logout apis,
 *
 *
 *
 * @exports   Api
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0 */


// -- Node Modules
const KZlog   = require('@mobilabs/kzlog');


// -- Project Modules
const config = require('../config')
    , pack   = require('../../package.json')
    , Auth   = require('../auth/main')
    ;


// -- Local constants
const { level } = config
    , log       = KZlog('api/connect.js', level, false)
    , auth      = Auth.isSession
    ;


// Local variables


// -- Private Functions --------------------------------------------------------

/**
 * Authenticates the sender.
 *
 * Nota:
 * This is just an example. The authentication method is not implemented.
 * It is just a bypass. If you want to add a session login, replace the
 * middleware '_auth' by 'auth'. The login session mechanism is implemented
 * in the folder 'auth'.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}        Express.js request object,
 * @param {Object}        Express.js response object,
 * @param {Function}      the function to call at the completion,
 * @returns {}            -,
 * @since 0.0.0
*/
function _auth(req, res, next) {
  next();
}


// -- Public -------------------------------------------------------------------

/**
 * Starts listening for the system APIs.
 *
 * @method (arg1)
 * @public
 * @param {Object}        the express.js app,
 * @returns {}            -,
 * @since 0.0.0
*/
const System = function(app) {
  app.get('/api/v1/sys/getVersion', _auth, (req, res) => {
    res.status(200).send({ status: 'Ok', message: `${pack.name} v${pack.version}` });
    log.trace('gets the api: "/api/v1/sys/getVersion".');
  });

  app.get('/api/v1/sys/getKappVersion', _auth, (req, res) => {
    res.status(200).send({ status: 'Ok', message: 'Kapp v{{kapp:version}}' });
    log.trace('gets the api: "/api/v1/sys/getKappVersion".');
  });
};


// -- Export
module.exports = System;
