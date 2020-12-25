/** ****************************************************************************
 *
 * Listens for the i18n APIs.
 *
 *
 * Private Methods:
 *  . _auth                       authenticates the sender,
 *
 *
 * Public Methods:
 *  . I18N                        starts listening for the calls,
 *
 *
 *
 * @exports   Api
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0,
  global-require: 0, import/no-dynamic-require: 0 */


// -- Vendor Modules
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../config')
    , Auth   = require('../auth/main')
    , list   = require('../libs/i18n/app/i18n.lang')
    ;


// -- Local Constants
const PATH      = '../libs/i18n/app'
    , { level } = config
    , auth      = Auth.isSession
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Loads the requested dictionary or an empty one.
 *
 * @method (arg1)
 * @public
 * @param {String}        the requested dictionary,
 * @returns {Object}      the avaiable dictionary or an empty one,
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


// -- Public -------------------------------------------------------------------

/**
 * Starts listening for the system APIs.
 *
 * @method (arg1, arg2, arg3)
 * @public
 * @param {Object}        the express.js app,
 * @param {Object}        the message translator,
 * @param {Object}        the db interface object,
 * @returns {}            -,
 * @since 0.0.0
 */
const I18N = function(app /* , i18n, dbi */) {
  const log = KZlog('api/i18n.js', level, false);

  // GET
  app.get('/api/v1/i18n/list', auth, (req, res) => {
    res.status(200).send({ status: 200, message: list });
    log.trace('Accepted GET api: "/api/v1/i18n/list".');
  });

  app.get('/api/v1/i18n/:lang', auth, (req, res) => {
    res.status(200).send({ status: 200, message: _get(req.params.lang) });
    log.trace('Accepted GET api: "/api/v1/i18n/:lang".');
  });
};


// -- Export
module.exports = I18N;
