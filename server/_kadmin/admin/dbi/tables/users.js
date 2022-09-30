/** ****************************************************************************
 *
 * Defines the users tables.
 *
 * users.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _getUsersTable              returns the SQL to create admin_users,
 *  . _getUsersEmailTable         returns the SQL to create admin_users_emails,
 *  . _getUsersAccessTable        returns the SQL to create admin_users_access,
 *  . _getUsersAccessRightsTable  returns the SQL to create admin_users_access_rights,
 *  . _getUsersAccessRightsList   returns the access right list,
 *  . _getI18nLocalesTable        returns the SQL to create admin_i18n_locales,
 *  . _getI18nLocalesList         returns the i18n locales list,
 *  . _getI18nLocalesLangList     returns i18n locales list,
 *
 *
 * Public Static Methods:
 *  . getUsersTable               returns the SQL to create admin_users,
 *  . getUsersEmailTable          returns the SQL to create admin_users_emails,
 *  . getUsersAccessTable         returns the SQL to create admin_users_access,
 *  . getUsersAccessRightsTable   returns the SQL to create admin_users_access_rights,
 *  . getUsersAccessRightsList    returns the access right list,
 *  . getI18nLocalesTable         returns the SQL to create admin_i18n_locales,
 *  . getI18nLocalesList          returns the i18n locales list,
 *  . getI18nLocalesLangList      returns i18n locales list,
 *
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint-disable one-var, semi-style, no-underscore-dangle */


// -- Vendor Modules


// -- Local Modules


// -- Local Constants


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Returns the SQL commands to create the admin_users table.
 *
 * @function (arg1)
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getUsersTable() {
  return `
    CREATE TABLE admin_users(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,

      user_name                     VARCHAR(50)         UNIQUE NOT NULL,
      user_hash                     VARCHAR(100)        NOT NULL,
      system_generated_password     TINYINT(1)          NOT NULL DEFAULT 0,
      pwd_last_changed              DATETIME            DEFAULT NULL,
      last_login                    DATETIME            DEFAULT NULL,

      avatar_id                     INTEGER             NOT NULL DEFAULT 1,
      photo                         BLOB(65535)         DEFAULT NULL,
      salutation_id                 INTEGER             NOT NULL DEFAULT 1,
      first_name                    VARCHAR(100)        DEFAULT NULL,
      last_name                     VARCHAR(100)        NOT NULL DEFAULT "Nobody",
      birthdate                     DATETIME            DEFAULT NULL,
      board_of_management           TINYINT(1)          NOT NULL DEFAULT 0,
      title                         VARCHAR(100)        DEFAULT NULL,
      description                   TEXT(65535)         DEFAULT NULL,
      preferences                   TEXT(65535)         DEFAULT NULL,
      i18n_locale                   VARCHAR(10)         DEFAULT "en-US",
      default_currency              VARCHAR(3)          DEFAULT "EUR",

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,
      assigned_to_user_id           INTEGER             NOT NULL DEFAULT 1,
      group_id                      INTEGER             DEFAULT 1,
      team_id                       INTEGER             DEFAULT 1,
      role_id                       INTEGER             DEFAULT 5,
      custom_role                   TINYINT(1)          NOT NULL DEFAULT 0,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,
      is_locked                     TINYINT(1)          NOT NULL DEFAULT 0,

      department                    VARCHAR(100)        DEFAULT NULL,
      reports_to_user_id            INTEGER             DEFAULT NULL,

      phone_home                    VARCHAR(100)        DEFAULT NULL,
      phone_home_mobile             VARCHAR(100)        DEFAULT NULL,
      phone_work_office             VARCHAR(100)        DEFAULT NULL,
      phone_work_mobile             VARCHAR(100)        DEFAULT NULL,
      phone_other                   VARCHAR(100)        DEFAULT NULL,
      phone_fax                     VARCHAR(100)        DEFAULT NULL,

      assistant                     VARCHAR(100)        DEFAULT NULL,
      assistant_phone               VARCHAR(100)        DEFAULT NULL,

      primary_address_street        VARCHAR(150)        DEFAULT NULL,
      primary_address_city          VARCHAR(100)        DEFAULT NULL,
      primary_address_state         VARCHAR(100)        DEFAULT NULL,
      primary_address_postal_code   VARCHAR(25)         DEFAULT NULL,
      primary_address_country       VARCHAR(255)        DEFAULT NULL,
      primary_latitude              FLOAT(0)            DEFAULT NULL,
      primary_longitude             FLOAT(0)            DEFAULT NULL,
      alt_address_street            VARCHAR(150)        DEFAULT NULL,
      alt_address_city              VARCHAR(100)        DEFAULT NULL,
      alt_address_state             VARCHAR(100)        DEFAULT NULL,
      alt_address_postal_code       VARCHAR(25)         DEFAULT NULL,
      alt_address_country           VARCHAR(255)        DEFAULT NULL,
      alt_latitude                  FLOAT(0)            DEFAULT NULL,
      alt_longitude                 FLOAT(0)            DEFAULT NULL,

      website                       VARCHAR(255)        DEFAULT NULL,
      twitter                       VARCHAR(255)        DEFAULT NULL,
      facebook                      VARCHAR(255)        DEFAULT NULL,
      linkedin                      VARCHAR(255)        DEFAULT NULL,

      im_home                       VARCHAR(100)        DEFAULT NULL,
      im_home_surname               VARCHAR(100)        DEFAULT NULL,
      im_work                       VARCHAR(100)        DEFAULT NULL,
      im_work_surname               VARCHAR(100)        DEFAULT NULL,

      FOREIGN KEY(avatar_id) REFERENCES admin_avatars(id),
      FOREIGN KEY(salutation_id) REFERENCES admin_salutation(id),
      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(assigned_to_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(reports_to_user_id) REFERENCES admin_users(id)
    )
  `;
}

/**
 * Returns the SQL commands to create the admin_users_emails table.
 *
 * @function (arg1)
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getUsersEmailTable() {
  return `
    CREATE TABLE admin_users_emails(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      user_id                       INTEGER             NOT NULL,
      email                         VARCHAR(100)        DEFAULT NULL,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,

      is_primary_email              TINYINT(1)          NOT NULL DEFAULT 0,
      is_invalid_email              TINYINT(1)          NOT NULL DEFAULT 0,
      is_opted_out                  TINYINT(1)          NOT NULL DEFAULT 0,

      FOREIGN KEY(user_id) REFERENCES admin_users(id),
      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id)
    )
  `;
}

/**
 * Returns the SQL commands to create the admin_users_access table.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getUsersAccessTable() {
  return `
    CREATE TABLE admin_users_access(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,

      date_created                  DATETIME            NOT NULL,
      date_modified                 DATETIME            DEFAULT NULL,
      created_by_user_id            INTEGER             NOT NULL,
      modified_by_user_id           INTEGER             DEFAULT NULL,

      description                   TEXT(65535)         DEFAULT NULL,
      is_deleted                    TINYINT(1)          NOT NULL DEFAULT 0,
      assigned_to_user_id           INTEGER             NOT NULL,

      user_id                       INTEGER             NOT NULL,
      module_id                     INTEGER             NOT NULL,
      access_right                  TINYINT(1)          NOT NULL DEFAULT 1,
      list_right                    TINYINT(1)          NOT NULL DEFAULT 1,
      view_right                    TINYINT(1)          NOT NULL DEFAULT 1,
      edit_right                    TINYINT(1)          NOT NULL DEFAULT 1,
      delete_right                  TINYINT(1)          NOT NULL DEFAULT 1,
      mass_update_right             TINYINT(1)          NOT NULL DEFAULT 1,
      import_right                  TINYINT(1)          NOT NULL DEFAULT 1,
      export_right                  TINYINT(1)          NOT NULL DEFAULT 1,

      FOREIGN KEY(created_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(modified_by_user_id) REFERENCES admin_users(id),
      FOREIGN KEY(assigned_to_user_id) REFERENCES admin_users(id),

      FOREIGN KEY(user_id) REFERENCES admin_users(id),
      FOREIGN KEY(module_id) REFERENCES admin_modules(id)
    )
  `;
}

/**
 * Returns the SQL commands to create the admin_users_access_rights table.
 *
 * @function (arg1)
 * @private
 * @param {String}          the tenant id,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getUsersAccessRightsTable() {
  return `
    CREATE TABLE admin_users_access_rights(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name                          VARCHAR(25)         NOT NULL,
      date_created                  DATETIME            DEFAULT NULL,
      values_json                   VARCHAR(255)        NOT NULL
    )
  `;
}

/**
 * Returns the access right list.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the access right list,
 * @since 0.0.0
 */
function _getUsersAccessRightsList() {
  return {
    access_right: ['Disabled', 'Not Set', 'Enabled'],
    list_right: ['None', 'Not Set', 'Owner', 'Team', 'Group', 'All Groups'],
    view_right: ['None', 'Not Set', 'Owner', 'Team', 'Group', 'All Groups'],
    edit_right: ['None', 'Not Set', 'Owner', 'Team', 'Group', 'All Groups'],
    delete_right: ['None', 'Not Set', 'Owner', 'Team', 'Group', 'All Groups'],
    mass_update_right: ['None', 'Not Set', 'Owner', 'Team', 'Group', 'All Groups'],
    import_right: ['None', 'Not Set', 'Enabled'],
    export_right: ['None', 'Not Set', 'Owner', 'Team', 'Group', 'All Groups'],
  };
}

/**
 * Returns the SQL commands to create the admin_i18n_locales table.
 *
 * @function (arg1)
 * @private
 * @param {String}          the tenant id,
 * @returns {SQL}           returns the SQL commands to create the table,
 * @since 0.0.0
 */
function _getI18nLocalesTable() {
  return `
    CREATE TABLE admin_i18n_locales(
      id                            INTEGER             NOT NULL PRIMARY KEY AUTO_INCREMENT,
      code                          VARCHAR(25)         NOT NULL,
      language                      VARCHAR(100)        NOT NULL,
      date_created                  DATETIME            DEFAULT NULL
    )
  `;
}

/**
 * Returns the i18n locales list.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the list,
 * @since 0.0.0
 */
function _getI18nLocalesList() {
  return [
    // 'Cy-az-AZ',
    // 'Cy-sr-SP',
    // 'Cy-uz-UZ',
    // 'Lt-az-AZ',
    // 'Lt-sr-SP',
    // 'Lt-uz-UZ',
    // 'aa',
    // 'ab',
    // 'ae',
    // 'af',
    // 'af-ZA',
    // 'ak',
    // 'am',
    // 'an',
    // 'ar',
    // 'ar-AE',
    // 'ar-BH',
    // 'ar-DZ',
    // 'ar-EG',
    // 'ar-IQ',
    // 'ar-JO',
    // 'ar-KW',
    // 'ar-LB',
    // 'ar-LY',
    // 'ar-MA',
    // 'ar-OM',
    // 'ar-QA',
    // 'ar-SA',
    // 'ar-SY',
    // 'ar-TN',
    // 'ar-YE',
    // 'as',
    // 'av',
    // 'ay',
    // 'az',
    // 'ba',
    // 'be',
    // 'be-BY',
    // 'bg',
    // 'bg-BG',
    // 'bh',
    // 'bi',
    // 'bm',
    // 'bn',
    // 'bo',
    // 'br',
    // 'bs',
    // 'ca',
    // 'ca-ES',
    // 'ce',
    // 'ch',
    // 'co',
    // 'cr',
    // 'cs',
    // 'cs-CZ',
    // 'cu',
    // 'cv',
    // 'cy',
    // 'da',
    // 'da-DK',
    'de',
    // 'de-AT',
    // 'de-CH',
    // 'de-DE',
    // 'de-LI',
    // 'de-LU',
    // 'div-MV',
    // 'dv',
    // 'dz',
    // 'ee',
    // 'el',
    // 'el-GR',
    // 'en',
    'en-AU',
    // 'en-BZ',
    // 'en-CA',
    // 'en-CB',
    'en-GB',
    // 'en-IE',
    // 'en-JM',
    // 'en-NZ',
    // 'en-PH',
    // 'en-TT',
    'en-US',
    // 'en-ZA',
    // 'en-ZW',
    // 'eo',
    // 'es',
    // 'es-AR',
    // 'es-BO',
    // 'es-CL',
    // 'es-CO',
    // 'es-CR',
    // 'es-DO',
    // 'es-EC',
    // 'es-ES',
    // 'es-GT',
    // 'es-HN',
    // 'es-MX',
    // 'es-NI',
    // 'es-PA',
    // 'es-PE',
    // 'es-PR',
    // 'es-PY',
    // 'es-SV',
    // 'es-UY',
    // 'es-VE',
    // 'et',
    // 'et-EE',
    // 'eu',
    // 'eu-ES',
    // 'fa',
    // 'fa-IR',
    // 'ff',
    // 'fi',
    // 'fi-FI',
    // 'fj',
    // 'fo',
    // 'fo-FO',
    'fr',
    // 'fr-BE',
    // 'fr-CA',
    // 'fr-CH',
    // 'fr-FR',
    // 'fr-LU',
    // 'fr-MC',
    // 'fy',
    // 'ga',
    // 'gd',
    // 'gl',
    // 'gl-ES',
    // 'gn',
    // 'gu',
    // 'gu-IN',
    // 'gv',
    // 'ha',
    // 'he',
    // 'he-IL',
    // 'hi',
    // 'hi-IN',
    // 'ho',
    // 'hr',
    // 'hr-HR',
    // 'ht',
    // 'hu',
    // 'hu-HU',
    // 'hy',
    // 'hy-AM',
    // 'hz',
    // 'ia',
    // 'id',
    // 'id-ID',
    // 'ie',
    // 'ig',
    // 'ii',
    // 'ik',
    // 'io',
    // 'is',
    // 'is-IS',
    'it',
    // 'it-CH',
    // 'it-IT',
    // 'iu',
    // 'ja',
    // 'ja-JP',
    // 'jv',
    // 'ka',
    // 'ka-GE',
    // 'kg',
    // 'ki',
    // 'kj',
    // 'kk',
    // 'kk-KZ',
    // 'kl',
    // 'km',
    // 'kn',
    // 'kn-IN',
    // 'ko',
    // 'ko-KR',
    // 'kr',
    // 'ks',
    // 'ku',
    // 'kv',
    // 'kw',
    // 'ky',
    // 'ky-KZ',
    // 'la',
    // 'lb',
    // 'lg',
    // 'li',
    // 'ln',
    // 'lo',
    // 'lt',
    // 'lt-LT',
    // 'lu',
    // 'lv',
    // 'lv-LV',
    // 'mg',
    // 'mh',
    // 'mi',
    // 'mk',
    // 'mk-MK',
    // 'ml',
    // 'mn',
    // 'mn-MN',
    // 'mr',
    // 'mr-IN',
    // 'ms',
    // 'ms-BN',
    // 'ms-MY',
    // 'mt',
    // 'my',
    // 'na',
    // 'nb',
    // 'nb-NO',
    // 'nd',
    // 'ne',
    // 'ng',
    // 'nl',
    // 'nl-BE',
    // 'nl-NL',
    // 'nn',
    // 'nn-NO',
    // 'no',
    // 'nr',
    // 'nv',
    // 'ny',
    // 'oc',
    // 'oj',
    // 'om',
    // 'or',
    // 'os',
    // 'pa',
    // 'pa-IN',
    // 'pi',
    // 'pl',
    // 'pl-PL',
    // 'ps',
    // 'pt',
    // 'pt-BR',
    // 'pt-PT',
    // 'qu',
    // 'rm',
    // 'rn',
    // 'ro',
    // 'ro-RO',
    // 'ru',
    // 'ru-RU',
    // 'rw',
    // 'sa',
    // 'sa-IN',
    // 'sc',
    // 'sd',
    // 'se',
    // 'sg',
    // 'si',
    // 'sk',
    // 'sk-SK',
    // 'sl',
    // 'sl-SI',
    // 'sm',
    // 'sn',
    // 'so',
    // 'sq',
    // 'sq-AL',
    // 'sr',
    // 'ss',
    // 'st',
    // 'su',
    // 'sv',
    // 'sv-FI',
    // 'sv-SE',
    // 'sw',
    // 'sw-KE',
    // 'ta',
    // 'ta-IN',
    // 'te',
    // 'te-IN',
    // 'tg',
    // 'th',
    // 'th-TH',
    // 'ti',
    // 'tk',
    // 'tl',
    // 'tn',
    // 'to',
    // 'tr',
    // 'tr-TR',
    // 'ts',
    // 'tt',
    // 'tt-RU',
    // 'tw',
    // 'ty',
    // 'ug',
    // 'uk',
    // 'uk-UA',
    // 'ur',
    // 'ur-PK',
    // 'uz',
    // 've',
    // 'vi',
    // 'vi-VN',
    // 'vo',
    // 'wa',
    // 'wo',
    // 'xh',
    // 'yi',
    // 'yo',
    // 'za',
    // 'zh',
    // 'zh-CHS',
    // 'zh-CHT',
    // 'zh-CN',
    // 'zh-HK',
    // 'zh-MO',
    // 'zh-SG',
    // 'zh-TW',
    // 'zu',
  ];
}

/**
 * Returns the i18n locales Lang list.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns the list,
 * @since 0.0.0
 */
function _getI18nLocalesLangList() {
  // https://gist.github.com/jacobbubu/1836273
  return {
    de: 'German',
    'en-AU': 'English (Australia)',
    'en-GB': 'English (United Kingdom)',
    'en-US': 'English (United States)',
    fr: 'French',
    it: 'Italian',
  };
}


// -- Public Static Methods ----------------------------------------------------

const Users = {

  /**
   * Returns the SQL commands to create the admin_users table.
   *
   * @method (arg1)
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the SQL commands to create the table,
   * @since 0.0.0
   */
  getUsersTable() {
    return _getUsersTable();
  },

  /**
   * Returns the SQL commands to create the admin_users_emails table.
   *
   * @method (arg1)
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the SQL commands to create the table,
   * @since 0.0.0
   */
  getUsersEmailTable() {
    return _getUsersEmailTable();
  },

  /**
   * Returns the SQL commands to create the admin_users_access table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the SQL commands to create the table,
   * @since 0.0.0
   */
  getUsersAccessTable() {
    return _getUsersAccessTable();
  },

  /**
   * Returns the SQL commands to create the admin_users_access_rights table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the SQL commands to create the table,
   * @since 0.0.0
   */
  getUsersAccessRightsTable() {
    return _getUsersAccessRightsTable();
  },

  /**
   * Returns the access right list.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the access right list,
   * @since 0.0.0
   */
  getUsersAccessRightsList() {
    return _getUsersAccessRightsList();
  },

  /**
   * Returns the SQL commands to create the admin_i18n_locales table.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the SQL commands to create the table,
   * @since 0.0.0
   */
  getI18nLocalesTable() {
    return _getI18nLocalesTable();
  },

  /**
   * Returns the i18N locales list.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the access right list,
   * @since 0.0.0
   */
  getI18nLocalesList() {
    return _getI18nLocalesList();
  },

  /**
   * Returns the i18N locales lang list.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @returns {SQL}         returns the list,
   * @since 0.0.0
   */
  getI18nLocalesLangList() {
    return _getI18nLocalesLangList();
  },
};

// -- Export
module.exports = Users;
