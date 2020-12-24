/** ****************************************************************************
 *
 * Interfaces Bcrypt library for hashing and comparing passwords.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . hash                        hashes a password,
 *  . compare                     compares a password to its pretending hash,
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
/* eslint-disable one-var, semi-style, no-underscore-dangle, global-require,
  import/no-unresolved */


// -- Vendor Modules

// This is a hack because 'bcrypt' can't be installed on Travis-CI. it can't
// load and compile its c++ dependencies. Thus, on Travis-CI we replace
// 'bcrypt' by a version written in pure Javascript (compatible but slower).
let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  bcrypt = require('bcryptjs');
  try {
    bcrypt = require('bcryptjs');
  } catch (ee) {
    throw new Error(e);
  }
}


// -- Local Modules


// -- Local Constants
const saltRounds = 10
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ----------------------------------------------------

const Crypto = {

  /**
   * Hashes a password.
   *
   * @method (arg1)
   * @public
   * @param {String}        the password to hash,
   * @returns {Obj/String}  returns a promise and then the hashed password,
   * @since 0.0.0
   */
  hash(pwd) {
    return bcrypt.hash(pwd, saltRounds);
  },

  /**
   * Compares a password to its pretending hash.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the password to test,
   * @param {String}        the stored hash of this password,
   * @returns {Obj/Boolean} returns a promise and then true or false,
   * @since 0.0.0
   */
  compare(userpass, hash) {
    return bcrypt.compare(userpass, hash);
  },
};


// -- Export
module.exports = Crypto;

/* - */
