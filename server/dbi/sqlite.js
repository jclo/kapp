/** ****************************************************************************
 *
 * Interfaces SQLite database.
 *
 * sqlite.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Constructor:
 *  . SQLite                      creates the database interface object,
 *
 *
 * Public Methods:
 *  . isDbEmpty                   returns true if the database is empty,
 *  . isTable                     returns true if the table exists,
 *  . getTableStructure           returns the table structure,
 *  . isTableEmpty                checks if the table is empty,
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
const SQ       = require('../libs/sqlite/api')
    , tmethods = require('./test/sqlite')
    , pmethods = require('../_custom/sqlite/api')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Defines SQLite constructor.
 * (do not modify it)
 *
 * @constructor (arg1)
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
const SQLite = function(params) {
  this._name = 'sqlite';
  this._db = params.database;
  this._lib = SQ;
};


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Checks if the database is empty.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isDbEmpty() {
    const SQL = 'SELECT count(*) FROM sqlite_master WHERE type = "table"';
    const resp = await this._lib.get(SQL);
    return resp['count(*)'] === 0;
  },

  /**
   * Checks if the table exists.
   *
   * @method (arg1)
   * @public
   * @param {String}        the name of the table,
   * @returns {Boolean}     returns true if the table exists otherwise false,
   * @since 0.0.0
   */
  async isTable(table) {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`;
    const r = await this._lib.get(sql);
    return typeof r === 'object' && r.name === table;
  },

  /**
   * Returns the table structure.
   *
   * @method (arg1)
   * @public
   * @param {String}        the name of the table,
   * @returns {Array}       returns the structure of the table,
   * @since 0.0.0
   */
  async getTableStructure(table) {
    const r = await this._lib.all(`pragma table_info(${table})`);
    const struct = [];

    // Standardize:
    for (let i = 0; i < r.length; i++) {
      let def;
      switch (r[i].dflt_value) {
        case 'NULL':
          def = 'NULL';
          break;
        case null:
          def = 'None';
          break;
        default:
          def = r[i].dflt_value;
      }
      struct.push({
        column: r[i].cid,
        name: r[i].name,
        type: r[i].type,
        notNULL: r[i].notnull === 0 ? 'No' : 'Yes',
        default: def,
        key: r[i].pk === 1 ? 'primary' : '',
        extra: '',
      });
    }

    return struct;
  },

  /**
   * Checks if the table is empty.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isTableEmpty(table) {
    const sql = `select count(*) from ${table}`;
    const r = await this._lib.get(sql);
    return r['count(*)'] === 0;
  },
};


// -- Export
module.exports = {
  Cstor: SQLite,
  methods,
  tmethods,
  pmethods,
};
