/** ****************************************************************************
 *
 * Defines the roles tables.
 *
 * roles.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getRolesTable              returns SQL to create admin_roles,
 *  . _getRolesAccessTable        returns SQL to create admin_roles_access,
 *
 *
 * Public Static Methods:
 *  . getRolesTable                returns SQL to create admin_roles,
 *  . getRolesAccessTable         returns SQL to create admin_roles_access,
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
 * Returns the SQL commands to create the admin_roles table.
 *
 * @function ()
 * @private
 * @param {}                ,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getRolesTable() {
  return `
    CREATE TABLE admin_roles(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(25)         NOT NULL,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,

      description                   TEXT(65535)         DEFAULT NULL,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,
      assigned_to_user_id           INTEGER             NOT NULL,
      is_editable                   TINYINT(1)          NOT NULL DEFAULT 1,
      is_locked                     TINYINT(1)          NOT NULL DEFAULT 0,

      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(assigned_to_user_id) REFERENCES admin_users(id)
    )
  `;
}

/**
 * Returns the SQL commands to create the admin_roles_access table.
 *
 * @function ()
 * @private
 * @param {String}          -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getRolesAccessTable() {
  return `
    CREATE TABLE admin_roles_access(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,

      description                   TEXT(65535)         DEFAULT NULL,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,
      assigned_to_user_id           INTEGER             NOT NULL,
      is_editable                   TINYINT(1)          NOT NULL DEFAULT 0,
      is_locked                     TINYINT(1)          NOT NULL DEFAULT 0,

      role_id                       INTEGER             NOT NULL,
      module_id                     INTEGER             NOT NULL,
      access_right                  TINYINT(1)          NOT NULL DEFAULT 1,
      list_right                    TINYINT(1)          NOT NULL DEFAULT 1,
      view_right                    TINYINT(1)          NOT NULL DEFAULT 1,
      edit_right                    TINYINT(1)          NOT NULL DEFAULT 1,
      delete_right                  TINYINT(1)          NOT NULL DEFAULT 1,
      mass_update_right             TINYINT(1)          NOT NULL DEFAULT 1,
      import_right                  TINYINT(1)          NOT NULL DEFAULT 1,
      export_right                  TINYINT(1)          NOT NULL DEFAULT 1,

      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(assigned_to_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(role_id) REFERENCES admin_roles(id),
      FOREIGN KEY(module_id) REFERENCES admin_modules(id)
    )
  `;
}


// -- Public Static Methods ----------------------------------------------------

const TR = {

  /**
   * Returns the SQL commands to create the admin_roles table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the table,
   * @since 0.0.0
   */
  getRolesTable() {
    return _getRolesTable();
  },

  /**
   * Returns the SQL commands to create the admin_roles_access table.
   *
   * @method (arg1)
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the table,
   * @since 0.0.0
   */
  getRolesAccessTable() {
    return _getRolesAccessTable();
  },
};


// -- Export
module.exports = TR;

/* - */
