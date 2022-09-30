/** ****************************************************************************
 *
 * Creates Roles tables.
 *
 * roles.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _setAccessRights            sets the access rights,
 *  . _addRoles                   adds a set of roles,
 *  . _createRolesTables          creates roles tables,
 *
 *
 * Public Static Methods:
 *  . createRolesTables           creates roles tables,
 *  . addRoles                    adds a set of roles,
 *  . setAccessRights             sets access rights,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, no-multi-spaces: 0 */


// -- Vendor Modules
const KZlog   = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../../../../../config')
    , U1     = require('../../../../../_utils/util1')
    , RT     = require('../../../tables/roles')
    , MT     = require('../../../tables/modules')
    , R      = require('../../../../../_utils/constants').roles
    ;


// -- Local Constants
const ROLES      = [
      'Administrator',
      'Groups Leader',
      'Group Leader',
      'Team Leader',
      'Team Member',
    ]
    , DISABLED   = 0
    , NOT_SET    = 1
    , ENABLED    = 2
    , NONE       = 0
    , OWNER      = 2
    , TEAM       = 3
    , GROUP      = 4
    , ALL_GROUPS = 5
    , { level }  = config
    , log        = KZlog('_kiwi/admin/dbi/common/miscellaneous/private/roles.js', level, false)
    , UTF8       = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Sets the access rights.
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
async function _setAccessRights(dbi, cn, sqlite, creator) {
  log.info('assigning the access rights to these roles ...');
  const SQL = `
    INSERT INTO admin_roles_access(
      date_created,
      created_by_user_id,
      assigned_to_user_id,
      is_editable,
      is_locked,

      role_id,
      module_id,
      access_right,
      list_right,
      view_right,
      edit_right,
      delete_right,
      mass_update_right,
      import_right,
      export_right
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const modulesList = MT.getModulesList();
  let params;

  log.info('assigning the access rights to the Administrator ...');
  params = [
    U1.getDateTime(new Date()),   // date_created
    creator,                      // created_by_user_id
    creator,                      // assigned_to_user_id
    0,                            // is_editable
    0,                            // is_locked
    R.ROLE_ADMINISTRATOR,         // role_id
    null,                         // module_id
    NONE,                         // access_right
    NONE,                         // list_right
    NONE,                         // view_right
    NONE,                         // edit_right
    NONE,                         // delete_right
    NONE,                         // mass_update_right
    NONE,                         // import_right
    NONE,                         // export_right
  ];
  for (let i = 0; i < modulesList.length; i++) {
    params[6] = i + 1;
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(cn, SQL, params);
  }

  log.info('assigning the access rights to the Groups Leader ...');
  params = [
    U1.getDateTime(new Date()),
    creator,                      // created_by_user_id
    creator,                      // assigned_to_user_id
    0,                            // is_editable
    0,                            // is_locked
    R.ROLE_GROUPS_LEADER,         // role_id
    null,                         // module_id
    ENABLED,                      // access_right
    ALL_GROUPS,                   // list_right
    ALL_GROUPS,                   // view_right
    ALL_GROUPS,                   // edit_right
    ALL_GROUPS,                   // delete_right
    ALL_GROUPS,                   // mass_update_right
    ENABLED,                      // import_right
    ALL_GROUPS,                   // export_right
  ];
  for (let i = 0; i < modulesList.length; i++) {
    params[6] = i + 1;
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(cn, SQL, params);
  }

  log.info('assigning the access rights to the Group Leader ...');
  params = [
    U1.getDateTime(new Date()),
    creator,                      // created_by_user_id
    creator,                      // assigned_to_user_id
    0,                            // is_editable
    0,                            // is_locked
    R.ROLE_GROUP_LEADER,          // role_id
    null,
    ENABLED,                      // access_right
    GROUP,                        // list_right
    GROUP,                        // view_right
    GROUP,                        // edit_right
    GROUP,                        // delete_right
    GROUP,                        // mass_update_right
    ENABLED,                      // import_right
    GROUP,                        // export_right
  ];
  for (let i = 0; i < modulesList.length; i++) {
    params[6] = i + 1;
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(cn, SQL, params);
  }

  log.info('assigning the access rights to the Team Leader ...');
  params = [
    U1.getDateTime(new Date()),
    creator,                      // created_by_user_id
    creator,                      // assigned_to_user_id
    0,                            // is_editable
    0,                            // is_locked
    R.ROLE_TEAM_LEADER,           // role_id
    null,
    ENABLED,                      // access_right
    TEAM,                         // list_right
    TEAM,                         // view_right
    TEAM,                         // edit_right
    TEAM,                         // delete_right
    TEAM,                         // mass_update_right
    ENABLED,                      // import_right
    TEAM,                         // export_right
  ];
  for (let i = 0; i < modulesList.length; i++) {
    params[6] = i + 1;
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(cn, SQL, params);
  }

  log.info('assigning the access rights to the Team Member ...');
  params = [
    U1.getDateTime(new Date()),
    creator,                      // created_by_user_id
    creator,                      // assigned_to_user_id
    0,                            // is_editable
    0,                            // is_locked
    R.ROLE_TEAM_MEMBER,           // role_id
    null,
    ENABLED,                      // access_right
    TEAM,                         // list_right
    OWNER,                        // view_right
    OWNER,                        // edit_right
    OWNER,                        // delete_right
    DISABLED,                     // mass_update_right
    ENABLED,                      // import_right
    DISABLED,                     // export_right
  ];
  for (let i = 0; i < modulesList.length; i++) {
    params[6] = i + 1;
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(cn, SQL, params);
  }
}

/**
 * Adds a set of roles.
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
async function _addRoles(dbi, cn, sqlite, creator) {
  log.info('creating the roles ...');
  const SQL = `
    INSERT INTO admin_roles(
      name,

      date_created,
      created_by_user_id,
      assigned_to_user_id,
      is_editable
    )
    VALUES(?, ?, ?, ?, ?)
  `;

  const params = [
    ROLES[0],
    U1.getDateTime(new Date()),
    creator,
    creator,
    0,
  ];
  await dbi._lib.query(cn, SQL, params);

  [, params[0]] = ROLES;
  await dbi._lib.query(cn, SQL, params);

  [,, params[0]] = ROLES;
  await dbi._lib.query(cn, SQL, params);

  [,,, params[0]] = ROLES;
  await dbi._lib.query(cn, SQL, params);

  [,,,, params[0]] = ROLES;
  await dbi._lib.query(cn, SQL, params);
}

/**
 * Creates Roles Tables.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _createRolesTables(dbi, cn, sqlite) {
  log.info('creating the admin_roles table ...');

  const roles = RT.getRolesTable();
  if (sqlite) {
    await dbi._lib.query(cn, roles.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, roles);
    await dbi._lib.query(cn, `ALTER TABLE admin_roles ${UTF8}`);
  }

  log.info('creating the admin_roles_access table ...');
  const rolesAccess = RT.getRolesAccessTable();
  if (sqlite) {
    await dbi._lib.query(cn, rolesAccess.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, rolesAccess);
    await dbi._lib.query(cn, `ALTER TABLE admin_roles_access ${UTF8}`);
  }

  log.info('done!');
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Creates the roles tables.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @param {String}        the master id,
   * @returns {String}      returns an error message or null,
   * @since 0.0.0
   */
  createRolesTables(dbi, cn, sqlite) {
    return _createRolesTables(dbi, cn, sqlite);
  },

  /**
   * Adds a set of roles.
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
  addRoles(dbi, cn, sqlite, creator) {
    return _addRoles(dbi, cn, sqlite, creator);
  },

  /**
   * Sets access rights.
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
  setAccessRights(dbi, cn, sqlite, creator) {
    return _setAccessRights(dbi, cn, sqlite, creator);
  },
};


// -- Export
module.exports = methods;
