/** ****************************************************************************
 *
 * Manages HTTP(s) requests through fetch native NodeJS function.
 *
 * fetch.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _fetch                      makes an HTTP(s) request,
 *
 *
 * Public Static Methods:
 *  . fetch                       makes an HTTP(s) request,
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


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Makes an HTTP(s) request.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the api,
 * @param {Object}          the fetch optional parameters,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _fetch(api, options) {
  const promise = new Promise((resolve, reject) => {
    fetch(api, options)
      .then((response) => response.text())
      .then((data) => { resolve(data); })
      .catch((error) => { reject(error); })
    ;
  });

  return promise
    .then((res) => {
      let data;
      try {
        data = JSON.parse(res);
      } catch (e) {
        data = res;
      }
      return [null, data];
    })
    .catch((err) => [err])
  ;
}


// -- Public Methods -----------------------------------------------------------

const FETCH = {

  /**
   * Fetches the passed-in url.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the url to fetch,
   * @param {Object}        the fetch parameters,
   * @return {Array}        returns the requested data or an error,
   * @since 0.0.0
   */
  fetch(url, options) {
    return _fetch(url, options);
  },
};


// -- Export
module.exports = FETCH;
