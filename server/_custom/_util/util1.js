/** ****************************************************************************
 *
 * Defines utility functions..
 *
 * util1.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _extend                     returns the merged objects,
 *
 *
 * Public Static Methods:
 *  . extend                      returns the merged objects,
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
 * Extends literal objects from left to right.
 * (first level only - this is intended to overwrite methods)
 *
 * @function (...args)
 * @private
 * @param {Objects}         a set of methods,
 * @returns {Object}        returns an object of methods,
 * @since 0.0.0
 */
/* eslint-disable no-restricted-syntax, guard-for-in */
function _extend(...args) {
  const obj = {};
  let source
    , prop
    ;

  for (let i = 0; i < args.length; i++) {
    source = args[i];
    for (prop in source) {
      obj[prop] = source[prop];
    }
  }
  return obj;
}
/* eslint-enable no-restricted-syntax, guard-for-in */


// -- Public Static Methods ----------------------------------------------------

const Util = {

  /**
   * Returns the merged objects.
   *
   * @method (...args)
   * @public
   * @param {Object}        a set of objects to merge,
   * @return {Object}       returns the resulting object,
   * @since 0.0.0
   */
  extend(...args) {
    return _extend(...args);
  },
};


// -- Export
module.exports = Util;
