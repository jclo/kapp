/** ****************************************************************************
 *
 * Listens for the messages sent by the client web App.
 *
 *
 * Private Methods:
 *  . _auth                       authenticates the sender,
 *
 *
 * Public Methods:
 *  . listen                      starts listening requests from the client app,
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
const config  = require('../config')
    , Connect = require('./connect')
    , System  = require('./system')
    , Auth    = require('../auth/main')
    ;


// -- Local constants
const { level } = config
    , log       = KZlog('api/main.js', level, false)
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


// -- Public Methods -----------------------------------------------------------

const Api = {

  /**
   * Starts listening requests from the client web site.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the express.js app,
   * @returns {}            -,
   * @since 0.0.0
  */
  listen(app) {
    Connect(app);
    System(app);

    app.get('/api/v1/getText', _auth, (req, res) => {
      res.send('Hello Text World!');
      log.trace('gets the api: "api/v1/getText".');
    });

    app.get('/api/v1/getJSON', _auth, (req, res) => {
      res.send(JSON.stringify({ a: 'Hello JSON World!' }));
      log.trace('gets the api: "api/v1/getJSON".');
    });

    app.post('/api/v1/posto', _auth, (req, res) => {
      res.send(JSON.stringify(req.body));
      log.trace('gets the api: "api/v1/post".');
      log.trace('got the payload!');
      console.log(req.body);
    });
  },
};


// -- Export
module.exports = Api;
