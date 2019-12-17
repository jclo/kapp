#!/usr/bin/env node
// ESLint declarations
/* global  */
/* eslint one-var: 0, semi-style: 0 */

// -- Node modules
const request = require('request')
    ;


// -- Project modules
const config = require('../server/config');


// -- Local constants
const server   = `http://localhost:${config.env.httpport}`
    ;


// -- Local variables
let url
  , payload
  , resp
  ;


// -- Private Functions --------------------------------------------------------

/**
 * GET
 */
async function GET(lurl) {
  return new Promise((resolve, reject) => {
    request({
      url: lurl,
      method: 'GET',
    }, (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res.body);
      }
    });
  });
}

/**
 * POST
 */
async function POST(lurl, pload) {
  return new Promise((resolve, reject) => {
    request({
      url: lurl,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: pload,
    }, (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res.body);
      }
    });
  });
}

/**
 * Run operations sequentially.
 */
async function run() {
  // Connect:
  process.stdout.write('Request the html page ... ');
  url = `${server}/index.html`;
  resp = await GET(url);
  if (typeof resp !== 'string') {
    throw new Error('The connection to the server did not return a string!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('Request a GET on /v1/getText ... ');
  url = `${server}/v1/getText`;
  resp = await GET(url);
  if (resp !== 'Hello Text World!') {
    throw new Error('The api /v1/getText did not return the right string!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('Request a GET on /v1/getJSON ... ');
  url = `${server}/v1/getJSON`;
  resp = await GET(url);
  if (JSON.parse(resp).a !== 'Hello JSON World!') {
    throw new Error('The api /v1/getJSON did not return the right string!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('Request a POST on /v1/posto ... ');
  url = `${server}/v1/posto`;
  payload = JSON.stringify({ a: 1, b: 'This is a payload' });
  resp = await POST(url, payload);
  if (JSON.parse(resp).b !== 'This is a payload') {
    throw new Error('The api /v1/posto did not return the right payload!');
  }
  process.stdout.write('ok\n');

  process.stdout.write('\nThat\'s all Folks!\n');
}


// -- Main section -
run();
