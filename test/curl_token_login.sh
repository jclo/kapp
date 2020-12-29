#!/bin/bash

##
# Transaction with token
#

# Ask for a token
echo 'Ask for an access token:'
token=$(curl -X POST --insecure --silent \
  --user "jdo:jdo" \
  --data "grant_type=client_credentials" \
  https://localhost:1443/api/v1/oauth2/token | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['message']['access_token'])")

echo "Got the access token: ${token}"
sleep 1


# Make a request with the token
echo 'Make a request with the received access token:'
curl -X GET  -k \
  -H "Authorization: Bearer ${token}" \
  https://localhost:1443/api/v1/system/version

echo ' '
sleep 1

exit 0


# -- o ---
