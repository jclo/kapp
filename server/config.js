/** ****************************************************************************
 *
 * Configuration file.
 *
 *
 * @exports   config
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint no-useless-escape: 0 */


// -- Node Modules


// -- Project Modules


// -- Local Constants


// -- Local variables


// -- Main section -

const config = {

  // Root __dirname
  base: __dirname,

  // Logging Level
  level: 'trace',

  // Environment configuration
  env: {
    staticpage: 'public',
    httpport: 1080,
    httpsport: 1443,
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
  },
};

// -- Export
module.exports = config;
