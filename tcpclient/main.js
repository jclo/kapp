#!/usr/bin/env node
// ESLint declarations
/* global */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Node modules
const nopt = require('nopt')
    ;


// -- Local modules
const pk = require('../package.json')
    , E  = require('./src/process')
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
    'directive1                       asks the server to execute the first directive',
    'directive2                       asks the server to execute the second directive',
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
  if (parsed.argv.remain[0] === 'directive1') {
    process.stdout.write('asking the server to execute the first directive ...\n');
    E.first();
    return;
  }

  /**
   * Processes the 2nd command.
   */
  if (parsed.argv.remain[0] === 'directive2') {
    process.stdout.write('asking the server to execute the second directive ...\n');
    E.second();
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
