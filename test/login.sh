#!/bin/bash

curl -X POST -k \
  --data "user=jdo&password=jdo" \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/auth/login

echo ''
sleep 2


curl -X GET -k \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/system/version

echo ''
sleep 2


curl -X GET -k \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/system/kapp-version

echo ''
sleep 2


curl -X GET -k \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/auth/logout

echo ''
exit 0
