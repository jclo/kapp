/** ****************************************************************************
 *
 * Creates a token or a password.
 *
 * main.js is built upon the Prototypal Instantiation pattern. It
 * returns an object by calling its constructor. It doesn't use the new
 * keyword.
 *
 * Private Functions:
 *  . _generatePassword           returns a password generated randomly,
 *  . _generateToken              returns a token generated randomly,
 *
 *
 * Public Methods:
 *  . generateToken               returns a token generated randomly,
 *  . generatePassword            returns a password generated randomly,
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
/* eslint semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
import crypto from 'crypto';


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns a password generated randomly.
 *
 * Nota:
 * Proposed by ChatGPT.
 *
 * In your case (automatic account creation via API), the objective is generally:
 *   . cryptographically secure password
 *   . sufficient entropy
 *   . no bias
 *   . avoid ambiguous characters if a human sometimes has to read/paste it
 *   . configurable length
 *
 * I therefore suggest a version closer to what password managers do.
 *
 * Improvements:
 *   . crypto.randomInt (security)
 *   . rejection sampling (no bias)
 *   . removal of ambiguous characters
 *   . clearly defined character sets
 *   . constraint checking
 *   . minimum 8 characters
 *
 * @function (arg1)
 * @private
 * @param {Number}          the length of the password,
 * @returns {String}        the generated password,
 * @since 0.0.0
 */
function _generatePassword(length = 12) {
  const minLength = 8;
  const finalLength = Math.max(length, minLength);

  // Chars without visual ambiguity
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'; // no l
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I or O
  const numbers = '23456789'; // no 0 or 1
  const specials = '!@#$%^&*-_=+';

  const allChars = lowercase + uppercase + numbers + specials;

  /**
   * Returns a random character from the given string.
   */
  function randomChar(chars) {
    return chars[crypto.randomInt(chars.length)];
  }

  /**
   * Returns true if the given string contains any character from the charset.
   */
  function contains(str, charset) {
    for (const c of str) {
      if (charset.includes(c)) { return true; }
    }
    return false;
  }

  while (true) {
    let password = '';

    for (let i = 0; i < finalLength; i++) {
      password += randomChar(allChars);
    }

    if (contains(password, lowercase)
      && contains(password, uppercase)
      && contains(password, numbers)
      && contains(password, specials)
    ) {
      return password;
    }
  }
}

/**
 * Returns a token generated randomly
 *
 * Nota:
 * Algorithm proposed by ChatGPT.
 *
 * For a multi-tenant SaaS system,
 * the cleanest technique is to use crypto.randomBytes()
 * and a method called rejection sampling to eliminate
 * any statistical bias when mapping to the alphabet.
 *
 * Why this is useful:
 *   . randomBytes generates cryptographically random bytes.
 *   . A byte has 256 possible values.
 *   . If your alphabet does not divide 256 exactly
 *     (62, for example), a simple modulo introduces bias.
 *   . This bias is eliminated by rejecting certain values.
 *
 * This technique is used in libraries such as nanoid.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Number}          the length of the token,
 * @param {String}          the string to use for encoding,
 * @returns {String}        the generated token,
 * @since 0.0.0
 */
function _generateToken(length = 5, base = 'base62') {
  const alphabets = {
    base36: '0123456789abcdefghijklmnopqrstuvwxyz',
    base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    'base62@#': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#'
  };

  const chars = alphabets[base] || alphabets.base62;
  const charsLength = chars.length;

  // Limit to avoid bias
  const maxByte = Math.floor(256 / charsLength) * charsLength;

  let token = '';
  while (token.length < length) {
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < randomBytes.length && token.length < length; i++) {
      const randomByte = randomBytes[i];
      if (randomByte < maxByte) {
        token += chars[randomByte % charsLength];
      }
    }
  }

  return token;
}


// -- Public Methods -----------------------------------------------------------

const TOKPASS = {

  /**
   * Returns a token generated randomly.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Number}        the length of the token,
   * @param {String}        the string to use for encoding,
   * @returns {String}      the generated token,
   * @since 0.0.0
   */
  generateToken(length, base) {
    return _generateToken(length, base);
  },

  /**
   * Returns a password generated randomly.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Number}        the length of the password,
   * @returns {String}      the generated password,
   * @since 0.0.0
   */
  generatePassword(length) {
    return _generatePassword(length);
  },
};


// -- Export
export default TOKPASS;
