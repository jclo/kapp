/** ****************************************************************************
 *
 * Listens for the messages sent by the client web App.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Methods:
 *  . none,
 *
 *
 * Public Function:
 *  . CAPIs                       starts listening requests from the client app,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-console: 0 */


// -- Vendor Modules


// -- Local Modules
const Users = require('./users')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Function ----------------------------------------------------------

/**
 * Starts listening for the project APIs.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @public
 * @param {Object}          express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @param {Object}          the in-memory db object,
 * @returns {}              -,
 * @since 0.0.0
 */
function CAPIs(app, i18n, dbi, dbn) {
  Users(app, i18n, dbi, dbn);
  // ...
}


// -- Export
module.exports = CAPIs;
