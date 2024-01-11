// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const chai     = require('chai')
    , chaiHttp = require('chai-http')
    , shell    = require('shelljs')
    ;


// -- Local Modules
const DBI      = require('../server/dbi/dbi')
    // , MongoDB  = require('../server/libs/mongodb/main4test')
    , config   = require('../server/config')
    , env      = require('../.env')
    , pack     = require('../package.json')
    // Kapp
    , apiauth  = require('./int/api-auth')
    , apiex    = require('./int/api-examples')
    , apii18n  = require('./int/api-i18n')
    , apiradio = require('./int/api-radio')
    , apisys   = require('./int/api-sys')
    , apitok   = require('./int/api-token')
    , apitok2  = require('./int/api-token-conc')
    , apiuser  = require('./int/api-users')
    // , tcpsock  = require('./int/api-tcpsocketserver')
    , apimdb   = require('./int/mongodb/api-mdb')
    ;


// -- Local Constants
// used for login
const user  = { user: 'jdo', password: 'jdo' }
    , user2 = { user: 'jsn', password: 'jsn' }
    , user3 = { user: 'jhe', password: 'jhe' }
    // , mongo = { user: 'jc', password: 'Abcde1@#' }
    ;


// -- Local Variables
let server;


// -- Main section -

// Set this environment variable otherwise 'request' does not accept
// self-signed certificates:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Set environment variables for testing:
process.env.KAPP_TEST_MODE = 1;


if (process.env.GITHUB_ACTIONS || !config.env.https) {
  server = `http://127.0.0.1:${config.env.httpport}`;
} else {
  server = `https://127.0.0.1:${config.env.httpsport}`;
}

// Attach 'http-chai' to 'chai':
chai.use(chaiHttp);

// Create the request object:
const request = chai.request.agent(server);

// Start the server:
/* eslint-disable-next-line no-unused-vars */
const app = require('../server/start');

// Create db object:
const dbi = DBI(env.db.active);

// Create the MongoDB object:
// We use here a dedicated lib (see server/libs/mongodb)
// as this script doesn't accept execution in callback.
// All the tests are killed at the end of the script!
// const dbmo = MongoDB(env.mongodb);

// Initializes testdb:
shell.exec('./test/init_test_db.sh 1');

// Let's Go!
describe('Test KApp Base Server:', () => {
  describe('Test KApp Base Server:', () => {
    apiauth(request, user, pack);
    apiex(request);
    apii18n(request, user);
    apiradio(request, user);
    apisys(request, user, pack);
    apitok(request, user, pack);
    apitok2(request, user, user2, user3, pack);
    apiuser(request, user, dbi);
    // tcpsock();
    // This test requires a localhost MongoDB server running
    // with a vulcain_test database.
    // apimdb();
  });
});


// -- oOo ---
