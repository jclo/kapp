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

// Starts the server:
if (process.env.KAPP_ENV_KUBE_YAML) {
  _setEnv();
}

App();


// -- Export
// nothing
