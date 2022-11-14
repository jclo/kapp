/** ****************************************************************************
 *
 * Starts the Server.
 *
 * This server sends the index.html page stored in the 'public' folder and
 * listens for requests sent by the client (see core/routes).
 *
 * Private Functions:
 *  . _cors                       sets the CORS policy,
 *  . _setEnv                     sets the environment variables,
 *  . _findLocalIP                finds the server network I/F,
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
    , Watcher    = require('./core/watcher')
    , FilterIP   = require('./middlewares/ip/main')
    , KillOutSe  = require('./middlewares/session/kill')
    , I18N       = require('./libs/i18n/i18n')
    , DBI        = require('./dbi/dbi')
    , MongoDB    = require('./libs/mongodb/main')
    , env        = require('../.env')
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
 * Sets the environment variables.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object}          the .env.js default values,
 * @param {Object}          the /server/config.js default values,
 * @returns {}              -,
 * @since 0.0.0
 */
/* eslint-disable max-len */
const _setEnv = function(enviro, conf) {
  if (!process.env.KAPP_DB_ACTIVE) process.env.KAPP_DB_ACTIVE = enviro.db.active;

  if (!process.env.KAPP_MYSQL_URL) process.env.KAPP_MYSQL_URL = enviro.db.mysql.host;
  if (!process.env.KAPP_MYSQL_PORT) process.env.KAPP_MYSQL_PORT = enviro.db.mysql.port || 3306;
  if (!process.env.KAPP_MYSQL_CNX_LIMIT) process.env.KAPP_MYSQL_CNX_LIMIT = enviro.db.mysql.connectionLimit;
  if (!process.env.KAPP_MYSQL_DATABASE) process.env.KAPP_MYSQL_DATABASE = enviro.db.mysql.database;
  if (!process.env.KAPP_MYSQL_USER) process.env.KAPP_MYSQL_USER = enviro.db.mysql.user;
  if (!process.env.KAPP_MYSQL_PASSWORD) process.env.KAPP_MYSQL_PASSWORD = enviro.db.mysql.password;

  if (!process.env.KAPP_MONGO_URL) process.env.KAPP_MONGO_URL = enviro.mongodb.host;
  if (!process.env.KAPP_MONGO_DATABASE) process.env.KAPP_MONGO_DATABASE = enviro.mongodb.db.database;
  if (!process.env.KAPP_MONGO_USER) process.env.KAPP_MONGO_USER = enviro.mongodb.db.options.auth.user;
  if (!process.env.KAPP_MONGO_PASSWORD) process.env.KAPP_MONGO_PASSWORD = enviro.mongodb.db.options.auth.password;

  if (!process.env.KAPP_HTTP_PORT) process.env.KAPP_HTTP_PORT = conf.env.httpport;
  if (!process.env.KAPP_HTTPS_PORT) process.env.KAPP_HTTPS_PORT = conf.env.httpsport;
  if (!process.env.KAPP_HTTPS) process.env.KAPP_HTTPS = conf.env.https;
  if (!process.env.KAPP_NETWORK) process.env.KAPP_NETWORK = conf.env.network;
};
/* eslint-enable max-len */

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
function App() {
  const log = KZlog('app.js', level, false);
  log.info('starts the app server ...');

  // Initialize the environment variables for the databases.
  _setEnv(env, config);

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
  log.info('create the dabase object ...');
  const dbi = DBI(process.env.KAPP_DB_ACTIVE);
  // This is used for filling the database. if the database already contains
  // tables nothing is done. The only way to initialize a database is to drop
  // its contents by hand.
  dbi.init();

  // Create a in-memory database to store tokens and sessions.
  // It means that if the server crashes the tokens and sessins are lost and
  // the user needs to login again. On the other side, it is almost
  // impossible to stole them.
  // Besides, the middleware 'KillOutSe' acts as a garbage collector by
  // destroying the outdated sessions (sessions with an inactive user).
  const dbn = PicoDB();
  app.use(KillOutSe(dbn));

  // Start the HTTP & HTTPS servers:
  Routes.start(app, i18n, dbi, dbn);
  Watcher.start(app, i18n, dbi, dbn);
  Servers.startHttp(app);
  Servers.startHttps(app, __dirname);

  // Or create a MongoDB object to access to the MongoDB database.
  // MongoDB(env.mongodb, (dbmo) => {
  //   // Start the HTTP & HTTPS servers:
  //   Routes.start(app, i18n, dbi, dbn, dbmo);
  //   Watcher.start(app, i18n, dbi, dbn, dbmo);
  //   Servers.startHttp(app);
  //   Servers.startHttps(app, __dirname);
  // });

  // It returns the db object only for testing purpose. With this object,
  // './server/start' scripts creates a testing sqlite database.
  return dbi;
}


// -- Export
module.exports = App;
