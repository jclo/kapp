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
  // The credentials of the pod. There used by the other servers to identify the
  // pod entering in contact with them.
  pod: {
    authserver: 'the name of the server who can confirm the credentials of the pod',
    auth: {
      user: 'the authentication username',
      password: 'the authentication password',
    },
  },
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
      timezone: 'set the timezone',
    },
  },

  mongodb: {
    host: '<the server domain name>:27017',
    db: {
      database: 'the database name',
      options: {
        auth: {
          user: 'the username with the privileges to access to the database',
          password: 'the username password',
        },
        changeStreamsActive: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        connectTimeoutMS: 30000,
        // keepAlive: true,
      },
    },
    testdb: {
      database: 'the test database name',
      options: {
        auth: {
          user: 'the username with the privileges to access to the database',
          password: 'the username password',
        },
        changeStreamsActive: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        connectTimeoutMS: 30000,
        // keepAlive: true,
      },
    },
  },
};


// -- Export
module.exports = env;
