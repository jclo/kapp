#!/usr/bin/env bash

NAME=$1
name=$(echo $1 | tr '[:upper:]' '[:lower:]')
VERSION=$2
NPM='private_repo'
TMP='tmp'
SOURCE='.'

# Clear tmp
if [[ -d "${NPM}/${TMP}" ]]
then
  rm -rf ${NPM}/${TMP}/*
fi

if [[ ! -d "${NPM}/${TMP}" ]]
then
  mkdir -p ${NPM}/${TMP}
fi

# Copy from source
# cp -r ${SOURCE}/__SQLite-amalgamation ${NPM}/${TMP}/.
cp -r ${SOURCE}/bin ${NPM}/${TMP}/.
cp -r ${SOURCE}/container ${NPM}/${TMP}/.
cp -r ${SOURCE}/db ${NPM}/${TMP}/.
cp -r ${SOURCE}/dbscripts ${NPM}/${TMP}/.
cp -r ${SOURCE}/examples ${NPM}/${TMP}/.
cp -r ${SOURCE}/public ${NPM}/${TMP}/.
cp -r ${SOURCE}/scripts ${NPM}/${TMP}/.
cp -r ${SOURCE}/server ${NPM}/${TMP}/.
cp -r ${SOURCE}/tcpclient ${NPM}/${TMP}/.
cp -r ${SOURCE}/test ${NPM}/${TMP}/.

cp ${SOURCE}/.env.github.js ${NPM}/${TMP}/.
cp ${SOURCE}/.eslintignore ${NPM}/${TMP}/.
cp ${SOURCE}/.eslintrc ${NPM}/${TMP}/.
cp ${SOURCE}/.gitignore ${NPM}/${TMP}/.
cp ${SOURCE}/.npmignore ${NPM}/${TMP}/.
cp ${SOURCE}/demo.env.js ${NPM}/${TMP}/.
cp ${SOURCE}/demo.env.js ${NPM}/${TMP}/.env.js
cp ${SOURCE}/index.js ${NPM}/${TMP}/.
cp ${SOURCE}/LICENSE.md ${NPM}/${TMP}/.
cp ${SOURCE}/package.json ${NPM}/${TMP}/.
cp ${SOURCE}/README_KAPP_API.md ${NPM}/${TMP}/.
cp ${SOURCE}/README_LIB_MONGODB.md ${NPM}/${TMP}/.
cp ${SOURCE}/README_PGSQL_DOCKER.md ${NPM}/${TMP}/.
cp ${SOURCE}/README_SOCKETS.md ${NPM}/${TMP}/.
cp ${SOURCE}/README.md ${NPM}/${TMP}/README_KAPP_SERVER.md
cp ${SOURCE}/.husky/pre-commit ${NPM}/${TMP}/pre-commit
cp ${SOURCE}/rmdstore.sh ${NPM}/${TMP}/.

# Remove some files
rm ${NPM}/${TMP}/db/db.sqlite
rm ${NPM}/${TMP}/db/testdb.sqlite
rm ${NPM}/${TMP}/server/ssl/*.pem
rm ${NPM}/${TMP}/scripts/private.sh
rm ${NPM}/${TMP}/scripts/compress.sh

# -- oOo --
