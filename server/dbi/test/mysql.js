/** ****************************************************************************
 *
 * Extends MySQL/MariaDB with the testing methods.
 *
 * mysql.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _isEmpty                    checks if the db is empty,
 *
 *
 * Public Methods:
 *  . isEmpty                     checks if the database is empty,
 *  . init                        initialize the users table,
 *  . getUser                     returns the user credentials from the database,
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
const config = require('../../config')
    , crypto = require('../../libs/crypto/main')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('dbi/sqlite.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

const users = `
  CREATE TABLE users(
    id                            INTEGER        PRIMARY KEY AUTO_INCREMENT,
    user_name                     VARCHAR(100)   DEFAULT NULL,
    user_hash                     VARCHAR(100)   DEFAULT NULL,
    first_name                    VARCHAR(100)   DEFAULT NULL,
    last_name                     VARCHAR(100)   DEFAULT NULL,
    is_deleted                    TINYINT(1)     NOT NULL DEFAULT 0,
    is_locked                     TINYINT(1)     NOT NULL DEFAULT 0
  )
`;

const people = [
  /* eslint-disable object-curly-newline */
  { user_name: 'jdo', user_pwd: 'jdo', first_name: 'John', last_name: 'Doe' },
  { user_name: 'jsn', user_pwd: 'jsn', first_name: 'John', last_name: 'Snow' },
  { user_name: 'jhe', user_pwd: 'jhe', first_name: 'John', last_name: 'Headache' },
  /* eslint-enable object-curly-newline */
];


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Initialize the users table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {}            -,
   * @since 0.0.0
   */
  async init() {
    const lib = this._lib;
    const cn = await lib.getConnection();

    // Check if the db has already been initialized with the
    // 'users table'. If it is the case, erase the previous content:
    let sql = 'SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
    let resp = await lib.query(cn, sql, ['kapp', 'users']);
    if (resp.length > 0) {
      log.info('The database is already filled.');
      await lib.release(cn);
      return;
    }

    // Create a fresh 'users' table:
    log.info('The database is empty.)');
    resp = await lib.query(cn, users);
    // Dump the table structure:
    sql = 'SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_DEFAULT, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
    resp = await lib.query(cn, sql, ['kapp', 'users']);
    console.log(resp);

    // Fills the 'users' table:
    sql = 'INSERT INTO users(user_name, user_hash, first_name, last_name, is_locked) VALUES(?, ?, ?, ?, ?)';
    let p = people[0];
    let pwd = await crypto.hash(p.user_pwd);
    await lib.query(cn, sql, [p.user_name, pwd, p.first_name, p.last_name, 0]);

    [, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await lib.query(cn, sql, [p.user_name, pwd, p.first_name, p.last_name, 0]);

    [,, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await lib.query(cn, sql, [p.user_name, pwd, p.first_name, p.last_name, 1]);

    // Dump the content of the users table:
    resp = await lib.query(cn, 'SELECT * FROM users');
    console.log(resp);
    log.info('We created the users table.)');

    // Free the connection when the task is completed.
    await lib.release(cn);
  },

  /**
   * Returns the user credentials from the database.
   *
   * @method (arg1)
   * @public
   * @param {String}        the username,
   * @returns {Object}      returns the user credentials or undefined,
   * @since 0.0.0
   */
  async userGetMe(username) {
    const cn = await this._lib.getConnection();
    const sql = 'SELECT * FROM users WHERE user_name = ?';
    const [user] = await this._lib.query(cn, sql, [username]);
    await this._lib.release(cn);
    return [null, user];
  },
};


// -- Export
module.exports = methods;
