/** ****************************************************************************
 *
 * Listens for the System APIs.
 *
 * system.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _auth                       authenticates the sender,
 *
 *
 * Public Function:
 *  . System                      starts listening for login and logout apis,
 *
 *
 * GET Api(s):
 *  . /api/v1/system/version      returns the version of the server,
 *  . /api/v1/system/kapp-version returns the version of Kapp server,
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
const config = require('../config')
    , pack   = require('../../package.json')
    , Auth   = require('../auth/main')
    ;


// -- Local Constants
const { level } = config
    , auth      = Auth.isSession
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------


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
  app.get('/api/v1/system/version', auth, (req, res) => {
    res.status(200).send({ status: 200, message: `${pack.name} v${pack.version}` });
    log.trace('Accepted GET api: "/api/v1/sys/version".');
  });

  app.get('/api/v1/system/kapp-version', auth, (req, res) => {
    res.status(200).send({ status: 200, message: 'Kapp v{{kapp:version}}' });
    log.trace('Accepted GET api: "/api/v1/sys/kapp-version".');
  });
};


// -- Export
module.exports = System;
