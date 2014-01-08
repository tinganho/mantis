
/**
 * @fileoverview Client configs file. This file will be compiled 
 * as an requirejs module. All unrelated environment configs
 * will be stripped off.
 */

var configs = {
  // Loading
  MIN_PAGE_LOAD_PERCENT : 0.6,
  MIN_PAGE_LOAD_TIME : 500,

  // Download links
  NATIVE_IOS_DOWNLOAD_LINK : 'itms://itunes.apple.com/app/id518997464',
  APP_STORE_LINK : 'https://itunes.apple.com/cn/app/p1/id518997464?l=:country',
  GOOGLE_PLAY_LINK : 'https://play.google.com/store/apps/details?id=com.p1.mobile.p1android',
  ANDROID_DOWNLOAD_LINK : 'http://p1.com/p1.apk',

  WEIBO_CLIENT_ID : '3749741979',
  WEIBO_GRANT_TYPE : 'authorization_code',
  WEIBO_REDIRECT_URI : 'http://p1.com/weibo/authorize',
  WEIBO_AUTHORIZATION_HREF_TEMPLATE : 'https://api.weibo.com/oauth2/authorize?client_id=:clientId&response_type=code&scope=email&redirect_uri=:redirectUri',
  WEIBO_POPUP_TIMEOUT : 2*60*1000,

  BREAKPOINT_MOBILE_WIDTH : 400,
  MINIMUM_PREVENT_TOUCH_IN_SCROLL_TIME : 100,

  DEFAULT_ITEMS_PER_PAGE : 10,

  MOBILE_WIDTH : 400,

  MIXPANEL_MINIMUM_CALLBACK_TIME : 300,

  TOUCH_OUT_OF_RANGE : 10,

  MIN_USAGE_AGE : 13,
  MAX_USAGE_AGE : 120,

  AJAX_TIMEOUT : 20000,

  // Weibo username length
  WEIBO_USERNAME_MIN_LENGTH : 4,
  WEIBO_USERNAME_MAX_LENGTH : 50,

  // Validations
  PASSWORD_MIN_LENGTH : 6,
  PASSWORD_MAX_LENGTH : 256,
  EMAIL_REGEXP : '[a-z0-9!#$%&*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?',

  DEV_STREETSTYLE_API_ORIGIN  : 'https://streetstyle-api-testing.p1staff.com',
  DIST_STREETSTYLE_API_ORIGIN : 'https://streetstyle-api-testing.p1staff.com',
  PROD_STREETSTYLE_API_ORIGIN : 'https://streetstyle-api.p1staff.com',

  STREETSTYLE_SESSION_LENGTH : 10*3600*1000,

  // Streetstyle picture max dimensions
  STREETSTYLE_MAX_WIDTH : 1280,
  STREETSTYLE_MAX_HEIGHT : 1280,

  // Webauth logout href
  STREETSTYLE_WEBAUTH_LOGOUT_HREF : 'https://webkdc.p1staff.com/logout',

  X_REQUESTED_BY : '1'
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

// Remove unrelated keys for this environment
var copy = {}, prefix = new RegExp('^' + ENV + '_');
for(var key in configs) {
  if(/^(DEV_|DIST_|PROD_)/.test(key)) {
    if(prefix.test(key)) {
      copy[key.replace(prefix, '')] = configs[key];
    }
  }
  else {
    copy[key.replace(prefix, '')] = configs[key];
  }
}

module.exports = copy;