/** ****************************************************************************
 *
 * Creates Teams table.
 *
 * teams.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _addOneTeam                 adds one team,
 *  . _createTeamsTable           creates a team table,
 *
 *
 * Public Static Methods:
 *  . createTeamsTable            creates a team table,
 *  . addOneTeam                  adds one team,
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
    , TTE    = require('../../../tables/teams')
    , U1     = require('../../../../../_utils/util1')
    ;


// -- Local Constants
const FIRST_TEAM_NAME = 'Main Team'
    , AVATAR          = 1
    , { level }       = config
    , log             = KZlog('_kadmin/admin/dbi/common/miscellaneous/private/teams.js', level, false)
    , UTF8            = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds one team.
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
async function _addOneTeam(dbi, cn, sqlite, creator) {
  log.info('Adding a first team to admin_teams table ...');
  const SQL = `
    INSERT INTO admin_teams(
      name,
      avatar_id,

      date_created,
      created_by_user_id,
      assigned_to_user_id,
      group_id
    )
    VALUES(?, ?, ?, ?, ?, ?)
  `;

  const params = [
    FIRST_TEAM_NAME,
    AVATAR,
    U1.getDateTime(new Date()),
    creator,
    creator,
    1,
  ];
  await dbi._lib.query(cn, SQL, params);
}

/**
 * Creates a team table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _createTeamsTable(dbi, cn, sqlite, tenantId) {
  log.info('creating the admin_teams table ...');

  const table = TTE.getTeamsTable(tenantId);
  if (sqlite) {
    await dbi._lib.query(cn, table.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, table);
    await dbi._lib.query(cn, `ALTER TABLE admin_teams ${UTF8}`);
  }

  return null;
}


// -- Public Static Methods ----------------------------------------------------

const Teams = {

  /**
   * Creates a team table.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @return {Object}       returns this,
   * @since 0.0.0
   */
  createTeamsTable(dbi, cn, sqlite) {
    return _createTeamsTable(dbi, cn, sqlite);
  },

  /**
   * Adds one team.
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
  addOneTeam(dbi, cn, sqlite, creator) {
    return _addOneTeam(dbi, cn, sqlite, creator);
  },
};


// -- Export
module.exports = Teams;
