/** ****************************************************************************
 *
 * Extends the methods of './server/dbi/mysql.js' with the project methods.
 *
 * main.js is just a literal object that contains a set of functions.
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
const miscellaneous = require('./private/miscellaneous')
    , U             = require('../../../_utils/util1')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------
// none,


// -- Export
module.exports = U.extend(
  miscellaneous,
);
