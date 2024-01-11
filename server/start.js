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
const dns = require('node:dns');


// -- Local Modules
const App = require('./app')
    ;


// -- Local Constants
const yamlfile = './container/kube-local.yaml'
    ;


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
/* eslint-disable global-require, import/no-extraneous-dependencies */
function _setEnv() {
  try {
    const yaml = require('js-yaml')
        , fs   = require('fs')
        , doc  = yaml.load(fs.readFileSync(yamlfile, 'utf8')).spec.template.spec.containers[0].env
        ;

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

// Starts the server:
if (process.env.KAPP_ENV_KUBE_YAML) {
  _setEnv();
}

App();


// -- Export
// nothing
