
/**
 * @fileoverview Client configs file. This file will be compiled
 * as an requirejs module. All unrelated environment configs
 * will be stripped off.
 */

/**
 * Module dependencies
 */

var config = require('../lib/config');

/**
 * Core client configs for your app. Use DEV__, STAG__, PROD__ prefixes
 * to set specific environmental configurations. When you set specific
 * environmental configurations. Please set it for all three DEV__,
 * STAG__, PROD__ environments and not leave any environments without
 * a configuration.
 *
 *   Example:
 *
 *     DEV__X_REQUESTED_BY : '1',
 *     STAG__X_REQUESTED_BY : '1',
 *     PROD__X_REQUESTED_BY : '1',
 */

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
   * E-Request-By header for protecting against CSRF attacks.
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
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
