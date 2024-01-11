/** ****************************************************************************
 *
 * Extends SQLite with the testing methods.
 *
 * sqlite.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Methods:
 *  . init                        initialize the users table,
 *  . userGetMe                   returns the user credentials from the database,
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
    , log       = KZlog('dbi/test/sqlite.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

const users = `
  CREATE TABLE users(
    id                            INTEGER        PRIMARY KEY AUTOINCREMENT,
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
  async init(callback) {
    const lib = this._lib;
    const cn = await lib.open(this._db);

    // Check if the db has already been initialized with the
    // 'users table':
    let SQL = 'SELECT name FROM sqlite_master WHERE type="table" AND name="users"';
    let resp = await lib.get(cn, SQL);
    if (resp && resp.name === 'users') {
      await lib.close(cn);
      log.info('The database is already filled.');
      if (callback) callback();
      return;
    }

    // Create a fresh 'users' table:
    log.info('The database is empty.)');
    resp = await lib.run(cn, users);
    // Get the table structure:
    SQL = 'SELECT sql FROM sqlite_master WHERE name="users"';
    resp = await lib.get(cn, SQL);
    console.log(resp);

    // Fills the 'users' table:
    SQL = 'INSERT INTO users(user_name, user_hash, first_name, last_name, is_locked) VALUES(?, ?, ?, ?, ?)';
    let p = people[0];
    let pwd = await crypto.hash(p.user_pwd);
    await lib.run(cn, SQL, p.user_name, pwd, p.first_name, p.last_name, 0);

    [, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await lib.run(cn, SQL, p.user_name, pwd, p.first_name, p.last_name, 0);

    [,, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await lib.run(cn, SQL, p.user_name, pwd, p.first_name, p.last_name, 1);

    // Dump the content of the users table:
    resp = await lib.all(cn, 'SELECT * FROM users');
    console.log(resp);

    log.info('we created the users table.)');
    await lib.close(cn);
    if (callback) callback();
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
    const cn = await this._lib.open(this._db);
    const user = await this._lib.get(cn, `SELECT * FROM users WHERE user_name="${username}"`);
    await this._lib.close(cn);
    return [null, user];
  },
};


// -- Export
module.exports = methods;
