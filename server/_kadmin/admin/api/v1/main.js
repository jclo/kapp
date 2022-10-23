/** ****************************************************************************
 *
 * Listens for the messages sent by the client web App.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Methods:
 *  . _Me                         starts listening for some users APIs,
 *
 *
 * Public Function:
 *  . CAPIs                       starts listening requests from the client app,
 *
 *
 * GET Api(s):
 *  . /api/v1/users/me            returns the params of the connected user,
 *  . /api/v1/users/online        returns the list of the connected users,
 *
 *
 * POST Api(s):
 *  . /api/v1/users/preferences   saves the preferences of the connected user,
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
    ;


// -- Local Modules
const config  = require('../../../../config')
    , MAuth   = require('../../../../middlewares/auth/main')
    , CUse    = require('../../controllers/v1/users')
    , Users   = require('./admin/users')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/api/v1/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Starts listening for some users APIs.
 *
 * @method (arg1, arg2, arg3)
 * @public
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @returns {}              -,
 * @since 0.0.0
 */
function _Me(app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);

  /**
   * GET api/v1/users/me
   * (returns the params of the connected user)
   */
  app.get('/api/v1/users/me', /* auth, */ (req, res) => {
    CUse.getMe(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/users/me".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/users/me".');
        log.info(resp);
      }
    });
  });

  /**
   * GET api/v1/users/online
   * (returns the params of the connected user(s))
   */
  app.get('/api/v1/users/online', auth, (req, res) => {
    CUse.getOnline(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/users/online".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/users/online".');
        log.info(resp);
      }
    });
  });

  /**
   * POST api/v1/admin/users/preferences
   * (save the preferences of the connected user)
   */
  app.post('/api/v1/users/preferences', auth, (req, res) => {
    CUse.savePreferencesOnlineUser(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused POST api: "api/v1/users/preferences".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted POST api: "api/v1/users/preferences".');
        log.info(resp);
      }
    });
  });
}


// -- Public Function ----------------------------------------------------------

/**
 * Starts listening for the project APIs.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @public
 * @param {Object}          express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the in-memory db object,
 * @returns {}              -,
 * @since 0.0.0
 */
function CAPIs(app, i18n, dbi, dbn) {
  _Me(app, i18n, dbi, dbn);
  Users(app, i18n, dbi, dbn);
}


// -- Export
module.exports = CAPIs;
