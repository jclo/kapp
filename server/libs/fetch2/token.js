/** ****************************************************************************
 *
 * The library for connecting to a server using tokens
 * with native Node.JS fetch.
 *
 * cookie.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _DELETE                     makes an http(s) delete request,
 *  . _POST                       makes an http(s) post request,
 *  . _GET                        makes an http(s) get request,
 *  . _login                      connects to the server,
 *
 *
 * Public Methods:
 *  . login                       connects to the server,
 *  . GET                         makes an http(s) get request,
 *  . POST                        makes an http(s) post request,
 *  . DELETE                      makes an http(s) delete request,
 *  . logout                      disconnects from the server,
 *  . fetch                       fetches the server,
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


// -- Local Modules
const F = require('./_fetch');


// -- Local Constants


// -- Local Variables


// -- Private Methods ----------------------------------------------------------

/**
 * Makes an HTTP(s) DELETE request.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the access token,
 * @param {String}          the DELETE API,
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _DELETE(accessToken, api) {
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return F.fetch(api, options);
}

/**
 * Makes an HTTP(s) POST.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the access token,
 * @param {String}          the POST API,
 * @param {Object}          the data to send,
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _POST(accessToken, api, payload) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  return F.fetch(api, options);
}

/**
 * Makes an HTTP(s) GET.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the access token,
 * @param {String}          the GET API,
 * @returns {JSON/String}   returns the server response,
 * @since 0.0.0
 */
async function _GET(accessToken, api) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return F.fetch(api, options);
}

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

  return F.fetch(api, options);
}


// -- Public Static Methods ----------------------------------------------------

const TOKFETCH = {

  /**
   * Connects to the server.
   *
   * @method (arg1, arg2, arg3, [arg4])
   * @public
   * @param {String}        the url of the remote server,
   * @param {String}        the username,
   * @param {String}        the user password,
   * @param {String}        token connection through an external server?,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  login(url, usr, pwd, auth) {
    return _login(`${url}/api/v1/oauth2/token`, usr, pwd, auth);
  },

  /**
   * Makes an HTTP(s) GET.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the access token,
   * @param {String}        the GET API,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  GET(token, api) {
    return _GET(token, api);
  },

  /**
   * Makes an HTTP(s) POST.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {String}        the access token,
   * @param {String}        the POST API,
   * @param {Object}        the data to send,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  POST(token, api, payload) {
    return _POST(token, api, payload);
  },

  /**
   * Makes an HTTP(s) DELETE.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the DELETE API,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  DELETE(token, api) {
    return _DELETE(token, api);
  },

  /**
   * Disconnects from the server.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the url of the remote server,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  logout(token, url) {
    return _GET(token, `${url}/api/v1/oauth2/revoke`);
  },

  /**
   * Fetches the server.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the server URL,
   * @param {Object}        the fetch parameters,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  fetch(url, options) {
    return F.fetch(url, options);
  },
};


// -- Export
module.exports = TOKFETCH;
