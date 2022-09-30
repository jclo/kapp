/** ****************************************************************************
 *
 * Fetches another API Server.
 * (optional library)
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _login                      connects to the remote server,
 *  . _GET                        makes an HTTP(s) GET,
 *  . POST                        Makes an HTTP(s) POST,
 *  . DELETE                      Makes an HTTP(s) DELETE,
 *
 *
 * Public Methods:
 *  . login                       connects to the remote server,
 *  . GET                         makes an HTTP(s) GET,
 *  . POST                        Makes an HTTP(s) POST,
 *  . DELETE                      Makes an HTTP(s) DELETE,
 *  . logout                      disconnects from the server,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0,
  import/no-extraneous-dependencies: 0, no-console: 0 */


// -- Vendor Modules


// -- Local Modules
const fetch = require('node-fetch');


// -- Local Constants


// -- Local Variables


// -- Enable self-signed Certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


// -- Private Functions --------------------------------------------------------

/**
 * Connects to the remote server.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {String}          the url of the remote server,
 * @param {String}          the username,
 * @param {String}          the user password,
 * @param {String}          the type of response (json or text),
 * @returns {Array}         returns an array with a cookie and the server response,
 * @since 0.0.0
 */
async function _login(api, user, pwd, type) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie: '',
    },
    body: JSON.stringify({ user, password: pwd }),
  };
  const resp = await fetch(api, options);
  const [cookie] = resp.headers.raw()['set-cookie'];
  const res = await resp.text();
  if (type === 'text') {
    return [cookie, res];
  }

  let data;
  try { data = JSON.parse(res); } catch (e) { data = res; }
  return [cookie, data];
}

/**
 * Makes an HTTP(s) GET.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the connection cookie,
 * @param {String}          the GET API,
 * @param {String}          the type of response (json or text),
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _GET(cookie, api, type) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie,
    },
  };
  const resp = await fetch(api, options);
  const res = await resp.text();
  if (type === 'text') {
    return res;
  }

  let data;
  try { data = JSON.parse(res); } catch (e) { data = res; }
  return data;
}

/**
 * Makes an HTTP(s) POST.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {String}          the connection cookie,
 * @param {String}          the POST API,
 * @param {Object}          the data to send,
 * @param {String}          the type of response (json or text),
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _POST(cookie, api, payload, type) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie,
    },
    body: JSON.stringify(payload),
  };
  const resp = await fetch(api, options);
  const res = await resp.text();
  if (type === 'text') {
    return res;
  }

  let data;
  try { data = JSON.parse(res); } catch (e) { data = res; }
  return data;
}

/**
 * Makes an HTTP(s) DELETE.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the connection cookie,
 * @param {String}          the DELETE API,
 * @param {String}          the type of response (json or text),
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _DELETE(cookie, api, type) {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie,
    },
  };
  const resp = await fetch(api, options);
  const res = await resp.text();
  if (type === 'text') {
    return res;
  }

  let data;
  try { data = JSON.parse(res); } catch (e) { data = res; }
  return data;
}


// -- Public Static Methods ----------------------------------------------------

const FETCH = {

  /**
   * Connects to the server.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {String}        the url of the remote server,
   * @param {String}        the username,
   * @param {String}        the user password,
   * @param {String}        the type of response (json or text),
   * @returns {Array}       returns an array with a cookie and the server response,
   * @since 0.0.0
   */
  login(url, usr, pwd, type) {
    return _login(`${url}/api/v1/auth/login`, usr, pwd, type);
  },

  /**
   * Makes an HTTP(s) GET.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the GET API,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  GET(cookie, api, type) {
    return _GET(cookie, api, type);
  },

  /**
   * Makes an HTTP(s) POST.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the POST API,
   * @param {Object}        the data to send,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  POST(cookie, api, payload, type) {
    return _POST(cookie, api, payload, type);
  },

  /**
   * Makes an HTTP(s) DELETE.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the DELETE API,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  DELETE(cookie, api, type) {
    return _DELETE(cookie, api, type);
  },

  /**
   * Disconnects from the server.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the url of the remote server,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  logout(cookie, url, type) {
    return _GET(cookie, `${url}/api/v1/auth/logout`, type);
  },
};


// -- Export
module.exports = FETCH;
