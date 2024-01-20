### HEAD

### 2.1.0 (January 20, 2024)

  * Updated the cryptokeys library,
  * Fixed a few typos,
  * Updated the project with es6lib v2.1.1,
  * Release.


### 2.0.0 (January 12, 2024)

  * Removed Travis CI,
  * Added Github Actions,
  * Added .github folder,
  * Added .env.js for Github Actions,
  * Fixed a typo in ci.yml,
  * Updated the project dependencies,
  * Replaced nyc by c8,
  * Renamed the package.json scripts,
  * Reshuffled test/main.js file and added mongodb test,
  * Improved token management,
  * Added the support of web sockets,
  * Added pod to .env.github.js,
  * Added the support of PostgreSQL,
  * Reduced the coverage for functions,
  * Added kube-local.yaml to run KApp inside a kubernetes node,
  * Added middlewares to filter IPs and domains,
  * Updated bin/kapp.js script,
  * Published 2.0.0-beta.1,
  * Fixed a few issues found during the creation of a KApp server,
  * Release.


### 1.9.1 (February 22, 2023)

  * Added a mechanism to watch login,
  * Release.


### 1.9.0 (January 9, 2023)

  * Fixed a few minor issues,
  * Kubernetized Kapp,
  * Release.


### 1.8.0 (January 4, 2023)

  * Updated the copyright date,
  * Made the server name generic in _getMe,
  * Fixed a minor issue in MongoDB lib,
  * Added environmental variables for Kubernetes,
  * Added package-lock.json to the production version,
  * Updated the project dependencies,
  * Normalized the returned errors ({ status: 40x, message: '...' }),
  * Fixed an error on env.travis file,
  * Release.


### 1.7.0 (December 2, 2022)

  * added the whoami method to auth.js for retrieving the username of the connected user,
  * added the option to start background processes,
  * added an optional library allowing to publish and listen messages,
  * Release.


### 1.6.3 (November 26, 2022)

  * Fixed an issue on token lib that prevented to guarantee the length of the string,
  * Added to Auth0.getMe the password as an optional argument,
  * fixed a few typos,
  * Release.


### 1.6.2 (November 22, 2022)

  * Fixed a regression on token authentication from an external server,
  * Added a library to generate a token or a password,
  * Release.


### 1.6.1 (November 21, 2022)

  * Fixed a few typos,
  * Moved the hook to a dedicated file,
  * Release.


### 1.6.0 (November 18, 2022)

  * Extended the fetch library to manage tokens,
  * Added a hook to get a token authentication from an external server,
  * Fixed a few issues,
  * Release.


### 1.5.1 (November 14, 2022)

  * Replaced numbers by strings in the values of environment variables in the kapp.yaml file,
  * Release.


### 1.5.0 (November 14, 2022)

  * Dockerized Kapp,
  * Added the container folder with Dockerfile and kapp.yaml files,
  * Updated the .env.travis.js file,
  * Release.


### 1.4.1 (October 23, 2022)

  * Fixed a few typos,
  * Release.


### 1.4.0 (October 8, 2022)

  * Added the capability to listen db events,
  * Release.


### 1.3.1 (September 30, 2022)

  * Fixed a few npm package issues,
  * Updated the project dependencies,
  * Release.


### 1.3.0 (September 30, 2022)

  * Added an example for a request through php,
  * Added a template (_kadmin) for the administration of users with different privileges,
  * Added an optional fetch library,
  * Added an optional MongoDB library,
  * Release.


### 1.2.0 (June 17, 2022)

  * Added a test to prevent a crash when the provided password isn't a string,
  * Added a timestamp to register the login and the latest transaction,
  * Added an ExpressJS middleware to remove the inactive users and sessions,
  * Fixed an issue for travis,
  * Release.


### 1.1.1 (January 27, 2022)

  * Updated the project dependencies,
  * Updated the copyright,
  * Release.


### 1.1.0 (November 15, 2021)

  * Added internationalisation capability through a new i18n local module,
  * Added an api to access to sqlite3 and MySQL/MariaDB databases,
  * Stored the credentials into the sqlite db with hashed passwords,
  * Added the support of oauth tokens,
  * Release.


### 1.0.2 (October 16, 2020)

  * Added the script tasks/prod.sh to build a production version,
  * Release.


### 1.0.1 (October 8, 2020)

  * Added @mobilabs/kasar for the documentation,
  * Release.


### 1.0.0 (October 2, 2020)

  * Updated the project dependencies,
  * Fixed a regression on test coverage,
  * Release.


### 0.0.4 (August 10, 2020)

  * Updated the project dependencies,
  * Release.


### 0.0.3 (March 16, 2020)

  * Enabled the local connections,
  * Updated the dependencies,
  * Release.


### 0.0.2 (December 19, 2019)

  * Implemented an optional session login mechanism,
  * Release.


### 0.0.1 (December 18, 2019)

  * Implemented a mechanism to run Kapp on Travis-CI without disabling the https server,
  * Release.


### 0.0.0 (December 17, 2019)

  * Initial commit,
  * First build,
  * Halted the https server by default otherwise the test fails on travis-ci,
  * Release.

-- oOo ---
