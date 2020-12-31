/** ****************************************************************************
 *
 * Interfaces MySQL/MariaDB database.
 *
 * mysql.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _isEmpty                    checks if the db is empty,
 *
 *
 * Constructor:
 *  . MySQL                       creates the database interface object,
 *
 *
 * Public Methods:
 *  . end                         free the pool of connections to the database,
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
const MQ     = require('../libs/mysql/api')
    , crypto = require('../libs/crypto/main')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

const users = `
  CREATE TABLE users(
    id                            INTEGER        PRIMARY KEY AUTO_INCREMENT,
    user_name                     VARCHAR(100)   DEFAULT NULL,
    user_hash                     VARCHAR(100)   DEFAULT NULL,
    first_name                    VARCHAR(100)   DEFAULT NULL,
    last_name                     VARCHAR(100)   DEFAULT NULL
    is_locked                     BIT(1)         NOT NULL DEFAULT 0
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
 * Check if the database is empty.
 *
 * @function (arg1)
 * @private
 * @param {Object}          the connection to the db object,
 * @returns {Number}        return the number of tables,
 * @since 0.0.0
 */
async function _isEmpty(cn) {
  const SQL = 'SELECT COUNT(DISTINCT `table_name`) AS TotalNumberOfTables FROM `information_schema`.`columns` WHERE `table_schema` = ?';
  const resp = await MQ.query(cn, SQL, ['kapp']);
  return resp[0].TotalNumberOfTables === 0;
}


// -- Public -------------------------------------------------------------------

/**
 * Defines MySQL constructor.
 * (do not modify it)
 *
 * @constructor (arg1)
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
const MySQL = function(params) {
  this._name = 'mysql';
  this._db = params.database;
  MQ.createPool(
    params.host,
    params.connectionLimit,
    params.database,
    params.user,
    params.password,
  );
};


// -- Public Methods -----------------------------------------------------------

const methods = {

  /**
   * Free the pool of connections to the database.
   * (mandatory - don't modify it)
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Boolean}     returns true if the database is released,
   * @since 0.0.0
   */
  end() {
    return MQ.end();
  },


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
   * @returns {Boolean}     returns true if empty otherwise false,
   * @since 0.0.0
   */
  async isEmpty() {
    // The basic principe is to start each method by asking a
    // connection to the database from the pool of connections. See
    // the documentation of the node module mysql for more
    // explanations.
    // When a connection is returned use this connection to perform
    // a query or a set of queries to the database.
    // And when the job is done release the connection before
    // exiting the method.

    // Ask for a connection to the MySQL pool of connections.
    const cn = await MQ.getConnection();
    // Process the database query:
    const result = _isEmpty(cn);
    // Free the connection when the query is done.
    await MQ.release(cn);
    return result;
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
    const cn = await MQ.getConnection();

    // Check if the db has already been initialized with the
    // 'users table'. If it is the case, erase the previous content:
    let sql = 'SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
    let resp = await MQ.query(cn, sql, ['kapp', 'users']);
    if (resp.length > 0) {
      await MQ.query(cn, 'DROP TABLE users');
    }

    // Create a fresh 'users' table:
    resp = await MQ.query(cn, users);
    // Dump the table structure:
    sql = 'SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, COLUMN_DEFAULT, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
    resp = await MQ.query(cn, sql, ['kapp', 'users']);
    console.log(resp);

    // Fills the 'users' table:
    sql = 'INSERT INTO users(user_name, user_hash, first_name, last_name, is_locked) VALUES(?, ?, ?, ?, ?)';
    let p = people[0];
    let pwd = await crypto.hash(p.user_pwd);
    await MQ.query(cn, sql, [p.user_name, pwd, p.first_name, p.last_name, 0]);

    [, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await MQ.query(cn, sql, [p.user_name, pwd, p.first_name, p.last_name, 0]);

    [,, p] = people;
    pwd = await crypto.hash(p.user_pwd);
    await MQ.query(cn, sql, [p.user_name, pwd, p.first_name, p.last_name, 1]);

    // Dump the content of the users table:
    resp = await MQ.query(cn, 'SELECT * FROM users');
    console.log(resp);

    // Free the connection when the task is completed.
    await MQ.release(cn);
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
    const cn = await MQ.getConnection();
    const sql = 'SELECT * FROM users WHERE user_name = ?';
    const resp = await MQ.query(cn, sql, [username]);
    await MQ.release(cn);
    return resp[0];
  },
};


// -- Export
module.exports = { Cstor: MySQL, methods };
