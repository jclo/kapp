/** ****************************************************************************
 *
 * Listens for the Login/Logout Authentication APIs.
 *
 * auth.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . Auth                        starts listening for login and logout apis,
 *
 *
 * GET Api(s):
 *  . /api/v1/auth/logout         logout,
 *
 *
 * POST Api(s):
 *  . /api/v1/auth/login          login,
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
    , CAuth = require('../controllers/auth')
    , MAuth = require('../middlewares/auth/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('api/auth.js', level, false)
    ;


// -- Local Variables


// -- Public -------------------------------------------------------------------

/**
 * starts listening for login and logout APIs.
 *
 * @function (arg1, arg2, arg3)
 * @public
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @returns {}              -,
 * @since 0.0.0
 */
const Auth = function(app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);


  // GET
  app.get('/api/v1/auth/logout', auth, (req, res) => {
    CAuth.logout(dbn, req, (err) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.warn(`${req.body.user}: ${err}`);
      } else {
        res.statusMessage = 'You are now disconnected!';
        res.status(200).send(res.statusMessage);
        log.trace(`req.session.user_id: ${req._deleted_session_user_id}.`);
        log.trace('You are now disconnected!');
      }
    });
  });


  // POST
  app.post('/api/v1/auth/login', (req, res) => {
    CAuth.login(dbi, dbn, req, (err) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.warn(`${req.body.user}: ${err}`);
      } else {
        res.statusMessage = 'You are now connected!';
        res.status(200).send(res.statusMessage);
        log.trace(`req.session.user_id: ${req.session.user_id}.`);
        log.trace(res.statusMessage);
      }
    });
  });
};


// -- Export
module.exports = Auth;
