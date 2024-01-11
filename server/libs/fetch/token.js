/** ****************************************************************************
 *
 * Fetches another API Server.
 * (optional library)
 *
 * token.js is just a literal object that contains a set of functions.
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
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


// -- Private Functions --------------------------------------------------------

/**
 * Connects to the remote server.
 *
 * @function (arg1, arg2, arg3, [arg4])
 * @private
 * @param {String}          the login API,
 * @param {String}          the username,
 * @param {String}          the user password,
 * @param {String}          the source of the auth,
 * @returns {Array}         returns an array with a cookie and the server response,
 * @since 0.0.0
 */
async function _login(api, usr, pwd, auth) {
  const s64 = auth
    ? Buffer.from(`${usr}:${pwd}:${auth}`, 'utf-8').toString('base64')
    : Buffer.from(`${usr}:${pwd}`, 'utf-8').toString('base64')
  ;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${s64}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grant_type: 'client_credentials' }),
  };

  const resp = await fetch(api, options);
  const res = await resp.text();

  let data;
  try { data = JSON.parse(res); } catch (e) { data = res; }
  return [null, data];
}

/**
 * Makes an HTTP(s) GET.
 *
 * @function (arg1, arg2, [arg3])
 * @private
 * @param {String}          the access token,
 * @param {String}          the GET API,
 * @param {String}          the type of response (json or text),
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _GET(accessToken, api, type) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
 * @function (arg1, arg2, arg3, [arg4])
 * @private
 * @param {String}          the access token,
 * @param {String}          the POST API,
 * @param {Object}          the data to send,
 * @param {String}          the type of response (json or text),
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _POST(accessToken, api, payload, type) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
 * @function (arg1, arg2, [arg3])
 * @private
 * @param {String}          the access token,
 * @param {String}          the DELETE API,
 * @param {String}          the type of response (json or text),
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _DELETE(accessToken, api, type) {
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
   * @method (arg1, arg2, arg3, [arg4])
   * @public
   * @param {String}        the url of the remote server,
   * @param {String}        the username,
   * @param {String}        the user password,
   * @param {String}        token connection through an external server?,
   * @returns {Array}       returns an array with a cookie and the server response,
   * @since 0.0.0
   */
  login(url, usr, pwd, auth) {
    return _login(`${url}/api/v1/oauth2/token`, usr, pwd, auth);
  },

  /**
   * Makes an HTTP(s) GET.
   *
   * @method (arg1, arg2, [arg3])
   * @public
   * @param {String}        the access token,
   * @param {String}        the GET API,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  GET(token, api, type) {
    return _GET(token, api, type);
  },

  /**
   * Makes an HTTP(s) POST.
   *
   * @method (arg1, arg2, arg3, [arg4])
   * @public
   * @param {String}        the access token,
   * @param {String}        the POST API,
   * @param {Object}        the data to send,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  POST(token, api, payload, type) {
    return _POST(token, api, payload, type);
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
  DELETE(token, api, type) {
    return _DELETE(token, api, type);
  },

  /**
   * Disconnects from the server.
   *
   * @method (arg1, arg2, [arg3])
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the url of the remote server,
   * @param {String}        the type of response (json or text),
   * @returns {JSON/String} returns the server response,
   * @since 0.0.0
   */
  logout(token, url, type) {
    return _GET(token, `${url}/api/v1/oauth2/revoke`, type);
  },
};


// -- Export
module.exports = FETCH;
