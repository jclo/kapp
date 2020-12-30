curl -X GET -k \
  https://localhost:1443/api/v1/text
echo ''


sleep 0.5
curl -X GET -k \
  https://localhost:1443/api/v1/json
echo ''


sleep 0.5
curl -X GET -k \
  'https://localhost:1443/api/v1/users/?id=1&name="John%20Doe"'
echo ' '


sleep 0.5
curl -X GET -k \
  https://localhost:1443/api/v1/users/1/2/3
echo ''

sleep 0.5
curl -X POST -k \
  --data "payload='{"a":1,"b":"This%20is%20a%20payload"}'" \
  https://localhost:1443/api/v1/posto

echo ''
sleep 2
