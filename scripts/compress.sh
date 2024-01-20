#!/usr/bin/env bash

NAME=$1
name=$(echo $1 | tr '[:upper:]' '[:lower:]')
VERSION=$2
NAMESPACE=$3
NPM='private_repo'
TMP='tmp'
DIST='_dist'

# Check if it is a package with a namespace. For instance @mobilabs/libname
if [[ ! -z ${NAMESPACE} ]]
then
  # Remove the namespace:
  NAMESPACE=${NAMESPACE}/
  name=${name/${NAMESPACE}}
  echo ${name}
fi

if [[ -z ${name} ]]
then
  echo 'You have to provide a name for the NPM package! Aborting ...'
  exit 1
fi

if [[ -z ${VERSION} ]]
then
  echo 'You have to provide a version for the NPM package! Aborting ...'
  exit 1
fi

mkdir -p ${NPM}/${name}/${VERSION}
cp -r ${NPM}/${TMP} ${NPM}/${name}/${VERSION}
cd ${NPM}/${name}/${VERSION}
mv ${TMP} ${name}
tar zcvf ${name}.tgz ${name}
rm -rf ${name}
cd ../../..
rm -rf ${NPM}/${TMP}
echo 'Done!'

# -- oOo --
