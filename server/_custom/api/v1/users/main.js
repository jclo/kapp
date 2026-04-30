/** ****************************************************************************
 *
 * Listens for the users APIs.
 *
 * users.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . Users                      starts listening for the calls,
 *
 *
 * GET Api(s):
 *  . /api/v1/users               returns the associated queries,
 *  . /api/v1/users/:id/:name     returns the associated variables,
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


// -- Local Modules
import CreateLogger from '../../../../libs/logger/main.js';
import MAuth from '../../../../middlewares/auth/main.js';


// -- Local Constants
const log = CreateLogger(import.meta.url);


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Starts listening for the users APIs.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @public
 * @param {Object}          the express.js router for the api,
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the db for storing doc in memory,
 * @returns {}              -,
 * @since 0.0.0
 */

function Users(apiRouter, app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);

  // GET
  // This GET api includes queries. It returns them.
  apiRouter.get('/v1/users', auth, (req, res) => {
    res.status(200).send({ status: 200, url: req.originalUrl, message: { query: req.query } });
    log.trace('Accepted GET api: "api/v1/users/".');
    log.trace(`Got the query: ${JSON.stringify(req.query)}.`);
  });

  // This GET api includes variables. They are returned in an object.
  apiRouter.get('/v1/users/:id/:name/:other', auth, (req, res) => {
    res.status(200).send({
      status: 200,
      url: req.originalUrl,
      message: { variables: req.params },
    });
    log.trace('Accepted GET api: "api/v1/users/:id/:name/other".');
    log.trace(`Got the variables: ${JSON.stringify(req.params)}.`);
  });
}


// -- Export
export default Users;
