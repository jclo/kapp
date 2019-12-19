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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Node Modules
const express      = require('express')
    , bodyParser   = require('body-parser')
    , cookieParser = require('cookie-parser')
    , session      = require('express-session')
    , KZlog        = require('@mobilabs/kzlog');


// -- Project Modules
const config     = require('./config')
    , Servers    = require('./core/http')
    , Routes     = require('./core/routes')
    , Middleware = require('./middlewares/main')
    ;


// -- Local constants
const { level } = config;


// Local variables


// -- Private Functions --------------------------------------------------------

/**
 * Sets the CORS policy.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the configuration settings object,
 * @returns {Object}        returns the function to execute for defining the CORS policy,
 * @since 0.0.0
 */
const _cors = function(conf) {
  return function(req, res, next) {
    res.header('Access-Control-Allow-Origin', conf.cors.origin);
    res.header('Access-Control-Allow-Methods', conf.cors.methods);
    res.header('Access-Control-Allow-Headers', conf.cors.headers);
    next();
  };
};


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

  // This block implements a session connection from a client web app. if
  // your App doesn't implement a login session, you can safely remove
  // this block and the modules 'cookieParser' and 'session'.
  app.use(cookieParser());
  app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    cookie: { maxAge: config.session.maxAge },
    saveUninitialized: true,
    resave: true,
  }));
  app.use(_cors(config));

  // Here it is an example of middlware:
  app.use(Middleware.filterHost());

  // Serve the static pages:
  app.use(express.static(config.env.staticpage));

  // Start the HTTP & HTTPS servers:
  Routes.start(app);
  Servers.startHttp(app);
  Servers.startHttps(app, __dirname);
}


// -- Export
module.exports = App;
