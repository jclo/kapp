/** ****************************************************************************
 *
 * Defines utility functions to manage db.
 *
 * util.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _extend                     returns the merged objects,
 *  . _getDateTime                stringifies a date,
 *  . _getSQLcv                   extracts columns and values from an object,
 *  . _getSQLcoval                extracts columns and values from an object,
 *  . _getSQLmrows                extracts col. and val. from an obj (multi rows),
 *  . _extractColumnLength        extracts the column length from the table structure,
 *  . _filterColumns              removes fake columns from the received object,
 *  . _filterEmail                returns a filtered email object,
 *
 *
 * Public Static Methods:
 *  . extend                      returns the merged objects,
 *  . getDateTime                 stringifies a date,
 *  . getSQLcv                    extracts columns and values from an object,
 *  . getSQLcoval                 extracts columns and values from an object,
 *  . getSQLmrows                 extracts col. and val. from an obj (multi rows),
 *  . filterColumns               removes fake columns from the received object,
 *  . filterEmail                 returns a filtered email object,
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
 * Extends literal objects from left to right.
 * (first level only - this is intended to overwrite methods)
 *
 * @function (...args)
 * @private
 * @param {Objects}         a set of methods,
 * @returns {Object}        returns an object of methods,
 * @since 0.0.0
 */
/* eslint-disable no-restricted-syntax, guard-for-in */
function _extend(...args) {
  const obj = {};
  let source
    , prop
    ;

  for (let i = 0; i < args.length; i++) {
    source = args[i];
    for (prop in source) {
      obj[prop] = source[prop];
    }
  }
  return obj;
}
/* eslint-enable no-restricted-syntax, guard-for-in */

/**
 * Converts a date to a string.
 *
 * @function (arg1)
 * @private
 * @param {Date}            the date to convert,
 * @returns {String}        returns the converted date,
 * @since 0.0.0
 */
function _getDateTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
}

/**
 * Extracts columns and values from an object.
 * (INSERT INTO table(colums...) VALUES(?, ?))
 *
 * @function (arg1)
 * @private
 * @param {Object}          the source object,
 * @returns {Array}         returns an array containing columns, values, params,
 * @since 0.0.0
 */
function _getSQLcv(obj) {
  // INSERT INTO accounts(col,) VALUES(val,)
  const keys = Object.keys(obj);
  const params = [];
  let cols = '';
  let vals = '';

  for (let i = 0; i < keys.length; i++) {
    if (i < keys.length - 1) {
      cols += `${keys[i]}, `;
      vals += '?, ';
    } else {
      cols += `${keys[i]}`;
      vals += '?';
    }
    params.push(obj[keys[i]]);
  }
  return [cols, vals, params];
}

/**
 * Extracts columnns and values from an object.
 * (UPDATE table SET col = ?, col = ?, ... WHERE col = ?)
 *
 * @function (arg1)
 * @private
 * @param {Object}          the source object,
 * @returns {Array}         returns the column string and the associated params,
 * @since 0.0.0
 */
function _getSQLcoval(obj) {
  // UPDATE table SET col1 = ?, col2 = ? WHERE id = ?
  const keys   = Object.keys(obj);
  const params = [];
  let coval = '';

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== 'id') {
      // if (i < keys.length - 1) {
      //   coval += `${keys[i]} = ?, `;
      // } else {
      //   coval += `${keys[i]} = ?`;
      // }
      coval += `${keys[i]} = ?, `;
      params.push(obj[keys[i]]);
    }
  }

  params.push(obj.id);
  return [coval.slice(0, -2), params];
}

/**
 * Extracts columns and values from an object.
 * (INSERT INTO (col1, col2, ...) VALUES (v1, v2), (v1, v2), () WHERE id = ?)
 *
 * @function (arg1)
 * @private
 * @param {Object}          the source object,
 * @returns {Array}         returns column names and values,
 * @since 0.0.0
 */
function _getSQLmrows(obj) {
  let cols = '';
  let keys = Object.keys(obj[0]);
  for (let i = 0; i < keys.length; i++) {
    cols += i < keys.length - 1 ? `${keys[i]}, ` : `${keys[i]}`;
  }

  let vals = '';
  for (let i = 0; i < obj.length; i++) {
    keys = Object.keys(obj[i]);
    vals += '(';
    for (let j = 0; j < keys.length; j++) {
      if (typeof obj[i][keys[j]] === 'string') {
        vals += j < keys.length - 1 ? `'${obj[i][keys[j]]}', ` : `'${obj[i][keys[j]]}'), `;
      } else {
        vals += j < keys.length - 1 ? `${obj[i][keys[j]]}, ` : `${obj[i][keys[j]]}), `;
      }
    }
  }

  return [cols, vals.slice(0, -2), []];
}

/**
 * Extracts the column length from the table structure.
 *
 * @function (arg1)
 * @private
 * @param {Array}           the table structure,
 * @returns {Object}        returns an object containing the length of the columns,
 * @since 0.0.0
 */
function _extractColumnLength(tableStructure) {
  const columnLength = {};

  let arr;
  let n;
  for (let i = 0; i < tableStructure.length; i++) {
    n = tableStructure[i].type === 'BLOB' || tableStructure[i].type === 'MEDIUMTEXT'
      ? 65535
      : null;
    arr = tableStructure[i].type.match(/\d+/g);
    if (arr) {
      n = parseInt(arr[0], 10);
    }
    columnLength[tableStructure[i].name] = n;
  }
  return columnLength;
}

/**
 * Removes inexisting columns.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object}          the received object to store in the db,
 * @param {Array}           the template defining the db table structure,
 * @returns {Object}        returns the expurged object,
 * @since 0.0.0
 */
function _filterColumns(obj, template) {
  const okeys   = Object.keys(obj)
      , columns = template.map((item) => item.name)
      , output  = {}
      ;

  for (let i = 0; i < okeys.length; i++) {
    if (columns.includes(okeys[i])) {
      output[okeys[i]] = obj[okeys[i]];
    }
  }
  return output;
}

/**
 * Returns a filtered email object.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the email,
 * @returns {Object}        returns the filtered object (without fake columns),
 * @since 0.0.0
 */
/* eslint-disable no-useless-escape */
function _filterEmail(email) {
  const ne = {}
      // , re = new RegExp(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      , re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ;

  if (re.test(email.email)) {
    ne.email = email.email;
  }

  if (email.is_deleted === 0 || email.is_deleted === 1) {
    ne.is_deleted = email.is_deleted;
  }

  if (email.is_primary_email === 0 || email.is_primary_email === 1) {
    ne.is_primary_email = email.is_primary_email;
  }

  if (email.is_invalid_email === 0 || email.is_invalid_email === 1) {
    ne.is_invalid_email = email.is_invalid_email;
  }

  if (email.is_opted_out === 0 || email.is_opted_out === 1) {
    ne.is_opted_out = email.is_opted_out;
  }

  return ne;
}
/* eslint-enable no-useless-escape */


// -- Public Static Methods ----------------------------------------------------

const Util = {

  /**
   * Returns the merged objects.
   *
   * @method (...args)
   * @public
   * @param {Object}        a set of objects to merge,
   * @return {Object}       returns the resulting object,
   * @since 0.0.0
   */
  extend(...args) {
    return _extend(...args);
  },

  /**
   * Stringifies a date.
   *
   * @method (arg1)
   * @public
   * @param {Date}          the date to convert,
   * @return {String}       returns the resulting string date,
   * @since 0.0.0
   */
  getDateTime(date) {
    return _getDateTime(date);
  },

  /**
   * Extracts columns and values from an object.
   * (formatted for SELECT)
   *
   * @method (arg1)
   * @public
   * @param {Object}        the received table object,
   * @return {Array}        returns an array with columns and values,
   * @since 0.0.0
   */
  getSQLcv(obj) {
    return _getSQLcv(obj);
  },

  /**
   * Extracts columns and values from an object.
   * (formatted for UPDATE)
   *
   * @method (arg1)
   * @public
   * @param {Object}        the received table object,
   * @return {Array}        returns an array with columns and values,
   * @since 0.0.0
   */
  getSQLcoval(obj) {
    return _getSQLcoval(obj);
  },

  /**
   * Extracts columns and values from an object.
   * (formatted for INSERT mutiple rows)
   *
   * @method (arg1)
   * @public
   * @param {Object}        the received table object,
   * @return {Array}        returns an array with columns and values,
   * @since 0.0.0
   */
  getSQLmrows(obj) {
    return _getSQLmrows(obj);
  },

  /**
   * Removes fake columns from the received object.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the object containing the table columns and values,
   * @return {Array}        returns the same object expurged from the fake columns,
   * @since 0.0.0
   */
  filterColumns(obj, template) {
    return _filterColumns(obj, template);
  },

  /**
   * Returns a filtered email object.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the email,
   * @returns {Object}      returns the filtered object (without fake columns),
   * @since 0.0.0
   */
  filterEmail(email) {
    return _filterEmail(email);
  },

  /**
   * Extracts the column length from the table structure.
   *
   * @method (arg1)
   * @public
   * @param {Array}         the table structure,
   * @returns {Object}      returns an object containing the length of the columns,
   * @since 0.0.0
   */
  extractColumnLength(tableStructure) {
    return _extractColumnLength(tableStructure);
  },
};


// -- Export
module.exports = Util;
