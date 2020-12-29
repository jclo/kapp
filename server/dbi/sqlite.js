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


// -- Local Modules
const SQ     = require('../libs/sqlite/api')
    , crypto = require('../libs/crypto/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

const users = `
  CREATE TABLE users(
    id                            INTEGER        PRIMARY KEY AUTOINCREMENT,
    user_name                     VARCHAR(100)   DEFAULT NULL,
    user_hash                     VARCHAR(100)   DEFAULT NULL,
    first_name                    VARCHAR(100)   DEFAULT NULL,
    last_name                     VARCHAR(100)   DEFAULT NULL,
    is_locked                     BIT(1)         NOT NULL DEFAULT 0
  )
`;

const people = [
  /* eslint-disable object-curly-newline */
  { user_name: 'jdo', user_pwd: 'jdo', first_name: 'John', last_name: 'Doe' },
  { user_name: 'jsn', user_pwd: 'jsn', first_name: 'John', last_name: 'Snow' },
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
async function _countTables() {
  const SQL = 'SELECT count(*) FROM sqlite_master WHERE type = "table"';
  const resp = await SQ.get(SQL);
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
    await SQ.open(this._db);

    // Perform query(ies)
    const count = await _countTables();

    // Close the connection to the database and leave.
    await SQ.close();
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
  async init() {
    await SQ.open(this._db);

    // Check if the db has already been initialized with the
    // 'users table':
    let SQL = 'SELECT name FROM sqlite_master WHERE type="table" AND name="users"';
    let resp = await SQ.get(SQL);
    if (resp && resp.name === 'users') {
      await SQ.run('DROP TABLE users');
    }

    // Create a fresh 'users' table:
    resp = await SQ.run(users);
    // Get the table structure:
    SQL = 'SELECT sql FROM sqlite_master WHERE name="users"';
    resp = await SQ.get(SQL);
    console.log(resp);

    // Fills the 'users' table:
    SQL = 'INSERT INTO users(user_name, user_hash, first_name, last_name) VALUES(?, ?, ?, ?)';
    let p = people[0];
    let pwd = await crypto.hash(p.user_pwd);
    await SQ.run(SQL, p.user_name, pwd, p.first_name, p.last_name);

    [, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await SQ.run(SQL, p.user_name, pwd, p.first_name, p.last_name);


    // Dump the content of the users table:
    resp = await SQ.all('SELECT * FROM users');
    console.log(resp);

    await SQ.close();
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
    await SQ.open(this._db);
    const resp = await SQ.get(`SELECT * FROM users WHERE user_name="${username}"`);
    await SQ.close();
    return resp;
  },
};


// -- Export
module.exports = { Cstor: SQLite, methods };
