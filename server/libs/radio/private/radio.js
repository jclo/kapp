/** ************************************************************************
 *
 * Implements the backbone radio.
 *
 * radio.js is just a literal object that contains a set of functions. It
 * can't be intantiated.
 *
 * Private Functions:
 *  . _schema                     returns the db schema,
 *  . _addChannel                 adds a channel to the db if it doesn't exist,
 *  . _fire                       publishes a message on a channel,
 *  . _off                        stops listening a channel,
 *  . _one                        listens a channel once,
 *  . _on                         listens a channel,
 *
 *
 * Public Static Methods:
 *  . on                          listens a channel,
 *  . once                        listens a channel once,
 *  . off                         stops Listening a channel,
 *  . fire                        publishes a message,
 *
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ********************************************************************** */
/* global */
/* eslint no-underscore-dangle: 0 */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the db schema.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the schema,
 * @since 0.0.0
 */
function _schema() {
  return {
    listeners: [],
    listenersOnce: [],
  };
}

/**
 * Adds the required channel to the db if it doesn't exist.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Object}          the database,
 * @param {String}          the channel,
 * @returns {}              -,
 * @since 0.0.0
 */
/* eslint-disable no-param-reassign */
function _addChannel(db, c) {
  if (typeof c === 'string' && !Object.prototype.hasOwnProperty.call(db, c)) {
    db[c] = _schema();
  }
}
/* eslint-enable no-param-reassign */

/**
 * Publishes a message on a channel.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database,
 * @param {String}          the channel,
 * @param {Object}          the message to publish,
 * @returns {}              -,
 * @since 0.0.0
 */
function _fire(db, channel, payload) {
  if (typeof channel === 'string' && Object.prototype.hasOwnProperty.call(db, channel)) {
    // Fires all the 'classic' listeners:
    for (let i = 0; i < db[channel].listeners.length; i++) {
      db[channel].listeners[i](payload);
    }

    // Fires all the listeners for once:
    for (let i = 0; i < db[channel].listenersOnce.length; i++) {
      db[channel].listenersOnce[i](payload);
    }

    // Remove all the event listeners for listener once:
    db[channel].listenersOnce.splice(0, db[channel].listenersOnce.length);
  }
}

/**
 * Stops listening a channel.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database,
 * @param {String}          the channel,
 * @param {Function}        the function to call when an event occurs,
 * @returns {}              -,
 * @since 0.0.0
 */
function _off(db, channel, listener) {
  let index;

  if (typeof channel === 'string'
      && typeof listener === 'function'
      && Object.prototype.hasOwnProperty.call(db, channel)) {
    index = db[channel].listeners.indexOf(listener);
    if (index >= 0) {
      db[channel].listeners.splice(index, 1);
    }
    index = db[channel].listenersOnce.indexOf(listener);
    if (index >= 0) {
      db[channel].listenersOnce.splice(index, 1);
    }
  }
}

/**
 * Listens a channel once.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database,
 * @param {String}          the channel,
 * @param {Function}        the function to call when an event occurs,
 * @returns {}              -,
 * @since 0.0.0
 */
function _one(db, channel, listener) {
  _addChannel(db, channel);
  if (typeof channel === 'string'
      && typeof listener === 'function'
      && Object.prototype.hasOwnProperty.call(db, channel)) {
    db[channel].listenersOnce.push(listener);
  }
}

/**
 * Listens a channel.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database,
 * @param {String}          the channel,
 * @param {Function}        the function to call when an event occurs,
 * @returns {}              -,
 * @since 0.0.0
 */
function _on(db, channel, listener) {
  _addChannel(db, channel);
  if (typeof channel === 'string'
      && typeof listener === 'function'
      && Object.prototype.hasOwnProperty.call(db, channel)) {
    db[channel].listeners.push(listener);
  }
}


// -- Public Static Methods ----------------------------------------------------

const Radio = {

  /**
   * Listens a channel.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the database,
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  on(db, channel, listener) {
    _on(db, channel, listener);
    return this;
  },

  /**
   * Listens a channel once.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the database,
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  one(db, channel, listener) {
    _one(db, channel, listener);
    return this;
  },

  /**
   * Stops Listening a channel.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the database,
   * @param {String}        the channel,
   * @param {Function}      the handler to remove,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  off(db, channel, listener) {
    _off(db, channel, listener);
    return this;
  },

  /**
   * Publishes a message.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the database,
   * @param {String}        the channel,
   * @param {Object}        the message to send to the listeners,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  fire(db, channel, message) {
    _fire(db, channel, message);
    return this;
  },
};


// -- Export
module.exports = Radio;
