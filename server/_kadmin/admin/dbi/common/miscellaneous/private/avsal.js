/** ****************************************************************************
 *
 * Creates Avatars and Salutation tables.
 *
 * avsal.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _createSalutationTable      creates the salutation table,
 *  . _createAvatarsTable         creates the avatars table,
 *
 *
 * Public Static Methods:
 *  . createAvatarsTable          creates the avatars table,
 *  . createSalutationTable       creates the salutation table,
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
    , OT     = require('../../../tables/others')
    , Ava    = require('../../../_avatars/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/dbi/common/miscellaneous/private/avsal.js', level, false)
    , UTF8      = 'CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci'
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Creates the salutation table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _createSalutationTable(dbi, cn, sqlite) {
  log.info('creating the salutation admin_table ...');

  const salutation = OT.getSalutationTable();
  if (sqlite) {
    await dbi._lib.query(cn, salutation.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, salutation);
    await dbi._lib.query(cn, `ALTER TABLE admin_salutation ${UTF8}`);
  }

  const list = OT.getSalutationList();
  for (let i = 0; i < list.length; i++) {
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(
      cn,
      'INSERT INTO admin_salutation(name, date_created) VALUES(?, ?)',
      [list[i], U1.getDateTime(new Date())],
    );
  }

  log.info('done!');
}

/**
 * Creates the avatars table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the db library,
 * @param {Object}          the connection to the db,
 * @param {Boolean}         true if sqlite false if mysql,
 * @returns {}              -,
 * @since 0.0.0
 */
async function _createAvatarsTable(dbi, cn, sqlite) {
  log.info('creating the avatars table ...');

  const avatarsT = OT.getAvatarsTable();
  if (sqlite) {
    await dbi._lib.query(cn, avatarsT.replace('AUTO_INCREMENT', 'AUTOINCREMENT'));
  } else {
    await dbi._lib.query(cn, avatarsT);
    await dbi._lib.query(cn, `ALTER TABLE admin_avatars ${UTF8}`);
  }

  const a1 = Ava.load('humans');
  const a2 = Ava.load('animals');
  const a3 = Ava.load('symbols');
  const avatars = a1.concat(a2).concat(a3);
  for (let i = 0; i < avatars.length; i++) {
    /* eslint-disable-next-line no-await-in-loop */
    await dbi._lib.query(
      cn,
      'INSERT INTO admin_avatars(name, picture, date_created) VALUES(?, ?, ?)',
      [avatars[i].name, avatars[i].picture, U1.getDateTime(new Date())],
    );
  }
  log.info('done!');
}


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Creates the Avatars table(s).
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {String}      returns an error message or null,
   * @since 0.0.0
   */
  createAvatarsTable(dbi, cn, sqlite) {
    return _createAvatarsTable(dbi, cn, sqlite);
  },

  /**
   * Creates the Salutation table(s).
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the db object,
   * @param {Object}        the connection to the db,
   * @param {Boolean}       true if sqlite false if mysql,
   * @returns {String}      returns an error message or null,
   * @since 0.0.0
   */
  createSalutationTable(dbi, cn, sqlite) {
    return _createSalutationTable(dbi, cn, sqlite);
  },
};


// -- Export
module.exports = methods;
