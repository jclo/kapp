/** ****************************************************************************
 *
 * Listens for the i18n APIs.
 *
 * i18n.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . I18N                        starts listening for the calls,
 *
 *
 * GET Api(s):
 *  . /api/v1/i18n/list           returns the list of the available dictionaries,
 *  . /api/v1/i18n/:lang          returns the requested dictionary or empty,
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
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../config')
    , CI18N  = require('../controllers/i18n')
    , MAuth = require('../middlewares/auth/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('api/i18n.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Starts listening for the system APIs.
 *
 * @method (arg1, arg2, arg3)
 * @public
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @returns {}              -,
 * @since 0.0.0
 */
const I18N = function(app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);


  // GET
  app.get('/api/v1/i18n/list', auth, (req, res) => {
    const list = CI18N.getDictionaryList(i18n);
    res.status(200).send(list);
    log.trace('Accepted GET api: "/api/v1/i18n/list".');
  });

  app.get('/api/v1/i18n/:lang', auth, (req, res) => {
    const dico = CI18N.load(i18n, req, res);
    res.status(200).send(dico);
    log.trace('Accepted GET api: "/api/v1/i18n/:lang".');
  });
};


// -- Export
module.exports = I18N;
