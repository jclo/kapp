#!/bin/bash

NAME=$1

if [[ ${NAME} -eq 1 ]]
  then
    echo 'Re-initializes test db ./db/testdb.sqlite ...'
    cp ./db/db.sqlite ./db/testdb.sqlite
else
  echo 'Re-initializes test db ./db/kadmin_testdb.sqlite ...'
  cp ./db/kadmin_db.sqlite ./db/kadmin_testdb.sqlite
fi


# -- oOo ---
