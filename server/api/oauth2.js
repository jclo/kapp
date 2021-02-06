/** ****************************************************************************
 *
 * Processes the Token Authentication APIs.
 *
 * oauth2.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . OAuth                       starts listening for login and logout apis,
 *
 *
 * GET Api(s):
 *  . api/v1/oauth2/revoke        revokes the current access token,
 *
 * POST Api(s):
 *  . /api/v1/oauth2/token        request for a token or a new token,
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
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../config')
    , COAuth = require('../controllers/oauth2')
    , MAuth  = require('../middlewares/auth/main')
    ;


// -- Local Constants
const { level } = config
    , log = KZlog('api/oauth2.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * starts listening for a token authentication APIs.
 *
 * @function (arg1, arg2, arg3)
 * @public
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @return {}               -,
 * @since 0.0.0
 */
function OAuth(app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);

  // GET
  app.get('/api/v1/oauth2/revoke', auth, (req, res) => {
    COAuth.revoke(dbi, dbn, req, res, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused POST api: "api/v1/api/v1/oauth2/revoke".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/api/v1/oauth2/revoke".');
      }
    });
  });


  // POST
  app.post('/api/v1/oauth2/token', (req, res) => {
    COAuth.get(dbi, dbn, req, res, (err, token) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused POST api: "api/v1/api/v1/oauth2/token".');
        log.info(err);
      } else {
        res.status(200).send(token);
        log.trace('Accepted POST api: "api/v1/api/v1/oauth2/token".');
        if (token.refresh_token) {
          log.info(`Accepted grant_type=client_credentials, the new access token ${token.access_token} has been sent.`);
        } else {
          log.info(`Accepted grant_type=refresh_token, the new access token ${token.access_token} has been sent.`);
        }
      }
    });
  });
}


// -- Export
module.exports = OAuth;
