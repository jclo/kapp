/** ****************************************************************************
 *
 * Environment file.
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
    active: 'name of the active database - currently "sqlite" or "mysql"',
    sqlite: {
      database: 'the path to sqlite database',
    },
    mysql: {
      host: 'server domain name',
      connectionLimit: 'number of simultaneous connections (number)',
      database: 'database name',
      user: 'username with the privileges to access to the database',
      password: 'username password',
    },
  },
};

// -- Export
module.exports = env;
