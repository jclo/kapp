/** ****************************************************************************
 *
 * Extends the methods of './server/dbi/dbi.js' with the project methods.
 *
 * miscellaneous.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . zzz                         does ...,
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


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Does ...
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Object}      returns the response,
   * @since 0.0.0
   */
  async zzz() {
    const cn = await this._lib.getConnection();
    const res = 'await COMM.zzz(this, cn)';
    await this._lib.release(cn);
    return res;
  },
};


// -- Export
module.exports = methods;
