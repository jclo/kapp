# README

## Select the database

  The `.env.js` file contains the path to the database.



## Create an Sqlite3 database

Create it by typing:

```bash
cd db
sqlite3 db.sqlite 'VACUUM'
```


## Fill the database

The server detects that a database is empty or not.

If the database isn't empty, the server says:

```bash
[2021-11-14  19:51:31:593] [info] app.js: starts the app server ...
[2021-11-14  19:51:31:598] [info] app.js: create the dabase object ...
[2021-11-14  19:51:31:613] [info] core/http.js: http listening on port 1080.
[2021-11-14  19:51:31:614] [info] core/http.js: https listening on port 1443.
[2021-11-14  19:51:31:616] [info] dbi/sqlite.js: The database is already filled.
```

If the database is empty, the server says:

```bash
[2021-11-14  19:53:44:378] [info] app.js: starts the app server ...
[2021-11-14  19:53:44:383] [info] app.js: create the dabase object ...
[2021-11-14  19:53:44:398] [info] core/http.js: http listening on port 1080.
[2021-11-14  19:53:44:398] [info] core/http.js: https listening on port 1443.
[2021-11-14  19:53:44:400] [info] dbi/sqlite.js: The database is empty.)
{
  sql: 'CREATE TABLE users(\n' +
    '    id                            INTEGER        PRIMARY KEY AUTOINCREMENT,\n' +
    '    user_name                     VARCHAR(100)   DEFAULT NULL,\n' +
    '    user_hash                     VARCHAR(100)   DEFAULT NULL,\n' +
    '    first_name                    VARCHAR(100)   DEFAULT NULL,\n' +
    '    last_name                     VARCHAR(100)   DEFAULT NULL,\n' +
    '    is_deleted                    TINYINT(1)     NOT NULL DEFAULT 0,\n' +
    '    is_locked                     TINYINT(1)     NOT NULL DEFAULT 0\n' +
    '  )'
}
[
  {
    id: 1,
    user_name: 'jdo',
    user_hash: '$2b$10$xAKoRWpK4Tg1rNE0aSX8DOtm6fniPbVIDaN6vlEfOwrRvjLTj4k1m',
    first_name: 'John',
    last_name: 'Doe',
    is_deleted: 0,
    is_locked: 0
  },
  {
    id: 2,
    user_name: 'jsn',
    user_hash: '$2b$10$g7pZpO8CN7.pSmzwaH1CcOZrNmFDjFiIsWguKoanOq/W1rHoKpQXS',
    first_name: 'John',
    last_name: 'Snow',
    is_deleted: 0,
    is_locked: 0
  },
  {
    id: 3,
    user_name: 'jhe',
    user_hash: '$2b$10$64YF5QoE2Xqv5bKuAt7lBu7/IUHJyS/UgNiPwIAvaNIJOl6zh2zUa',
    first_name: 'John',
    last_name: 'Headache',
    is_deleted: 0,
    is_locked: 1
  }
]
[2021-11-14  19:53:44:635] [info] dbi/sqlite.js: we created the users table.)
```

That's all!

-- oOo ---
