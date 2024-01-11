/** ****************************************************************************
 *
 * Updates .env.js with VAPID keys.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _updateEnv                  adds to .env.js the VAPID keys,
 *  . _addKeysToEnv               returns the VAPID public keys or generate new ones,
 *
 *
 * Public Static Methods:
 *  . addKeysToEnv                adds the VAPID keys to .env.js,
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
const fs = require('fs');


// -- Local Modules


// -- Local Constants
const envpath = './.env.js';


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds to .env.js the VAPID keys.
 *
 * @method (arg1, arg2)
 * @public
 * @param {Object}          the VAPID keys,
 * @param {Function}        the function to call at the completion,
 * @returns {}              -,
 * @since 0.0.0
 */
function _updateEnv(keys, callback) {
  fs.readFile(envpath, 'utf8', (err, data) => {
    if (err) {
      callback({
        error_code: 'ReadFailed',
        message: 'Could NOT read .env.js',
      });
      return;
    }

    let s = '';
    let newenv = data;
    if (data.match('vapidKeys: null,')) {
      s = `vapidKeys: {\n    publicKey: '${keys.publicKey}',\n    privateKey: '${keys.privateKey}',\n  },`;
      newenv = newenv.replace('vapidKeys: null,', s);
    }

    if (data.match('publicKey: null,')) {
      s = `publicKey: '${keys.publicKey}',`;
      newenv = newenv.replace('publicKey: null,', s);
    }

    if (data.match('privateKey: null,')) {
      s = `privateKey: '${keys.privateKey}',`;
      newenv = newenv.replace('privateKey: null,', s);
    }

    if (!data.match('vapidKeys:')) {
      s = `\n  vapidKeys: {\n    publicKey: '${keys.publicKey}',\n    privateKey: '${keys.privateKey}',\n  },\n};`;
      newenv = newenv.replace('};', s);
    }

    if (newenv === data) {
      callback({
        error_code: 'Failed',
        message: 'Could NOT find any pattern to update .env.js',
      });
      return;
    }

    fs.writeFile(envpath, newenv, 'utf8', (errw) => {
      if (errw) {
        callback({
          error_code: 'WriteFailed',
          message: 'Could NOT write .env.js',
        });
        return;
      }

      callback({
        error_code: null,
        message: 'Succeded to update .env.js with vapidKeys!',
      });
    });
  });
}

/**
 * Returns the VAPID public keys or generate new ones.
 *
 * @method (arg1, arg2)
 * @public
 * @param {Object}          the library object,
 * @param {Function}        the function to call at the completion,
 * @returns {}              -,
 * @since 0.0.0
 */
function _addKeysToEnv(that, callback) {
  let keys = that.getKeys();
  if (keys) {
    callback({
      error_code: null,
      message: 'The VAPID keys are already defined in .env.js!',
    });
    return;
  }

  keys = that.generateKeys();
  _updateEnv(keys, (resp) => {
    callback(resp);
  });
}


// -- Public Static Methods ----------------------------------------------------

const PKeys = {

  /**
   * Adds the VAPID keys to .env.js.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Object}        the library object,
   * @param {Function}      the function to call at the completion,
   * @returns {}            -,
   * @since 0.0.0
   */
  addKeysToEnv(that, callback) {
    _addKeysToEnv(that, callback);
  },
};


// -- Export
module.exports = PKeys;
