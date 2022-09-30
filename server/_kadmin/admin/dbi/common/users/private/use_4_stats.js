/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * use_4_stats.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _count                      counts the owned users,
 *
 *
 * Public Static Methods:
 *  . count                       counts the owned users,
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
    , U3     = require('../../../../../_utils/util3')
    , WHO    = require('../../../../../_utils/util4')
    , LU2    = require('../../_util/util2')
    ;


// -- Local Constants
const F4TEAMS     = []
    , F4EXTRA     = [{ name: 'full_name' }]
    , { level }   = config
    , log         = KZlog('_kadmin/admin/dbi/common/users/private/use_4_stats.js', level, false)
    ;


// -- Local Variables
let tableStructure;


// -- Private Functions --------------------------------------------------------

/**
 * Counts the owned users.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the session user,
 * @param {Object}          the query,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the counted items,
 * @since 0.0.0
 */
async function _count(dbi, cn, cuser, query, sqlite) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];


  // Ok, let's go on!
  let users
    , sql
    , clauses
    , qparams
    ;

  sql = `
    SELECT
      U.id,
      U.assigned_to_user_id,
      U.group_id,
      U.team_id,
      U.role_id,
      U.is_locked,
      CASE WHEN U.role_id < 2 THEN 1 ELSE 0 END AS is_admin,
      {{sql:full_name}}
    FROM admin_users AS U
    LEFT JOIN admin_salutation AS SA ON SA.id = U.salutation_id
    WHERE {{sql:conds}}
  `;

  sql = sqlite
    ? sql.replace('{{sql:full_name}}', 'SA.name || " " || IFNULL(U.first_name, "") || " " || U.last_name AS full_name')
    : sql.replace('{{sql:full_name}}', 'CONCAT(SA.name, " ", COALESCE(U.first_name, ""), " ", U.last_name) AS full_name');

  if (!tableStructure) {
    tableStructure = await dbi.getTableStructure(cn, `admin_users_${cuser.tenant_uid}`);
  }

  qparams = [];
  const [, conds, wconds, xconds] = U3.getSQLQueryAndLimit(query, tableStructure, F4TEAMS, F4EXTRA, 'U');

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

  // See './_kiwi/admin/dbi/common/users/private/use_1_get'
  // for the explanations.
  if (xconds) {
    clauses += sqlite
      ? ` AND ${xconds}`
      : ` HAVING ${xconds}`;
  }
  sql = sql.replace('{{sql:conds}}', clauses);

  try {
    users = await dbi._lib.query(cn, sql, qparams);
  } catch (e) {
    log.warn(`dbi.count query failed! The clause "${wconds}" is badly formed!`);
    users = null;
  }

  return [null, { users: LU2.getUsersStatistics(users || [], cuser) }];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Counts the owned items.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {String}        the session user,
   * @param {Object}        the query,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the counted items,
   * @since 0.0.0
   */
  count(dbi, cn, cuser, query, sqlite) {
    return _count(dbi, cn, cuser, query, sqlite);
  },
};


// -- Export
module.exports = methods;
