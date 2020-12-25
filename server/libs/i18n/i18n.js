/** ****************************************************************************
 *
 * Translates messages.
 *
 * i18n.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _getDictionary              returns the requested dictionary,
 *
 *
 * Constructor:
 *  . I18N                        creates the translation object,
 *
 *
 * Public Methods:
 *  .load                         returns the requested dictionary,
 *  . s                           returns the translated passed-in message,
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
/* eslint no-underscore-dangle: 0 */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables
let methods;


// -- Private Functions --------------------------------------------------------

/**
 * Returns the requested dictionary.
 *
 * @function (arg1, [arg2])
 * @private
 * @param {String}          the dictionary name,
 * @param {String}          which dictionary for the server or for the web app?,
 * @returns {Object}        returns the requested dictionary,
 * @since 0.0.0
 */
function _getDictionary(lang, which) {
  if (typeof lang !== 'string') return null;

  const folder = which === 'app' ? which : 'server';
  try {
    /* eslint-disable-next-line global-require, import/no-dynamic-require */
    return require(`./${folder}/i18n.${lang}.js`);
  } catch (e) {
    return null;
  }
}


// -- Public -------------------------------------------------------------------

/**
 * Returns the I18N object.
 * (Prototypal Instantiation Pattern)
 *
 * @constructor ()
 * @public
 * @param {}                -,
 * @returns {Object}        returns the i18n object,
 * @since 0.0.0
 */
const i18N = function(lang) {
  const obj = Object.create(methods);
  obj.dic = _getDictionary(lang);
  return obj;
};


// -- Public Methods -----------------------------------------------------------

methods = {

  /**
   * Returns the requested dictionary or null.
   *
   * @method (arg1)
   * @public
   * @param {String}        the dictionary name,
   * @returns {Object}      returns the requested dictionary,
   * @since 0.0.0
   */
  load(lang) {
    return _getDictionary(lang, 'app');
  },

  /**
   * Returns the translated message.
   *
   * Nota:
   * The message to translate could be a simple string or the string with
   * jokers. For example if you loaded the french dictionary:
   *
   *  . i18n.s('Hello') returns 'Bonjour',
   *  . i18n.s('Hello %s and %s', 1, 123) returns 'Bonjour 1 et 123',
   *
   * If the translation does not exist, it returns the original message.
   *
   * @method (arg1, [arg2])
   * @public
   * @param {String}        the message to translate,
   * @param {String/Number} the variables in the message,
   * @returns {String}      returns the translated message or the original,
   * @since 0.0.0
   */
  s(msg, ...args) {
    let s = this.dic && this.dic[msg] ? this.dic[msg] : msg;
    for (let i = 0; i < args.length; i++) {
      s = s.replace('%s', args[i]);
    }
    return s;
  },
};


// -- Export
module.exports = i18N;
