curl -X POST -k \
  --user "jdo:jdo" \
  --data "grant_type=client_credentials" \
  https://localhost:1443/api/v1/oauth2/token

echo ''


curl -X POST -k \
  --user "jdo:jdo" \
  --header "refresh_token: ZRdXiIx5qyXL3QXGVnzOGIdeUPl0noTT" \
  --data "grant_type=refresh_token" \
  https://localhost:1443/api/v1/oauth2/token

echo ''

# -- oOo ---
