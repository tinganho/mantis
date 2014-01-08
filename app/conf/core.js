var fs   = require('fs')
  , path = require('path')
  , _    = require('underscore')
  , glob = require('glob');


var configs = {

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
   * The default locale used for the website
   *
   * @type {Array.<String>}
   */

  DEFAULT_LOCALE : 'en-US'
};

var ENV;

switch(process.env.NODE_ENV) {
  case 'development':
    ENV = 'DEV';
    break;
  case 'staging':
    ENV = 'DIST';
    break;
  case 'production':
    ENV = 'PROD';
    break;
  default:
    ENV = 'DEV';
    break;
}

/** globalize ENV **/
global.ENV = ENV;

/**
 * Getters
 */

var getters = {
  REDIS_PORT : {
    get : function() {
      return configs[ENV + '_REDIS_PORT'];
    },
    configurable : true
  },
  REDIS_PASS : {
    get : function() {
      return configs[ENV + '_REDIS_PASS'];
    },
    configurable : true
  },
  REDIS_HOST : {
    get : function() {
      return configs[ENV + '_REDIS_HOST'];
    },
    configurable : true
  },
  TMP_ACCESS_TOKEN : {
    get : function() {
      return configs[ENV + '_TMP_ACCESS_TOKEN'];
    },
    configurable : true
  },
  APP_HOME_URL : {
    get : function() {
      return configs[ENV + '_APP_HOME_URL'];
    },
    configurable : true
  },
  APP_LOGIN_URL : {
    get : function() {
      return configs[ENV + '_APP_LOGIN_URL'];
    },
    configurable : true
  },
  ACCOUNT_SERVICE_URL : {
    get : function() {
      return configs[ENV + '_ACCOUNT_SERVICE_URL'];
    },
    configurable : true
  },
  API_URL : {
    get : function() {
      return configs[ENV + '_API_URL'];
    },
    configurable : true
  },
  TRANSLATION_PATH : {
    get : function() {
      return configs[ENV + '_TRANSLATION_PATH'];
    },
    configurable : true
  }
};

Object.defineProperties(configs, getters);

/**
 * Merge third party configs
 */

var thirdParty = require('./thirdPartyConfig');
configs = _.defaults(configs, thirdParty.configs);
Object.defineProperties(configs, thirdParty.getters);

/**
 * Merge links configs
 */

var links = require('./linksConfig');
configs = _.defaults(configs, links.configs);


if(fs.existsSync(configs.GLOBAL_CONF)) {
  var globalConfig = require(configs.GLOBAL_CONF);
  for(var key in globalConfig) {
    delete configs[key];
    configs[key] = globalConfig[key];
  }
}

module.exports = configs;
