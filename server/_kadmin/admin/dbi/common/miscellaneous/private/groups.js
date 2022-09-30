/** ****************************************************************************
 *
 * Creates Groups table.
 *
 * groups.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _addOneGroup                adds one group,
 *  . _createGroupsTable          creates a group table,
 *
 *
 * Public Static Methods:
 *  . createGroupsTable           creates a group table,
 *  . addOneGroup                 adds one group,
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
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../../../../../config')
    , TTG    = require('../../../tables/groups')
    , U1     = require('../../../../../_utils/util1')
    ;


// -- Local Constants
const FIRST_GROUP_NAME = 'Main Group'
    , AVATAR           = 1
    , { level }        = config
    , log              = KZlog('_kadmin/admin/dbi/common/miscellaneous/private/groups.js', level, false)
    , UTF8             = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds one group.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}        the db object,
 * @param {Object}        the connection to the db,
 * @param {Boolean}       true if sqlite false if mysql,
 * @param {Number}        the creator user id,
 * @returns {Object}      returns a promise,
 * @since 0.0.0
 */
async function _addOneGroup(dbi, cn, sqlite, creator) {
  log.info('Adding a first group to admin_groups table ...');
  const SQL = `
    INSERT INTO admin_groups(
      name,
      avatar_id,

      date_created,
      created_by_user_id,
      assigned_to_user_id
    )
    VALUES(?, ?, ?, ?, ?)
  `;

  const params = [
    FIRST_GROUP_NAME,
    AVATAR,
    U1.getDateTime(new Date()),
    creator,
    creator,
  ];
  await dbi._lib.query(cn, SQL, params);
}

/**
 * Creates a group table.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @param {String}          the tenant id,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _createGroupsTable(dbi, cn, sqlite, tenantId) {
  log.info('creating the admin_groups table ...');

  const table = TTG.getGroupsTable(tenantId);
  if (sqlite) {
    await dbi._lib.query(cn, table.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, table);
    await dbi._lib.query(cn, `ALTER TABLE admin_groups ${UTF8}`);
  }

  return null;
}


// -- Public Static Methods ----------------------------------------------------

const Groups = {

  /**
   * Creates a group table.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  createGroupsTable(dbi, cn, sqlite) {
    return _createGroupsTable(dbi, cn, sqlite);
  },

  /**
   * Adds one group.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @param {Number}        the creator user id,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  addOneGroup(dbi, cn, sqlite, creator) {
    return _addOneGroup(dbi, cn, sqlite, creator);
  },
};


// -- Export
module.exports = Groups;
