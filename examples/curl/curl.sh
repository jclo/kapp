#!/bin/bash

curl -X POST -k \
  --data "user=client_id&password=client_secret" \
  --cookie "cookie.txt" \
  --cookie-jar "cookie.txt" \
  https://localhost:1443/api/v1/posto

echo ''
exit 0

# -- oOo ---
