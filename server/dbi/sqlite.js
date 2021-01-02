/** ****************************************************************************
 *
 * Interfaces SQLite database.
 *
 * sqlite.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _countTables                returns the number of tables set in the db,
 *
 *
 * Constructor:
 *  . SQLite                      creates the database interface object,
 *
 *
 * Public Methods:
 *
 *  TO BE REPLACED BY YOUR OWN:
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
const config   = require('../config')
    , SQ       = require('../libs/sqlite/api')
    , crypto   = require('../libs/crypto/main')
    , pmethods = require('../_custom/sqlite/api')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('dbi/sqlite.js', level, false)
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


/**
 * Returns the number of tables set in the db.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Number}        the number of tables,
 * @since 0.0.0
 */
async function _countTables(lib) {
  const SQL = 'SELECT count(*) FROM sqlite_master WHERE type = "table"';
  const resp = await lib.get(SQL);
  return resp['count(*)'];
}


// -- Public -------------------------------------------------------------------

/**
 * Defines SQLite constructor.
 * (do not modify it)
 *
 * @constructor (arg1)
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
const SQLite = function(params) {
  this._name = 'sqlite';
  this._db = params.database;
  this._lib = SQ;
};


// -- Public Methods -----------------------------------------------------------

const methods = {


  // The methods below are given as examples how to interact with the
  // database to check it, add contents and retrieve data.
  //
  // You can delete and replace them by your methods.
  // Only the constructor and the method 'end' are mandatory.

  /**
   * Checks if the database is empty.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if empty otherwis false,
   * @since 0.0.0
   */
  async isEmpty() {
    // The basic principe is to start each method by asking a
    // connection to the database.
    // When a connection is established perform a query or a set of queries
    // to the database.
    // And when the job is done release the connection before
    // exiting the method.

    // Ask for an access to the database:
    await this._lib.open(this._db);

    // Perform query(ies)
    const count = await _countTables(this._lib);

    // Close the connection to the database and leave.
    await this._lib.close();
    return count === 0;
  },

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
    await lib.open(this._db);

    // Check if the db has already been initialized with the
    // 'users table':
    let SQL = 'SELECT name FROM sqlite_master WHERE type="table" AND name="users"';
    let resp = await lib.get(SQL);
    if (resp && resp.name === 'users') {
      await lib.close();
      log.info('The database is already filled.');
      if (callback) callback();
    }

    // Create a fresh 'users' table:
    log.info('The database is empty.)');
    resp = await lib.run(users);
    // Get the table structure:
    SQL = 'SELECT sql FROM sqlite_master WHERE name="users"';
    resp = await lib.get(SQL);
    console.log(resp);

    // Fills the 'users' table:
    SQL = 'INSERT INTO users(user_name, user_hash, first_name, last_name, is_locked) VALUES(?, ?, ?, ?, ?)';
    let p = people[0];
    let pwd = await crypto.hash(p.user_pwd);
    await lib.run(SQL, p.user_name, pwd, p.first_name, p.last_name, 0);

    [, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await lib.run(SQL, p.user_name, pwd, p.first_name, p.last_name, 0);

    [,, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await lib.run(SQL, p.user_name, pwd, p.first_name, p.last_name, 1);

    // Dump the content of the users table:
    resp = await lib.all('SELECT * FROM users');
    console.log(resp);

    log.info('We created the users table.)');
    await lib.close();
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
  async getUser(username) {
    await this._lib.open(this._db);
    const resp = await this._lib.get(`SELECT * FROM users WHERE user_name="${username}"`);
    await this._lib.close();
    return resp;
  },
};


// -- Export
module.exports = { Cstor: SQLite, methods, pmethods };
