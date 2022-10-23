/** ****************************************************************************
 *
 * Defines utility functions to manage access rights.
 *
 * uti11.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:

 *
 *
 * Public Static Methods:

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


// -- Local Modules
const U1 = require('./util1');


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Sets the access rights.
 *
 * It merges the custom access rights with the role access rights and
 * the team member access rights.
 * If a custom access right is 'Not Set', it is overwritten by the role
 * access right and if this last one is 'Not Set' too, it is overwritten by
 * the team member access right.
 *
 * In another words, if an access right is 'Not Set' nor by custom neither by
 * role, the access right defined for Team Member applies.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Array}           the custom access rights (if any),
 * @param {Array}           the access rights for the defined role,
 * @param {Array}           the access rights of the team member,
 * @returns {Array}         returns the resulting access rights,
 * @since 0.0.0
 */
function _mergeAccessRights(custom, role, rmember) {
  if (!custom && !role) return rmember;

  /**
   * Returns the matching module.
   */
  function _extract(obj, index) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].module_id === index) {
        return obj[i];
      }
    }
    return {};
  }

  /**
   * Removes the 'Not Set' access rights.
   */
  function _purge(obj) {
    const nobj = {}
        , keys = Object.keys(obj)
        ;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === 'module_id' || obj[keys[i]] !== 1) {
        nobj[keys[i]] = obj[keys[i]];
      }
    }
    return nobj;
  }

  const acc = [];
  let cu
    , ro
    , rm
    ;
  if (custom && role) {
    for (let i = 0; i < custom.length; i++) {
      cu = _purge(custom[i]);
      ro = _purge(_extract(role, custom[i].module_id));
      rm = _extract(rmember, custom[i].module_id);
      acc.push(U1.extend(rm, ro, cu));
    }
    return acc;
  }

  if (custom && !role) {
    for (let i = 0; i < custom.length; i++) {
      cu = _purge(custom[i]);
      rm = _extract(rmember, custom[i].module_id);
      acc.push(U1.extend(rm, cu));
    }
    return acc;
  }

  for (let i = 0; i < role.length; i++) {
    ro = _purge(role[i]);
    rm = _extract(rmember, role[i].module_id);
    acc.push(U1.extend(rm, ro));
  }
  return acc;
}


// -- Public Static Methods ----------------------------------------------------

const Util = {

  /**
   * Sets the access rights.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Array}         the custom access rights (if any),
   * @param {Array}         the access rights for the defined role,
   * @param {Array}         the access rights of the team member,
   * @returns {Array}       returns the resulting access rights,
   * @since 0.0.0
   */
  mergeAccessRights(custom, role, rmember) {
    return _mergeAccessRights(custom, role, rmember);
  },
};


// -- Export
module.exports = Util;
