// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
import * as chai from "chai";
import {default as chaiHttp, request} from "chai-http";
import shell from 'shelljs';


// -- Local Modules
import DBI from '../server/dbi/dbi.js';
// import MongoDB from '../server/libs/mongodb/main4test.js';
import config from '../server/config.js';
import env from '../.env.js';
import pack from '../package.json' with { type: 'json' };
// KApp
import apiauth from './int/legacy/api-auth.js';
import apiex from './int/legacy/api-examples.js';
import apii18n from './int/legacy/api-i18n.js';
import apiradio from './int/legacy/api-radio.js';
import apisys from './int/legacy/api-sys.js';
import apitok from './int/legacy/api-token.js';
import apitok2 from './int/legacy/api-token-conc.js';
import apiuser from './int/legacy/api-users.js';
import tcpsock from './int/legacy/api-tcpsocketserver.js';
import apimdb from './int/legacy/mongodb/api-mdb.js';


// -- Local Constants
// used for login
const user  = { user: 'jdo', password: 'jdo' }
    , user2 = { user: 'jsn', password: 'jsn' }
    , user3 = { user: 'jhe', password: 'jhe' }
    // , mongo = { user: 'jc', password: 'Abcde1@#' }
    ;


// -- Local Variables


// -- Main section -

// Set environment variables for testing:
process.env.KAPP_TEST_MODE = 1;
process.env.KAPP_HTTPS= false;

// Set the server URL
const server = `http://127.0.0.1:${config.env.httpport}`;
const agent = request.agent(server);

// Attach 'http-chai' to 'chai':
chai.use(chaiHttp);

// Start the server:
import '../server/start.js';

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
describe('Test KApp Server:', () => {
  describe('Test KApp Server:', () => {
    apiradio();
    tcpsock();
    apiauth(agent, user, pack);
    apiex(agent);
    apii18n(agent, user);
    apisys(agent, user, pack);
    apitok(agent, user, pack);
    apitok2(agent, user, user2, user3, pack);
    apiuser(agent, user, dbi);
    // This test requires a localhost MongoDB server running
    // with a vulcain_test database.
    // apimdb();
  });
});


// -- oOo ---
