/** ****************************************************************************
 *
 * Defines utility functions to manage db.
 *
 * util12.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getUsersStatistics         returns Users' statistics,
 *
 *
 * Public Static Methods:
 *  . getUsersStatistics          returns Users' statistics,
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
const R = require('../../../../_utils/constants').roles;


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns Users' statistics.
 *
 * @function (arg1, arg2)
 * @private
 * @param {Array}         the list of users,
 * @param {Object}        the connected user,
 * @returns {Object}      returns the statistics,
 * @since 0.0.0
 */
function _getUsersStatistics(users, user) {
  const teams   = []
      , us      = {
        total: users.length,
        assigned: 1,
        admin: 0,
        teams: 0,
        groupsLeaders: 0,
        groupLeaders: 0,
        teamLeaders: 0,
        teamMembers: 0,
        locked: 0,
      }
    ;

  for (let i = 0; i < users.length; i++) {
    us.assigned += users[i].assigned_to_user_id === user.id && users[i].id !== user.id ? 1 : 0;
    us.admin += users[i].role_id === R.ROLE_ADMINISTRATOR ? 1 : 0;
    us.groupsLeaders += users[i].role_id === R.ROLE_GROUPS_LEADER ? 1 : 0;
    us.groupLeaders += users[i].role_id === R.ROLE_GROUPS_LEADER ? 1 : 0;
    us.teamLeaders += users[i].role_id === R.ROLE_TEAM_LEADER ? 1 : 0;
    us.teamMembers += users[i].role_id === R.ROLE_TEAM_MEMBER ? 1 : 0;
    us.locked += users[i].is_locked === 1 ? 1 : 0;

    if (users[i].team_id && teams.indexOf(users[i].team_id) === -1) {
      us.teams += 1;
      teams.push(users[i].team_id);
    }
  }

  return us;
}


// -- Public Static Methods ----------------------------------------------------

const Util = {

  /**
   * Returns Users' statistics.
   *
   * @method (arg1, arg2)
   * @public
   * @param {Array}         the list of users,
   * @param {Object}        the connected user,
   * @returns {Object}      returns the statistics,
   * @since 0.0.0
   */
  getUsersStatistics(users, user) {
    return _getUsersStatistics(users, user);
  },
};


// -- Export
module.exports = Util;
