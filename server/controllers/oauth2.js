/** ****************************************************************************
 *
 * Processes the Token Authentication APIs.
 *
 * oauth2.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _auth                       extracts from the header the user credentials,
 *
 *
 * Public Static Methods:
 *  . get                         returns a new token or renew it,
 *  . revoke                      revokes the current access token,
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
const Token = require('./private/oauthtokens')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Extracts from the header the user credentials if any.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the express.js app,
 * @returns {Object}        returns the user credentials or null,
 * @since 0.0.0
 */
function _auth(req) {
  if (req.headers.authorization) {
    const s = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
    return { name: s[0], pwd: s[1] };
  }
  return null;
}


// -- Public Static Methods ----------------------------------------------------

const OAuth = {

  /**
   * Returns an access token or newew it.
   * (api 'api/v1/oauth/token').
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}          the db object,
   * @param {Object}          the in-memory db object,
   * @param {Object}          express.js request,
   * @param {Object}          express.js response,
   * @param {Function}        the function to call at the completion
   * @return {}               -,
   * @since 0.0.0
   */
  get(dbi, dbn, req, res, callback) {
    // Two hypothesis:
    //  1. it could be a request to ask for a token,
    //  2. or it could be a request to ask for a refresh token.

    // First, we retrieve the payload carried in the header to discover
    // what is the request:
    const user = _auth(req);
    const refreshToken = req.header('refresh_token');


    // First we have to check if the user is defined:
    if (!user) {
      callback('The user credentials are missing!');
      return;
    }

    // is grant_type client_credentials?
    if (req.body.grant_type === 'client_credentials') {
      // The client request for a token. So, we have now to check if this
      // client is authorized to obtain that token.
      Token.get(dbi, dbn, user.name, user.pwd, (err, token) => {
        if (err) {
          callback(err);
        } else {
          // We return only a subset of the generated token to the client:
          const clientToken = {
            scope: token.scope,
            token_type: token.token_type,
            access_token: token.access_token,
            expires_in: token.expires_in / 1000,
            expires_at: new Date(token.expires_at),
            refresh_token: token.refresh_token,
            refresh_expires_at: new Date(token.refresh_expires_at),
          };
          callback(null, clientToken);
        }
      });
      return;
    }


    // is grant_type refresh_token?
    if (req.body.grant_type === 'refresh_token') {
      // The client ask for a token renew:
      Token.refresh(dbi, dbn, user.name, user.pwd, refreshToken, (err, token) => {
        if (err) {
          callback(err);
        } else {
          callback(null, token);
        }
      });
      return;
    }


    // Anomalies
    if (req.body.grant_type) {
      callback(`The Grant Type '${req.body.grant_type}' is not supported!`);
      return;
    }

    // Missing Grant Type:
    callback('The Grant Type is not specified!');
  },

  /**
   * Revokes the current access token.
   * (api 'api/v1/oauth/revoke')
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}          the db object,
   * @param {Object}          the in-memory db object,
   * @param {Object}          express.js request,
   * @param {Object}          express.js response,
   * @param {Function}        the function to call at the completion
   * @return {}               -,
   * @since 0.0.0
   */
  async revoke(dbi, dbn, req, res, callback) {
    // Gets the access token:
    // (if we are here it means that the access token has been recognized
    // by the authentication middleware. So, the right access token is
    // available inside the header)
    const auth = req.header('Authorization').split(' ');
    await dbn.updateOne({ 'token.access_token': auth[1] }, { $set: { token: { is_access_token_revoked: true } } });
    callback(null, `Your access token ${auth[1]} has been revoked!`);
  },
};


// -- Export
module.exports = OAuth;
