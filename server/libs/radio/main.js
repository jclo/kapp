/** ****************************************************************************
 *
 * Defines a backbone radio.
 *
 * main.js is just a literal object that contains a set of functions. It
 * can't be intantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . listen                      listens a channel,
 *  . listenOnce                  listens a channel once,
 *  . unlisten                    stops Listening a channel,
 *  . publish                     publishes a message on a channel,
 *  . on                          alias on listen,
 *  . one                         alias on listenOnce,
 *  . off                         alias on unlisten,
 *  . fire                        alias on publish,
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
/* global */
/* eslint no-underscore-dangle: 0 */


// -- Vendor Modules


// -- Local Modules
const R = require('./private/radio');


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public Static Methods ------------------------------------------------

const Radio = {

  _db: {},

  /**
   * Listens a channel.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  listen(channel, handler) {
    R.on(this._db, channel, handler);
    return this;
  },

  /**
   * Listens a channel once.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  listenOnce(channel, handler) {
    R.one(this._db, channel, handler);
    return this;
  },

  /**
   * Stops Listening a channel.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Function}      the handler to remove,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  unlisten(channel, handler) {
    R.off(this._db, channel, handler);
    return this;
  },

  /**
   * Publishes a message on a channel.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Object}        the message to send to the listeners,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  publish(channel, message) {
    R.fire(this._db, channel, message);
    return this;
  },

  /**
   * Alias on listen.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  on(channel, handler) {
    return this.listen(channel, handler);
  },

  /**
   * Alias on listenOnce.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  one(channel, handler) {
    return this.listenOnce(channel, handler);
  },

  /**
   * Alias on unlisten.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Function}      the function to call when an event occurs,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  off(channel, handler) {
    return this.unlisten(channel, handler);
  },

  /**
   * Alias on publish.
   *
   * @method (arg1, arg2)
   * @public
   * @param {String}        the channel,
   * @param {Object}        the message to send to the listeners,
   * @returns {Object}      returns this,
   * @since 0.0.0
   */
  fire(channel, message) {
    return this.publish(channel, message);
  },
};


// -- Export
module.exports = Radio;
