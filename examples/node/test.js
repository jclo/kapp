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
 * Run operations sequentially.
 */
async function run() {
  let url
    , err
    , resp
    , payload
    ;

  // Connect:
  process.stdout.write('Request the html page ... ');
  url = `${server}/index.html`;
  [err, resp] = await GET(url);
  if (typeof resp !== 'string') {
    throw new Error('The connection to the server did not return a string!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('Request a GET on /api/v1/text ... ');
  url = `${server}/api/v1/text`;
  [err, resp] = await GET(url);
  if (resp !== 'Hello Text World!') {
    throw new Error('The api /v1/text did not return the right string!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('Request a GET on /api/v1/json ... ');
  url = `${server}/api/v1/json`;
  [err, resp] = await GET(url);
  if (JSON.parse(resp).a !== 'Hello JSON World!') {
    throw new Error('The api /v1/json did not return the right string!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('Request a POST on /api/v1/posto ... ');
  url = `${server}/api/v1/posto`;
  payload = { a: 1, b: 'This is a payload' };

  [err, resp] = await POST(url, payload);
  if (resp.b !== 'This is a payload') {
    throw new Error('The api /v1/posto did not return the right payload!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('\nThat\'s all Folks!\n');
}


// -- Main section -

// Set this environment variable orherwise 'request' does not accept self-signed
// certificates:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (process.env.TRAVIS || !config.env.https) {
  server = `http://localhost:${config.env.httpport}`;
} else {
  server = `https://localhost:${config.env.httpsport}`;
}

run();

// -- oOo ---
