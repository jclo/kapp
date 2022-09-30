/** ****************************************************************************
 *
 * Creates Modules tables.
 *
 * miscellaneous.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _addModules                 adds a set of modules,
 *  . _createModulesTable         creates the modules table,
 *
 *
 * Public Static Methods:
 *  . createModulesTable          creates the module tables,
 *  . addModules                  adds a set of modules,
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
    , U1     = require('../../../../../_utils/util1')
    , MT     = require('../../../tables/modules')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/miscellaneous/private/modules.js', level, false)
    , UTF8      = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds a set of modules.
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
async function _addModules(dbi, cn) {
  log.info('filling the module table ...');
  const SQL = `
    INSERT INTO admin_modules(
      name,

      date_created,
      created_by_user_id,
      assigned_to_user_id
    )
    VALUES(?, ?, ?, ?)
  `;

  // const p = [];
  const list = MT.getModulesList();
  let params;
  for (let i = 0; i < list.length; i++) {
    params = [
      list[i],
      U1.getDateTime(new Date()),
      1,
      1,
    ];
    // p.push(lib.query(cn, SQL, params));
    /* eslint-disable-next-line */
    await dbi._lib.query(cn, SQL, params);
  }
  // await Promise.all(p);
}

/**
 * Creates the modules table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _createModulesTable(dbi, cn, sqlite) {
  log.info('creating the admin_modules table ...');

  const modules = MT.getModulesTable();
  if (sqlite) {
    await dbi._lib.query(cn, modules.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, modules);
    await dbi._lib.query(cn, `ALTER TABLE admin_modules ${UTF8}`);
  }

  log.info('done!');
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Creates the Module Tables.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {String}      returns an error message or null,
   * @since 0.0.0
   */
  createModulesTable(dbi, cn, sqlite) {
    return _createModulesTable(dbi, cn, sqlite);
  },

  /**
   * Adds a set of modules.
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
  addModules(dbi, cn, sqlite, creator) {
    return _addModules(dbi, cn, sqlite, creator);
  },
};


// -- Export
module.exports = methods;
