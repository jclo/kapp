/** ****************************************************************************
 *
 * Defines the db admin tables.
 *
 * db.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getDBTable                 returns SQL to create admin_db_versions,
 *
 *
 * Public Static Methods:
 *  . getDBTable                  returns SQL to create admin_db_versions,
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
/* eslint-disable one-var, semi-style, no-underscore-dangle */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the SQL commands to create the admin_db_versions table.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getDBTable() {
  return `
    CREATE TABLE admin_db_versions(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(25)         NOT NULL,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,

      description                   TEXT(65535)         DEFAULT NULL,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,

      server_version                VARCHAR(25)         NOT NULL,
      db_version                    VARCHAR(25)         NOT NULL,

      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id)
    )
  `;
}


// -- Public Static Methods ----------------------------------------------------

const DB = {

  /**
   * Returns the SQL commands to create the admin_db_versions table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the table,
   * @since 0.0.0
   */
  getDBTable() {
    return _getDBTable();
  },
};


// -- Export
module.exports = DB;
