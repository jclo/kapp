/** ****************************************************************************
 *
 * Creates Users tables.
 *
 * users.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _fillUsersAccessRightTable  fills users access rights table,
 *  . _addAdminUser               creates the admin user,
 *  . _createAndFilli18nTable     creates and fills admin_i18n_locales rights table,
 *  . _fillUsersAccessRights      fills users access rights table,
 *  . _createUsersAccessTables    creates the users access tables,
 *  . _createUsersTables          creates users tables,
 *
 *
 * Public Static Methods:
 *  . createUsersTables           creates users tables,
 *  . createUsersAccessTables     creates the users access tables,
 *  . createi18nTable             creates the i18n table,
 *  . addAdminUser                creates the admin user,
 *  . fillUsersAccessRightsTable  creates the users access right table,
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
    , Crypto = require('../../../../../../libs/crypto/main')
    , U1     = require('../../../../../_utils/util1')
    , UT     = require('../../../tables/users')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/miscellaneous/private/users.js', level, false)
    , UTF8      = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Fills users access rights table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _fillUsersAccessRightTable(dbi, cn/* , sqlite */) {
  log.info('filling the admin_users_access_rights table ...');

  const list = UT.getUsersAccessRightsList();
  const keys = Object.keys(list);
  let sql;
  let params;
  for (let i = 0; i < keys.length; i++) {
    sql = `
      INSERT INTO admin_users_access_rights
        (name, date_created, values_json)
        VALUES(?, ?, ?)
    `;

    params = [
      keys[i],
      U1.getDateTime(new Date()),
      JSON.stringify(list[keys[i]]),
    ];
    /* eslint-disable no-await-in-loop */
    await dbi._lib.query(cn, sql, params);
  }

  log.info('done!');
}

/**
 * Creates the Admin user.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _addAdminUser(dbi, cn/* , sqlite */) {
  log.info('creating the Administrator user ...');
  const hash = await Crypto.hash('admin');
  const date = U1.getDateTime(new Date());

  // First create the admin in the table referencing
  // all the users:
  const sql = `
    INSERT INTO admin_users
    (
      user_name,
      user_hash,
      system_generated_password,

      last_name,
      title,

      date_created,
      created_by_user_id,
      assigned_to_user_id,
      group_id,
      team_id,
      role_id
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    'admin',                        // user_name
    hash,                           // user_hash
    1,                              // system_generated_password

    'Nobody',                       // last name
    'Administrator',                // title

    date,                           // date_created
    1,                              // created_by_user_id
    1,                              // assigned_to_user_id
    null,                           // group_id
    null,                           // team_id
    1,                              // role_id
  ];
  await dbi._lib.query(cn, sql, params);
  log.info('done!');
}

/**
 * Creates and fills admin_i18n_locales rights table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _createAndFilli18nTable(dbi, cn, sqlite) {
  log.info('creating and filling the admin_i18n_locales table ...');

  const i18nLocales = UT.getI18nLocalesTable();
  if (sqlite) {
    await dbi._lib.query(cn, i18nLocales.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, i18nLocales);
    await dbi._lib.query(cn, `ALTER TABLE admin_i18n_locales ${UTF8}`);
  }

  const list = UT.getI18nLocalesList();
  const keys = Object.keys(list);
  for (let i = 0; i < keys.length; i++) {
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(
      cn,
      'INSERT INTO admin_i18n_locales(code, language, date_created) VALUES(?, ?, ?)',
      [keys[i], list[keys[i]], U1.getDateTime(new Date())],
    );
  }
  log.info('done!');
}

/**
 * Creates users access tables.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _createUsersAccessTables(dbi, cn, sqlite) {
  log.info('creating the admin_users_access table ...');

  const usersAccess = UT.getUsersAccessTable();
  if (sqlite) {
    await dbi._lib.query(cn, usersAccess.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, usersAccess);
    await dbi._lib.query(cn, `ALTER TABLE admin_users_access ${UTF8}`);
  }
  log.info('done!');

  log.info('creating the admin_users_access_rights table ...');

  const usersAccessRights = UT.getUsersAccessRightsTable();
  if (sqlite) {
    await dbi._lib.query(cn, usersAccessRights.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, usersAccessRights);
    await dbi._lib.query(cn, `ALTER TABLE admin_users_access_rights ${UTF8}`);
  }
  log.info('done!');

  // await _fillUsersAccessRights(dbi, cn, sqlite);
}

/**
 * Creates users.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _createUsersTables(dbi, cn, sqlite) {
  log.info('creating the admin_users table ...');

  const users = UT.getUsersTable();
  if (sqlite) {
    await dbi._lib.query(cn, users.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, users);
    await dbi._lib.query(cn, `ALTER TABLE admin_users ${UTF8}`);
  }

  log.info('creating the admin_users_emails table ...');
  const emails = UT.getUsersEmailTable();

  if (sqlite) {
    await dbi._lib.query(cn, emails.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, emails);
    await dbi._lib.query(cn, `ALTER TABLE admin_users_emails ${UTF8}`);
  }

  log.info('done!');
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Creates the users tables.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  createUsersTables(dbi, cn, sqlite) {
    return _createUsersTables(dbi, cn, sqlite);
  },

  /**
   * Creates the users access tables.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  createUsersAccessTables(dbi, cn, sqlite) {
    return _createUsersAccessTables(dbi, cn, sqlite);
  },

  /**
   * Creates the i18n table.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  createi18nTable(dbi, cn, sqlite) {
    return _createAndFilli18nTable(dbi, cn, sqlite);
  },

  /**
   * Creates the Admin user.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  addAdminUser(dbi, cn, sqlite) {
    return _addAdminUser(dbi, cn, sqlite);
  },

  /**
   * Creates the users access right table.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  fillUsersAccessRightsTable(dbi, cn, sqlite) {
    return _fillUsersAccessRightTable(dbi, cn, sqlite);
  },
};


// -- Export
module.exports = methods;
