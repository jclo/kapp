/** ****************************************************************************
 *
 * Defines the Groups Table.
 *
 * groups.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getGroupsTable             returns the SQL to create the groups table,
 *
 *
 * Public Static Methods:
 *  . _getGroupsTable             returns the SQL to create the groups table,
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
 * Returns the SQL commands to create the groups table.
 *
 * @function (arg1)
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getGroupsTable() {
  return `
    CREATE TABLE admin_groups(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(25)         NOT NULL,
      avatar_id                     INTEGER             NOT NULL DEFAULT 1,
      picture                       BLOB(65535)         DEFAULT NULL,
      description                   TEXT(65535)         DEFAULT NULL,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,
      assigned_to_user_id           INTEGER             NOT NULL,
      is_editable                   TINYINT(1)          NOT NULL DEFAULT 1,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,
      is_locked                     TINYINT(1)          NOT NULL DEFAULT 0,

      FOREIGN KEY(avatar_id) REFERENCES admin_avatars(id),
      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(assigned_to_user_id) REFERENCES admin_users(id)
    )
  `;
}

// -- Public Static Methods ----------------------------------------------------

const Groups = {

  /**
   * Returns the SQL commands to create the teams table.
   *
   * @method (arg1)
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the SQL commands to create the table,
   * @since 0.0.0
   */
  getGroupsTable() {
    return _getGroupsTable();
  },
};


// -- Export
module.exports = Groups;
