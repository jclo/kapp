/** ****************************************************************************
 *
 * Generate VAPID keys for Web Push Notifications.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getPublicKey               returns the VAPID public key,
 *  . _getKeys                    returns the VAPID public and private keys,
 *  . _generateKeys               generates the VAPID keys,
 *
 *
 * Public Static Methods:
 *  . generateKeys                generates and returns the VAPID keys,
 *  . getKeys                     returns the VAPID keys,
 *  . getPublicKey                returns the VAPID public key,
 *  . addKeysToEnv                adds the VAPID keys to .env.js if not in,
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
const crypto = require('crypto');


// -- Local Modules
const Env = require('../../../.env')
    , P   = require('./keyenv')
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the VAPID public key.
 *
 * @method ()
 * @public
 * @param {}                -,
 * @returns {Object}        returns public and private keys,
 * @since 0.0.0
 */
function _getPublicKey() {
  if (Env.vapidKeys
    && Env.vapidKeys.publicKey
    && typeof Env.vapidKeys.publicKey === 'string'
  ) {
    return { publicKey: Env.vapidKeys.publicKey };
  }

  return null;
}

/**
 * Returns the VAPID public and private keys.
 *
 * @method ()
 * @public
 * @param {}                -,
 * @returns {Object}        returns public and private keys,
 * @since 0.0.0
 */
function _getKeys() {
  if (Env.vapidKeys
    && Env.vapidKeys.publicKey
    && typeof Env.vapidKeys.publicKey === 'string'
    && Env.vapidKeys.privateKey
    && typeof Env.vapidKeys.privateKey === 'string'
  ) {
    return {
      publicKey: Env.vapidKeys.publicKey,
      privateKey: Env.vapidKeys.privateKey,
    };
  }

  return null;
}

/**
 * Generates the VAPID keys.
 *
 * @method ()
 * @public
 * @param {}                -,
 * @returns {Object}        returns public and private keys,
 * @since 0.0.0
 */
function _generateKeys() {
  const curve = crypto.createECDH('prime256v1');
  curve.generateKeys();
  let publicKeyBuffer = curve.getPublicKey();
  let privateKeyBuffer = curve.getPrivateKey();

  // Sometimes the private key is not padded to the correct lengh resulting
  // in errors. Thus, we padd both to be sure they have the right length even
  // if the public key length seems always right (tested 1O millions times).
  if (privateKeyBuffer.length < 32) {
    const padding = Buffer.alloc(32 - privateKeyBuffer.length);
    padding.fill(0);
    privateKeyBuffer = Buffer.concat([padding, privateKeyBuffer]);
  }

  if (publicKeyBuffer.length < 65) {
    const padding = Buffer.alloc(65 - publicKeyBuffer.length);
    padding.fill(0);
    publicKeyBuffer = Buffer.concat([padding, publicKeyBuffer]);
  }

  return {
    publicKey: publicKeyBuffer.toString('base64url'),
    privateKey: privateKeyBuffer.toString('base64url'),
  };
}


// -- Public Static Methods ----------------------------------------------------

const CryptoKeys = {

  /**
   * Generates and returns the VAPID keys.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Object}      returns public and private keys,
   * @since 0.0.0
   */
  generateKeys() {
    const keys = this.getKeys();
    if (keys) {
      return keys;
    }
    return _generateKeys();
  },

  /**
   * Returns the VAPID keys.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Object}      returns public and private keys or null,
   * @since 0.0.0
   */
  getKeys() {
    return _getKeys();
  },

  /**
   * Returns the VAPID public key.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Object}      returns the public key or null,
   * @since 0.0.0
   */
  getPublicKey() {
    return _getPublicKey();
  },

  /**
   * Adds the VAPID keys to .env.js if not in.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {Promise}     returns the added keys or an error,
   * @since 0.0.0
   */
  addKeysToEnv(callback) {
    P.addKeysToEnv(this, callback);
  },
};


// -- Export
module.exports = CryptoKeys;
