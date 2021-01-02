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

// This is used for filling the database. if the database already contains
// tables nothing is done. The only way to initialize a database is to drop
// its contents by hand.
dbi.init();


// -- Export
// nothing
