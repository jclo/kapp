/** ****************************************************************************
 *
 * Makes requests to the server.
 *
 * This script uses the method 'fetch' to make request to the App server.
 * With 'fetch', a response could be:
 *
 *  . a form data;
 *  . an arrayBuffer
 *  . a blob,
 *  . a text,
 *  . a json,
 *
 *
 * @exports   -
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* global fetch */
/* eslint no-underscore-dangle: 0, no-console: 0 */

/**
 * Fetch
 */
function _fetch(url, options, type, callback) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((resp) => {
        if (resp.ok) {
          return type === 'text' ? resp.text() : resp.json();
        }
        return Promise.reject(resp);
      })
      .then((data) => {
        resolve(data);
        if (callback) callback(null, data);
      })
      .catch((resp) => {
        reject(resp);
        if (callback) callback(resp);
      });
  });
}


/**
 * Execute calls
 */
async function run() {
  const log = document.getElementById('msg');
  let resp;

  // GET '/api/v1/text':
  resp = await _fetch('/api/v1/text', {}, 'text');
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${resp}<br />`);


  // GET '/api/v1/json':
  resp = await _fetch('/api/v1/json');
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${JSON.stringify(resp)}<br />`);


  // POST '/api/v1/posto':
  resp = await _fetch('/api/v1/posto', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ a: 1, b: 'This is a payload' }),
  });
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${JSON.stringify(resp)}<br />`);


  // Wrong GET '/api/v1/texto':
  await _fetch('/api/v1/texto', {}, 'text')
    .then((data) => {
      console.log(data);
      log.append(JSON.stringify(resp));
    })
    .catch((e) => {
      console.log(e.status);
      console.log(e.statusText);
      console.log(e.url);
    });


  // Login
  resp = await _fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: 'jdo', password: 'jdo' }),
  }, 'text');
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${JSON.stringify(resp)}<br />`);

  // GET with query
  resp = await _fetch('/api/v1/users/?id=1&name=Doe');
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${JSON.stringify(resp)}<br />`);


  // GET with variable(s)
  resp = await _fetch('/api/v1/users/1/Doe/3');
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${JSON.stringify(resp)}<br />`);

  // GET Dictionary list
  resp = await _fetch('/api/v1/i18n/list');
  console.log(resp);
  log.insertAdjacentHTML('beforeend', `${JSON.stringify(resp)}<br />`);


  // GET English-French Dictionary
  resp = await _fetch('/api/v1/i18n/fr');
  console.log(resp);
  console.log(resp);
  console.log(resp['Hello %s and %s']);
}


// -- Main
run();

/* - */
