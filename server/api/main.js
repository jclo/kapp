/** ****************************************************************************
 *
 * Listens for the messages sent by the client web App.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Methods:
 *  . _auth                       authenticates the sender,
 *
 *
 * Public Methods:
 *  . listen                      starts listening requests from the client app,
 *
 *
 * GET Api(s):
 * (for testing and as examples)
 *  . /api/v1/text                returns a string,
 *  . /api/v1/json                returns a JSON,
 *
 *
 * POST Api(s):
 * (for testing and as examples)
 *  . /api/v1/posto               returns a payload,
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


// -- Local Modules
import CreateLogger from '../libs/logger/main.js';
import Auth from './auth.js';
import OAuth2 from './oauth2.js';
import System from './system.js';
import I18N from './i18n.js';
import CAPIS from '../_custom/api/v1/main.js';


// -- Local Constants
const log = CreateLogger(import.meta.url);


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Authenticates the sender.
 *
 * Nota:
 * This is just an example. The authentication method is not implemented.
 * It is just a bypass. If you want to add a session login by cookies or
 * through a token, replace the middleware '_auth' by 'auth'.
 * See the system apis in the file './server/api/system.js'. They insert
 * a middleware for authentication.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          Express.js request object,
 * @param {Object}          Express.js response object,
 * @param {Function}        the function to call at the completion,
 * @returns {}              -,
 * @since 0.0.0
 */
function _auth(req, res, next) {
  next();
}


// -- Public Methods -----------------------------------------------------------

const Api = {

  /**
   * Starts listening requests from the client web site.
   *
   * @method (arg1, arg2, arg3, arg4, arg5, arg6)
   * @public
   * @param {Object}        the express.js router for the api,
   * @param {Object}        the express.js app,
   * @param {Object}        the message translator,
   * @param {Object}        the db interface object,
   * @param {Object}        the db for storing doc in memory,
   * @param {Object}        the Mongodb db,
   * @returns {}            -,
   * @since 0.0.0
   */
  listen(apiRouter, app, i18n, dbi, dbn, dbm) {
    Auth(apiRouter, app, i18n, dbi, dbn);
    OAuth2(apiRouter, app, i18n, dbi, dbn);
    System(apiRouter, app, i18n, dbi, dbn);
    I18N(apiRouter, app, i18n, dbi, dbn);
    CAPIS(apiRouter, app, i18n, dbi, dbn, dbm);

    // These are a few examples of apis. For the sake of simplicity,
    // they use a fake middleware for the authentication and
    // they are not calling the associated controller but they return
    // directly the request to the caller.
    //
    // The general rule is to implement the counterpart controller that
    // processes the request in the controller folder.

    // GET
    // This GET api returns a simple string.
    apiRouter.get('/v1/text', _auth, (req, res) => {
      res.status(200).send('Hello Text World!');
      log.trace('Accepted GET api: "api/v1/text".');
    });

    // This GET api returns a json object.
    apiRouter.get('/v1/json', _auth, (req, res) => {
      res.status(200).send({ a: 'Hello JSON World!' });
      log.trace('Accepted GET api: "api/v1/json".');
    });

    // POST
    // This POST api sends a payload in the body. The payload is
    // returned.
    apiRouter.post('/v1/posto', _auth, (req, res) => {
      res.status(200).send(req.body);
      log.trace('Accepted POST api: "api/v1/posto".');
      log.trace('got the payload!');
    });
  },
};


// -- Export
export default Api;
