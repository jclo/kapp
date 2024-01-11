/** ****************************************************************************
 *
 * Listens for the System APIs.
 *
 * system.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  none,
 *
 *
 * Public Function:
 *  . System                      starts listening for system apis,
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
    , MAuth  = require('../middlewares/auth/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('api/connect.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------


// -- Public -------------------------------------------------------------------

/**
 * Starts listening for the system APIs.
 * (the answers are pretty straightforward, we don't implement controllers
 *  for these requests)
 *
 * @function (arg1, arg2, arg3)
 * @public
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @returns {}              -,
 * @since 0.0.0
 */
const System = function(app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);


  // GET
  app.get('/api/v1/system/version', auth, (req, res) => {
    res.status(200).send({ version: `${pack.name} v${pack.version}` });
    log.trace('Accepted GET api: "/api/v1/sys/version".');
  });

  app.get('/api/v1/system/kapp-version', auth, (req, res) => {
    res.status(200).send({ version: 'KApp v{{kapp:version}}' });
    log.trace('Accepted GET api: "/api/v1/sys/kapp-version".');
  });
};


// -- Export
module.exports = System;
