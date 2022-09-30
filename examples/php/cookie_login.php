<?php

  $TIMEOUT = 10;

  /**
   * LOGIN
   */
  function _login($usr, $pwd, $cookies_file) {
    $url = 'https://<domain>/api/v1/auth/login';

    $credits = [
      'user' => $usr,
      'password' => $pwd
    ];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($credits));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($curl, CURLOPT_COOKIESESSION, true);
    curl_setopt($curl, CURLOPT_COOKIEJAR,  $cookies_file);

    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
  }

  /**
   * GET
   */
  function _GET($url, $cookies_file) {
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_COOKIEFILE, $cookies_file);

    // for debug only!
    // curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    // curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    $resp = curl_exec($curl);
    curl_close($curl);
    return $resp;
  }

  /**
   * POST
   */
  function _POST($url, $data, $cookies_file) {
    // url-ify the data for the POST:
    $data_string = http_build_query($data);

    // open and set the connection:
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt( $ch, CURLOPT_COOKIEFILE, $cookies_file);

    // for debug only!
    // curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    // curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    // execute post:
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
  }

  /**
   * LOGOUT
   */
  function _logout($cookies_file) {
    $url = 'https://<domain>/api/v1/auth/logout';

    $response = _GET($url, $cookies_file);
    if (file_exists($cookies_file))
      unlink($cookies_file);

    return $response;
  }


  /**
   * Main
   */
  $cookies_file = dirname(__FILE__).'/cookie.txt';

  $resp = _login('cate', '123', $cookies_file);
  var_dump($resp);
  echo '';

  $url = 'https://<domain>/api/v1/i18n/list';
  $resp = _GET($url, $cookies_file);
  var_dump($resp);
  echo '';

  $resp = _logout($cookies_file);
  var_dump($resp);
  echo '';

?>
