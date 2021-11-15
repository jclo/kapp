# Test

## Run unitary tests

```bash
  npm run test
```

## Address Kapp through Node.js

```bash
  # Start Kapp:
  node run app

  # From another terminal:
  node examples/node/test.js
```

## Address Kapp from a shell

```bash
  # Start Kapp:
  node run app

  # From another terminal:

  # Basic curl request:
  ./examples/curl/curl.sh

  # Session Login:
  ./examples/curl/curl_cookie_login.sh

  # Token Login:
  ./examples/curl/curl_token_login.sh

  # A sequence of login, request, logout:
  ./examples/curl/curl_api_with_filter_variables.sh

  # A request to get a refresh token:
  ./examples/curl/curl_refresh_token_to_be_implemented.sh
```

That's all!

-- oOo ---
