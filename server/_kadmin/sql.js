/** ****************************************************************************
 *
 * Extends the methods of './server/dbi/sqlite.js' with the project methods.
 *
 * dbi.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none
 *
 *
 * Public Static Methods:
 *  . none,
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
const adminSQLite = require('./admin/dbi/sqlite/main')
    , adminMySQL  = require('./admin/dbi/mysql/main')
    , U           = require('./_utils/util1')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------
// none,


// -- Export
module.exports = {
  sqlite: U.extend(
    adminSQLite,
  ),

  mysql: U.extend(
    adminMySQL,
  ),
};
