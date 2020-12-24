/** ****************************************************************************
 *
 * Adds credential to the SQlite database.
 *
 * build.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . init                        creates and fills 'users' table,
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
/* eslint-disable one-var, semi-style, no-underscore-dangle */


// -- Vendor Modules


// -- Local Modules
const crypto = require('../libs/crypto/main')
    , SQ     = require('../libs/sqlite/api')
    ;


// -- Local Constants
const PATH       = './server/db/db.sqlite'
    , saltRounds = 10
    ;

const users = `
  CREATE TABLE users(
    id                            INTEGER        PRIMARY KEY AUTOINCREMENT,
    user_name                     VARCHAR(100)   DEFAULT NULL,
    user_hash                     VARCHAR(100)   DEFAULT NULL,
    first_name                    VARCHAR(100)   DEFAULT NULL,
    last_name                     VARCHAR(100)   DEFAULT NULL
  )
`;

const people = [
  /* eslint-disable object-curly-newline */
  { user_name: 'jdo', user_pwd: 'jdo', first_name: 'John', last_name: 'Doe' },
  { user_name: 'jsn', user_pwd: 'jsn', first_name: 'John', last_name: 'Snow' },
  /* eslint-enable object-curly-newline */
];


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const DB = {

  /**
   * Creates and fills 'users' table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {}            -,
   * @since 0.0.0
   */
  async init() {
    let SQL
      , resp
      ;

    // Open the database:
    resp = await SQ.open(PATH);

    // Check if the db has already been initialized with the
    // 'users table':
    SQL = 'SELECT name FROM sqlite_master WHERE type="table" AND name="users"';
    resp = await SQ.get(SQL);
    if (resp && resp.name === 'users') {
      // Ok it already exist, drop it
      await SQ.run('DROP TABLE users');
    }

    // Create a fresh 'users' table:
    resp = await SQ.run(users);

    // Get the table structure:
    SQL = 'SELECT sql FROM sqlite_master WHERE name="users"';
    resp = await SQ.get(SQL);
    // console.log(resp);

    // Fills the 'users ' table:
    SQL = 'INSERT INTO users(user_name, user_hash, first_name, last_name) VALUES(?, ?, ?, ?)';
    let p = people[0];
    let pwd = await crypto.hash(p.user_pwd, saltRounds);
    await SQ.run(SQL, p.user_name, pwd, p.first_name, p.last_name);
    [, p] = people;
    pwd = await crypto.hash(p.user_pwd, saltRounds);
    await SQ.run(SQL, p.user_name, pwd, p.first_name, p.last_name);

    // Close the database:
    await SQ.close();
  },
};


// -- Export
module.exports = DB;

/* - */
