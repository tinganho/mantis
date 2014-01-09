
/**
 * @fileoverview Client configs file. This file will be compiled
 * as an requirejs module. All unrelated environment configs
 * will be stripped off.
 */

var configs = {

  MIN_PAGE_LOAD_PERCENT : 0.6,

  MIN_PAGE_LOAD_TIME : 500,

  BREAKPOINT_MOBILE_WIDTH : 400,

  MOBILE_WIDTH : 500,

  TOUCH_OUT_OF_RANGE : 10,

  AJAX_TIMEOUT : 10000,

  X_REQUESTED_BY : '1'

};

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
