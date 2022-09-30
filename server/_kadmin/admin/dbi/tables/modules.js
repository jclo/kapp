/** ****************************************************************************
 *
 * Defines the modules tables.
 *
 * modules.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getModulesTable            returns SQL to create admin_modules,
 *  . _getModulesList             returns the list of modules,
 *
 *
 * Public Static Methods:
 *  . getModulesTable             returns SQL to create admin_modules,
 *  . getModulesList              returns the list of modules,
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
 * Returns the SQL commands to create the admin_modules table.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getModulesTable() {
  return `
    CREATE TABLE admin_modules(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(25)         NOT NULL,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,

      description                   TEXT(65535)         DEFAULT NULL,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,
      assigned_to_user_id           INTEGER             NOT NULL,
      is_locked                     TINYINT(1)          NOT NULL DEFAULT 0,

      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(assigned_to_user_id) REFERENCES admin_users(id)
    )
  `;
}

/**
 * Returns the list of modules.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the list,
 * @since 0.0.0
 */
function _getModulesList() {
  return [
    'sales_accounts', 'sales_contacts', 'sales_leads', 'sales_opportunities',
  ];
}


// -- Public Static Methods ----------------------------------------------------

const Modules = {

  /**
   * Returns the SQL commands to create the admin_modules table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the table,
   * @since 0.0.0
   */
  getModulesTable() {
    return _getModulesTable();
  },

  /**
   * Returns the list of modules.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the list,
   * @since 0.0.0
   */
  getModulesList() {
    return _getModulesList();
  },
};


// -- Export
module.exports = Modules;
