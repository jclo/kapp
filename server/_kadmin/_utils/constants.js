/** ****************************************************************************
 *
 * Constants file.
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint no-useless-escape: 0 */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Main section -

const constants = {
  /* eslint-disable key-spacing */
  roles: {
    ROLE_ADMINISTRATOR: 1,
    ROLE_GROUPS_LEADER: 2,
    ROLE_GROUP_LEADER:  3,
    ROLE_TEAM_LEADER:   4,
    ROLE_TEAM_MEMBER:   5,
  },
  /* eslint-enable key-spacing */

  RESERVED_WORDS: ['superadmin', 'owneradmin', 'admin', 'owner', 'tenant'],
  USER_NAME_MAX: 50,
  PHOTO_MAX_SIZE: 25600,
};


// -- Export
module.exports = constants;
