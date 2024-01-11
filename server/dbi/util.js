/** ****************************************************************************
 *
 * Utilities for dbi.js
 *
 * util.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _convertTypes         converts MySQL types to PgSQL,
 *  . _getArgs              returns the decoded passed-in arguments,
 *
 *
 * Public Static Methods:
 *  . getArgs               returns the decoded passed-in arguments,
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
 * Converts an sql query with db server dependant functions.
 *
 * @function (arg1, arg2)
 * @private
 * @param {SQLString}     the sql,
 * @param {String}        the dbserver (sqlite, mysql, pgsql),
 * @returns {String}      returns the converted sql,
 * @since 0.0.0
 */
function _convert(sqlin, dbserver) {
  let sql = sqlin
    , var1
    ;

  switch (dbserver) {
    case 'sqlite':
      break;

    case 'mysql':
      break;

    case 'pgsql':
      // COUNT returns a bigint that is converted to a string.
      // This operation casts the returned value to an integer.
      sql = sql.replace(/COUNT\(id\)/g, 'COUNT(id)::int');

      // This replace a query having one "IFNULL(..., ...) AS ..."
      var1 = sql.match(/IFNULL\((.*,.*)\)\s+AS/);
      sql = var1
        ? sql.replace(/IFNULL\((.*,.*)\)\s+AS/, `COALESCE(${var1[1]}) AS`)
        : sql
      ;

      // This replace a query having multiple "(SELECT IFNULL((SELECT ...), ...))"
      if (sql.match(/\(SELECT IFNULL\(\(SELECT/)) {
        sql = sql.replace(/\(SELECT IFNULL\(\(SELECT/g, '(SELECT COALESCE((SELECT');
      }

      // LIKE is case sensitive on PostgreSQL while ILIKE (not standard SQL)
      // is not.
      sql = sql.replace(/\sLIKE\s/g, ' ILIKE ');
      break;

    default:
      throw new Error(`server/dbi/util:_convert: the db server "${dbserver}" is unknown!`);
  }

  return sql;
}

/**
 * Returns the decoded passed-in arguments.
 *
 * @function ([arg1], [arg2], [arg3], [arg4])
 * @private
 * @param {Array}           the query values or null,
 * @param {Boolean}         if the sql query is database dependant,
 * @param {Boolean}         if the converted sql query must be printed,
 * @param {Function}        the function to call at the completion,
 * @returns {Array}         returns an array with the query, params, convert, dump and callback,
 * @since 0.0.0
 */
function _getArgs(...args) {
  let params  = []
    , convert = null
    , dump    = null
    , fn      = null
    ;

  for (let i = 0; i < args.length; i++) {
    if (Array.isArray(args[i])) {
      params = args[i];
    } else if (args[i] === true || args[i] === false || Object.prototype.toString.call(args[i]) === '[object Boolean]') {
      if (convert !== true && convert !== false) {
        convert = args[i];
      } else {
        dump = args[i];
      }
    } else if (Object.prototype.toString.call(args[i]) === '[object Function]') {
      fn = args[i];
    }
  }

  return [params, convert, dump, fn];
}


// -- Public Static Methods ----------------------------------------------------

const U = {

  /**
   * Returns the decoded passed-in arguments.
   *
   * @method ([arg1], [arg2], [arg3], [arg4])
   * @public
   * @param {Array}         the query values or null,
   * @param {Boolean}       if the sql query is database dependant,
   * @param {Boolean}       if the converted sql query must be printed,
   * @param {Function}      the function to call at the completion,
   * @returns {Array}       returns an array with the query, params, convert, dump and callback,
   * @since 0.0.0
   */
  getArgs(...args) {
    return _getArgs(...args);
  },

  /**
   * Converts an sql query with db server dependant functions.
   *
   * @method (arg1, arg2)
   * @public
   * @param {SQLString}     the sql,
   * @param {String}        the dbserver (sqlite, mysql, pgsql),
   * @returns {String}      returns the converted sql,
   * @since 0.0.0
   */
  convert(sql, dbserver) {
    return _convert(sql, dbserver);
  },
};


// -- Export
module.exports = U;
