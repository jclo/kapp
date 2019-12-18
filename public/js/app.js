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
/* eslint no-console: 0 */

/**
 * Sends a GET api and wait for a text response.
 */
fetch('/v1/getText')
  .then((resp) => {
    if (resp.ok) {
      return resp.text();
    }
    return Promise.reject(resp);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((resp) => {
    console.log(`Fetch does not work for the api "/v1/getText". The server returns: ${resp.statusText}.`);
  });

/**
 * Sends a GET api and wait for a JSON response.
 */
fetch('/v1/getJSON')
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
    return Promise.reject(resp);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((resp) => {
    console.log(`Fetch does not work for the api "/v1/getJSON". The server returns: ${resp.statusText}.`);
  });

/**
 * Sends a POST api with a payload.
 */
fetch('/v1/posto', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ a: 1, b: 'This is a payload' }),
})
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
    return Promise.reject(resp);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((resp) => {
    console.log(`Fetch does not work for the api "/v1/posto". The server returns: ${resp.statusText}.`);
  });
