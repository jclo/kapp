#!/usr/bin/env node
// ESLint declarations
/* global */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Node modules
const nopt = require('nopt')
    ;


// -- Local modules
const pk     = require('../package.json')
    , enviro = require('../.env')
    , DBI    = require('../server/dbi/dbi')
    , A      = require('./src/add')
    ;


// -- Local constants
const opts = {
      help: [Boolean, false],
      version: [String, null],
    }
    , shortOpts = {
      h: ['--help'],
      v: ['--version', pk.version],
    }
    , parsed = nopt(opts, shortOpts, process.argv, 2)
    ;

// -- Local variables


// -- Private functions --------------------------------------------------------

/**
 * Prints the help;
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
function _help() {
  const message = ['',
    'Usage: command [options]',
    '',
    'addcolumn                        adds i_am_a_new_column to master_db_versions',
    'addtable                         adds the i_am_new_table table to the db',
    '',
    'Options:',
    '',
    '-h, --help                       output usage information',
    '-v, --version                    output the version number',
    '',
  ].join('\n');

  process.stdout.write(`${message}\n`);
  process.exit(0);
}

/**
 * Initializes the db object.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {}              ,
 * @since 0.0.0
 */
/* eslint-disable max-len */
function _initdb() {
  if (!process.env.KAPP_DB_ACTIVE) process.env.KAPP_DB_ACTIVE = enviro.db.active;

  if (!process.env.KAPP_MYSQL_URL) process.env.KAPP_MYSQL_URL = enviro.db.mysql.host;
  if (!process.env.KAPP_MYSQL_PORT) process.env.KAPP_MYSQL_PORT = enviro.db.mysql.port || 3306;
  if (!process.env.KAPP_MYSQL_CNX_LIMIT) process.env.KAPP_MYSQL_CNX_LIMIT = enviro.db.mysql.connectionLimit;
  if (!process.env.KAPP_MYSQL_DATABASE) process.env.KAPP_MYSQL_DATABASE = enviro.db.mysql.database;
  if (!process.env.KAPP_MYSQL_USER) process.env.KAPP_MYSQL_USER = enviro.db.mysql.user;
  if (!process.env.KAPP_MYSQL_PASSWORD) process.env.KAPP_MYSQL_PASSWORD = enviro.db.mysql.password;

  const dbi = DBI(enviro.db.active);
  return dbi;
}
/* eslint-enable max-len */

/**
 * Executes the script.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {}              ,
 * @since 0.0.0
 */
function _run() {
  /**
   * Prints help page.
   */
  if (parsed.help) {
    _help();
  }

  /**
   * Prints the script version.
   */
  if (parsed.version) {
    process.stdout.write(`version: ${pk.version}\n`);
    process.exit(0);
  }

  /**
   * Processes the 1st command.
   */
  if (parsed.argv.remain[0] === 'addcolumn') {
    process.stdout.write('adding a new column to master_db_versions ...\n');
    A.addColumn(_initdb(), 'i_am_a_new_column', 'master_db_versions');
    return;
  }

  /**
   * Processes the 2nd command.
   */
  if (parsed.argv.remain[0] === 'addtable') {
    process.stdout.write('adding the i_am_new_table table to the db ...\n');
    A.addTable(_initdb());
    return;
  }

  _help();
}

// -- Main ---------------------------------------------------------------------

/**
 * Starting the script.
 *
 */
_run();


// -- oOo ---
