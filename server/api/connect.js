/** ****************************************************************************
 *
 * Listens for the Authentification APIs.
 *
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Methods:
 *  . Connect                     starts listening for login and logout apis,
 *
 *
 *
 * @exports   Connect
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0 */


// -- Node Modules


// -- Project Modules
const Auth = require('../auth/main')
    ;


// -- Local constants


// Local variables


// -- Public -------------------------------------------------------------------

/**
 * starts listening for login and logout APIs.
 *
 * @method (arg1)
 * @public
 * @param {Object}        the express.js app,
 * @returns {}            -,
 * @since 0.0.0
*/
const Connect = function(app) {
  app.post('/api/v1/auth/login', (req, res, next) => {
    Auth.login(req, res, next);
  });

  app.get('/api/v1/auth/logout', (req, res, next) => {
    Auth.logout(req, res, next);
  });
};


// -- Export
module.exports = Connect;
