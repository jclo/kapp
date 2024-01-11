/** ****************************************************************************
 *
 * Removes inactive users still logged-in.
 *
 * kill.js is an ExpressJS middleware. It returns a function.
 *
 * Private Functions:
 *  . _deleteSession              kills the sessions of inactive users,
 *  . _killOld                    removes inactive logged-in users,
 *
 *
 * Public:
 *  . RemoveInactiveUsers         removes inactive logged-in users,
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


// -- Local Constants
const TIME_BETWEEN_TWO_CHECKS = 1000 * 60 * 5 // 5 minutes
    , OUTDATED_SESSION        = (1000 * 60 * 60) + (1000 * 60 * 15) // 1h 15m 00s
    , OUTDATED_TOKEN          = (1000 * 60 * 60) + (1000 * 60 * 15) // 1h 15m 00s
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Kills the sessions of inactive users.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the session id,
 * @param {Object}          ExpressJS request object,
 * @returns {}              -,
 * @since 0.0.0
 */
function _deleteSession(sid, req) {
  req.sessionStore.get(sid, (e, session) => {
    if (session) {
      req.sessionStore.destroy(sid);
    }
  });
}

/**
 * Removes logged-in users who have been inactive for some time.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the in memory database that stores connected users,
 * @param {Object}          ExpressJS request object,
 * @param {Function}        ExpressJS next function,
 * @param {Array}           the list of connected users,
 * @returns {}              -,
 * @since 0.0.0
 */
function _killOld(dbn, req, next, docs) {
  let now;

  for (let i = 0; i < docs.length; i++) {
    if (docs[i]._timestamp_latest_transaction) {
      now = (new Date()).getTime();
      if ((now - docs[i]._timestamp_latest_transaction) > OUTDATED_SESSION) {
        _deleteSession(docs[i]._sessionID, req, docs[i].user_name);
        dbn.deleteOne({ _sessionID: docs[i]._sessionID });
      }
    } else if (docs[i]._timestamp_login) {
      now = (new Date()).getTime();
      if (now - docs[i]._timestamp_login > OUTDATED_SESSION) {
        _deleteSession(docs[i]._sessionID, req, docs[i].user_name);
        dbn.deleteOne({ _sessionID: docs[i]._sessionID });
      }
    } else if (docs[i].token) {
      if ((now - docs[i].token.expires_at) > OUTDATED_TOKEN) {
        dbn.deleteOne({ _id: docs[i]._id });
      }
    }
  }

  next();
}


// -- Public -------------------------------------------------------------------

/**
 * Removes inactive logged-in users.
 *
 * @function (arg1)
 * @public
 * @param {Object}          the in memory database that stores connected users,
 * @returns {Function}      returns the middleware,
 * @since 0.0.0
 */
function RemoveInactiveUsers(dbn) {
  let start = (new Date()).getTime();

  return function(req, res, next) {
    if ((new Date()).getTime() - start < TIME_BETWEEN_TWO_CHECKS) {
      next();
      return;
    }

    start = (new Date()).getTime();
    dbn.find({}).toArray((e, docs) => {
      _killOld(dbn, req, next, docs);
    });
  };
}


// -- Export
module.exports = RemoveInactiveUsers;
