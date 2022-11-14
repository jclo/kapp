#!/usr/bin/env bash

NAME=$1
DEFAULTNAME='_prod'

# Assign a default name for a prod distribution if it is not
# defined
if [[ -z ${NAME} ]]
  then NAME=${DEFAULTNAME}
  echo "Assign the default name ${NAME}"
fi

# Destroy old, create and fill prod
echo "Remove the previous version of ${NAME} ..."
echo "Create the folder ${NAME}"
rm -rf ${NAME}
mkdir -p ${NAME}
cd ${NAME}

echo 'Create ./db ...'
mkdir db
echo 'Copy ./server ...'
cp -R ../server .
echo 'Copy ./public ...'
cp -R ../public .
echo 'Create .env.js ...'
cp ../demo.env.js .env.js
echo 'Copy LICENSE.md, package.json and README.md'
cp ../LICENSE.md .
cp ../package.json .
cp ../README.md .

echo 'Install NPM production packages ...'
# npm install --only=production
# rm -rf node_modules

echo ''
echo 'This production server runs the minimalist Web App'
echo 'located in the public folder.'
echo ''
echo 'You should delete this folder and copy your Web App'
echo 'in the root folder. Then, you should create a'
echo 'virtual link to your Web App folder like this:'
echo '  ln -s _app/ public'
echo ''
echo 'Now, your server is ready to run your Web App. Start the'
echo 'server by typing:'
echo '  npm run app'
echo 'Open your browser and copy the url http://localhost:1080.'
echo 'Your Web App must be displayed!'
echo ''
echo 'The file ./server/config.js must be configured to listen'
echo 'the right addresses and ports.'
echo 'Enjoy!'

# -- o --
