/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none
 *
 *
 * Public Static Methods:
 *  . getMe                       returns the credentials of the connected user,
 *  . registerLogin               registers this new login,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, camelcase: 0 */


// -- Vendor Modules


// -- Local Modules
const use_1_get    = require('./private/use_1_get')
    , use_2_addup  = require('./private/use_2_addup')
    , use_3_del    = require('./private/use_3_del')
    , use_4_stats  = require('./private/use_4_stats')
    , use_5_emails = require('./private/use_5_emails')
    , use_7_save   = require('./private/use_7_save')
    , U            = require('../../../../_utils/util1')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------
// none,


// -- Export
module.exports = U.extend(
  use_1_get,
  use_2_addup,
  use_3_del,
  use_4_stats,
  use_5_emails,
  use_7_save,
);
