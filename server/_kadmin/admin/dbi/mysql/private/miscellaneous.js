/** ****************************************************************************
 *
 * Extends the methods of './server/dbi/mysql.js' with the project methods.
 *
 * miscellaneous.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . getCount                    returns the number of rows in a table,
 *  . init                        initializes the database,
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
const COMM = require('../../common/miscellaneous/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Initializes the database.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {}            -,
   * @since 0.0.0
   */
  async init() {
    const cn = await this._lib.getConnection();
    const res = await COMM.init(this, cn, false);
    await this._lib.release(cn);
    return res;
  },
};


// -- Export
module.exports = methods;
