/** ****************************************************************************
 *
 * Defines utility functions to manage db.
 *
 * util3.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _purgeCondition             extracts one unauthorized where condition,
 *  . _extractCondition           extracts one authorized where condition,
 *  . _whereFormat                returns the formatted SQL where clause(s),
 *  . _convert                    returns the value converted w.r.t. its type,
 *  . _getMatchingColumn          returns the matching column and its type,
 *  . _andConds                   returns the query converted in WHERE clause and values,
 *  . _limit                      returns the provided LIMIT values or default ones,
 *  . _getSQLQueryAndLimit        returns the SQL WHERE conditions and LIMIT,
 *
 *
 * Public Static Methods:
 *  . getSQLQueryAndLimit         returns the SQL WHERE conditions and LIMIT,
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
const OFFSET  = 0
    , NUMBERS = 25
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Parses WHERE clause string and returns an array representation.
 *
 * @function (arg1)
 * @private
 * @param {String}          the where clause,
 * @returns {Array}         returns where splitted clause,
 * @since 0.0.0
 */
function _parseWhereConditions(where) {
  let svalues = where.match(/"(.*?)"/g);
  if (!svalues) svalues = [];

  let s = where;
  for (let i = 0; i < svalues.length; i++) {
    s = s.replace(svalues[i], `&µℏ${i}`);
  }
  const arr = s.replace('(', '( ').replace(')', ' )').split(' ');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].match(/^&µℏ/)) {
      arr[i] = svalues[parseInt((arr[i].replace('&µℏ', '')), 10)];
    }
  }
  return arr;
}

/**
 * Extracts and trashes one unauthorized where condition.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Array}           the where condition(s),
 * @param {Number}          the pointer on the conditions table,
 * @param {Array}           the table of valid condition(s),
 * @param {Array}           the table of the rejected condition(s),
 * @returns {Array}         returns an error or the new pointer position,
 * @since 0.0.0
 */
function _purgeCondition(awhere, i, result, trash) {
  const column = awhere[i];

  let ni  = i
    , err = null
    ;

  switch (awhere[ni + 1]) {
    case '=':
    case '>':
    case '<':
    case '>=':
    case '<=':
    case '<>':
    case '!=':
      trash.push(column);
      trash.push(awhere[ni + 1]);
      trash.push(awhere[ni + 2]);
      ni += 2;
      break;

    case 'between':
    case 'BETWEEN':
      // must be: column BETWEEN value1 AND value2
      err = true;
      break;

    case 'like':
    case 'LIKE':
      trash.push(column);
      trash.push('LIKE');
      trash.push(awhere[ni + 2]);
      ni += 2;
      break;

    case 'in':
    case 'IN':
      // must be column IN (value1,value2)
      err = true;
      break;

    default:
      err = true;
  }

  if (result[result.length - 1] === 'AND'
    || result[result.length - 1] === 'OR'
    || result[result.length - 1] === 'NOT') {
    result.pop();
  }

  if (!err) {
    // AND, OR, NOT Operators
    switch (awhere[ni + 1]) {
      case 'and':
      case 'AND':
      case 'or':
      case 'OR':
      case 'not':
      case 'NOT':
        if (result.length > 0) {
          result.push(awhere[ni + 1].toUpperCase());
        }
        ni += 1;
        break;

      case ')':
        result.push(')');
        ni += 1;
        break;

      default:
    }
  }

  return [err, ni];
}

/**
 * Extracts one authorized where condition.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Array}           the where condition(s),
 * @param {Number}          the pointer on the conditions table,
 * @param {Array}           the table of valid condition(s),
 * @param {String}          the SQL table identifier,
 * @returns {Array}         returns an error or the new pointer position,
 * @since 0.0.0
 */
function _extractCondition(awhere, i, result, header) {
  const column = awhere[i];

  let ni  = i
    , err = null
    ;

  switch (awhere[ni + 1]) {
    case '=':
    case '>':
    case '<':
    case '>=':
    case '<=':
    case '<>':
    case '!=':
      result.push(header ? `${header}.${column}` : column);
      result.push(awhere[ni + 1]);
      result.push(awhere[ni + 2]);
      ni += 2;
      break;

    case 'between':
    case 'BETWEEN':
      // must be: column BETWEEN value1 AND value2
      err = true;
      break;

    case 'like':
    case 'LIKE':
      result.push(header ? `${header}.${column}` : column);
      result.push('LIKE');
      result.push(awhere[ni + 2]);
      ni += 2;
      break;

    case 'asc':
    case 'ASC':
    case 'desc':
    case 'DESC':
      result.push(header ? `${header}.${column}` : column);
      result.push(awhere[ni + 1].toUpperCase());
      ni += 2;
      break;

    case 'in':
    case 'IN':
      // must be column IN (value1,value2)
      err = true;
      break;

    default:
      err = true;
  }

  if (!err) {
    // AND, OR, NOT Operators
    switch (awhere[ni + 1]) {
      case 'and':
      case 'AND':
      case 'or':
      case 'OR':
      case 'not':
      case 'NOT':
        result.push(awhere[ni + 1].toUpperCase());
        ni += 1;
        break;

      case 'order':
      case 'ORDER':
        if (awhere[ni + 2] === 'by' || awhere[ni + 2] === 'BY') {
          result.push('ORDER BY');
          ni += 2;
        }
        break;

      case ')':
        result.push(')');
        ni += 1;
        break;

      default:
    }
  }

  return [err, ni];
}

/**
 * Returns the cleaned where condition(s).
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the where condition(s),
 * @param {Array}           the table structure,
 * @param {Array}           the unauthorized table columns for a query,
 * @param {String}          the SQL table identifier,
 * @returns {Array}         returns the cleaned where condition(s),
 * @since 0.0.0
 */
function _whereFormat(where, tableColumns, forbidColumns, header) {
  // Build a list of authorized columns:
  const columnNames = [];
  tableColumns.forEach((column) => {
    if (forbidColumns.indexOf(column.name) === -1) {
      columnNames.push(column.name);
    }
  });

  // Converts WHERE clause in an array for parsing all the conditions:
  const awhere = _parseWhereConditions(where);

  let i = 0;
  let err = false;
  const result = [];
  const trash = [];
  while (i < awhere.length) {
    if (awhere[i] === '(' || awhere[i] === ')') {
      result.push(awhere[i]);
    } else if (columnNames.includes(awhere[i])) {
      // Extract a condition for a matching column:
      [err, i] = _extractCondition(awhere, i, result, header);
      if (err) break;
    } else {
      // Extract and trash a condition for an unknown or rejected column:
      [err, i] = _purgeCondition(awhere, i, result, trash);
      if (err) break;
    }
    i += 1;
  }

  // Now the WHERE clause has been parsed and cleaned, we reserialize it
  // again:
  let clause = '';
  if (!err) {
    for (i = 0; i < result.length; i++) {
      clause += result[i] === '('
        ? result[i]
        : `${result[i]} `;
    }
    clause = clause.replace(/\s\)/g, ')').trim();
  }

  return clause.length > 0 ? clause : null;
}

/**
 * Returns the value converted w.r.t. its type.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the column type,
 * @param {String}          the value,
 * @returns {String/Number} returns the converted value,
 * @since 0.0.0
 */
function _convert(type, value) {
  if (type.includes('INTEGER') || type.includes('TINYINT')) {
    const val = parseInt(value, 10);
    return !Number.isNaN(val) ? val : value;
  }

  if (type.includes('FLOAT')) {
    const val = parseFloat(value);
    return !Number.isNaN(val) ? val : value;
  }

  return value;
}

/**
 * Returns the matching column and its type.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the API query,
 * @param {Array}           the table structure,
 * @param {Array}           the unauthorized table columns for a query,
 * @returns {Object}        returns the matching column and type,
 * @since 0.0.0
 */
function _getMatchingColumn(item, tableColumns, forbidColumns) {
  let column
    , type
    ;

  for (let i = 0; i < tableColumns.length; i++) {
    if (tableColumns[i].name === item && !forbidColumns.includes(item)) {
      column = tableColumns[i].name;
      type = tableColumns[i].type;
    }
  }
  return [column, type];
}

/**
 * Returns the query converted in WHERE clause and values.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the API query,
 * @param {Array}           the table structure,
 * @param {Array}           the unauthorized table columns for a query,
 * @param {String}          the SQL table identifier,
 * @returns {Object}        returns the LIMIT values,
 * @since 0.0.0
 */
function _andConds(query, tableColumns, forbidColumns, header) {
  const nq = { ...query }
      ;

  delete nq.where;
  delete nq.offset;
  delete nq.numbers;

  let q = ''
    , col
    , type
    ;

  const values = [];
  const keys = Object.keys(nq);
  for (let i = 0; i < keys.length; i++) {
    [col, type] = _getMatchingColumn(keys[i], tableColumns, forbidColumns);
    if (col) {
      if (header) {
        q += `${header}.${keys[i]} = ? AND `;
      } else {
        q += `${keys[i]} = ? AND `;
      }
      values.push(_convert(type, nq[keys[i]]));
    }
  }

  return q.length > 0 ? { clause: q.slice(0, -5), values } : null;
}

/**
 * Returns the provided LIMIT values or default ones.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the API query,
 * @returns {Object}        returns the LIMIT values,
 * @since 0.0.0
 */
function _limit(query) {
  const offset = query.offset && !Number.isNaN(parseInt(query.offset, 10))
    ? parseInt(query.offset, 10)
    : OFFSET;

  const numbers = query.numbers && !Number.isNaN(parseInt(query.numbers, 10))
    ? parseInt(query.numbers, 10)
    : NUMBERS;

  return { offset, numbers };
}

/**
 * Returns the SQL WHERE conditions and LIMIT.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the API query,
 * @param {Array}           the table structure,
 * @param {Array}           the unauthorized table columns for a query,
 * @param {String}          the SQL table identifier,
 * @returns {Array}         returns the SQL limits and WHERE conditions,
 * @since 0.0.0
 */
function _getSQLQueryAndLimit(query, tableColumns, forbidColumns, virtualColumns, header) {
  if (Object.prototype.toString.call(query) !== '[object Object]') {
    return [_limit({})];
  }

  return [
    _limit(query),
    _andConds(query, tableColumns, forbidColumns, header),
    query.where
      ? _whereFormat(query.where, tableColumns, forbidColumns, header)
      : null,
    query.where && Array.isArray(virtualColumns) && virtualColumns.length > 0
      ? _whereFormat(query.where, virtualColumns, [])
      : null,
  ];
}


// -- Public Static Methods ----------------------------------------------------

const Util = {

  /**
   * Returns the SQL WHERE conditions and LIMIT.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the API query,
   * @param {Array}         the table structure,
   * @param {Array}         the unauthorized table columns for a query,
   * @param {Array}         the extra columns for a query (composite columns),
   * @param {String}        the SQL table identifier,
   * @returns {Array}       returns the SQL limits and WHERE conditions,
   * @since 0.0.0
   */
  getSQLQueryAndLimit(query, tableColumns, forbidColumns, virtualColumns, header) {
    return _getSQLQueryAndLimit(query, tableColumns, forbidColumns, virtualColumns, header);
  },
};


// -- Export
module.exports = Util;
