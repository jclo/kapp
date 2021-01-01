# README

Put in this folder the code specific to your application.


## APIs

Write your apis in the `api` folder.


## Controllers

Write the controllers in the `controllers` folder.


## Database access

`dbi.js` is the database interface with your code. `dbi.js` acts as an interface. `mysql/api.js` and `sqlite/api.js` implement the specific code to address the database.

Look at `server/dbi/dbi.js`. The method `getUser` is empty. The files `server/dbi/mysql.js` and `server/dbi/sqlite.js` implement the code for `getUser`. As you can see, it it not the same for `sqlite` and `mysql`.

That's all!
