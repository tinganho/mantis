
/**
 * @fileoverview Client configs file. This file will be compiled
 * as an requirejs module. All unrelated environment configs
 * will be stripped off.
 */

/**
 * Module dependencies
 */

var config = require('../lib/config')
  , path = require('path');

var configs = {

  /**
   * The range from touch start and release of finger in pixels
   *
   * @type {Number}
   */

  MIN_PAGE_LOAD_TIME : 500,

  /**
   * The range from touch start and release of finger in pixels
   *
   * @type {Number}
   */

  MOBILE_WIDTH : 500,

  /**
   * The range from touch start and release of finger in pixels
   *
   * @type {Number}
   */

  TOUCH_OUT_OF_RANGE : 10,

  /**
   * Default AJAX timeout for every request measured in ms.
   *
   * @type {Number}
   */

  AJAX_TIMEOUT : 10000,

  /**
   * E-Request-By header for protecting against CSRF attacks
   *
   * @type {String}
   */

  X_REQUESTED_BY : '1'
};

/**
 * Remove environmental prefixes
 */

configs = config.formatConfigs(configs);

/**
 * Merge external configs
 */

configs = config.mergeExternalConfigs(configs, process.env.EXTERNAL_CLIENT_CORE_CONF);

/**
 * Export config
 */

module.exports = configs;
