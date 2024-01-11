/** ****************************************************************************
 *
 * Adds columns and table to the db.
 *
 * add.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _addTable                   adds a new table to the db,
 *  . _addColumn                  adds the passed-in column to the passed-in table,
 *
 *
 * Public Static Methods:
 *  . addColumn                   adds the passed-in column to the passed-in table,
 *  . addTable                    adds a new table to the db,
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
const UTF8 = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci';


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds a new table to the db.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the database object,
 * @return {Object}         returns a promise,
 * @since 0.0.0
 */
async function _addTable(dbi) {
  const sql = `
    CREATE TABLE i_am_new_table(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,

      name                          VARCHAR(50)         UNIQUE NOT NULL,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,
      assigned_to_user_id           INTEGER             NOT NULL DEFAULT 1,
      group_id                      INTEGER             DEFAULT 1,
      team_id                       INTEGER             DEFAULT 1,
      role_id                       INTEGER             DEFAULT 6,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0
    )
  `;

  let resp;
  if (dbi._name === 'sqlite') {
    resp = await dbi._query(sql.replace('AUTO_INCREMENT', 'AUTOINCREMENT'), []);
    process.stdout.write('done!\n');
    return;
  }

  resp = await dbi._query(sql, []);
  resp = await dbi._query(`ALTER TABLE i_am_new_table ${UTF8}`, []);
  process.stdout.write('done!\n');
  process.exit(0);
}

/**
 * Adds the passed-in column to the passed-in table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database object,
 * @param {String}          the name of the column to add,
 * @param {String}          the name of the table,
 * @return {Promise}        returns a promise,
 * @since 0.0.0
 */
async function _addColumn(dbi, column, table) {
  const sql = dbi._name === 'sqlite'
    ? `ALTER TABLE ${table} ADD COLUMN ${column} VARCHAR(50) DEFAULT NULL`
    : `
    ALTER TABLE ${table}
    ADD COLUMN ${column}_first VARCHAR(50) DEFAULT NULL FIRST,
    ADD COLUMN ${column}_after VARCHAR(50) DEFAULT NULL AFTER db_version
    `;

  const resp = await dbi._query(sql, []);
  process.stdout.write('done!\n');
  process.exit(0);
}


// -- Public Methods -----------------------------------------------------------

const ADD = {

  /**
   * Adds the passed-in column to the passed-in table.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the database object,
   * @param {String}        the name of the column to add,
   * @param {String}        the name of the table,
   * @return {Promise}      returns a promise,
   * @since 0.0.0
   */
  addColumn(dbi, column, table) {
    _addColumn(dbi, column, table);
    return this;
  },

  /**
   * Adds a new table to the db.
   *
   * @method (arg1)
   * @public
   * @param {Object}        the database object,
   * @return {Object}       returns a promise,
   * @since 0.0.0
   */
  addTable(dbi) {
    return _addTable(dbi);
  },
};


// -- Export
module.exports = ADD;
