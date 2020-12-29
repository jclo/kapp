/** ****************************************************************************
 *
 * Environment file for test on Travis-CI.
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


// -- Main section -

const env = {
  // Define here the credentials to access your database. This hidden file
  // is declared not to be exported in '.gitignore'.
  db: {
    sqlite: {
      database: './db/db.sqlite',
    },
  },
};

// -- Export
module.exports = env;
