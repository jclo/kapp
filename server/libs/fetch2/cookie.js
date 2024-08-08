/** ****************************************************************************
 *
 * The library for connecting to a server using cookies
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
 * @param {String}          the connection cookie,
 * @param {String}          the DELETE API,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _DELETE(cookie, api) {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie,
    },
  };

  return F.fetch(api, options);
}

/**
 * Makes an HTTP(s) POST request.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the connection cookie,
 * @param {String}          the POST API,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _POST(cookie, api, payload) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie,
    },
    body: JSON.stringify(payload),
  };

  return F.fetch(api, options);
}

/**
 * Makes an HTTP(s) GET request.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the connection cookie,
 * @param {String}          the GET API,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _GET(cookie, api) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie,
    },
  };

  return F.fetch(api, options);
}

/**
 * Connects to the server.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the server URL,
 * @param {String}          the username to access vulcain,
 * @param {String}          the password to access vulcain,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _login(api, user, pwd) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie: '',
    },
    body: JSON.stringify({ user, password: pwd }),
  };

  let cookie;
  const p = new Promise((resolve, reject) => {
    fetch(api, options)
      .then((response) => {
        [cookie] = response.headers.getSetCookie();
        return response.text();
      })
      .then((data) => { resolve(data); })
      .catch((error) => { reject(error); })
    ;
  });

  return p
    .then((data) => {
      let res;
      try { res = JSON.parse(data); } catch (e) { res = data; }
      return [null, { cookie, message: res }];
    })
    .catch((err) => [err]);
}


// -- Public Methods -----------------------------------------------------------

const COOKFETCH = {

  /**
   * Connects to the server.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {String}        the server URL,
   * @param {String}        the username to access vulcain,
   * @param {String}        the password to access vulcain,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  login(url, usr, pwd) {
    return _login(`${url}/api/v1/auth/login`, usr, pwd);
  },

  /**
   * Makes an HTTP(s) GET request.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the GET API,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  GET(cookie, api) {
    return _GET(cookie, api);
  },

  /**
   * Makes an HTTP(s) POST request.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the POST API,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  POST(cookie, api, payload) {
    return _POST(cookie, api, payload);
  },

  /**
   * Makes an HTTP(s) DELETE request.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the DELETE API,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  DELETE(cookie, api) {
    return _DELETE(cookie, api);
  },

  /**
   * Disconnects from the server.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the connection cookie,
   * @param {String}        the server URL,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  logout(cookie, url) {
    return _GET(cookie, `${url}/api/v1/auth/logout`);
  },

  /**
   * Fetches the server.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the server URL,
   * @param {Object}        the fetch parameters,
   * @returns {Array}       returns the reponse or an error,
   * @since 0.0.0
   */
  fetch(url, options) {
    return F.fetch(url, options);
  },
};


// -- Export
module.exports = COOKFETCH;
