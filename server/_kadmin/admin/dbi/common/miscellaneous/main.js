/** ****************************************************************************
 *
 * Creates the Admin tables.
 *
 * miscellaneous.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _init                       initializes the database,
 *
 *
 * Public Static Methods:
 *  . init                        initializes the database,
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
const config = require('../../../../../config')
    , AS     = require('./private/avsal')
    , DB     = require('./private/db')
    , MO     = require('./private/modules')
    , TG     = require('./private/groups')
    , TE     = require('./private/teams')
    , RO     = require('./private/roles')
    , US     = require('./private/users')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/miscellaneous/main.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Initializes the database.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {String}        returns an error message or null,
 * @since 0.0.0
 */
async function _init(dbi, cn, sqlite) {
  const empty = await dbi.isDbEmpty(cn, dbi._db);
  if (!empty) {
    log.info('The database is not empty!');
    return [null];
  }

  log.info('The database is empty, we are going now to create the Admin tables!');
  await AS.createAvatarsTable(dbi, cn, sqlite);
  await AS.createSalutationTable(dbi, cn, sqlite);
  await US.createUsersTables(dbi, cn, sqlite);
  await MO.createModulesTable(dbi, cn, sqlite);
  await US.createUsersAccessTables(dbi, cn, sqlite);
  await US.createi18nTable(dbi, cn, sqlite);
  await DB.createDBTable(dbi, cn, sqlite);
  await TG.createGroupsTable(dbi, cn, sqlite);
  await TE.createTeamsTable(dbi, cn, sqlite);
  await RO.createRolesTables(dbi, cn, sqlite);

  await US.addAdminUser(dbi, cn, sqlite);
  await US.fillUsersAccessRightsTable(dbi, cn, sqlite);
  await DB.fillDBTable(dbi, cn, sqlite, 1);
  await MO.addModules(dbi, cn, sqlite, 1);
  await TG.addOneGroup(dbi, cn, sqlite, 1);
  await TE.addOneTeam(dbi, cn, sqlite, 1);
  await RO.addRoles(dbi, cn, sqlite, 1);
  await RO.setAccessRights(dbi, cn, sqlite, 1);

  // Create other tables:
  // example: if (dbi.salesInit) await dbi.salesInit(dbi, cn, sqlite);
  return [null];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Initializes the database.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {String}      returns an error message or null,
   * @since 0.0.0
   */
  init(dbi, cn, sqlite) {
    return _init(dbi, cn, sqlite);
  },
};


// -- Export
module.exports = methods;
