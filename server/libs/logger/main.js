/** ****************************************************************************
 *
 * Interfaces @mobilabs/KZLog.
 *
 * main.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Static Methods:
 *  . CreateLogger                creates the logger,
 *
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
import { fileURLToPath } from 'node:url';
import { basename } from 'node:path';
import KZlog from '@mobilabs/kzlog';


// -- Local Modules
import config from '../../config.js';


// -- Local Constants
const level = config.level || 'info';


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Creates the logger.
 *
 * @function (arg1, [arg2])
 * @public
 * @param {String}        the name of the file,
 * @param {Object}        the optional parameters (level and highlight),
 * @returns {Object}      returns the logger instance,
 * @since 0.0.0
 */
function CreateLogger(metaUrl, option) {
  const filename  = basename(fileURLToPath(metaUrl))
      , klevel    = option && option.level ? option.level : level
      , highlight = option && option.highlight === true ? true : false
      ;

  return KZlog(filename, klevel, highlight);
}


// -- Export
export default CreateLogger;
