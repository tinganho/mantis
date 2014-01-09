
/** 
 * Module dependencies
 */

var fs = require('fs');

/**
 * Config
 *
 * @constructor
 */

function Config() {
  if(!ENV) {
    throw new TypeError('global variable ENV is not set');
  }

  this.env = ENV;
  this.envPrefixRegExp = /^DEV__|^STAG__|^PROD__/;
  this.envRegExp = /^([A-Z]{3,4})__/;
}

/**
 * Format configs. Formatting removes DEV__, DIST__ and PROD__
 * prefixes.
 *
 * @param {Object} configs
 * @return {Object}
 * @api public
 */

Config.prototype.formatConfigs = function(configs) {
  if(typeof configs !== 'object') {
    throw new TypeError('first parameter mustbe of type object');
  }
  for(var key in configs) {
    if(this.envPrefixRegExp.test(key)) {
      var env = this.envRegExp.exec(key)[1]
        , _key = key.replace(this.envRegExp, '');
      if(env === this.env) {
        configs[_key] = configs[key];
      }
      delete configs[key];
    }
  }

  return configs;
};

/**
 * Merge external configs from a JSON file defined
 * in environmental variable GLOBAL_CORE_CONF
 *
 * @param {Object} configs
 * @return {Object}
 * @api public
 */

Config.prototype.mergeExternalConfigs = function(configs) {
  if(fs.existsSync(process.env.GLOBAL_CORE_CONF)) {
    var globalConfig = require(process.env.GLOBAL_CORE_CONF);
    for(var key in globalConfig) {
      delete configs[key];
      configs[key] = globalConfig[key];
    }
  }

  return configs;
};

/**
 * Export `mergeExternalConfigs` method
 */

module.exports = new Config;


