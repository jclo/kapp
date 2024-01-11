# README

This tutorial explains how to create and use a `PostgreSQL` server running on docker.


## Create PostgreSQL Server

Type:

```bash
docker run -d \
	--name my-postgres \
	-e POSTGRES_PASSWORD=root \
	-e PGDATA=/var/lib/postgresql/data/pgdata \
	-v $PWD/postgresql/db:/var/lib/postgresql/data \
  -p 5432:5432 \
	postgres
```

## Connect to the created server

```bash
# this connect to the container:
docker exec -it my-postgres bash

# this connect to PostgreSQL server:
# (role postgres)
psql -U postgres
```


## Create User and database

First list the current users:

```bash
 postgres=# \du

 # You should get:
 Role name |                         Attributes                         
-----------+------------------------------------------------------------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

Then, create a new database with an associated user:

```bash
postgres=# CREATE DATABASE testdb;
postgres=# CREATE USER user WITH ENCRYPTED PASSWORD 'user';
postgres=# ALTER DATABASE testdb OWNER TO user; 
```

### Useful commands

```bash
DROP DATABASE mydb WITH (FORCE);
DROP USER user_name;
```

```bash
postgres=# \l                       # list databases,
postgres=# \du                      # list users,
postgres=# \c db_select             # connect to a db,
db_select=# DROP TABLE table_name;  # drop table table_name from db,
db_select=# \dt                     # print tables,
```

## Add pgAdmin

Type:

```bash
docker pull dpage/pgadmin4
docker run -p 8080:80 \
    -e 'PGADMIN_DEFAULT_EMAIL=contact@mobilabs.fr' \
    -e 'PGADMIN_DEFAULT_PASSWORD=root' \
    -d dpage/pgadmin4
```

### Configure pgAdmin

When you connect to pgAdmin at **localhoqt:8080** url, you need to enter your login and password defined above.

You should then configure pgAdmin to connect to the server by clicking oon **add server**. The name is what you want.

On the connection page, ou must enter the ip address of the runnning Postgres running container and not localhost.

You can find it by running:

```bash
docker ps

#response
CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                           NAMES
91c5f25ddefd   postgres         "docker-entrypoint.s…"   57 minutes ago   Up 57 minutes   0.0.00:5432->5432/tcp my-postgres
555083546b6f   dpage/pgadmin4   "/entrypoint.sh"         2 hours ago      Up 2 hours      443/tcp, 0.0.00:8080->80/tcp   jovial_khorana

# Then type:
docker inspect 91c5f25ddefd
# and find the IPAddress in the response.
```

This is the address you should enter [see here for more explanations](https://stackoverflow.com/questions/57109494/unable-to-connect-to-server-pgadmin-4).


#### Nota

Each time you restart Docker, the IP address of the db server change. You must update the server by modifying its parameters (in fact iits IP address) otherwise you cannot login to the db server.


# Appendix

  - [PostgreSQL on Docker](https://hub.docker.com/_/postgres),
  - [Converting MySQL to PostgreSQL](https://en.wikibooks.org/wiki/Converting_MySQL_to_PostgreSQL),
   [PostgreSQL Tutorial](https://www.tutorialspoint.com/postgresql/index.htm),
   [PostgreSQL - How to List All Available Tables?](https://www.commandprompt.com/education/postgresql-how-to-list-all-available-tables/),


-- oOo ---
