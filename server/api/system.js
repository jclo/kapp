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


// -- Vendor Modules
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../config')
    , pack   = require('../../package.json')
    // , Auth   = require('../auth/main')
    ;


// -- Local Constants
const { level } = config
    // , auth      = Auth.isSession
    ;


// -- Local Variables


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
 * @method (arg1, arg2, arg3)
 * @public
 * @param {Object}        the express.js app,
 * @param {Object}        the message translator,
 * @param {Object}        the db interface object,
 * @returns {}            -,
 * @since 0.0.0
 */
const System = function(app /* , i18n, dbi */) {
  const log = KZlog('api/connect.js', level, false);

  // GET
  app.get('/api/v1/system/version', _auth, (req, res) => {
    res.status(200).send({ status: 200, message: `${pack.name} v${pack.version}` });
    log.trace('Accepted GET api: "/api/v1/sys/version".');
  });

  app.get('/api/v1/system/kapp-version', _auth, (req, res) => {
    res.status(200).send({ status: 200, message: 'Kapp v{{kapp:version}}' });
    log.trace('Accepted GET api: "/api/v1/sys/kapp-version".');
  });
};


// -- Export
module.exports = System;
