/** ****************************************************************************
 *
 * Creates a token or a password.
 *
 * main.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _get                        returns a string generated randomly,
 *
 *
 * Public Methods:
 *  . get                         returns a string generated randomly,
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
/* eslint semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns a token or a password generated randomly.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Number}          the length of the token or password,
 * @param {String}          the string to use for encoding,
 * @returns {String}        the generated token or password,
 * @since 0.0.0
 */
function _get(length, base) {
  const n = typeof length === 'number' && Number.isInteger(length) && length < 64
    ? length
    : 16
  ;

  let s;
  switch (base) {
    case 'base36':
      s = '0123456789abcdefghijklmnopqrstuvwxyz';
      break;

    case 'base62':
      s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz';
      break;

    case 'base62@#':
      s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz@#';
      break;

    default:
      s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz';
  }

  let id = '';
  for (let i = 0; i < n; i++) {
    id += s.charAt(Math.floor(Math.random() * (s.length - 0) + 0));
  }
  return id;
}


// -- Public Methods -----------------------------------------------------------

const TK = {

  /**
   * Returns a token or a password generated randomly.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Number}        the length of the token or password,
   * @param {String}        the string to use for encoding,
   * @returns {String}      the generated token or password,
   * @since 0.0.0
   */
  get(length, base) {
    return _get(length, base);
  },
};


// -- Export
module.exports = TK;
