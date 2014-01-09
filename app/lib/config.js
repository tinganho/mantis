
/** 
 * Module dependencies
 */

var fs = require('fs');

/**
 * RegExps
 */

var envPrefixRegExp = /^DEV__|^STAG__|^PROD__/
  , envRegExp = /^([A-Z]{3,4})__/;

/**
 * Format configs. Formatting removes DEV__, DIST__ and PROD__
 * prefixes.
 *
 * @param {Object} configs
 * @return {Object}
 * @api public
 */

function formatConfigs(configs) {
  if(typeof configs !== 'object') {
    throw new TypeError('first parameter mustbe of type object');
  }
  for(var key in configs) {
    if(envPrefixRegExp.test(key)) {
      var env = envRegExp.exec(key)[1]
        , _key = key.replace(envRegExp, '');
      if(env === ENV) {
        configs[_key] = configs[key];
      }
      delete configs[key];
    }
  }

  return configs;
};

/**
 * Export `formatConfigs` method
 */

module.exports.formatConfigs = formatConfigs;

/**
 * Merge external configs from a JSON file defined
 * in environmental variable GLOBAL_CORE_CONF
 *
 * @param {Object} configs
 * @return {Object}
 * @api public
 */

function mergeExternalConfigs(configs) {
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

module.exports.mergeExternalConfigs = mergeExternalConfigs;


