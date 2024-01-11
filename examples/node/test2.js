#!/usr/bin/env node
// ESLint declarations
/* global  */
/* eslint one-var: 0, semi-style: 0 */

// -- Node modules
const fetch = require('node-fetch')
    ;


// -- Project modules
const config = require('../../server/config');


// -- Local constants


// -- Local variables
let server
  ;


// -- Private Functions --------------------------------------------------------

/**
 * GET
 */
async function GET(url) {
  return fetch(url)
    .then((respo) => {
      if (respo.ok) {
        return respo.text();
      }
      return Promise.reject(respo);
    })
    .then((data) => [null, data])
    .catch((err) => [err])
  ;
}

/**
 * POST
 */
async function POST(url, payload) {
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((respo) => {
      if (respo.ok) {
        return respo.json();
      }
      return Promise.reject(respo);
    })
    .then((data) => [null, data])
    .catch((err) => [err])
  ;
}

/**
 * LOGIN
 */
async function TOK_LOGIN() {
  return fetch(`${server}/api/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from('jdo:jdo').toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grant_type: 'client_credentials' }),
  })
    .then((respo) => {
      if (respo.ok) {
        return respo.json();
      }
      return Promise.reject(respo);
    })
    .then((data) => [null, data])
    .catch((err) => [err])
  ;
}

/**
 * Run operations sequentially.
 */
async function run() {
  let url
    , err
    , resp
    , payload
    ;

  [err, resp] = await TOK_LOGIN();
  [err, resp] = await TOK_LOGIN();

  process.stdout.write('\nThat\'s all Folks!\n');
}


// -- Main section -

// Set this environment variable orherwise 'request' does not accept self-signed
// certificates:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (process.env.TRAVIS || config.env.https) {
  server = `http://127.0.0.1:${config.env.httpport}`;
} else {
  server = `https://127.0.0.1:${config.env.httpsport}`;
}

run();

// -- oOo ---
