/** ****************************************************************************
 *
 * Listens for the Authentification APIs.
 *
 * connect.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . Connect                     starts listening for login and logout apis,
 *
 *
 * GET Api(s):
 *  . /api/v1/auth/logout         logout,
 *
 *
 * POST Api(s):
 *  . /api/v1/auth/login          login,
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
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules


// -- Local Modules
const Auth = require('../auth/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Public -------------------------------------------------------------------

/**
 * starts listening for login and logout APIs.
 *
 * @method (arg1, arg2, arg3)
 * @public
 * @param {Object}        the express.js app,
 * @param {Object}        the message translator,
 * @param {Object}        the db interface object,
 * @returns {}            -,
 * @since 0.0.0
 */
const Connect = function(app, i18n, dbi) {
  // GET
  app.get('/api/v1/auth/logout', (req, res, next) => {
    Auth.logout(req, res, next);
  });


  // POST
  app.post('/api/v1/auth/login', (req, res, next) => {
    Auth.login(dbi, req, res, next);
  });
};


// -- Export
module.exports = Connect;
