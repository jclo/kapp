#!/bin/bash

NAME=$1

if [[ ${NAME} -eq 1 ]]
  then
    echo 'Re-initializes test db ./db/testdb.sqlite ...'
    cp ./db/db.sqlite ./db/testdb.sqlite
fi


# -- oOo ---
