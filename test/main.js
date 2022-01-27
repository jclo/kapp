// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const chai     = require('chai')
    , chaiHttp = require('chai-http')
    ;


// -- Local Modules
const DBI     = require('../server/dbi/dbi')
    , config  = require('../server/config')
    , env     = require('../.env')
    , pack    = require('../package.json')
    // Kapp
    , apiex   = require('./int/api-examples')
    , apiauth = require('./int/api-auth')
    , apisys  = require('./int/api-sys')
    , apii18n = require('./int/api-i18n')
    , apitok  = require('./int/api-token')
    , apiuser = require('./int/api-users')
    ;


// -- Local Constants
// used for login
const user = { user: 'jdo', password: 'jdo' }
    ;


// -- Local Variables
let server;


// -- Main section -

// Set this environment variable otherwise 'request' does not accept
// self-signed certificates:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Set test mode for using the test db:
process.env.KAPP_TEST_MODE = 1;


if (process.env.TRAVIS || !config.env.https) {
  server = `http://localhost:${config.env.httpport}`;
} else {
  server = `https://localhost:${config.env.httpsport}`;
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

// Let's Go!
describe('Test Kapp:', () => {
  apiex(request);
  apiauth(request, user, pack);
  apisys(request, user, pack);
  apii18n(request, user);
  apitok(request, user, pack);
  apiuser(request, user, dbi);
});
