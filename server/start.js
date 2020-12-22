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
    , DB  = require('./db/build')
    ;


// -- Local Constants


// -- Local Variables


// -- Main section -

// This is for testing purpose. It initializes the SQlite database
// './db/db.sqlite' with credential for the user authentication.
// DB.init();

// Starts the server:
App();

/* - */
