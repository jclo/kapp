/** ****************************************************************************
 *
 * Creates DB table.
 *
 * db.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _fillDBTable                fills the db table,
 *  . _createDBTable              creates the db table,
 *
 *
 * Public Static Methods:
 *  . createDBTable               creates the db table,
 *  . fillDBTable                 fills the db table,
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
    , pk     = require('../../../../../../../package.json')
    , U1     = require('../../../../../_utils/util1')
    , DB     = require('../../../tables/db')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/miscellaneous/private/db.js', level, false)
    , UTF8      = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Fills the db Table.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the db object,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @param {Number}          the creator user id,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _fillDBTable(dbi, cn, sqlite, creator) {
  log.info('Initializing admin_db_versions table ...');
  const SQL = `
    INSERT INTO admin_db_versions(
      name,
      date_created,
      created_by_user_id,
      server_version,
      db_version
    )
    VALUES(?, ?, ?, ?, ?)
  `;

  const params = [
    'Creation',
    U1.getDateTime(new Date()),
    creator,
    pk.version,
    pk.dbVersion,
  ];
  await dbi._lib.query(cn, SQL, params);
}

/**
 * Creates the db Table.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @param {String}          the master id,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
async function _createDBTable(dbi, cn, sqlite, masterId) {
  log.info('creating the admin_db_versions table ...');

  const db = DB.getDBTable(masterId);
  if (sqlite) {
    await dbi._lib.query(cn, db.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, db);
    await dbi._lib.query(cn, `ALTER TABLE admin_db_versions ${UTF8}`);
  }

  log.info('done!');
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Creates the db Table.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {Object}      returns a promise,
   * @since 0.0.0
   */
  createDBTable(dbi, cn, sqlite) {
    return _createDBTable(dbi, cn, sqlite);
  },

  /**
   * Fills the db Table.
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
  fillDBTable(dbi, cn, sqlite, creator) {
    return _fillDBTable(dbi, cn, sqlite, creator);
  },
};


// -- Export
module.exports = methods;
