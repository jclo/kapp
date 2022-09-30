/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * use_3_del.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _deleteOne                  deletes the specified user,
 *  . _deleteMany                 deletes the specified users,
 *
 *
 * Public Static Methods:
 *  . deleteOne                   deletes the specified user,
 *  . deleteMany                  deletes the specified users,
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
    , U1     = require('../../../../../_utils/util1')
    , U2     = require('../../../../../_utils/util2')
    , WHO    = require('../../../../../_utils/util4')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/users/private/use_3_del.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Deletes the specified user.
 *
 * @method (arg1, arg2, arg3, arg4, arg5)
 * @public
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {Object}          the connected user,
 * @param {Object}          the credentials of the user to delete,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the deleted user,
 * @since 0.0.0
 */
async function _deleteOne(dbi, cn, cuser, query/* , sqlite */) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];

  // Ok, let's go on!
  const admin_users         = 'admin_users'
      , admin_users_emails  = 'admin_users_emails'
      ;

  let sql
    , qparams
    ;

  // First try to retrieve the requested user from the db:
  sql = `
    SELECT
      U.*,
      (SELECT COUNT(id) FROM ${admin_users} WHERE assigned_to_user_id = U.id AND is_deleted = ?) AS number_users_assigned_to_user,
      (SELECT COUNT(id) FROM ${admin_users} WHERE reports_to_user_id = U.id AND is_deleted = ?) AS number_users_reports_to_user
    FROM ${admin_users} AS U WHERE (U.id = ? OR U.user_name = ?) AND U.is_deleted = ?
  `;
  qparams = [0, 0, query.id, query.user_name, 0];
  const [res] = await dbi._lib.query(cn, sql, qparams);

  if (!res) {
    return [null, { id: null, msg: 'Your id or user_name does not match any user!' }];
  }

  if (res.id === 1) {
    return ['Operation refused. The principal admin user cannot be deleted!'];
  }

  if (res.number_users_assigned_to_user > 0
    || res.number_users_reports_to_user > 0
  ) {
    return [null, { id: null, msg: 'This user is assigned to multiple elements (accounts, contacts, etc.). It can\'t be deleted!' }];
  }

  // Ok, proceed:
  sql = `
    UPDATE ${admin_users}
      SET date_modified = ?, modified_by_user_id = ?, is_deleted = ?
    WHERE id = ?
  `;
  qparams = [U1.getDateTime(new Date()), cuser.id, 1, res.id];
  await dbi._lib.query(cn, sql, qparams);

  // Delete all the emails that belong to this user:
  sql = `
    UPDATE ${admin_users_emails}
      SET date_modified = ?, modified_by_user_id = ?, is_deleted = ?
    WHERE user_id = ?
  `;
  qparams = [U1.getDateTime(new Date()), cuser.id, 1, res.id];
  await dbi._lib.query(cn, sql, qparams);

  return [null, { id: res.id }];
}

/**
 * Deletes the specified users.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the session user,
 * @param {Object}          the query,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the deleted users,
 * @since 0.0.0
 */
/* eslint-disable no-await-in-loop */
async function _deleteMany(dbi, cn, cuser, query/* , sqlite */) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];


  // Ok, let's go on!
  const admin_users         = 'admin_users'
      , admin_users_emails  = 'admin_users_emails'
      ;

  let cids
    , sql
    , qparams
    , index
    ;

  // Extracts ids and generate WHERE conditions:
  const [rids, rejected, excluded] = U2.extractIds(query.ids, [1]);
  if (rids.length === 0) return [null, { deleted: [], rejected, excluded }];
  cids = '(';
  for (let i = 0; i < rids.length; i++) {
    cids += i === 0 ? `U.id = ${rids[i]}` : ` OR U.id = ${rids[i]}`;
  }
  cids += ')';

  // Retrieve the selected items from the db and reject the users that are
  // assigned to accounts or contacts, etc.
  sql = `
    SELECT
      U.id,
      (SELECT COUNT(id) FROM ${admin_users} WHERE assigned_to_user_id = U.id AND is_deleted = ?) AS number_users_assigned_to_user,
      (SELECT COUNT(id) FROM ${admin_users} WHERE reports_to_user_id = U.id AND is_deleted = ?) AS number_users_reports_to_user
    FROM ${admin_users} AS U WHERE ${cids} AND U.is_deleted = ?
  `;
  const res = await dbi._lib.query(cn, sql, [0, 0, 0]);

  const nids = [];
  for (let i = 0; i < res.length; i++) {
    if (res[i].number_users_assigned_to_user === 0
      && res[i].number_users_reports_to_user === 0
    ) {
      nids.push(res[i].id);
    }
  }

  const reject = [...rids];
  for (let i = 0; i < nids.length; i++) {
    index = reject.indexOf(nids[i]);
    if (index > -1) reject.splice(index, 1);
  }
  if (nids.length === 0) {
    return [null, { deleted: [], rejected: reject.concat(rejected), excluded }];
  }

  cids = '(';
  for (let i = 0; i < nids.length; i++) {
    cids += i === 0 ? `id = ${nids[i]}` : ` OR id = ${nids[i]}`;
  }
  cids += ')';

  // Ok, now we got the list of 'deleteable' users, we can proceed:
  sql = `
    UPDATE ${admin_users}
      SET date_modified = ?, modified_by_user_id = ?, is_deleted = ?
    WHERE ${cids}
  `;
  qparams = [U1.getDateTime(new Date()), cuser.id, 1];
  await dbi._lib.query(cn, sql, qparams);

  // Now, retrieve the deleted users:
  sql = `
    SELECT
      id,
      user_name,
      first_name,
      last_name,
      is_deleted
    FROM ${admin_users} WHERE ${cids} AND is_deleted = ?
    `;
  const udel = await dbi._lib.query(cn, sql, [1]);

  // Delete the associated emails
  const ecids = cids.replace(/id =/g, 'user_id =');

  sql = `
    UPDATE ${admin_users_emails}
      SET date_modified = ?, modified_by_user_id = ?, is_deleted = ?
    WHERE ${ecids}
  `;
  qparams = [U1.getDateTime(new Date()), cuser.id, 1];
  await dbi._lib.query(cn, sql, qparams);

  return [null, { deleted: udel, rejected: reject.concat(rejected), excluded }];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Deletes the specified user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the deleted user,
   * @since 0.0.0
   */
  deleteOne(dbi, cn, cuser, query, sqlite) {
    return _deleteOne(dbi, cn, cuser, query, sqlite);
  },

  /**
   * Deletes the specified users.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {String}        the session user,
   * @param {Object}        the query,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the deleted users,
   * @since 0.0.0
   */
  deleteMany(dbi, cn, cuser, query, sqlite) {
    return _deleteMany(dbi, cn, cuser, query, sqlite);
  },
};


// -- Export
module.exports = methods;
