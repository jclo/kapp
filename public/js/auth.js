/** ****************************************************************************
 *
 * Makes requests to the server with tokens.
 *
 * This script uses the method 'fetch' to make request to the App server.
 *
 *
 *
 * @exports   -
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* global window, fetch, btoa */
/* eslint no-underscore-dangle: 0, no-console: 0 */

// Global:
let accessToken;


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
 * Asks for a login.
 */
function login(user, password) {
  const url = '/api/v1/oauth2/token';

  const options = {
    method: 'POST',
    headers: {
      // the user credentials must be encoded in base64:
      Authorization: `Basic ${btoa(`${user}:${password}`)}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grant_type: 'client_credentials' }),
  };

  _fetch(url, options, 'json')
    .then((resp) => {
      accessToken = resp.message.access_token;
      console.log(`We got the access token: ${accessToken}`);
    })
    .catch((e) => {
      console.log(e);
    });
}


/**
 * Makes a request.
 */
function getVersion() {
  const url = '/api/v1/system/version';

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  _fetch(url, options, 'json')
    .then((resp) => {
      console.log(resp.message);
    })
    .catch((e) => {
      console.log(e.statusText);
    });
}


/**
 * Logout.
 */
function logout() {
  const url = '/api/v1/oauth2/revoke';

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  _fetch(url, options, 'json')
    .then((resp) => {
      console.log(resp.message);
    })
    .catch((e) => {
      console.log(e.statusText);
    });
}


// -- Main

// List for a click event:
window.addEventListener('click', (e) => {
  if (e.target.className === 'logout') {
    logout();
    return;
  }

  if (e.target.className === 'version') {
    getVersion();
  }
}, false);

// Listen for a submit event:
window.addEventListener('submit', (e) => {
  e.preventDefault();
  login(e.target[0].value, e.target[1].value);
});

/* - */
