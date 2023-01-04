/** ****************************************************************************
 *
 * Configuration file.
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint no-useless-escape: 0 */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main section -

const config = {

  // Root __dirname
  base: __dirname,

  // Logging Level
  level: 'error',

  // Environment configuration
  env: {
    staticpage: 'public',
    httpport: 1080,
    httpsport: 1443,
    // By default, HTTPS is active and it is used for all the transactions.
    // It could be disabled for testing purpose.
    https: true,
    // By default, the transactions are authorized for the local machine only.
    // Replace '127.0.0.1' by '0.0.0.0' if you want to authorize the
    // transactions from all the machines on the nework or by the address
    // of the authorized machine.
    network: '127.0.0.1',
    ipFilteringDisabled: false,
  },

  // Session configuration
  // (remove this if your App doesn't require a session login)
  session: {
    name: 'app',
    secret: 'p!550ff',
    path: '/',
    httpOnly: true,
    maxAge: null,
    secure: false,
  },

  // CORS Policy
  // This define the server cors policy. It accepts the methods GET, POST, PUT
  // and DELETE from any clients on the network. If you want to restrict
  // the access to a list of domains, you have to implement a middleware
  // that filters the domain names. The propery hostname is used here as an
  // example how to filter hosts (refer to the middleware filterHosts).
  cors: {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    headers: 'X-Requested-With, Content-Type',
    credentials: true,
    hostname: ['google.com'],
  },

  // Useful regular expressions
  regex: {
    name: '/^[a-zA-Z0-9]+$/',
    username: '/^[a-z0-9_-]{3,16}$/',
    password: '/^[a-z0-9_-]{6,18}$/',
    hex: '/^#?([a-f0-9]{6}|[a-f0-9]{3})$/',
    email: '/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/',
    url: '/^((http|https|ftp)://)?([[a-zA-Z0-9]\-\.])+(\.)([[a-zA-Z0-9]]){2,4}([[a-zA-Z0-9]/+=%&_\.~?\-]*)$/',
    domain: '/^[a-z0-9]+[a-z0-9-\.]*[a-z0-9]+\.[a-z\.]{2,5}$/',
    ipv4: '/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/',
    email2: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },

  // Language for the server (if not english):
  i18n: null,

  // Databases:
  // See the file './.env.js'

  // Token
  // (lifetime is expressed in seconds)
  token: {
    length: 32,
    lifetime: 30 * 60,
    refreshTokenLifetime: 24 * 60 * 60,
    base: 'base62',
  },
};

// -- Export
module.exports = config;
