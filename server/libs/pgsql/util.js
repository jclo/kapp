/** ****************************************************************************
 *
 * Utilities for the PostgreSQL database.
 *
 * util.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _convertTypes         converts MySQL types to PgSQL,
 *
 *
 * Public Static Methods:
 *  . converTypes           converts MySQL types to PgSQL,
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

/**
 * Converts MySQL types to PgSQL.
 *
 * @function (arg1)
 * @private
 * @param {String}          the SQL command for creating a table,
 * @returns {Array}         returns the SQL command with PgSQL types,
 * @since 0.0.0
 */
function _convertTypes(sql) {
  const nsql = sql
    .replace(/INTEGER\s+NOT NULL PRIMARY KEY AUTO_INCREMENT/, 'SERIAL PRIMARY KEY')
    .replace(/BLOB\(65535\)/g, 'BYTEA')
    .replace(/DATETIME/g, 'TIMESTAMP')
    .replace(/TINYINT\(1\)/g, 'SMALLINT')
    .replace(/FLOAT\(0\)/g, 'FLOAT(1)')
    .replace(/TEXT\(65535\)/g, 'TEXT')
  ;

  return nsql;
}


// -- Public Static Methods ----------------------------------------------------

const PGSQL = {

  /**
   * Converts MySQL types to PgSQL.
   *
   * @method (arg1)
   * @public
   * @param {String}        the SQL command for creating a table,
   * @returns {String}      returns the SQL command with PgSQL types,
   * @since 0.0.0
   */
  convertTypes(sql) {
    return _convertTypes(sql);
  },
};


// -- Export
module.exports = PGSQL;
