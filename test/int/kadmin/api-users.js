// ESLint declarations:
/* global describe */
/* eslint one-var: 0, semi-style: 0, camelcase: 0 */


// -- Vendor Modules


// -- Local Modules
const users_1_1  = require('./users/users_1_1')
    , users_2_1  = require('./users/users_2_1')
    , users_3_1  = require('./users/users_3_1')
    , users_4_1  = require('./users/users_4_1')
    , users_5_1  = require('./users/users_5_1')
    , users_6_1  = require('./users/users_6_1')
    , users_7_1  = require('./users/users_7_1')
    , users_8_1  = require('./users/users_8_1')
    , users_9_1  = require('./users/users_9_1')
    , users_10_1  = require('./users/users_10_1')
    , users_11_1  = require('./users/users_11_1')
    , users_12_1  = require('./users/users_12_1')
    , users_13_1  = require('./users/users_13_1')
    , users_14_1  = require('./users/users_14_1')
    , users_15_1  = require('./users/users_15_1')
    ;


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = (request, dbi, params, admin) => {
  describe('Test Admin Users APIs:', () => {
    users_1_1(request, dbi, params, admin);
    users_2_1(request, dbi, params, admin);
    users_3_1(request, dbi, params, admin);
    users_4_1(request, dbi, params, admin);
    users_5_1(request, dbi, params, admin);
    users_6_1(request, dbi, params, admin);
    users_7_1(request, dbi, params, admin);
    users_8_1(request, dbi, params, admin);
    users_9_1(request, dbi, params, admin);
    users_10_1(request, dbi, params, admin);
    users_11_1(request, dbi, params, admin);
    users_12_1(request, dbi, params, admin);
    users_13_1(request, dbi, params, admin);
    users_14_1(request, dbi, params, admin);
    users_15_1(request, dbi, params, admin);

    //
  });
};
