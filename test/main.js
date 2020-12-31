// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const chai     = require('chai')
    , chaiHttp = require('chai-http')
    ;


// -- Local Modules
const app     = require('../server/start')
    , config  = require('../server/config')

    , apiex   = require('./int/api-examples')
    , apiauth = require('./int/api-auth')
    , apisys  = require('./int/api-sys')
    , apii18n = require('./int/api-i18n')
    , apitok  = require('./int/api-token')
    ;


// -- Local Constants
// used for login
const user = { user: 'jdo', password: 'jdo' }
    ;


// -- Local Variables
let server;


// -- Main section -

// Set this environment variable orherwise 'request' does not accept self-signed
// certificates:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (process.env.TRAVIS || !config.env.https) {
  server = `http://localhost:${config.env.httpport}`;
} else {
  server = `https://localhost:${config.env.httpsport}`;
}

// Attach 'http-chai' to 'chai':
chai.use(chaiHttp);

// Create the request object:
const request = chai.request.agent(server);

describe('Test Kapp:', () => {
  apiex(request);
  apiauth(request, user);
  apisys(request, user);
  apii18n(request, user);
  apitok(request, user);

  //
});
