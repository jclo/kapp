#!/bin/bash

curl -X POST -k \
  --data "user=jdo&password=jdo" \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/auth/login

echo ''
sleep 1


curl -X GET -k \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/i18n/list

echo ''
sleep 1

curl -X GET -k \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/i18n/fr

echo ''
sleep 1


curl -X GET -k \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/auth/logout

echo ''


exit 0

# -- oOo ---
