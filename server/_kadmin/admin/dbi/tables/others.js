/** ****************************************************************************
 *
 * Defines the other admin tables.
 *
 * others.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getSalutationTable         returns SQL to create admin_salutation,
 *  . _getSalutationList          returns the list of salutations,
 *  . _getAvatarsTable            returns SQL to create admin_avatars,
 *
 *
 * Public Static Methods:
 *  . none,
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
 * Returns the SQL commands to create the admin_salutation table.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getSalutationTable() {
  return `
    CREATE TABLE admin_salutation(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(25)         DEFAULT NULL,
      date_created                  DATETIME            DEFAULT NULL
    )
  `;
}

/**
 * Returns the list of salutations.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the list,
 * @since 0.0.0
 */
function _getSalutationList() {
  return ['', 'Mr.', 'Ms.', 'Mrs.', 'Miss', 'Dr.', 'Prof.'];
}

/**
 * Returns the SQL commands to create the admin_avatars table.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getAvatarsTable() {
  return `
    CREATE TABLE admin_avatars(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(50)         DEFAULT NULL,
      picture                       BLOB(65535)         DEFAULT NULL,
      date_created                  DATETIME            DEFAULT NULL
    )
  `;
}


// -- Public Static Methods ----------------------------------------------------

const O = {

  /**
   * Returns the SQL commands to create the admin_salutation table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the table,
   * @since 0.0.0
   */
  getSalutationTable() {
    return _getSalutationTable();
  },

  /**
   * Returns the list of salutations.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the list,
   * @since 0.0.0
   */
  getSalutationList() {
    return _getSalutationList();
  },

  /**
   * Returns the SQL commands to create the admin_avatars table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the table,
   * @since 0.0.0
   */
  getAvatarsTable() {
    return _getAvatarsTable();
  },
};


// -- Export
module.exports = O;
