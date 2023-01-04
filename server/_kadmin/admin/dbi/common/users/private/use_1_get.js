/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * use_1_get.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getMe                      returns the credentials of the connected user,
 *
 *
 * Public Static Methods:
 *  . getMe                       returns the credentials of the connected user,
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
const KZlog = require('@mobilabs/kzlog');


// -- Local Modules
const config = require('../../../../../../config')
    , UT     = require('../../../tables/users')
    , U3     = require('../../../../../_utils/util3')
    , pk     = require('../../../../../../../package.json')
    , WHO    = require('../../../../../_utils/util4')
    , C      = require('../../../../../_utils/constants')
    , LU1    = require('../../../../../_utils/util5')
    ;


// -- Local Constants
const TABLE_USERS = 'admin_users'
    // These are the unauthorized columns for a query:
    , F4TEAMS     = []
    , F4EXTRA     = [{ name: 'full_name' }]
    , { level }   = config
    , log         = KZlog('_kadmin/admin/dbi/common/users/private/use_1_get.js', level, false)
    ;


// -- Local Variables
let tableStructure;


// -- Private Functions --------------------------------------------------------

/**
 * Returns the credentials of the connected user.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user executing the operation,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the user's credentials,
 * @since 0.0.0
 */
async function _getMe(dbi, cn, username, sqlite) {
  let sql = `
    SELECT
      U.id,
      U.user_name,
      U.user_hash,
      U.avatar_id,
      IFNULL(U.photo, AV.picture) AS photo,
      U.first_name,
      U.last_name,
      U.title,
      U.preferences,
      U.i18n_locale,
      U.default_currency,
      U.group_id,
      U.team_id,
      U.role_id,
      U.custom_role,
      U.is_deleted,
      U.is_locked,
      CASE WHEN U.role_id = 1 THEN 1 ELSE 0 END AS is_admin,
      U.phone_work_office,
      U.phone_work_mobile,
      U.primary_address_city,
      U.primary_address_country,
      U1.user_name AS assigned_to_user_name,
      SA.name AS salutation,
      UE.email AS primary_email,
      {{sql:name}},
      {{sql:full_name}},
      (SELECT server_version FROM admin_db_versions ORDER BY ID DESC LIMIT 1) AS server_db_version,
      (SELECT db_version FROM admin_db_versions ORDER BY ID DESC LIMIT 1) AS database_version,
      {{sql:library:version}}
    FROM admin_users AS U
    LEFT JOIN admin_avatars AS AV ON AV.id = U.avatar_id
    LEFT JOIN admin_users AS U1 ON U1.id = U.assigned_to_user_id
    LEFT JOIN admin_salutation AS SA ON SA.id = U.salutation_id
    LEFT JOIN admin_users_emails AS UE ON UE.user_id = U.id AND UE.is_deleted = 0 AND UE.is_primary_email = 1 AND UE.is_invalid_email = 0 AND UE.is_opted_out = 0
    WHERE U.user_name = ?
  `;

  sql = sqlite
    ? sql.replace('{{sql:name}}', 'IFNULL(U.first_name, "") || " " || U.last_name AS name')
    : sql.replace('{{sql:name}}', 'CONCAT(COALESCE(U.first_name, ""), " ", U.last_name) AS name');

  sql = sqlite
    ? sql.replace('{{sql:full_name}}', 'SA.name || " " || IFNULL(U.first_name, "") || " " || U.last_name AS full_name')
    : sql.replace('{{sql:full_name}}', 'CONCAT(SA.name, " ", COALESCE(U.first_name, ""), " ", U.last_name) AS full_name');

  sql = sqlite
    ? sql.replace('{{sql:library:version}}', '(SELECT sqlite_version()) AS sqlite_library_version')
    : sql.replace('{{sql:library:version}}', '(SELECT VERSION()) AS mysql_server_version');

  const [me] = await dbi._lib.query(cn, sql, [username]);
  if (!me) return [null, null];

  // Add current server version:
  me.server_version = pk.version;

  // Decodes preferences.
  try {
    me.preferences = me.preferences ? JSON.parse(me.preferences) : {};
  } catch (e) {
    me.preferences = {};
  }

  // Attaches extra parameters required by the API /api/v1/users/online.
  me.auth = {
    list_right: true, view_right: false, edit_right: false, delete_right: false,
  };
  // This is because 'dbn/PicoDB' doesn't manage properly buffers.
  if (me.photo) me._arrayphoto = [...me.photo];


  // Attaches access rights to the connected user:
  me.access_rights = [];
  let custom
    , role
    , rmember = {}
    ;

  if (me.custom_role) {
    sql = `
      SELECT
        module_id,
        access_right,
        list_right,
        view_right,
        edit_right,
        delete_right,
        mass_update_right,
        import_right,
        export_right
      FROM admin_users_access
      WHERE user_id = ?
    `;
    custom = await dbi._lib.query(cn, sql, [me.id]);
  }

  if (me.role_id) {
    sql = `
      SELECT
        module_id,
        access_right,
        list_right,
        view_right,
        edit_right,
        delete_right,
        mass_update_right,
        import_right,
        export_right
      FROM admin_roles_access
      WHERE role_id = ?
    `;
    role = await dbi._lib.query(cn, sql, [me.role_id]);
  }

  sql = `
    SELECT
      module_id,
      access_right,
      list_right,
      view_right,
      edit_right,
      delete_right,
      mass_update_right,
      import_right,
      export_right
    FROM admin_roles_access
    WHERE role_id = (SELECT id FROM admin_roles WHERE name = ?)
  `;
  rmember = await dbi._lib.query(cn, sql, ['Team Member']);
  me.access_rights = LU1.mergeAccessRights(custom, role, rmember);
  me.access_legend = UT.getUsersAccessRightsList();
  me.modules = await dbi._lib.query(cn, 'SELECT id, name FROM admin_modules', []);
  return [null, me];
}

/**
 * Returns the requested user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user executing the operation,
 * @param {Object}          the query,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the user's credentials,,
 * @since 0.0.0
 */
async function _getOne(dbi, cn, cuser, query, sqlite) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];


  // Ok, let's go!
  let sql
    ;

  sql = `
    SELECT
      U.*,
      IFNULL(U.photo, AV.picture) AS photo,
      U1.user_name AS created_by_user_name,
      U2.user_name AS modified_by_user_name,
      U3.user_name AS assigned_to_user_name,
      SA.name AS salutation_name,
      G1.name AS group_name,
      T1.name AS team_name,
      R1.name AS role_name,
      {{sql:name}},
      {{sql:full_name}},
      {{sql:reportsTo}},
      (SELECT COUNT(id) FROM admin_users WHERE assigned_to_user_id = U.id AND is_deleted = ?) AS number_users_assigned_to_user,
      (SELECT COUNT(id) FROM admin_users WHERE reports_to_user_id = U.id AND is_deleted = ?) AS number_users_reports_to_user
    FROM admin_users AS U
    LEFT JOIN admin_avatars AS AV ON AV.id = U.avatar_id
    LEFT JOIN admin_users AS U1 ON U1.id = U.created_by_user_id
    LEFT JOIN admin_users AS U2 ON U2.id = U.modified_by_user_id
    LEFT JOIN admin_users AS U3 ON U3.id = U.assigned_to_user_id
    LEFT JOIN admin_users AS U4 ON U4.id = U.reports_to_user_id
    LEFT JOIN admin_salutation AS SA ON SA.id = U.salutation_id
    LEFT JOIN admin_groups AS G1 ON G1.id = U.group_id
    LEFT JOIN admin_teams AS T1 ON T1.id = U.team_id
    LEFT JOIN admin_roles AS R1 ON R1.id = U.role_id
    WHERE (U.id = ? OR U.user_name = ?) AND U.is_deleted = ?
  `;

  sql = sqlite
    ? sql.replace('{{sql:name}}', 'IFNULL(U.first_name, "") || " " || U.last_name AS name')
    : sql.replace('{{sql:name}}', 'CONCAT(COALESCE(U.first_name, ""), " ", U.last_name) AS name');

  sql = sqlite
    ? sql.replace('{{sql:full_name}}', 'SA.name || " " || IFNULL(U.first_name, "") || " " || U.last_name AS full_name')
    : sql.replace('{{sql:full_name}}', 'CONCAT(SA.name, " ", COALESCE(U.first_name, ""), " ", U.last_name) AS full_name');

  sql = sqlite
    ? sql.replace('{{sql:reportsTo}}', 'IFNULL(U4.first_name, "") || " " || U4.last_name AS reports_to_user_name')
    : sql.replace('{{sql:reportsTo}}', 'CONCAT(COALESCE(U4.first_name, ""), " ", U4.last_name) AS reports_to_user_name');

  const qparams = [0, 0, query.id, query.user_name, 0];
  const [user] = await dbi._lib.query(cn, sql, qparams);

  if (user) {
    // Delete unwanted discovered column/properties:
    delete user.user_hash;

    // Get the associated emails if any:
    sql = 'SELECT * FROM admin_users_emails WHERE user_id = ? AND is_deleted = ?';
    user.emails = await dbi._lib.query(cn, sql, [user.id, 0]);

    // Provisoire:
    user.auth = {
      list_right: true, view_right: true, edit_right: true, delete_right: true,
    };
    if (user.id === 1
      || user.number_users_assigned_to_user > 0
      || user.number_users_reports_to_user > 0
    ) {
      user.auth.delete_right = false;
    }
  }

  return user ? [null, user] : [null, null];
}

/**
 * Returns a list of users.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the connected user executing the operation,
 * @param {Object}          the query,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the a list of users,
 * @since 0.0.0
 */
async function _getMany(dbi, cn, cuser, query, sqlite) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];


  // Ok, let's go!
  let users
    , sql
    , clauses
    , qparams
    ;

  sql = `
    SELECT
      U.id,
      U.user_name,
      U.salutation_id,
      U.first_name,
      U.last_name,
      U.title,
      U.group_id,
      U.team_id,
      U.role_id,
      U.is_locked,
      U.phone_work_office,
      U.phone_work_mobile,
      U.primary_address_city,
      U.primary_address_country,
      U.twitter,
      U.linkedin,
      IFNULL(U.photo, AV.picture) AS photo,
      U1.user_name AS created_by_user_name,
      U2.user_name AS modified_by_user_name,
      U3.user_name AS assigned_to_user_name,
      SA.name AS salutation_name,
      G1.name AS group_name,
      T1.name AS team_name,
      R1.name AS role_name,
      {{sql:name}},
      {{sql:full_name}},
      {{sql:reportsTo}},
      UE.email AS primary_email,
      (SELECT COUNT(id) FROM admin_users WHERE assigned_to_user_id = U.id AND is_deleted = ?) AS number_users_assigned_to_user,
      (SELECT COUNT(id) FROM admin_users WHERE reports_to_user_id = U.id AND is_deleted = ?) AS number_users_reports_to_user
    FROM admin_users AS U
    LEFT JOIN admin_avatars AS AV ON AV.id = U.avatar_id
    LEFT JOIN admin_users AS U1 ON U1.id = U.created_by_user_id
    LEFT JOIN admin_users AS U2 ON U2.id = U.modified_by_user_id
    LEFT JOIN admin_users AS U3 ON U3.id = U.assigned_to_user_id
    LEFT JOIN admin_users AS U4 ON U4.id = U.reports_to_user_id
    LEFT JOIN admin_salutation AS SA ON SA.id = U.salutation_id
    LEFT JOIN admin_groups AS G1 ON G1.id = U.group_id
    LEFT JOIN admin_teams AS T1 ON T1.id = U.team_id
    LEFT JOIN admin_roles AS R1 ON R1.id = U.role_id
    LEFT JOIN admin_users_emails AS UE ON UE.user_id = U.id AND UE.is_deleted = 0 AND UE.is_primary_email = 1 AND UE.is_invalid_email = 0 AND UE.is_opted_out = 0
    WHERE {{sql:conds}}
    LIMIT ?, ?
  `;

  sql = sqlite
    ? sql.replace('{{sql:name}}', 'IFNULL(U.first_name, "") || " " || U.last_name AS name')
    : sql.replace('{{sql:name}}', 'CONCAT(COALESCE(U.first_name, ""), " ", U.last_name) AS name');

  sql = sqlite
    ? sql.replace('{{sql:full_name}}', 'SA.name || " " || IFNULL(U.first_name, "") || " " || U.last_name AS full_name')
    : sql.replace('{{sql:full_name}}', 'CONCAT(SA.name, " ", COALESCE(U.first_name, ""), " ", U.last_name) AS full_name');

  sql = sqlite
    ? sql.replace('{{sql:reportsTo}}', 'IFNULL(U4.first_name, "") || " " || U4.last_name AS reports_to_user_name')
    : sql.replace('{{sql:reportsTo}}', 'CONCAT(COALESCE(U3.first_name, ""), " ", U4.last_name) AS reports_to_user_name');

  if (!tableStructure) {
    tableStructure = await dbi.getTableStructure(cn, TABLE_USERS);
  }

  qparams = [0, 0];
  const [limit, conds, wconds, xconds] = U3.getSQLQueryAndLimit(query, tableStructure, F4TEAMS, F4EXTRA, 'U');

  if (conds && wconds) {
    clauses = `(${conds.clause}) AND (${wconds}) AND U.is_deleted = ?`;
    qparams = qparams.concat(conds.values);
    qparams.push(0);
  } else if (conds) {
    clauses = `(${conds.clause}) AND U.is_deleted = ?`;
    qparams = qparams.concat(conds.values);
    qparams.push(0);
  } else if (wconds) {
    clauses = `(${wconds}) AND U.is_deleted = ?`;
    qparams.push(0);
  } else {
    clauses = 'U.is_deleted = ?';
    qparams.push(0);
  }

  /* eslint-disable max-len */
  // MySQL doesn't recognize the composite column full_name in the
  // WHERE clause. We have two options: using HAVING or regenerating
  // full_name in the WHERE clause:
  //  . WHERE {{sql:conds}} HAVING full_name LIKE "%John S%"
  //  . WHERE {{sql:conds}} AND CONCAT(SA.name, " ", COALESCE(U.first_name, ""), " ", U.last_name) LIKE "%John S%"
  //
  /* eslint-enable max-len */
  if (xconds) {
    clauses += sqlite
      ? ` AND ${xconds}`
      : ` HAVING ${xconds}`;
  }
  sql = sql.replace('{{sql:conds}}', clauses);
  qparams.push(limit.offset);
  qparams.push(limit.numbers);

  try {
    users = await dbi._lib.query(cn, sql, qparams);
  } catch (e) {
    log.warn(`dbi.getMany query failed! The clause "${wconds}" is badly formed!`);
    users = null;
  }

  // Provisoire
  if (users) {
    for (let i = 0; i < users.length; i++) {
      /* eslint-disable-next-line object-curly-newline */
      users[i].auth = { list_right: true, view_right: true, edit_right: true, delete_right: true };
      if (users[i].id === 1
        || users[i].number_users_assigned_to_user > 0
        || users[i].number_users_reports_to_user > 0
      ) {
        users[i].auth.delete_right = false;
      }
    }
  }

  return [null, users];
}

/**
 * Checks if the passed-in username is already taken.
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
async function _isUsernameAlreadyTaken(dbi, cn, cuser, username/* , sqlite */) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];

  if (!username) {
    return ['You must provide an username'];
  }

  if (typeof username !== 'string') {
    return ['You must provide a valid username'];
  }

  if (C.RESERVED_WORDS.indexOf(username) > -1) {
    return [`The username "${username}" is a reserved word!`];
  }

  if (username.length > C.USER_NAME_MAX) {
    return [`Your user_name is too long. It can't exceed ${C.USER_NAME_MAX} characters!`];
  }

  const sql = 'SELECT id, user_name FROM admin_users WHERE user_name = ?';
  const [user] = await dbi._lib.query(cn, sql, [username]);
  if (user) {
    return [null, { user_name: user.user_name, msg: 'This username is already taken!' }];
  }
  return [null, { user_name: null, msg: `This username "${username}" is not yet registered. You can use it!` }];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Returns the credentials of the connected user.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the user's credentials,
   * @since 0.0.0
   */
  getMe(dbi, cn, username, sqlite) {
    return _getMe(dbi, cn, username, sqlite);
  },

  /**
   * Returns an user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the user's credentials,
   * @since 0.0.0
   */
  getOne(dbi, cn, cuser, query, sqlite) {
    return _getOne(dbi, cn, cuser, query, sqlite);
  },

  /**
   * Returns a list of users.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the a list of users,
   * @since 0.0.0
   */
  getMany(dbi, cn, cuser, query, sqlite) {
    return _getMany(dbi, cn, cuser, query, sqlite);
  },

  /**
   * Checks if the passed-in username is already taken.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {String}        the username to check,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or null,
   * @since 0.0.0
   */
  isUsernameAlreadyTaken(dbi, cn, cuser, username, sqlite) {
    return _isUsernameAlreadyTaken(dbi, cn, cuser, username, sqlite);
  },
};


// -- Export
module.exports = methods;
