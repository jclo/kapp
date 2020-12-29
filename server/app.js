/** ****************************************************************************
 *
 * Starts the Server.
 *
 * This server sends the index.html page stored in the 'public' folder and
 * listens for requests sent by the client (see core/routes).
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . App                         starts the App server,
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
const os           = require('os')
    , express      = require('express')
    , bodyParser   = require('body-parser')
    , cookieParser = require('cookie-parser')
    , session      = require('express-session')
    , KZlog        = require('@mobilabs/kzlog')
    , PicoDB       = require('picodb')
    ;


// -- Local Modules
const config     = require('./config')
    , Servers    = require('./core/http')
    , Routes     = require('./core/routes')
    , FilterIP   = require('./middlewares/ip/main')
    , I18N       = require('./libs/i18n/i18n')
    , DBI        = require('./dbi/dbi')
    ;


// -- Local Constants
const { level } = config;


// -- Local Variables


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

/**
 * Finds the server network I/F.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the server network I/F,
 * @since 0.0.0
 */
const _findLocalIP = function() {
  const net = os.networkInterfaces();
  const ifaces = Object.keys(net);

  let ip;
  let iface;
  ifaces.forEach((item) => {
    if (item === 'eth0' || item === 'en0') {
      for (let i = 0; i < net[item].length; i++) {
        if (net[item][i].family === 'IPv4') {
          iface = item;
          ip = net[item][i].address;
          break;
        }
      }
    }
  });
  return { eth: iface, ip };
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
async function App() {
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
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      path: config.session.path,
      httponly: config.session.httponly,
      maxAge: config.session.maxAge,
      secure: config.session.secure,
    },
  }));
  app.use(_cors(config));

  // Here it is an example of middlware:
  app.use(FilterIP(_findLocalIP()));

  // Serve the static pages:
  app.use(express.static(config.env.staticpage));

  // Initialize the english-x dictionary:
  const lang = config.i18n && config.i18n.lang ? config.i18n.lang : null;
  const i18n = I18N(lang);
  if (lang) {
    log.info(`Loaded the ${config.i18n.name}.`);
  }

  // Create the database object and create the tables for testing.
  // dbi.init() must be removed for the production version.
  log.info('create the users table for testing:');
  const dbi = await DBI('sqlite');
  await dbi.init();

  // Create a in-memory database to store the token and refresh token.
  // It means that if the server crashes the tokens are lost and
  // the user needs to login again. On the other side, it is almost
  // impossible to stole them.
  const dbn = PicoDB();

  // Start the HTTP & HTTPS servers:
  Routes.start(app, i18n, dbi, dbn);
  Servers.startHttp(app);
  Servers.startHttps(app, __dirname);
}


// -- Export
module.exports = App;
