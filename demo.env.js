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
    active: 'the name of the active database - currently "sqlite" or "mysql"',
    sqlite: {
      database: 'the path to sqlite database',
      testdb: 'the path to sqlite test database',
    },
    mysql: {
      host: 'the server domain name',
      connectionLimit: 'the number of simultaneous connections (number)',
      database: 'the database name',
      testdb: 'the test database name',
      user: 'the username with the privileges to access to the database',
      password: 'the username password',
    },
  },
};

// -- Export
module.exports = env;
