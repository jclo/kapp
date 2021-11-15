#!/bin/bash

##
# Transaction with token
#

# Ask for a token
echo 'Ask for an access token:'
token_jdo=$(curl -X POST --insecure --silent \
  --user "jdo:jdo" \
  --data "grant_type=client_credentials" \
  https://localhost:1443/api/v1/oauth2/token | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "Got the access token: ${token_jdo}"
sleep 1


token_jsn=$(curl -X POST --insecure --silent \
  --user "jsn:jsn" \
  --data "grant_type=client_credentials" \
  https://localhost:1443/api/v1/oauth2/token | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "Got another access token: ${token_jsn}"
sleep 1



# Make a fews request with the token
echo 'Makes a few request with the received access token:'
curl -X GET  -k \
  -H "Authorization: Bearer ${token_jdo}" \
  https://localhost:1443/api/v1/system/version

echo ' '
sleep 1

curl -X GET  -k \
  -H "Authorization: Bearer ${token_jdo}" \
  https://localhost:1443/api/v1/system/kapp-version

echo ' '
sleep 1

curl -X GET  -k \
  -H "Authorization: Bearer ${token_jdo}" \
  https://localhost:1443/api/v1/i18n/list

echo ' '
sleep 1


# Revoke the access token
echo 'Revokes access token:'
curl -X GET  -k \
  -H "Authorization: Bearer ${token_jdo}" \
  https://localhost:1443/api/v1/oauth2/revoke

echo ' '
sleep 1


# Make a request that require authentication
# after the token has been revooked
echo 'Makes a request that requires authentication:'
curl -X GET  -k \
  -H "Authorization: Bearer ${token_jdo}" \
  https://localhost:1443/api/v1/system/version

echo ' '
sleep 1

curl -X GET  -k \
  -H "Authorization: Bearer ${token_jsn}" \
  https://localhost:1443/api/v1/system/version

echo ' '
sleep 1

exit 0

# -- oOo ---
