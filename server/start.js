#!/usr/bin/env node
/** ****************************************************************************
 *
 * Starts {{app:name}}.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Main:
 *  . script!
 *
 *
 *
 * @exports   -
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules


// -- Local Modules
const App = require('./app')
    ;


// -- Local Constants


// -- Local Variables


// -- Main Section


// Starts the server:
const dbi = App();

// This is only used for creating the testing database. Uncomment the next
// line if you want to recreate the testing database only.
// dbi.init();


// -- Export
// nothing
