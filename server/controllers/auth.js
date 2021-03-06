/** ****************************************************************************
 *
 * Processes login, logout apis.
 *
 * auth.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . login                       processes the api 'api/v1/auth/login',
 *  . logout                      processes the api 'api/v1/auth/logout',
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
const Crypto = require('../libs/crypto/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const Auth = {

  /**
   * Processes the api 'api/v1/auth/login'.
   *
   * @function (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the in-memory db object,
   * @param {Object}        express.js request object,
   * @param {Function}      the function to call at the completion,
   * @return {}             -,
   * @since 0.0.0
   */
  async login(dbi, dbn, req, callback) {
    const [, user] = await dbi.userGetMe(req.body.user);
    if (!user) {
      callback('You are NOT a referenced user!');
      return;
    }

    const match = await Crypto.compare(req.body.password, user.user_hash);
    if (!match) {
      callback('You provided a wrong password!');
      return;
    }

    if (user.is_deleted === 1) {
      callback('Your account is deleted!');
      return;
    }

    if (user.is_locked) {
      callback('Your account is locked!');
      return;
    }

    // Ok. Register this new session:
    req.session.user_id = req.body.user;
    const [suser] = await dbn.find({ user_name: req.body.user }).toArray();
    if (suser) await dbn.deleteOne({ user_name: req.body.user });
    await dbn.insertOne(user);
    callback(null);
  },

  /**
   * Processes the api 'api/v1/auth/logout'.
   *
   * @function (arg1, arg2)
   * @public
   * @param {Object}        the in-memory db object,
   * @param {Object}        express.js request object,
   * @return {}             -,
   * @since 0.0.0
   */
  async logout(dbn, req, callback) {
    await dbn.deleteOne({ user_name: req.session.user_id });
    delete req.session.user_id;
    callback(null);
  },
};


// -- Export
module.exports = Auth;
