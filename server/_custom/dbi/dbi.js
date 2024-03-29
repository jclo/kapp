/** ****************************************************************************
 *
 * Overwrites the methods of './server/dbi/dbi.js'.
 *
 * dbi.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none
 *
 *
 * Public Static Methods:
 *  . zzz                         ...,
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
const v1 = require('./api/v1/main')
    , U  = require('../_util/util1')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------
// none,


// -- Export
module.exports = U.extend(
  v1,
);
