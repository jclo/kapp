/** ****************************************************************************
 *
 * Listens for messages sent by the client web App.
 *
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Methods:
 *  . start                       starts listening requests from the client app,
 *
 *
 *
 * @exports   routes
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0 */


// -- Node Modules
const KZlog   = require('@mobilabs/kzlog');


// -- Project Modules
const config = require('../config.js');


// -- Local constants
const { level } = config
    , log       = KZlog('core/routes.js', level, false)
    ;


// Local variables


// -- Public Methods -----------------------------------------------------------

const routes = {

  /**
   * Starts listening requests from the client web site.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the express.js app,
   * @returns {}            -,
   * @since 0.0.0
  */
  start(app) {
    app.get('/v1/getText', (req, res) => {
      res.send('Hello Text World!');
      log.info('gets the api: "/v1/getText".');
    });

    app.get('/v1/getJSON', (req, res) => {
      res.send(JSON.stringify({ a: 'Hello JSON World!' }));
      log.info('gets the api: "/v1/getJSON".');
    });

    app.post('/v1/posto', (req, res) => {
      res.send(JSON.stringify(req.body));
      log.info('gets the api: "/v1/post".');
      log.info('got payload!');
      console.log(req.body);
    });
  },
};


// -- Export
module.exports = routes;
