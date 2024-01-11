# README

These are the APIs SUPPORTED BY `KApp Server`.


## KApp APIs

### GET APIs

| GET APIs                                       | Description                    |
|:-----------------------------------------------|:-------------------------------|
| /api/v1/text                                   | returns a simple string        |
| /api/v1/json                                   | returns a json object          |
| -                                              |                                |
| /api/v1/auth/logout                            | logout                         |
| -                                              |                                |
| /api/v1/oauth2/revoke                          | revokes current access token   |
| -                                              |                                |
| /api/v1/system/version                         | returns server version         |
| /api/v1/system/kapp-version                    | returns kApp version           |
| -                                              |                                |
| /api/v1/i18n/list                              | returns the list of dicos      |
| /api/v1/i18n/:lang                             | returns the requested dico     |
| -                                              |                                |
| /api/v1/users                                  | returns the requested user(s)  |
| /api/v1/users/:id/:name/:other                 | returns the requuested user    |


### POST APIs

| POST APIs                                      | Description                    |
|:-----------------------------------------------|:-------------------------------|
| -                                              |                                |
| /api/v1/posto                                  | returns the sent payload       |
| -                                              |                                |
| /api/v1/auth/login                             | login                          |
| -                                              |                                |
| /api/v1/oauth2/token                           | request for a token            |


### DELETE APIs

| DELETE APIs                                    | Description                    |
|:-----------------------------------------------|:-------------------------------|
| -                                              |                                |


-- oOo --
