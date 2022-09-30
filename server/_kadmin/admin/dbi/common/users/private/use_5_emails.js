/** ****************************************************************************
 *
 * Implements the common parts of the methods for users.
 *
 * use_5_emails.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _emailUpdateOne             updates an email linked to an existing user,
 *  . _emailAddOne                adds an email to an existing user,
 *  . _emailAddOrUpdateOne        add or updates an email for an existing user,
 *  . _emailDeleteOne             deletes an email,
 *
 *
 * Public Static Methods:
 *  . emailAddOrUpdateOneOne      adds or updates an email for an existing user,
 *  . emailDeleteOne              deletes an existing email,
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
const config  = require('../../../../../../config')
    , U1      = require('../../../../../_utils/util1')
    , WHO     = require('../../../../../_utils/util4')
    ;


// -- Local Constants
const { level }    = config
    , log          = KZlog('_kadmin/admin/dbi/common/users/private/use_5_emails.js', level, false)
    ;


// -- Local Variables
let tableStructure
  , columnLength
  ;


// -- Private Functions --------------------------------------------------------

/**
 * Updates an email linked to an existing user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5, arg6)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the session user,
 * @param {Object}          the params,
 * @param {Boolean}         true if sqlite false if mysql,
 * @param {Object}          the extracted email from the db,
 * @returns {Array}         returns an error message or the updated email,
 * @since 0.0.0
 */
async function _emailUpdateOne(dbi, cn, cuser, params, sqlite, dbemail) {
  let sql
    , coval
    , qparams
    ;

  const nemail = U1.filterEmail(params);
  if (!nemail.email) {
    return [null, { id: null, msg: `This email "${params.email}" is badly formed!` }];
  }
  if (nemail.email.length > columnLength.email) {
    return [null, { id: null, msg: `This email "${params.email}" is too big!` }];
  }

  delete nemail.user_id;
  delete nemail.date_created;
  delete nemail.created_by_user_id;

  nemail.id = params.id;
  nemail.date_modified = U1.getDateTime(new Date());
  nemail.modified_by_user_id = cuser.id;
  /* eslint-disable-next-line prefer-const */
  [coval, qparams] = U1.getSQLcoval(nemail);

  sql = `UPDATE admin_users_emails SET ${coval} WHERE id = ?`;
  await dbi._lib.query(cn, sql, qparams);

  // If this is a primary email set all the others as not primary:
  if ((nemail.is_primary_email === 1 || nemail.is_primary_email === '1')) {
    sql = 'UPDATE admin_users_emails SET is_primary_email = ? WHERE id != ? AND user_id = ?';
    qparams = [0, params.id, dbemail.user_id];
    await dbi._lib.query(cn, sql, qparams);
  }

  return [null, { id: params.id }];
}

/**
 * Adds an email to an existing user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the session user,
 * @param {Object}          the params,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the added email,
 * @since 0.0.0
 */
async function _emailAddOne(dbi, cn, cuser, params, sqlite) {
  let sql
    , cols
    , vals
    , qparams
    ;

  const nemail = U1.filterEmail(params);
  if (!nemail.email) {
    return [null, { id: null, msg: `This email "${params.email}" is badly formed!` }];
  }
  if (nemail.email.length > columnLength.email) {
    return [null, { id: null, msg: `This email "${params.email}" is too big!` }];
  }

  nemail.user_id = params.user_id;
  nemail.date_created = U1.getDateTime(new Date());
  nemail.created_by_user_id = cuser.id;
  /* eslint-disable-next-line prefer-const */
  [cols, vals, qparams] = U1.getSQLcv(nemail);

  // Check if this email already exist in the db:
  sql = 'SELECT * FROM admin_users_emails WHERE user_id = ? AND email = ? AND is_deleted = ?';
  const [res] = await dbi._lib.query(cn, sql, [params.user_id, nemail.email, 0]);
  if (res) {
    /* eslint-disable-next-line */
    params.id = res.id;
    return _emailUpdateOne(dbi, cn, cuser, params, sqlite, res);
  }

  // Ok, add it:
  sql = `INSERT INTO admin_users_emails (${cols}) VALUES (${vals})`;
  await dbi._lib.query(cn, sql, qparams);

  // Nota:
  // We could have done all the operations in once through this SQL:
  // sql = `
  //   INSERT INTO admin_users_emails (${cols})
  //     SELECT * FROM (SELECT ${vals}) AS tmp
  //   WHERE EXISTS
  //     (SELECT id FROM admin_users WHERE id = ? AND is_deleted = ?)
  //   AND NOT EXISTS
  //     (SELECT email FROM admin_users_emails WHERE email = ? AND user_id = ? AND is_deleted = ?)
  //   LIMIT 1
  // `;
  //
  // It works with 'SQlite' but not with MySQL as the connection isn't closed
  // between two transactions.
  // Thus, if the SQL INSERT does not insert anything because the conditions
  // aren't met, the returned 'id' belongs to the previous INSERT transaction
  // and we have no way to know if the 'id' belongs to the above INSERT or
  // another one!

  // Get the id of the added email!
  const eid = await dbi.getLastInsertedId(cn);

  // If this is a primary email set all the others as not primary:
  if ((nemail.is_primary_email === 1 || nemail.is_primary_email === '1') && eid) {
    sql = 'UPDATE admin_users_emails SET is_primary_email = ? WHERE id != ? AND user_id = ?';
    qparams = [0, eid, params.user_id];
    await dbi._lib.query(cn, sql, qparams);
  }

  return [null, { id: eid || null }];
}

/**
 * Add or updates an email for an existing user.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the session user,
 * @param {Object}          the params,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the added/updated email,
 * @since 0.0.0
 */
async function _emailAddOrUpdateOne(dbi, cn, cuser, params, sqlite) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];

  let sql
    , qparams
    , res
    ;

  if (!tableStructure) {
    tableStructure = await dbi.getTableStructure(cn, 'admin_users_emails');
    columnLength = U1.extractColumnLength(tableStructure);
  }

  if (params.id) {
    sql = 'SELECT * FROM admin_users_emails WHERE id = ? AND is_deleted = ?';
    qparams = [params.id, 0];
    [res] = await dbi._lib.query(cn, sql, qparams);
    return res
      ? _emailUpdateOne(dbi, cn, cuser, params, sqlite, res)
      : [null, { id: null, msg: `The record "${params.id}" does NOT exist!` }];
  }

  sql = 'SELECT * FROM admin_users WHERE id = ? AND is_deleted = ?';
  qparams = [params.user_id, 0];
  [res] = await dbi._lib.query(cn, sql, qparams);
  return res
    ? _emailAddOne(dbi, cn, cuser, params, sqlite)
    : [null, { id: null, msg: `The user_id "${params.user_id}" does NOT exist!` }];
}

/**
 * Deletes an existing email.
 *
 * @function (arg1, arg2, arg3, arg4, arg5)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection object for mysql,
 * @param {String}          the session user,
 * @param {Object}          the query,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {Array}         returns an error message or the deleted email,
 * @since 0.0.0
 */
async function _emailDeleteOne(dbi, cn, cuser, query/* , sqlite */) {
  const [err] = WHO.amIAdmin(cuser);
  if (err) return [err];console.log(query)

  if (!query.id) {
    return [null, { id: null, msg: 'You must provide an email id!' }];
  }

  // check if the record exist:
  let sql = 'SELECT * FROM admin_users_emails WHERE id = ? AND is_deleted = ?';
  const [res] = await dbi._lib.query(cn, sql, [query.id, 0]);
  if (!res) {
    return [null, { id: null, msg: `The record id "${query.id}" does NOT exist!` }];
  }

  // Ok, we can delete this record:
  const nemail = {};
  nemail.id = res.id;
  nemail.date_modified = U1.getDateTime(new Date());
  nemail.modified_by_user_id = cuser.id;
  nemail.is_deleted = 1;
  nemail.is_primary_email = 0;

  const [coval, qparams] = U1.getSQLcoval(nemail);
  sql = `UPDATE admin_users_emails SET ${coval} WHERE id = ?`;
  await dbi._lib.query(cn, sql, qparams);

  return [null, { id: res.id }];
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Adds or updates an email for an existing user.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the user's email to add or update,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the added or updated email,
   * @since 0.0.0
   */
  emailAddOrUpdateOne(dbi, cn, cuser, params, sqlite) {
    return _emailAddOrUpdateOne(dbi, cn, cuser, params, sqlite);
  },

  /**
   * Deletes an existing email.
   *
   * @method (arg1, arg2, arg3, arg4, arg5)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection object for mysql,
   * @param {Object}        the connected user,
   * @param {Object}        the query,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Array}       returns an error message or the deleted email,
   * @since 0.0.0
   */
  emailDeleteOne(dbi, cn, cuser, query, sqlite) {
    return _emailDeleteOne(dbi, cn, cuser, query, sqlite);
  },
};


// -- Export
module.exports = methods;
