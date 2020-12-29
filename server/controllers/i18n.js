/** ****************************************************************************
 *
 * Processes the i18n APIs.
 *
 * i18n.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _get                        loads the requested dictionary or an empty one,
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
const list   = require('../libs/i18n/app/i18n.lang')
    ;


// -- Local Constants
const PATH = '../libs/i18n/app'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Loads the requested dictionary or an empty one.
 *
 * @method (arg1)
 * @public
 * @param {String}          the requested dictionary,
 * @returns {Object}        the avaiable dictionary or an empty one,
 * @since 0.0.0
 */
function _get(lang) {
  let dic;
  try {
    dic = require(`${PATH}/i18n.${lang}`);
  } catch (e) {
    dic = { message: 'This translation dictionary is not available yet!' };
  }
  return dic;
}


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
  getDictionaryList() {
    return list;
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
  getDictionary(req /* , res */) {
    return _get(req.params.lang);
  },
};


// -- Export
module.exports = I18N;
