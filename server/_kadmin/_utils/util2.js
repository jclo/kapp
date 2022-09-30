/** ****************************************************************************
 *
 * Provides utilities to check access rights.
 *
 * util2.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _filterAccess               filters access rights,
 *  . _extractIds                  extracts ids from the query,
 *  . _canIOperateOnIt            checks if this user has the right to perform,
 *  . _getMyRightsOnIt            returns the user's rights for the given module,
 *  . _getModuleRights            returns the access_rights for the specified module,
 *  . _amIAuthorized              returns the access_rights for the specified module,
 *
 *
 * Public Static Methods:
 *  . amIAuthorized               checks if this user has the requested rights,
 *  . getMyRightsOnIt             returns the user's rights for the given module,
 *  . canIOperateOnIt             checks if this user has the right to perform,
 *  . extractIds                  extracts ids from the query,
 *  . filterAccess                filters access rights,
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
const acc = require('../admin/dbi/tables/users').getUsersAccessRightsList()
    ;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Filters access rights.
 *
 * Nota:
 * This is for updating an existing role. Fake and badly formed columns
 * are removed.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Array}           access rights,
 * @param {Number}          the number of modules,
 * @returns {Array}         returns the formatted access rights,
 * @since 0.0.0
 */
function _filterAccess(accesses, mlength) {
  const upacc = []
      , kacc  = Object.keys(acc)
      ;

  // Remove access that don't have a module_id or have a module_id out or range.
  // Remove fake columns and columns out of range.
  let keys;
  let obj;
  for (let i = 0; i < accesses.length; i++) {
    if (accesses[i].module_id >= 0 && accesses[i].module_id <= mlength + 1) {
      keys = Object.keys(accesses[i]);
      obj = {};
      for (let j = 0; j < keys.length; j++) {
        if (keys[j] === 'module_id') {
          obj.module_id = accesses[i].module_id;
        } else if (kacc.indexOf(keys[j]) > -1
            && accesses[i][keys[j]] >= 0
            && accesses[i][keys[j]] < acc[keys[j]].length) {
          obj[keys[j]] = accesses[i][keys[j]];
        }
      }
      if (Object.keys(obj).length > 1) {
        upacc.push(obj);
      }
    }
  }

  return upacc;
}

/**
 * Extracts ids from the query.
 *
 * @function (arg1, [arg2])
 * @private
 * @param {String}          the list of ids,
 * @param {Array}           the ids to exclude,
 * @returns {Array}         returns the valid and invalid ids,
 * @since 0.0.0
 */
function extractIds(list, excluded) {
  if (typeof list !== 'string') {
    return [
      [],
      [],
      Array.isArray(excluded) ? [...excluded] : [],
    ];
  }

  let ids;
  if (list.includes(',')) {
    ids = list.split(',');
  } else if (list.includes(';')) {
    ids = list.split(';');
  } else if (list.length > 0) {
    ids = [list];
  } else {
    ids = [];
  }

  const valIds = [];
  const unvalIds = [];
  const exclu = Array.isArray(excluded) ? [...excluded] : [];

  let id;
  for (let i = 0; i < ids.length; i++) {
    id = parseInt(ids[i], 10);
    if (Number.isNaN(id)) {
      unvalIds.push(ids[i]);
    } else if (exclu.indexOf(id) === -1) {
      valIds.push(id);
    }
  }

  return [valIds, unvalIds, exclu];
}

/**
 * Checks if this user has the right to perform the operation.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Object}          the session user,
 * @param {Object}          the module,
 * @param {Object}          the access rights,
 * @param {String}          the module name,
 * @returns {Array}         returns an error or null,
 * @since 0.0.0
 */
function _canIOperateOnIt(user, moduleItem, right, moduleName) {
  if (right === 'All Groups') {
    return [null];
  }

  if (right === 'Group' && moduleItem.group_id === user.group_id) {
    return [null];
  }

  if (right === 'Team' && moduleItem.team_id === user.team_id) {
    return [null];
  }

  if (right === 'Owner' && moduleItem.assigned_to_user_id === user.id) {
    return [null];
  }

  if (right === 'None') {
    return [`Operation refused. You have no accces right for the module ${moduleName}!`];
  }

  if (moduleItem.team_id !== user.team_id) {
    return [`Operation refused. The ${moduleName} ${moduleItem.id} belongs to another team!`];
  }

  return [`Operation refused. You are not the owner of the ${moduleName} ${moduleItem.id}!`];
}

/**
 * Returns the user's rights for the given module item.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the session user,
 * @param {Object}          the user rights,
 * @param {Object}          the module item,
 * @returns {Object}        returns the user's rights for this module item,
 * @since 0.0.0
 */
function _getMyRightsOnIt(user, auth, item) {
  const nauth = { ...auth };

  // Am I the owner of this item?
  if (user.id === item.assigned_to_user_id) {
    nauth.access_right = nauth.access_right === 'Enabled';

    nauth.list_right = nauth.list_right === 'All Groups'
      || nauth.list_right === 'Group'
      || nauth.list_right === 'Team'
      || nauth.list_right === 'Owner';

    nauth.view_right = nauth.view_right === 'All Groups'
      || nauth.view_right === 'Group'
      || nauth.view_right === 'Team'
      || nauth.view_right === 'Owner';

    nauth.edit_right = nauth.edit_right === 'All Groups'
      || nauth.edit_right === 'Group'
      || nauth.edit_right === 'Team'
      || nauth.edit_right === 'Owner';

    nauth.delete_right = nauth.delete_right === 'All Groups'
      || nauth.delete_right === 'Group'
      || nauth.delete_right === 'Team'
      || nauth.delete_right === 'Owner';

    nauth.mass_update_right = nauth.mass_update_right === 'All Groups'
      || nauth.mass_update_right === 'Group'
      || nauth.mass_update_right === 'Team'
      || nauth.mass_update_right === 'Owner';

    nauth.import_right = nauth.import_right === 'Enabled';

    nauth.export_right = nauth.export_right === 'All Groups'
      || nauth.export_right === 'Group'
      || nauth.export_right === 'Team'
      || nauth.export_right === 'Owner';

    return nauth;
  }

  // Am I in the same team as this item?
  if (user.team_id === item.team_id) {
    nauth.access_right = nauth.access_right === 'Enabled';

    nauth.list_right = nauth.list_right === 'All Groups'
      || nauth.list_right === 'Group'
      || nauth.list_right === 'Team';

    nauth.view_right = nauth.view_right === 'All Groups'
      || nauth.view_right === 'Group'
      || nauth.view_right === 'Team';

    nauth.edit_right = nauth.edit_right === 'All Groups'
      || nauth.edit_right === 'Group'
      || nauth.edit_right === 'Team';

    nauth.delete_right = nauth.delete_right === 'All Groups'
      || nauth.delete_right === 'Group'
      || nauth.delete_right === 'Team';

    nauth.mass_update_right = nauth.mass_update_right === 'All Groups'
      || nauth.mass_update_right === 'Group'
      || nauth.mass_update_right === 'Team';

    nauth.import_right = nauth.import_right === 'Enabled';

    nauth.export_right = nauth.export_right === 'All Groups'
      || nauth.export_right === 'Group'
      || nauth.export_right === 'Team';

    return nauth;
  }

  // Am I in the same group as this item?
  if (user.group_id === item.group_id) {
    nauth.access_right = nauth.access_right === 'Enabled';

    nauth.list_right = nauth.list_right === 'All Groups'
      || nauth.list_right === 'Group';

    nauth.view_right = nauth.view_right === 'All Groups'
      || nauth.view_right === 'Group';

    nauth.edit_right = nauth.edit_right === 'All Groups'
      || nauth.edit_right === 'Group';

    nauth.delete_right = nauth.delete_right === 'All Groups'
      || nauth.delete_right === 'Group';

    nauth.mass_update_right = nauth.mass_update_right === 'All Groups'
      || nauth.mass_update_right === 'Group';

    nauth.import_right = nauth.import_right === 'Enabled';

    nauth.export_right = nauth.export_right === 'All Groups'
      || nauth.export_right === 'Group';

    return nauth;
  }

  // Neither the owner nor the same team and nor the same group!
  nauth.access_right = nauth.access_right === 'Enabled';
  nauth.list_right = nauth.list_right === 'All Groups';
  nauth.view_right = nauth.view_right === 'All Groups';
  nauth.edit_right = nauth.edit_right === 'All Groups';
  nauth.delete_right = nauth.delete_right === 'All Groups';
  nauth.mass_update_right = nauth.mass_update_right === 'All Groups';
  nauth.import_right = nauth.import_right === 'Enabled';
  nauth.export_right = nauth.export_right === 'All Groups';
  return nauth;
}

/**
 * Returns the access_rights for the specified module.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {Array}           access rights for all the modules,
 * @param {Array}           the modules,
 * @param {Array}           the access rights legend,
 * @param {String}          the module to retrieve access rights,
 * @returns {Array}         returns readeable access rights (legend instead of numbers),
 * @since 0.0.0
 */
function _getModuleRights(accessrights, modules, legend, module) {
  let id
    , match
    , rights
    ;

  // Find the module index:
  match = false;
  for (let i = 0; i < modules.length; i++) {
    if (modules[i].name === module) {
      id = modules[i].id;
      match = true;
      break;
    }
  }
  if (!match) {
    throw new Error(`_getModuleRights: the module ${module} does nor exist!`);
  }

  // Retrieve the access rights for the passed-in module:
  match = false;
  for (let i = 0; i < accessrights.length; i++) {
    if (accessrights[i].module_id === id) {
      rights = { ...accessrights[i] };
      match = true;
      break;
    }
  }
  if (!match) {
    throw new Error(`_getModuleRights: the access rights for the module ${module} are not found!`);
  }

  // Replace the access rights expressed in numbers by their
  // corresponding string:
  const keys = Object.keys(rights);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'module_id') {
      rights.module_id = module;
    } else {
      rights[keys[i]] = legend[keys[i]][rights[keys[i]]];
    }
  }
  return rights;
}

/**
 * Returns the access_rights for the specified module.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {Object}          the session user,
 * @param {String}          the module,
 * @param {Object}          the requested access rights,
 * @returns {Array}         returns error and auth,
 * @since 0.0.0
 */
function _amIAuthorized(user, module, rights) {
  const auth = _getModuleRights(
    user.access_rights,
    user.modules,
    user.access_legend,
    module,
  );

  if (auth.access_right !== 'Enabled') {
    return [
      `Operation refused. You don't have the authorization to access ${module}!`,
    ];
  }

  if (auth[rights] !== 'Owner'
    && auth[rights] !== 'Team'
    && auth[rights] !== 'Group'
    && auth[rights] !== 'All Groups') {
    return [
      `Operation refused. You don't have the '${rights}' authorization for ${module}!`,
      auth,
    ];
  }

  return [null, auth];
}


// -- Public Static Methods ----------------------------------------------------

const Util = {

  /**
   * Checks if the user has the requested rights for the specified module.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}        the session user,
   * @param {Object}        the module,
   * @param {Object}        the requested access rights,
   * @returns {Array}       returns error and auth,
   * @since 0.0.0
   */
  amIAuthorized(user, module, rights) {
    return _amIAuthorized(user, module, rights);
  },

  /**
   * Returns the user's rights for the given module item.
   *
   * @method (arg1, arg2, arg3)
   * @public
   * @param {Object}          the session user,
   * @param {Object}          the user rights,
   * @param {Object}          the current module item,
   * @returns {Object}        returns the user's rights for this module item,
   * @since 0.0.0
   */
  getMyRightsOnIt(user, auth, item) {
    return _getMyRightsOnIt(user, auth, item);
  },

  /**
   * Checks if this user has the right to perform the operation.
   *
   * @method (arg1, arg2, arg3, arg4)
   * @public
   * @param {Object}        the session user,
   * @param {Object}        the module,
   * @param {Object}        the access rights,
   * @param {String}        the module name,
   * @returns {Array}       returns an error or null,
   * @since 0.0.0
   */
  canIOperateOnIt(user, moduleItem, right, moduleName) {
    return _canIOperateOnIt(user, moduleItem, right, moduleName);
  },

  /**
   * Extracts ids from the query.
   *
   * @method (arg1, [arg2])
   * @public
   * @param {String}        the list of ids,
   * @param {Array}         the ids to exclude,
   * @returns {Array}       returns the valid, invalid and excluded ids,
   * @since 0.0.0
   */
  extractIds(ids, excluded) {
    return extractIds(ids, excluded);
  },

  /**
   * Filters access rights.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         access rights,
   * @param {Number}        the number of modules,
   * @returns {Array}       returns the formatted access rights,
   * @since 0.0.0
   */
  filterAccess(accesses, mlength) {
    return _filterAccess(accesses, mlength);
  },
};


// -- Export
module.exports = Util;
