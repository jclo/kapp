### HEAD

### 1.0.3 (December 31, 2020)

  * Added internationalization capability through a new i18n local module,
  * Added an api to access to an sqlite3 database,
  * Stored the credentials into the sqlite db with hashed passwords,
  * First release candidate,
  * Updated .travis.yml script,
  * Updated again .travis.yml as the previous wasn't sufficient to repair Travis-CI build,
  * Grrr x 6!
  * Replaced bcrypt by bcryptjs when Kapp is running on Travis-CI as it fails to compile addon,
  * Updated the cookie options,
  * Second release candidate,
  * Added an insulation layer for the calls to the database,
  * Added more api examples,
  * Third release candidate,
  * Added an api to load a translation dictionary,
  * Fourth release candidate,
  * Unified the file headers,
  * Extended the support to MySQL/MariaDB databases,
  * Added the support of oauth tokens,
  * Added the option to revoke an access token,
  * Added an hidden environment file to save the database credentials,
  * Created a specific environment file for Travis-CI,
  * Added a few examples of transactions based on curl and Node.js,
  * Updated the infrastructure for the unitary tests,
  * Added a first set of unitary tests,
  * Set to print error logs only,
  * ...,


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
