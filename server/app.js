/** ****************************************************************************
 *
 * Starts the Server.
 *
 * This server sends the index.html page stored in the 'public' folder and
 * listens for requests sent by the client (see core/routes).
 *
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Functions:
 *  . App                         starts the App server,
 *
 *
 *
 * @exports   App
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0 */


// -- Node Modules
const express    = require('express')
    , bodyParser = require('body-parser')
    , KZlog      = require('@mobilabs/kzlog');


// -- Project Modules
const config  = require('./config.js')
    , servers = require('./core/http')
    , routes  = require('./core/routes')
    ;


// -- Local constants
const { level } = config;


// Local variables


// -- Public -------------------------------------------------------------------

/**
 * Starts the App server.
 *
 * @function ()
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
*/
function App() {
  const log = KZlog('app.js', level, false);
  log.info('starts the app server ...');

  // Here we configure 'app' to accept both JSON and url encoded payloads
  // and to serve the static page 'public/index.html'.
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(config.env.staticpage));

  routes.start(app);
  servers.startHttp(app);
  servers.startHttps(app, __dirname);
}


// -- Export
module.exports = App;
