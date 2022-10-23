/** ****************************************************************************
 *
 * Processes users apis.
 *
 * users.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . getMe                       returns the credentials of the connected user,
 *  . getOnline                   returns the list of connected users,
 *  . savePreferencesOnlineUser   saves the preferences of the connected user,
 *  . getOne                      returns the requested user,
 *  . getMany                     returns the requested users,
 *  . addOrUpdateOne              adds or updates the requested user,
 *  . deleteOne                   deletes the requested user,
 *  . deleteMany                  deletes the requested users,
 *  . addOrUpdateEmailsOne        adds or updates the requested user email,
 *  . deleteEmailsOne             deletes the requested user email,
 *  . count                       counts the number of users,
 *  . isUsernameTaken             returns if the username is taken,
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
const U = require('../private/util')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------

const CUsers = {

  /**
   * Returns the credentials of the connected user.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async getMe(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    if (!username) {
      callback(null, {});
      return this;
    }

    const [err, resp] = await dbi.userGetMe(username);
    if (!err) {
      // Suppress some stuff we don't want to send outside:
      delete resp.user_hash;
      delete resp._arrayphoto;
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Returns the list of connected users.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Object}        req.params or req.query,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async getOnline(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    if (!username) {
      callback(null, {});
      return this;
    }

    // Only admin can perform this request!
    const [me] = await dbn.find({ user_name: username }).toArray();
    if (!me || me.is_admin === 0) {
      callback(null, {});
      return this;
    }

    // Extract the list of connected users from 'dbn':
    const res = await dbn.find({}, {
      _sessionID: 1,
      user_name: 1,
      avatar_id: 1,
      _arrayphoto: 1,
      first_name: 1,
      last_name: 1,
      title: 1,
      phone_work_office: 1,
      phone_work_mobile: 1,
      primary_address_city: 1,
      primary_address_country: 1,
      primary_email: 1,
      name: 1,
      full_name: 1,
      assigned_to_user_name: 1,
      auth: 1,
      _date_connection: 1,
    }).toArray();

    // Replace id by session id:
    // (enable to see multiplelogin with the same credentials)
    for (let i = 0; i < res.length; i++) {
      res[i].id = res[i]._sessionID;
    }

    callback(null, res);
    return this;
  },

  /**
   * Saves the preferences of the connected user.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async savePreferencesOnlineUser(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserSavePreferences(user, req.body);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Returns the credentials of the requested user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Object}        req.params or req.query,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async getOne(dbi, dbn, req, porq, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserGetOne(user, porq);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Returns the requested list of users.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async getMany(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserGetMany(user, req.query);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Adds or updates the requested user.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async addOrUpdateOne(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserAddOrUpdateOne(user, req.body);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Deletes the requested user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Object}        express req.params or req.query,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async deleteOne(dbi, dbn, req, porq, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserDeleteOne(user, porq);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Deletes the requested users.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Object}        express req.params or req.query,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async deleteMany(dbi, dbn, req, porq, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserDeleteMany(user, porq);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Adds or updates the requested user email.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async addOrUpdateEmailsOne(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserEmailsAddOrUpdateOne(user, req.body);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Deletes the requested user email.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Object}        express req.params or req.query,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async deleteEmailsOne(dbi, dbn, req, porq, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = Object.keys(req.body).length > 0
      ? await dbi.adminUserEmailsDeleteOne(user, req.body)
      : await dbi.adminUserEmailsDeleteOne(user, porq);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Counts the owned users.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async count(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminUserCount(user, req.query);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },

  /**
   * Returns if the username is already taken.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the database object,
   * @param {Object}        the in-memory database object,
   * @param {Object}        express request object,
   * @param {Function}      the function to call at the completion,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  async isUsernameTaken(dbi, dbn, req, callback) {
    const username = await U.whoami(dbn, req);
    const [user] = await dbn.find({ user_name: username }).toArray();
    const [err, resp] = await dbi.adminIsUsernameTaken(user, req.query.user_name);
    if (!err) {
      callback(null, resp);
    } else {
      callback(err);
    }
    return this;
  },
};


// -- Export
module.exports = CUsers;
