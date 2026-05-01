#!/usr/bin/env node
/** ****************************************************************************
 *
 * Starts {{app:name}}.
 *
 * Private Functions:
 *  . _setEnv                     initialises env. variables as does Kubernetes,
 *
 *
 * Main:
 *  . script!
 *
 *
 *
 * @exports   -
 * @author    -
 * @since     0.0.0
 * @version   -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
import dns from 'node:dns';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';


// -- Local Modules
import App from './app.js';
import CKeys from './libs/cryptokeys/main.js';


// -- Local Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const yamlfile = join(__dirname, './container/kube-local.yaml');


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Initialises environment variables as does Kubernetes.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
function _setEnv() {
  try {
    const doc = yaml.load(fs.readFileSync(yamlfile, 'utf8')).spec.template.spec.containers[0].env;

    for (let i = 0; i < doc.length; i++) {
      process.env[doc[i].name] = doc[i].value;
    }
  } catch (e) {
    throw new Error(e);
  }
}


// -- Main Section -------------------------------------------------------------

// There was a breaking change in Node v17 which changed the default IP resolving.
// ip6 is preferred by default. Thus, localhost is interpreted as an ip6 address
// resulting in error of connection with a fetch at 'http://localhost'.
// A workaroung is to replace localhost' by '127.0.0.1' or rechanging the
// preferred default with this:
// (see https://github.com/node-fetch/node-fetch/issues/1624)
dns.setDefaultResultOrder('ipv4first');

// Adds Web Push notifications keys to .env.js if they do not exist.
CKeys.addKeysToEnv((resp) => {
  if (resp.error_code) {
    process.stdout.write('Could NOT generate Web Push Notification keys. The server must not to be started!');
    return;
  }

  // Starts the server:
  if (process.env.KAPP_ENV_KUBE_YAML) {
    _setEnv();
  }
  App(__dirname);
});


// -- Export
// nothing
