
/**
 * Module dependencies
 */

var configuration = require('../core/configuration')
  , path = require('path')
  , glob = require('glob')
  , corePath = require('../core/path');

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

var configurations = {

  /**
   * Set backend origin, It will be used as the default one in all issued request
   *
   * @type {String}
   */

  DEV_BACKEND_ORIGIN : 'localhost',
  STAG_BACKEND_ORIGIN : 'localhost',
  PROD_BACKEND_ORIGIN : 'localhost',

  /**
   * Default user agent string in all outgoing requests
   *
   * @type {String}
   */

  USER_AGENT : 'mantis-server',

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
   * configured, so please don't touch it. You should use it through
   * out the project whenever a absolute path needs to be set.
   *
   * @type {String}
   */

  ROOT_FOLDER : path.join(__dirname, '../'),

  /**
   * Temporary folder
   *
   * @type {String}
   */

  TEMPORARY_FOLDER : 'public/tmp',

  /**
   * All uploads will be stored on this folder
   *
   * @type {String}
   */

  UPLOAD_FOLDER : 'public/uploads',

  /**
   * We write all client configuration files written in nodejs to client
   * javascript. Please specify glob file pattern to your client
   * configuration files.
   *
   * @type {String}
   */

  CLIENT_CONFIGURATIONS_GLOB : 'configurations/client/*.js',

  /**
   * We write all client configuration files written in nodejs to client
   * javascript. Please specify glob file pattern to your client
   * configuration files.
   *
   * @type {String}
   */

  CLIENT_CONFIGURATIONS_BUILD : 'public/scripts/configurations',

  /**
   * Path to the default favicon for your website
   *
   * @type {String}
   */

  FAVICON : 'public/images/favicon.ico',


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

  LOCALES: ['en-US', 'zh-CN'],

  /**
   * Languages
   *
   * @type {Function}
   */

  LANGUAGES: function() {
    return _.uniq(this.LOCALES.map(function(locale) {
      return locale.substr(0, 2);
    }));
  },

  /**
   * The default locale used for the website.
   *
   * @type {Array.<String>}
   */

  DEFAULT_LOCALE: 'en-US',

  /**
   * Maximum number of sockets.
   *
   * @type {Number}
   */

  MAX_SOCKETS : 1024,

  /**
   * We want to prevent people from JSON hijacking. Other site can include
   * script tags and override Object and Array constructor to read any kind
   * of JSON content we provide. We can prevent this if we have a script that
   * crashes the web page.
   *
   * More info: http://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses
   *
   * @type {String}
   */

  JSON_HIJACKING_PREFIX : 'while(1);',

  /**
   * X-Request-By header for protecting against CSRF attacks.
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   *
   * @type {String}
   */

  X_REQUESTED_BY : '1',

  /**
   * Document built templates path
   *
   * @type {String}
   */

  DOCUMENT_TEMPLATES : 'public/templates/documents/templates',

  /**
   * Layout built templates path
   *
   * @type {String}
   */

  LAYOUT_TEMPLATES : 'public/templates/layouts/templates',

  /**
   * Layout built templates path
   *
   * @type {String}
   */

  CORE_TEMPLATES : 'public/templates/core/templates',

  /**
   * Requirejs path
   *
   * @type {String}
   */

  REQUIREJS : corePath.requirejs(),

  /**
   * Modernizr path
   *
   * @type {String}
   */

  MODERNIZR : corePath.modernizr(),

  /**
   * Default main path
   *
   * @type {String}
   */

  DEFAULT_MAIN : 'mains/default',

  /**
   * We want to prevent people from JSON hijacking. Other site can include
   * script tags and override Object and Array constructor to read any kind
   * of JSON content we provide. We can prevent this if we have a script that
   * crashes the web page.
   *
   * More info: http://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses
   *
   * @type {String}
   */

  JSON_HIJACK_PREFIX : 'while(1);',

  /**
   * Path of composite router
   *
   * @type {String}
   */

  COMPOSER_BUILD_PATH : 'public/scripts/routers/composer.js',

  /**
   * Detect webview. The first match marked with parenthesis will indicate the
   * underlying platform OS.
   *
   * @type {RegExp}
   */

  WEB_VIEW_DETECT : /^(.+)[\-\.]webview\.*/i,

  /**
   * Client configuration map. name to alias mapping.
   *
   * @type {Map}
   */

  CLIENT_CONFIGURATIONS_MAP : {},

  /**
   * Client ID for OAuth2
   *
   * @type {String}
   */

  CLIENT_ID     : '100001',

  /**
   * Client secret for OAuth2
   *
   * @type {String}
   */

  CLIENT_SECRET : 'opkewpofkfepokewfpokepkwepf',

  /**
   * Authorization header
   *
   * @type {Function}
   */

  AUTHORIZATION : function() {
    return 'Basic ' + new Buffer(this.CLIENT_ID + ':' + this.CLIENT_SECRET),toString('base64');
  },

  /**
   * Mobile device detect
   *
   * @type {RegExp}
   */

  MOBILE_DEVICE_DETECT_1 : /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,
  MOBILE_DEVICE_DETECT_2 : /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,

  /**
   * Default platform if no platform is specified in your page manifest
   *
   * @type {String} (desktop|mobile|(.+)\.webview)
   */

  DEFAULT_PLATFORM : 'desktop'
};

/**
 * Remove environmental prefixes
 */

configurations = configuration.formatConfigurations(configurations);

/**
 * Merge external configs
 */

configurations = configuration.mergeExternalConfigurations(configurations, process.env.EXTERNAL_CORE_CONFIGURATIONS);

/**
 * Export configs
 */

module.exports = configurations;
