/** ****************************************************************************
 *
 * Manages the Oauth tokens.
 *
 * oauthtokens.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . get                         returns a new token for the passed-in user,
 *  . refresh                     returns a new token from the refresh token,
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
const Crypto = require('../../libs/crypto/main')
    , Token  = require('../../libs/token/main')
    , config = require('../../config')
    , Auth0  = require('./authserver')
    ;


// -- Local Constants
const TK = config.token
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const TOK = {

  /**
   * Returns a new token for the passed-in user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the db that store token in-memory,
   * @param {String}        the username of the user,
   * @param {String}        the password of the user,
   * @param {Function}      the function to call at the completion,
   * @return {}             -,
   * @since 0.0.0
   */
  async get(dbi, dbn, username, pwd, auth, callback) {
    const [err, user] = !auth
      ? await dbi.userGetMe(username)
      : await Auth0.getMe(username, auth, pwd)
      ;

    if (err) {
      callback(err);
      return;
    }

    if (!user) {
      callback(`The username "${username}" is unknown!`);
      return;
    }

    const match = await Crypto.compare(pwd, user.user_hash);
    if (!match) {
      callback('You provided a wrong password!');
      return;
    }

    if (user.is_deleted === 1) {
      callback('Your account is deleted!');
      return;
    }

    if (user.is_locked === 1) {
      callback('Your account is locked!');
      return;
    }

    // Everything is ok. We can provide a token:
    const newtoken = {
      scope: '',
      token_type: 'Bearer',
      access_token: Token.get(TK.length, TK.base),
      expires_in: TK.lifetime * 1000,
      expires_at: Date.now() + TK.lifetime * 1000,
      is_access_token_revoked: false,
      refresh_token: Token.get(TK.length, TK.base),
      refresh_expires_at: Date.now() + TK.refreshTokenLifetime * 1000,
    };

    // We store this new token into the in-memory database:
    user.token = newtoken;
    // const [suser] = await dbn.find({ user_name: username }).toArray();
    // if (suser) await dbn.deleteOne({ user_name: username });
    await dbn.insertOne(user);

    callback(null, newtoken);
  },

  /**
   * Returns a new token from the refresh token.
   *
   * @method (arg1, arg2, arg3, arg4, arg5, arg6)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the db that store token in-memory,
   * @param {String}        the username of the user,
   * @param {String}        the password of the user,
   * @param {String}        the refresh token,
   * @param {Function}      the function to call at the completion,
   * @return {}             -,
   * @since 0.0.0
   */
  async refresh(dbi, dbn, username, pwd, refreshToken, callback) {
    const [, user] = await dbi.userGetMe(username);
    if (!user) {
      callback(`The username "${username}" is unknown!`);
      return;
    }

    const match = await Crypto.compare(pwd, user.user_hash);
    if (!match) {
      callback('You provided a wrong password!');
      return;
    }

    if (user.is_deleted === 1) {
      callback('Your account is locked!');
      return;
    }

    if (user.is_locked === 1) {
      callback('Your account is locked!');
      return;
    }

    // Does the refresh token belongs to 'username' and still valid?
    let [suser] = await dbn.find({ user_name: username }).toArray();
    if (refreshToken !== suser.token.refresh_token) {
      callback('You are NOT the owner of this refresh token!');
      return;
    }

    if (Date.now() > suser.token.refresh_expires_at) {
      callback('Your refresh token has expired. You must reconnect!');
      return;
    }

    // Update the token:
    let { token } = suser;
    token.access_token = Token.get(TK.length, TK.base);
    token.expires_in = TK.lifetime * 1000;
    token.expires_at = Date.now() + TK.lifetime * 1000;
    token.is_access_token_revoked = false;
    [suser] = await dbn.updateOne({ user_name: username }, { $set: { token } });

    // Send only the renewed token:
    token = suser.token;
    delete token.refresh_token;
    delete token.refresh_expires_at;
    callback(null, token);
  },
};


// -- Export
module.exports = TOK;
