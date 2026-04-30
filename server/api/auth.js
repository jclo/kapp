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


// -- Local Modules
import CreateLogger from '../libs/logger/main.js';
import CAuth from '../controllers/auth.js';
import MAuth from '../middlewares/auth/main.js';


// -- Local Constants
const log = CreateLogger(import.meta.url);


// -- Local Variables


// -- Public -------------------------------------------------------------------

/**
 * starts listening for login and logout APIs.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @public
 * @param {Object}          the express.js router for the api,
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @returns {}              -,
 * @since 0.0.0
 */
const Auth = function(apiRouter, app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);


  // GET
  apiRouter.get('/v1/auth/logout', auth, (req, res) => {
    CAuth.logout(dbn, req, (err) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send({ status: 401, message: err });
        log.warn(`${req.body.user}: ${err}`);
      } else {
        res.statusMessage = 'You are now disconnected!';
        res.status(200).send({ status: 200, message: 'You are now disconnected!' });
        log.trace(`req.session.user_id: ${req._deleted_session_user_id}.`);
        log.trace('You are now disconnected!');
      }
    });
  });


  // POST
  apiRouter.post('/v1/auth/login', (req, res) => {
    CAuth.login(dbi, dbn, req, (err) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send({ status: 401, message: err });
        log.warn(`${req.body.user}: ${err}`);
      } else {
        res.statusMessage = 'You are now connected!';
        res.status(200).send({ status: 200, message: 'You are now connected!' });
        log.trace(`req.session.user_id: ${req.session.user_id}.`);
        log.trace(res.statusMessage);
      }
    });
  });
};


// -- Export
export default Auth;
