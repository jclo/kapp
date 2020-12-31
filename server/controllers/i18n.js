/** ****************************************************************************
 *
 * Processes the i18n APIs.
 *
 * i18n.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Methods:
 *  . getDictionaryList           returns the list of the available dictionaries,
 *  . getDictionary               returns the requested dictionary,
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
  global-require: 0, import/no-dynamic-require: 0 */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------

const I18N = {

  /**
   * Returns the list of the available dictionaries.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @param {}              -,
   * @returns {Object}      returns the list of available dictionaries,
   * @since 0.0.0
   */
  getDictionaryList(i18n) {
    return i18n.getList();
  },

  /**
   * Returns the requested dictionary.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        express.js request,
   * @param {Object}        express.js response,
   * @returns {Object}      returns the requested dictionary or empty,
   * @since 0.0.0
   */
  load(i18n, req /* , res */) {
    const dic = i18n.load(req.params.lang);
    return dic || { message: 'This translation dictionary is not available yet!' };
  },
};


// -- Export
module.exports = I18N;
