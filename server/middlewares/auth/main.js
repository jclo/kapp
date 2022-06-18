/** ****************************************************************************
 *
 * Defines the middleware that processes authentication.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . MAuth                       returns the authentication middleware,
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
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../config')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('middlewares/auth/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------

/**
 * Returns the authentication middleware.
 *
 * @function (arg1, arg2)
 * @public
 * @param {Object}        the db object,
 * @param {Object}        the in-memory db object,
 * @return {Function}     returns the authentication middleware,
 * @since 0.0.0
 */
function MAuth(dbi, dbn) {
  return function(req, res, next) {
    // Check if the 'header' contains the property 'Authorization':
    const auth = req.header('Authorization')
      ? req.header('Authorization').split(' ')
      : [];


    // Token?
    if (auth.length > 0 && auth[0] === 'Bearer') {
      if (typeof auth[1] !== 'string') {
        res.statusMessage = 'Your token is missing!';
        res.status(401).send(res.statusMessage);
        log.warn(`The token ${auth[1]} is NOT valid!`);
        return;
      }

      // Ok. it's a token. We have now to check if it is a valid one:
      dbn.find({ 'token.access_token': auth[1] }).toArray((err, resp) => {
        if (resp.length === 0) {
          res.statusMessage = 'Your token is NOT valid!';
          res.status(401).send(res.statusMessage);
          log.warn(`The token ${auth[1]} is NOT valid!`);
          return;
        }

        if (resp[0].token.expires_at < Date.now()) {
          res.statusMessage = 'Your token is expired!';
          res.status(401).send(res.statusMessage);
          log.warn(`The token ${auth[1]} is expired!`);
          return;
        }

        if (resp[0].token.is_access_token_revoked) {
          res.statusMessage = 'Your token is revoked!';
          res.status(401).send(res.statusMessage);
          log.warn(`The token ${auth[1]} is revoked!`);
          return;
        }

        // It seems that this token is valid!
        next();
        log.trace(`The connection is accepted for the access token: ${auth[1]}.`);
      });
      return;
    }


    // Cookies?
    if (req.session.user_id) {
      // Ok. It's an open session with cookies. Record the time
      // and let's go on!
      dbn.updateOne(
        { _sessionID: req.sessionID },
        { $set: { _timestamp_latest_transaction: (new Date()).getTime() } },
      );
      next();
      log.trace(`The connection is accepted for the user: ${req.session.user_id}.`);
      return;
    }


    // It's a request without authentication. Say no!
    res.statusMessage = 'This request requires an user authentication!';
    res.status(401).send(res.statusMessage);
    log.warn('This request requires an user authentication!');
  };
}


// -- Export
module.exports = MAuth;
