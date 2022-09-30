/** ****************************************************************************
 *
 * Extends the methods of './server/dbi/sqlite.js' with the project methods.
 *
 * users.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none
 *
 *
 * Public Static Methods:
 *  . userGetMe                       returns the credentials of the connected user,
 *  . adminUserRegisterLogin          registers this new login,
 *  . adminUserSavePreferences        saves the preferences of the connected user,
 *
 *  . adminUserGetOne                 returns the requested user,
 *  . adminUserGetMany                returns the requested list of users,
 *  . adminUserAddOrUpdateOne         adds or updates an user,
 *  . adminUserDeleteOne              deletes the specified user,
 *  . adminUserDeleteMany             deletes the specified users,
 *
 *  . adminUserEmailsAddOrUpdateOne   adds or updates an email for an existing user,
 *  . adminUserEmailsDeleteOne        deletes the specified email,
 *
 *  . adminUserCount                  counts the owned items,
 *  . isUsernameTaken                 returns if the username is taken,
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
const COMU = require('../../common/users/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Returns the credentials of the connected user.
   *
   * @method (arg1)
   * @public
   * @param {String}        the username of the admin user,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async userGetMe(username) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.getMe(this, cn, username, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Registers this new login.
   *
   * @method (arg1)
   * @public
   * @param {String}        the username of connected user,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserRegisterLogin(username) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.registerLogin(this, cn, username, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Saves the preferences of the connected user.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the parameter of the user to save,
   * @returns {Array}       returns an error or the id(s),
   * @since 0.0.0
   */
  async adminUserSavePreferences(cuser, params) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.savePreferences(this, cn, cuser, params, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Returns the credentials of the requested user.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserGetOne(user, query) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.getOne(this, cn, user, query, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Returns the requested list of users.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserGetMany(user, query) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.getMany(this, cn, user, query, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Adds or updates an user.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the parameter of the user to add or update,
   * @returns {Array}       returns an error or the id(s),
   * @since 0.0.0
   */
  async adminUserAddOrUpdateOne(cuser, user) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.addOrUpdateOne(this, cn, cuser, user, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Deletes an existing user.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the user to delete,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserDeleteOne(cuser, query) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.deleteOne(this, cn, cuser, query, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Deletes a set of users.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the session user,
   * @param {Object}        the users to delete,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserDeleteMany(user, query) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.deleteMany(this, cn, user, query, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Adds an new email to an existing user.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the user's id and email parameters,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserEmailsAddOrUpdateOne(cuser, params) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.emailAddOrUpdateOne(this, cn, cuser, params, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Deletes an existing email.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserEmailsDeleteOne(cuser, query) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.emailDeleteOne(this, cn, cuser, query, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Counts the owned items.
   *
   * @method (arg1, [arg2])
   * @public
   * @param {String}        the session user,
   * @param {Object}        the query,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminUserCount(user, query) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.count(this, cn, user, query, true);
    await this._lib.close(cn);
    return res;
  },

  /**
   * Checks if the passed-in username is already taken.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the connected user,
   * @param {String}        the username to check,
   * @returns {Array}       returns an error or the response,
   * @since 0.0.0
   */
  async adminIsUsernameTaken(cuser, username) {
    const cn = await this._lib.open(this._db);
    const res = await COMU.isUsernameAlreadyTaken(this, cn, cuser, username, true);
    await this._lib.close(cn);
    return res;
  },
};


// -- Export
module.exports = methods;
