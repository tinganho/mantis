
/**
 * Module dependencies
 */

var config = require('../lib/config')
  , path = require('path');


/**
 * Core server configs for your app. Use DEV__, STAG__, PROD__ prefixes
 * to set specific environmental configurations. When you set specific
 * environmental configurations. Please set it for all three DEV__,
 * STAG__, PROD__ environments and not leave any environments without
 * a configuration. Otherwise your app may have an undefined configuration
 * variable.
 *
 *   Example:
 *
 *     DEV__X_REQUESTED_BY : '1',
 *     STAG__X_REQUESTED_BY : '1',
 *     PROD__X_REQUESTED_BY : '1',
 */

var configs = {

  /**
   * Default port for express server
   *
   * @type {Number}
   */

  DEFAULT_PORT : 3000,

  /**
   * Long time cache life time. Convenient configuration for
   * e.g. configuring resource cache lifetime
   *
   * @type {Number}
   */

  LONG_TIME_CACHE_LIFE_TIME  : 6*30*24*3600,

  /**
   * Short time cache life time. Convenient configuration for
   * e.g. configuring resource cache lifetime
   *
   * @type {Number}
   */

  SHORT_TIME_CACHE_LIFE_TIME : 24*3600,

  /**
   * Default content type for all request
   *
   * @type {String}
   */

  DEFAULT_CONTENT_TYPE : 'application/json',

  /**
   * Root folder. Is just a convenient constant. It should not be
   * configured, so please don't touch it.
   *
   * @type {String}
   */

  ROOT_FOLDER : path.join(__dirname, '../'),

  /**
   * Temporary folder
   *
   * @type {String}
   */

  TMP_FOLDER : '/public/tmp',

  /**
   * All uploads will be stored on this folder
   *
   * @type {String}
   */

  UPLOAD_FOLDER : '/public/uploads',

  /**
   * Public config folder is used for serving compiled client configs
   * Every file in the client-conf folder will be compiled automatically
   * int this folder.
   *
   * @type {String}
   */

  PUBLIC_CONF_FOLDER : '/public/conf',

  /**
   * Path to the default favicon for your website
   *
   * @type {String}
   */

  FAVICON : path.join(__dirname, '../', 'public/images/favicon.ico'),

  /**
   * Locales for your website. You could define it any format you want
   * but we suggest using standard locale names.
   *
   * Standard locale name definition:
   *
   * A locale name, either a language specification of the form ll or a
   * combined language and country specification of the form ll_CC.
   * Examples: it, de_AT, es, pt_BR. The language part is always in
   * lower case and the country part in upper case. The separator is an
   * underscore.
   *
   * @type {Array.<String>}
   */

  LOCALES : ['en-US'],

  /**
   * The default locale used for the website. Recommend us locale name.
   * See definition above.
   *
   * @type {Array.<String>}
   */

  DEFAULT_LOCALE : 'en-US'
};

/**
 * Remove environmental prefixes
 */

configs = config.formatConfigs(configs);

/**
 * Merge external configs
 */

configs = config.mergeExternalConfigs(configs, process.env.EXTERNAL_CORE_CONF);

/**
 * Export configs
 */

module.exports = configs;
