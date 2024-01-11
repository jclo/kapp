/** ****************************************************************************
 *
 * Adds columns and table to the db.
 *
 * add.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _addTable                   adds a new table to the db,
 *  . _addColumn                  adds the passed-in column to the passed-in table,
 *
 *
 * Public Static Methods:
 *  . addColumn                   adds the passed-in column to the passed-in table,
 *  . addTable                    adds a new table to the db,
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
const net = require('net');

// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Adds the passed-in column to the passed-in table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database object,
 * @param {String}          the name of the column to add,
 * @param {String}          the name of the table,
 * @return {Promise}        returns a promise,
 * @since 0.0.0
 */
function _second() {
  const client = net.connect({ host: '127.0.0.1', port: 5000 }, () => {
    client.write(JSON.stringify({
      command: 'directive_2',
      payload: 'payload',
    }));

    client.on('data', (resp) => {
      process.stdout.write(`response from server: ${resp.toString()}\n`);
      // client.end();
    });

    client.on('close', () => {
      process.stdout.write('disconnected from server!\n');
    });
  });
}

/**
 * Adds the passed-in column to the passed-in table.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the database object,
 * @param {String}          the name of the column to add,
 * @param {String}          the name of the table,
 * @return {Promise}        returns a promise,
 * @since 0.0.0
 */
function _first() {
  const client = net.connect({ host: '127.0.0.1', port: 5000 }, () => {
    client.write(JSON.stringify({
      command: 'directive_1',
      payload: 'payload',
    }));

    client.on('data', (resp) => {
      process.stdout.write(`response from server: ${resp.toString()}\n`);
      // client.end();
    });

    client.on('close', () => {
      process.stdout.write('disconnected from server!\n');
    });
  });
}


// -- Public Methods -----------------------------------------------------------

const DIR = {

  /**
   * Executes the first directive.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @return {}             -,
   * @since 0.0.0
   */
  first() {
    _first();
    return this;
  },

  /**
   * Executes the second directive.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @return {}             -,
   * @since 0.0.0
   */
  second() {
    _second();
    return this;
  },
};


// -- Export
module.exports = DIR;
