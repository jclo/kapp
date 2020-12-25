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


// -- Vendor Modules
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config  = require('../config')
    , Connect = require('./connect')
    , System  = require('./system')
    , I18N    = require('./i18n')
    // , Auth    = require('../auth/main')
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


// -- Public Methods -----------------------------------------------------------

const Api = {

  /**
   * Starts listening requests from the client web site.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the express.js app,
   * @param {Object}        the message translator,
   * @param {Object}        the db interface object,
   * @returns {}            -,
   * @since 0.0.0
   */
  listen(app, i18n, dbi) {
    Connect(app, i18n, dbi);
    System(app, i18n, dbi);
    I18N(app, i18n, dbi);

    const log = KZlog('api/main.js', level, false);

    // GET
    app.get('/api/v1/text', _auth, (req, res) => {
      res.status(200).send('Hello Text World!');
      log.trace('Accepted GET api: "api/v1/text".');
    });

    app.get('/api/v1/json', _auth, (req, res) => {
      res.status(200).send({ status: 200, message: { a: 'Hello JSON World!' } });
      log.trace('Accepted GET api: "api/v1/json".');
    });


    // GET with queries
    app.get('/api/v1/users', _auth, (req, res) => {
      res.status(200).send({ status: 200, url: req.originalUrl, message: { query: req.query } });
      log.trace('Accepted GET api: "api/v1/users/".');
      log.trace(`Got the query: ${JSON.stringify(req.query)}.`);
    });


    // Get with variables
    app.get('/api/v1/users/:id/:name/:other', _auth, (req, res) => {
      res.status(200).send({
        status: 200,
        url: req.originalUrl,
        message: { variables: req.params },
      });
      log.trace('Accepted GET api: "api/v1/users/:id/:name/other".');
      log.trace(`Got the variables: ${JSON.stringify(req.params)}.`);
    });


    // POST
    app.post('/api/v1/posto', _auth, (req, res) => {
      res.status(200).send({ status: 200, message: req.body });
      log.trace('Accepted POST api: "api/v1/posto".');
      log.trace('got the payload!');
    });
  },
};


// -- Export
module.exports = Api;
