# README

To activate _kadmin, do the following:

`package.json`:
```bash
# replace
"test": "cross-env NODE_ENV=test nyc --reporter=lcov mocha ./test/main.js --exit",

#by
"test": "cross-env NODE_ENV=test nyc --reporter=lcov mocha ./test/kmain.js --exit",
```

`server/api/main.js`:
```bash
# comment the first line and uncommment the second one:
, CAPIS  = require('../_custom/api/v1/main')
// , CAPIS  = require('../_kadmin/api')
```

`server/dbi/dbi.js`:
```bash
# comment the three first lines and uncomments the three last ones:
, pdbimethods    = require('../_custom/dbi/dbi')
, sqlitepmethods = require('../_custom/dbi/sqlite/api')
, mysqlpmethods  = require('../_custom/dbi/mysql/api')
// , pdbimethods    = require('../_kadmin/dbi')
// , sqlitepmethods = require('../_kadmin/sql').sqlite
// , mysqlpmethods  = require('../_kadmin/sql').mysql
```

`.env.js`:
```bash
# comment the lines for db.sqlite and uncomments the lines for kadmin_db.sqlite:
db: {
  active: 'sqlite',
  sqlite: {
    database: './db/db.sqlite',
    testdb: './db/testdb.sqlite',
    // database: './db/kadmin_db.sqlite',
    // testdb: './db/kadmin_testdb.sqlite',
  },
  ...
},
```

That's all!

-- oOo --
