/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * use_2_addup.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _updateUsername             updates the username for a given user,
 *  . _updatePassword             updates the password for a given user,
 *  . _checkAndRegister           registers the passed-in username if it is free,
 *  . _truncate                   truncates the column values to their max size,
 *  . _update                     updates a just created or an existing user,
 *  . _updateExisting             updates an existing user,
 *  . _addOne                     adds an user,
 *  . _addOrUpdateOne             adds or updates an user,
 *
 *
 * Public Static Methods:
 *  . addOrUpdateOne              adds or updates an user,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0, camelcase: 0 */


// -- Vendor Modules
const KZlog = require('@mobilabs/kzlog');


// -- Local Modules
const config = require('../../../../../../config')
    , Crypto = require('../../../../../../libs/crypto/main')
    , U1     = require('../../../../../_utils/util1')
    , WHO    = require('../../../../../_utils/util4')
    , C      = require('../../../../../_utils/constants')
    , R      = require('../../../../../_utils/constants').roles
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/users/private/use_2_addup.js', level, false)
    ;


// -- Local Variables
let tableStructure
  , columnLength
  ;


// -- Private Functions --------------------------------------------------------

/**
 * Updates the username for a given user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {Object}          the connected user,
 * @param {Object}          the user to update,
 * @param {String}          the new username,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or null,
 * @since 0.0.0
 */
async function _updateUsername(dbi, cn, cuser, user, newname/* , sqlite */) {
  if (!newname) {
    return ['You must provide an username'];
  }

  if (typeof newname !== 'string') {
    return ['You must provide a valid username'];
  }

  if (!user.user_name) {
    return ['The current username is NOT provided!'];
  }

  if (newname === user.user_name) {
    return [null, { id: null, msg: 'The new username is the same as the old one!' }];
  }

  if (!user.id || typeof user.id !== 'number') {
    return ['You must provide an user id!'];
  }

  if (C.RESERVED_WORDS.indexOf(newname) > -1) {
    return [`The username "${newname}" is a reserved word!`];
  }

  if (newname.length > C.USER_NAME_MAX) {
    return [`You user_name is too long. It can't exceed ${C.USER_NAME_MAX} characters!`];
  }

  let sql = 'SELECT id FROM admin_users WHERE user_name = ?';
  const [nuser] = await dbi._lib.query(cn, sql, [newname]);
  if (nuser) {
    return ['This username is already taken!'];
  }

  // Ok, this new username is free, we can take it!
  sql = `
    UPDATE admin_users
      SET user_name = ?
    WHERE user_name = ?
  `;
  const qparams = [
    newname,
    user.user_name,
  ];
  await dbi._lib.query(cn, sql, qparams);

  return [null, { id: user.id }];
}

/**
 * Updates the password for a given user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {Object}          the connected user,
 * @param {Object}          the user to update,
 * @param {String}          the new password,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or null,
 * @since 0.0.0
 */
async function _updatePassword(dbi, cn, cuser, user, newpass/* , sqlite */) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];

  if (!newpass) {
    return ['You must provide a password'];
  }

  if (typeof newpass !== 'string') {
    return ['You must provide a valid password'];
  }

  const hash = await Crypto.hash(newpass);
  const d = U1.getDateTime(new Date());
  const sql = `
    UPDATE admin_users
      SET user_hash = ?, pwd_last_changed = ?
    WHERE user_name = ?
  `;
  const qparams = [hash, d, user.user_name];
  await dbi._lib.query(cn, sql, qparams);

  return [null];
}

/**
 * Registers the passed-in username if it is free.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {Object}          the connected user,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or null,
 * @since 0.0.0
 */
async function _checkAndRegister(dbi, cn, cuser, params/* , sqlite */) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];

  let sql
    ;

  if (!params.user_name) {
    return ['You must provide an username'];
  }

  if (typeof params.user_name !== 'string') {
    return ['You must provide a valid username'];
  }

  if (C.RESERVED_WORDS.indexOf(params.user_name) > -1) {
    return [`The username "${params.user_name}" is a reserved word!`];
  }

  if (params.user_name.length > C.USER_NAME_MAX) {
    return [`Your user_name is too long. It can't exceed ${C.USER_NAME_MAX} characters!`];
  }

  sql = `
    SELECT
      U.id,
      U.user_name,
      CASE WHEN U.role_id = ${R.ROLE_ADMINISTRATOR} THEN 1
           ELSE 0 END AS is_admin
      FROM admin_users AS U
      WHERE U.user_name = ?
  `;
  const [user] = await dbi._lib.query(cn, sql, [params.user_name]);

  if (user) {
    return [null, {
      id: user.user_id,
      user_name: user.user_name,
      is_admin: user.is_admin,
      new: false,
      msg: 'This username is already taken!',
    }];
  }

  if (!params.user_pwd) {
    return ['You must provide a password'];
  }

  if (typeof params.user_pwd !== 'string') {
    return ['You must provide a valid password'];
  }

  // Ok it's free, register it immediately:
  sql = `
    INSERT INTO admin_users
      (
        user_name, user_hash, system_generated_password,
        date_created, created_by_user_id
      )
      VALUES(?, ?, ?, ?, ?)
    `;

  const date = U1.getDateTime(new Date());
  const hash = await Crypto.hash(params.user_pwd);
  const qparams = [
    params.user_name,
    hash,
    0,
    date,
    cuser.id,
  ];
  await dbi._lib.query(cn, sql, qparams);
  const id = await dbi.getLastInsertedId(cn);

  return [null, { id, user_name: params.user_name, new: true }];
}

/**
 * Truncates the column values to their max size.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the user to add or to update,
 * @returns {Object}        returns the user to add or update with truncated columns,
 * @since 0.0.0
 */
/* eslint-disable no-param-reassign, max-len */
function _truncate(nuser) {
  if (nuser.user_name) nuser.user_name = nuser.user_name.slice(0, columnLength.user_name);
  if (nuser.first_name) nuser.first_name = nuser.first_name.slice(0, columnLength.first_name);
  if (nuser.last_name) nuser.last_name = nuser.last_name.slice(0, columnLength.last_name);
  if (nuser.title) nuser.title = nuser.title.slice(0, columnLength.title);

  if (nuser.description) nuser.description = nuser.description.slice(0, columnLength.description);
  if (nuser.department) nuser.department = nuser.department.slice(0, columnLength.department);

  if (nuser.phone_home) nuser.phone_home = nuser.phone_home.slice(0, columnLength.phone_home);
  if (nuser.phone_home_mobile) nuser.phone_home_mobile = nuser.phone_home_mobile.slice(0, columnLength.phone_home_mobile);
  if (nuser.phone_work_office) nuser.phone_work_office = nuser.phone_work_office.slice(0, columnLength.phone_work_office);
  if (nuser.phone_work_mobile) nuser.phone_work_mobile = nuser.phone_work_mobile.slice(0, columnLength.phone_work_mobile);
  if (nuser.phone_other) nuser.phone_other = nuser.phone_other.slice(0, columnLength.phone_other);
  if (nuser.phone_fax) nuser.phone_fax = nuser.phone_fax.slice(0, columnLength.phone_fax);

  if (nuser.assistant) nuser.assistant = nuser.assistant.slice(0, columnLength.assistant);
  if (nuser.assistant_phone) nuser.assistant_phone = nuser.assistant_phone.slice(0, columnLength.assistant_phone);

  if (nuser.primary_address_street) nuser.primary_address_street = nuser.primary_address_street.slice(0, columnLength.primary_address_street);
  if (nuser.primary_address_city) nuser.primary_address_city = nuser.primary_address_city.slice(0, columnLength.primary_address_city);
  if (nuser.primary_address_state) nuser.primary_address_state = nuser.primary_address_state.slice(0, columnLength.primary_address_state);
  if (nuser.primary_address_postal_code) nuser.primary_address_postal_code = nuser.primary_address_postal_code.slice(0, columnLength.primary_address_postal_code);
  if (nuser.primary_address_country) nuser.primary_address_country = nuser.primary_address_country.slice(0, columnLength.primary_address_country);

  if (nuser.alt_address_street) nuser.alt_address_street = nuser.alt_address_street.slice(0, columnLength.alt_address_street);
  if (nuser.alt_address_city) nuser.alt_address_city = nuser.alt_address_city.slice(0, columnLength.alt_address_city);
  if (nuser.alt_address_state) nuser.alt_address_state = nuser.alt_address_state.slice(0, columnLength.alt_address_state);
  if (nuser.alt_address_postal_code) nuser.alt_address_postal_code = nuser.alt_address_postal_code.slice(0, columnLength.alt_address_postal_code);
  if (nuser.alt_address_country) nuser.alt_address_country = nuser.alt_address_country.slice(0, columnLength.alt_address_country);

  if (nuser.website) nuser.website = nuser.website.slice(0, columnLength.website);
  if (nuser.twitter) nuser.twitter = nuser.twitter.slice(0, columnLength.twitter);
  if (nuser.facebook) nuser.facebook = nuser.facebook.slice(0, columnLength.facebook);
  if (nuser.linkedin) nuser.linkedin = nuser.linkedin.slice(0, columnLength.linkedin);

  if (nuser.im_home) nuser.im_home = nuser.im_home.slice(0, columnLength.im_home);
  if (nuser.im_home_surname) nuser.im_home_surname = nuser.im_home_surname.slice(0, columnLength.im_home_surname);
  if (nuser.im_work) nuser.im_work = nuser.im_work.slice(0, columnLength.im_work);
  if (nuser.im_work_surname) nuser.im_work_surname = nuser.im_work_surname.slice(0, columnLength.im_work_surname);

  return nuser;
}
/* eslint-enable no-param-reassign, max-len */

/**
 * Updates a just created or an existing user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user,
 * @param {Object}          the parameters of the user to add or update,
 * @param {Boolean}         true if sqlite false if mysql,
 * @param {Object}          the user to update,
 * @returns {Array}         returns an error message or the added/updated user,
 * @since 0.0.0
 */
async function _update(dbi, cn, cuser, params, sqlite, user) {
  const admin_groups = 'admin_groups'
      , admin_teams  = 'admin_teams'
      , admin_users  = 'admin_users'
      ;

  let coval
    , qparams
    ;

  // Remove the fake columns and delete the columns the user hasn't the
  // rights to modify;
  const nuser = _truncate(U1.filterColumns(params, tableStructure));
  delete nuser.id;
  delete nuser.user_name;
  delete nuser.system_generated_password;
  delete nuser.pwd_last_changed;
  delete nuser.last_login;
  delete nuser.avatar_id;
  delete nuser.photo;
  delete nuser.salutation_id;
  // delete nuser.first_name;
  // delete nuser.last_name;
  delete nuser.birthdate;
  delete nuser.board_of_management;
  // delete nuser.title;
  // delete nuser.description;
  // delete nuser.preferences;
  delete nuser.i18n_locale;
  delete nuser.default_currency;
  delete nuser.date_created;
  delete nuser.date_modified;
  delete nuser.created_by_user_id;
  delete nuser.modified_by_user_id;
  delete nuser.assigned_to_user_id;
  delete nuser.group_id;
  delete nuser.team_id;
  delete nuser.role_id;
  delete nuser.custom_role;
  delete nuser.is_deleted;
  delete nuser.is_locked;
  // delete nuser.department;
  delete nuser.reports_to_user_id;
  // delete nuser.phone_home;
  // delete nuser.phone_home_mobile;
  // delete nuser.phone_work_office;
  // delete nuser.phone_work_mobile;
  // delete nuser.phone_other;
  // delete nuser.phone_fax;
  // delete nuser.assistant;
  // delete nuser.assistant_phone;
  // delete nuser.primary_address_street;
  // delete nuser.primary_address_city;
  // delete nuser.primary_address_state;
  // delete nuser.primary_address_postal_code;
  // delete nuser.primary_address_country;
  delete nuser.primary_latitude;
  delete nuser.primary_longitude;
  // delete nuser.alt_address_street;
  // delete nuser.alt_address_city;
  // delete nuser.alt_address_state;
  // delete nuser.alt_address_postal_code;
  // delete nuser.alt_address_country;
  delete nuser.alt_latitude;
  delete nuser.alt_longitude;
  // delete nuser.website;
  // delete nuser.twitter;
  // delete nuser.facebook;
  // delete nuser.linkedin;
  // delete nuser.im_home;
  // delete nuser.im_home_surname;
  // delete nuser.im_work;
  // delete nuser.im_work_surname

  nuser.id = user.id;
  if (!user.new) {
    nuser.date_modified = U1.getDateTime(new Date());
    nuser.modified_by_user_id = cuser.id;
    nuser.assigned_to_user_id = cuser.id;
  }
  /* eslint-disable-next-line prefer-const */
  [coval, qparams] = U1.getSQLcoval(nuser);
  qparams.pop();

  // params.user_name & params.user_pwd
  // For a new user, _checkAndRegister set the username and
  // password in admin_users table.
  //
  // For an existing user, dbi.masterUpdatePassword updates the password in
  // admin_users_master_all and dbi.masterUpdateUsername updates the username
  // in both admin_users_master_all and admin_users_tenant tables.

  if (params.avatar_id) {
    coval += ', avatar_id = (SELECT IFNULL((SELECT id FROM admin_avatars WHERE id = ?), avatar_id))';
    qparams.push(params.avatar_id);
  }

  if (params.photo_remove) {
    coval += ', photo = ?';
    qparams.push(null);
  }

  if (params.photo && !params.photo_remove) {
    let data;
    if (params.photo.type === 'base64') {
      data = params.photo.header
        ? Buffer.from(params.photo.data.substr(params.photo.header.length), 'base64')
        : Buffer.from(params.photo.data, 'base64')
      ;
    } else if (params.photo.type === 'Buffer') {
      data = Buffer.from(params.photo.data);
    }

    if (Buffer.isBuffer(data) && data.length < C.PHOTO_MAX_SIZE) {
      coval += ', photo = ?';
      qparams.push(data);
    } else if (Buffer.isBuffer(data)) {
      log.warn(`this photo is too big. It exceeds ${C.PHOTO_MAX_SIZE} bytes!`);
    }
  }

  if (params.salutation_id) {
    coval += ', salutation_id = (SELECT IFNULL((SELECT id FROM admin_salutation WHERE id = ?), 1))';
    qparams.push(params.salutation_id);
  }

  if (params.birthdate) {
    const d = new Date(params.birthdate);
    if (!Number.isNaN(d.getTime())) {
      coval += ', birthdate = ?';
      qparams.push(U1.getDateTime(d));
    }
  } else if (params.birthdate === null
    || (typeof params.birthdate === 'string' && params.birthdate.length === 0)) {
    coval += ', birthdate = NULL';
  }

  if (params.board_of_management || params.board_of_management === 0) {
    const n = parseInt(params.board_of_management, 10);
    if (!Number.isNaN(n) && (n === 0 || n === 1)) {
      coval += ', board_of_management = ?';
      qparams.push(n);
    }
  }

  if (params.i18n_locale || params.i18n_locale === 0) {
    coval += ', i18n_locale = (SELECT IFNULL((SELECT language FROM admin_i18n_locales WHERE language = ?), i18n_locale ))';
    qparams.push(params.i18n_locale);
  }

  if (params.default_currency) {
    coval += ', default_currency = (SELECT IFNULL((SELECT iso4217 FROM sales_currencies WHERE iso4217 = ?), default_currency))';
    qparams.push(params.default_currency);
  }

  if (params.assigned_to_user_id) {
    // Assigned to the creator admin only for the time being!
  }

  // Sets group_id, team_id and role_id for an admin user:
  if (params.is_admin === 1 && user.new) {
    coval += ', group_id = ?, team_id = ?, role_id = ?';
    qparams.push(null);
    qparams.push(null);
    qparams.push(R.ROLE_ADMINISTRATOR);
  } else if (params.is_admin === 1) {
    log.warn('A regular user cannot become an admin!');
  }

  // Sets group_id, team_id and role_id for a regular user:
  if (params.is_admin !== 1) {
    let role;
    if (params.role_id) {
      const n = parseInt(params.role_id, 10);
      role = !Number.isNaN(n) ? n : null;
    }

    if (user.new || user.freeOfCharges) {
      // We are here because it's a new user or an user with no link. Thus,
      // we can assign to him any role (except administrator) and any group/team.
      let val;

      switch (role) {
        case R.ROLE_GROUPS_LEADER:
          coval += ', group_id = ?, team_id = ?, role_id = ?';
          qparams.push(null);
          qparams.push(null);
          qparams.push(R.ROLE_GROUPS_LEADER);
          break;

        case R.ROLE_GROUP_LEADER:
          val = user.group_id ? 'group_id' : 1;
          coval += `, group_id = (SELECT IFNULL((SELECT id FROM ${admin_groups} WHERE id = ? AND is_deleted = ?), ${user.new ? 1 : val}))`;
          qparams.push(params.group_id);
          qparams.push(0);

          coval += ', team_id = ?';
          qparams.push(null);

          coval += ', role_id = ?';
          qparams.push(R.ROLE_GROUP_LEADER);
          break;

        case R.ROLE_TEAM_LEADER:
        case R.ROLE_TEAM_MEMBER:
          val = user.team_id ? 'group_id' : 1;
          coval += `, group_id = (SELECT IFNULL((SELECT group_id FROM ${admin_teams} WHERE id = ? AND is_deleted = ?), ${user.new ? 1 : val}))`;
          qparams.push(params.team_id);
          qparams.push(0);

          val = user.team_id ? 'team_id' : 1;
          coval += `, team_id = (SELECT IFNULL((SELECT id FROM ${admin_teams} WHERE id = ? AND is_deleted = ?), ${user.new ? 1 : val}))`;
          qparams.push(params.team_id);
          qparams.push(0);

          coval += ', role_id = ?';
          qparams.push(role);
          break;

        default:
          if (user.role_id === R.ROLE_GROUPS_LEADER) {
            coval += ', group_id = ?, team_id = ?';
            qparams.push(null);
            qparams.push(null);
            break;
          }

          if (user.role_id === R.ROLE_GROUP_LEADER) {
            val = user.group_id ? 'group_id' : 1;
            coval += `, group_id = (SELECT IFNULL((SELECT id FROM ${admin_groups} WHERE id = ? AND is_deleted = ?), ${user.new ? 1 : val}))`;
            qparams.push(params.group_id);
            qparams.push(0);

            coval += ', team_id = ?';
            qparams.push(null);
            break;
          }

          if (user.new
            || user.role_id === R.ROLE_TEAM_LEADER
            || user.role_id === R.ROLE_TEAM_MEMBER
          ) {
            val = user.team_id ? 'group_id' : 1;
            coval += `, group_id = (SELECT IFNULL((SELECT group_id FROM ${admin_teams} WHERE id = ? AND is_deleted = ?), ${user.new ? 1 : val}))`;
            qparams.push(params.team_id);
            qparams.push(0);

            val = user.team_id ? 'team_id' : 1;
            coval += `, team_id = (SELECT IFNULL((SELECT id FROM ${admin_teams} WHERE id = ? AND is_deleted = ?), ${user.new ? 1 : val}))`;
            qparams.push(params.team_id);
            qparams.push(0);

            if (user.new) {
              coval += ', role_id = ?';
              qparams.push(R.ROLE_TEAM_MEMBER);
            }
          }
          break;
      }
    } else {
      // We are here because the selected user has users, accounts, etc.
      // linked to him. Thus, he can only switch from a team leader to
      // a team member and vice-versa. Otherwise, the users, accounts, etc.
      // that are linked to him become orphans if we move him to another
      // team or group.
      switch (role) {
        case R.ROLE_GROUPS_LEADER:
        case R.ROLE_GROUP_LEADER:
          break;

        case R.ROLE_TEAM_LEADER:
        case R.ROLE_TEAM_MEMBER:
          coval += ', role_id = ?';
          qparams.push(role);
          break;

        default:
          break;
      }
    }
  }

  if (params.custom_role) {
    // Not managed for the time being!
  }

  if (params.is_locked || params.is_locked === 0) {
    const n = parseInt(params.is_locked, 10);
    if (!Number.isNaN(n) && (n === 0 || n === 1)) {
      coval += ', is_locked = ?';
      qparams.push(n);
    }
  }

  if (params.reports_to_user_id) {
    if (user.is_admin) {
      coval += ', reports_to_user_id = ?';
      qparams.push(cuser.id);
    }

    if (user.new) {
      let role;
      if (params.role_id) {
        const n = parseInt(params.role_id, 10);
        role = !Number.isNaN(n) ? n : null;
      }

      switch (role) {
        // reports to no one:
        case R.ROLE_GROUPS_LEADER:
          coval += ', reports_to_user_id = ?';
          qparams.push(null);
          break;

        // reports to groups leader if any:
        case R.ROLE_GROUP_LEADER:
          coval += `, reports_to_user_id = (SELECT IFNULL((SELECT id FROM ${admin_users} WHERE role_id = ? AND is_deleted = ? AND id = ?), ?))`;
          qparams.push(R.ROLE_GROUPS_LEADER);
          qparams.push(0);
          qparams.push(params.reports_to_user_id);
          qparams.push(null);
          break;

        // reports to group leader in the same group if any:
        case R.ROLE_TEAM_LEADER:
          coval += `, reports_to_user_id = (SELECT IFNULL((SELECT id FROM ${admin_users} WHERE group_id = ? AND role_id = ? AND is_deleted = ? AND id = ?), ?))`;
          qparams.push(params.group_id);
          qparams.push(R.ROLE_GROUP_LEADER);
          qparams.push(0);
          qparams.push(params.reports_to_user_id);
          qparams.push(null);
          break;

        // reports to team leader in the same team if any:
        case R.ROLE_TEAM_MEMBER:
          coval += `, reports_to_user_id = (SELECT IFNULL((SELECT id FROM ${admin_users} WHERE team_id = ? AND role_id = ? AND is_deleted = ? AND id = ?), ?))`;
          qparams.push(params.team_id);
          qparams.push(R.ROLE_TEAM_LEADER);
          qparams.push(0);
          qparams.push(params.reports_to_user_id);
          qparams.push(null);
          break;

        default:
      }
    }

    if (!user.new) {
      switch (user.role_id) {
        // reports to no one:
        case R.ROLE_GROUPS_LEADER:
          coval += ', reports_to_user_id = ?';
          qparams.push(null);
          break;

        // reports to groups leader if any:
        case R.ROLE_GROUP_LEADER:
          coval += `, reports_to_user_id = (SELECT IFNULL((SELECT id FROM ${admin_users} WHERE role_id = ? AND is_deleted = ? AND id = ?), reports_to_user_id))`;
          qparams.push(R.ROLE_GROUPS_LEADER);
          qparams.push(0);
          qparams.push(params.reports_to_user_id);
          break;

        // reports to group leader in the same group if any:
        case R.ROLE_TEAM_LEADER:
          coval += `, reports_to_user_id = (SELECT IFNULL((SELECT id FROM ${admin_users} WHERE group_id = ? AND role_id = ? AND is_deleted = ? AND id = ?), reports_to_user_id))`;
          qparams.push(user.group_id);
          qparams.push(R.ROLE_GROUP_LEADER);
          qparams.push(0);
          qparams.push(params.reports_to_user_id);
          break;

        // reports to team leader in the same team if any:
        case R.ROLE_TEAM_MEMBER:
          coval += `, reports_to_user_id = (SELECT IFNULL((SELECT id FROM ${admin_users} WHERE team_id = ? AND role_id = ? AND is_deleted = ? AND id = ?), reports_to_user_id))`;
          qparams.push(user.team_id);
          qparams.push(R.ROLE_TEAM_LEADER);
          qparams.push(0);
          qparams.push(params.reports_to_user_id);
          break;

        default:
      }
    }
  }

  if (params.reports_to_user_id === null) {
    coval += ', reports_to_user_id = ?';
    qparams.push(null);
  }

  if (params.primary_latitude === null || params.primary_longitude === null) {
    // one null => both null
    coval += ', primary_latitude = ?, primary_longitude = ?';
    qparams.push(null);
    qparams.push(null);
  } else if (params.primary_latitude !== undefined && params.primary_longitude !== undefined) {
    // both well defined => ok else ignored
    if (!Number.isNaN(parseFloat(params.primary_latitude))
      && !Number.isNaN(parseFloat(params.primary_longitude))
      && params.primary_latitude >= -90 && params.primary_latitude <= 90
      && params.primary_longitude >= -180 && params.primary_longitude <= 180
    ) {
      coval += ', primary_latitude = ?, primary_longitude = ?';
      qparams.push(params.primary_latitude);
      qparams.push(params.primary_longitude);
    }
  } else if (params.primary_latitude !== undefined) {
    // latitude well defined, longitude can't remain null
    if (!Number.isNaN(parseFloat(params.primary_latitude))
      && params.primary_latitude >= -90 && params.primary_latitude <= 90
    ) {
      coval += ', primary_latitude = ?';
      coval += `, primary_longitude = (SELECT IFNULL((SELECT primary_longitude FROM ${admin_users} WHERE id = ?), ?))`;
      qparams.push(params.primary_latitude);
      qparams.push(nuser.id);
      qparams.push(0);
    }
  } else if (params.primary_longitude !== undefined) {
    // longitude well defined, latitude can't remain null
    if (!Number.isNaN(parseFloat(params.primary_longitude))
      && params.primary_longitude >= -180 && params.primary_longitude <= 180
    ) {
      coval += ', primary_longitude = ?';
      coval += `, primary_latitude = (SELECT IFNULL((SELECT primary_latitude FROM ${admin_users} WHERE id = ?), ?))`;
      qparams.push(params.primary_longitude);
      qparams.push(nuser.id);
      qparams.push(0);
    }
  }

  if (params.alt_latitude === null || params.alt_longitude === null) {
    // one null => both null
    coval += ', alt_latitude = ?, alt_longitude = ?';
    qparams.push(null);
    qparams.push(null);
  } else if (params.alt_latitude !== undefined && params.alt_longitude !== undefined) {
    // both well defined => ok else ignored
    if (!Number.isNaN(parseFloat(params.alt_latitude))
      && !Number.isNaN(parseFloat(params.alt_longitude))
      && params.alt_latitude >= -90 && params.alt_latitude <= 90
      && params.alt_longitude >= -180 && params.alt_longitude <= 180
    ) {
      coval += ', alt_latitude = ?, alt_longitude = ?';
      qparams.push(params.alt_latitude);
      qparams.push(params.alt_longitude);
    }
  } else if (params.alt_latitude !== undefined) {
    // latitude well defined, longitude can't remain null
    if (!Number.isNaN(parseFloat(params.alt_latitude))
      && params.alt_latitude >= -90 && params.alt_latitude <= 90
    ) {
      coval += ', alt_latitude = ?';
      coval += `, alt_longitude = (SELECT IFNULL((SELECT alt_longitude FROM ${admin_users} WHERE id = ?), ?))`;
      qparams.push(params.alt_latitude);
      qparams.push(nuser.id);
      qparams.push(0);
    }
  } else if (params.alt_longitude !== undefined) {
    // longitude well defined, latitude can't remain null
    if (!Number.isNaN(parseFloat(params.alt_longitude))
      && params.alt_longitude >= -180 && params.alt_longitude <= 180
    ) {
      coval += ', alt_longitude = ?';
      coval += `, alt_latitude = (SELECT IFNULL((SELECT alt_latitude FROM ${admin_users} WHERE id = ?), ?))`;
      qparams.push(params.alt_longitude);
      qparams.push(nuser.id);
      qparams.push(0);
    }
  }

  const sql = `
    UPDATE ${admin_users}
      SET ${coval}
    WHERE id = ?
  `;
  qparams.push(nuser.id);
  await dbi._lib.query(cn, sql, qparams);

  return [null, { id: nuser.id }];
}

/**
 * Updates an existing user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user,
 * @param {Object}          the parameters of the user to add or update,
 * @param {Boolean}         true if sqlite false if mysql,
 * @param {Object}          the user to update,
 * @returns {Array}         returns an error message or the added/updated user,
 * @since 0.0.0
 */
/* eslint-disable no-param-reassign */
async function _updateExisting(dbi, cn, cuser, params, sqlite, user) {
  // You are here because you attempt to update an existing user. First,
  // we have to check that the user you try to update is the tenant admin.
  // If it is the case we have to apply a few restrictions:
  if (user.role_id === R.ROLE_ADMINISTRATOR
      && params.role_id
      && params.role_id !== R.ROLE_ADMINISTRATOR
  ) {
    return [null, { id: null, msg: 'You cannot modify the role of an administrator!' }];
  }

  if (user.role_id === R.ROLE_ADMINISTRATOR) {
    params.is_admin = 1;
  }

  if (user.id === 1 && params.user_name && params.user_name !== user.user_name) {
    return [null, { id: null, msg: 'You cannot modify the user_name of user 1.' }];
  }

  if (user.id === 1
    && (params.is_admin === 0 || params.is_deleted || params.is_locked)
  ) {
    return [null, { id: null, msg: 'You cannot modify is_deleted, is_locked, is_admin for user 1.' }];
  }

  if (params.first_name && typeof params.first_name !== 'string') {
    return [null, { id: null, msg: 'You must provide a valid first name!' }];
  }

  if (params.last_name && typeof params.last_name !== 'string') {
    return [null, { id: null, msg: 'You must provide a valid last name!' }];
  }

  if (user.is_admin) {
    delete params.group_id;
    delete params.team_id;
  }

  // Update password if requested:
  if (params.user_pwd) {
    if (typeof params.user_pwd !== 'string') {
      return [null, { id: null, msg: 'You must provide a valid password!' }];
    }
    await _updatePassword(dbi, cn, cuser, user, params.user_pwd, sqlite);
    delete params.user_pwd;
  }

  // Update the username if there isn't an attempt to stole an
  // existing username:
  if (params.user_name && params.user_name !== user.user_name) {
    const [err] = await _updateUsername(dbi, cn, cuser, user, params.user_name, sqlite);
    if (err) {
      return [null, { id: null, msg: err }];
    }
    delete params.user_name;
  }

  if (!user.is_admin && !user.number_users_assigned_to_user) {
    // If we are here it is because there is an attempt to update the
    // user by identifying it through its username instead of id. In this
    // case we get only a limited set of columns. Thus we have to get the
    // missing ones to check if the user can switch from one team or group
    // to another.
    [, user] = await dbi.adminUserGetOne(cuser, { id: params.id });
  }

  if (user.number_users_assigned_to_user === 0
    && user.number_users_reports_to_user === 0
  ) {
    user.freeOfCharges = true;
  }

  // Ok, let's go:
  return _update(dbi, cn, cuser, params, sqlite, user);
}
/* eslint-enable no-param-reassign */

/**
 * Adds an user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user,
 * @param {Object}          the parameters of the user to add or update,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the added user,
 * @since 0.0.0
 */
/* eslint-disable no-param-reassign */
async function _addOne(dbi, cn, cuser, params, sqlite, user) {
  delete params.user_name;
  delete params.user_pwd;

  if (params.first_name && typeof params.first_name !== 'string') {
    return [null, { id: null, msg: 'You must provide a valid first name!' }];
  }

  if (typeof params.last_name !== 'string') {
    return [null, { id: null, msg: 'You must provide a valid last name!' }];
  }

  if (user.is_admin) {
    params.is_admin = user.is_admin;
  }

  return _update(dbi, cn, cuser, params, sqlite, user);
}
/* eslint-enable no-param-reassign */

/**
 * Adds or updates an user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user,
 * @param {Object}          the parameters of the user to add or update,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the added/updated user,
 * @since 0.0.0
 */
/* eslint-disable no-param-reassign */
async function _addOrUpdateOne(dbi, cn, cuser, params, sqlite) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];

  if (!tableStructure) {
    tableStructure = await dbi.getTableStructure(cn, 'admin_users');
    columnLength = U1.extractColumnLength(tableStructure);
  }

  if (params.id) {
    const [, user] = await dbi.adminUserGetOne(cuser, { id: params.id, user_id: params.user_id });
    return user
      ? _updateExisting(dbi, cn, cuser, params, sqlite, user)
      : [null, { id: null, msg: `The record "${params.id}" does NOT exist!` }];
  }

  const [error, resp] = await _checkAndRegister(dbi, cn, cuser, params, sqlite);
  if (error || !resp.id) {
    return [null, { id: null, msg: error || resp.msg }];
  }

  if (resp.new) {
    return _addOne(dbi, cn, cuser, params, sqlite, {
      id: resp.id,
      user_name: resp.user_name,
      is_admin: params.role_id === R.ROLE_ADMINISTRATOR ? 1 : 0,
      new: true,
    });
  }

  params.id = resp.id;
  return _updateExisting(dbi, cn, cuser, params, sqlite, {
    id: resp.id,
    user_name: resp.user_name,
    is_admin: resp.is_admin,
    new: false,
  });
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Adds or updates an user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the parameters of the user to add or update,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the added/updated user,
   * @since 0.0.0
   */
  addOrUpdateOne(dbi, cn, cuser, params, sqlite) {
    return _addOrUpdateOne(dbi, cn, cuser, params, sqlite);
  },
};


// -- Export
module.exports = methods;
