/** ****************************************************************************
 *
 * Interfaces the database.
 * (it aims to make the code independant from the chosen db)
 *
 * db.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Constructor:
 *  . DB                          creates the database interface object,
 *
 *
 * Public Methods:
 *  .getUser                      returns the user credentials from the database,
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
const SQ     = require('./libs/sqlite/api')
    , config = require('./config')
    ;


// -- Local Constants
const PATH = config.db.sqlite.path
    ;


// -- Local Variables
let methods;


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Returns the DB object.
 * (Prototypal Instantiation Pattern)
 *
 * @constructor (arg1)
 * @public
 * @param {String}          the database server name (sqlite, mysql, etc.),
 * @returns {Object}        returns the DB object,
 * @since 0.0.0
 */
const DBI = function(server, name) {
  const obj = Object.create(methods);
  obj._db_server = server;
  obj._db_name = name;
  obj._location = PATH;
  obj._user = null;
  obj._pwd = null;
  return obj;
};


// -- Public Methods -----------------------------------------------------------

methods = {

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
    await SQ.open(PATH);
    const resp = await SQ.get(`SELECT * FROM users WHERE user_name="${username}"`);
    await SQ.close();
    return resp;
  },
};


// -- Export
module.exports = DBI;

/* - */
