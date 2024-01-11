# README

Put in this folder the code specific to your application.


## APIs

Write your apis in the `api` folder.


## Controllers

Write the controllers in the `controllers` folder.


## Database access

`dbi.js` is the database interface with your code. `dbi.js` acts as an interface.


## Link to KApp

If you decide to rename this folder `_custom`, you have to update the link in the file `server/api/main.js` in order to include your `apis`:

```javascript
const config = require('../config')
    , Auth   = require('./auth')
    , OAuth2 = require('./oauth2')
    , System = require('./system')
    , I18N   = require('./i18n')
    , CAPIS  = require('../_custom/api/v1/main')  // <-- update this line
    ;
```

And, you need to update the file `server/dbi.js` in order to include your `dbi methods`:

```javascript
const SQlite          = require('./sqlite')
    , MySQL           = require('./mysql')
    , PgSQL           = require('./pgsql')
    , { db }          = require('../../.env')
    , custpdbimethods = require('../_custom/sql')          // <-- update
    ;
```


That's all!

-- oOo ---
