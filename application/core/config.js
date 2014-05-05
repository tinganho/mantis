
/**
 * Module dependencies
 */

var fs = require('fs')
  , glob = require('glob');

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
    throw new TypeError('first parameter must be of type object');
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
  if(typeof configs !== 'object') {
    throw new TypeError('first parameter must be of type object');
  }
  if(fs.existsSync(process.env.EXTERNAL_CORE_CONF)) {
    var globalConfig = require(process.env.EXTERNAL_CORE_CONF);
    for(var key in globalConfig) {
      delete configs[key];
      configs[key] = globalConfig[key];
    }
  }

  return configs;
};

/**
 * We write the configurations from a folder that has configuration files
 * written in Node to a public folder, so your client can access these
 * configurations.
 *
 * @return {void}
 * @api public
 */

Config.prototype.writeClientConfigs = function() {
  var configPath = cf.ROOT_FOLDER + cf.CLIENT_CONFIG_BUILD;
  if(!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath);
  }
  var files = glob.sync(cf.CLIENT_CONFIG_BUILD + '/*.js', { cwd : cf.ROOT_FOLDER });
  files.forEach(function(file) {
    fs.unlinkSync(cf.ROOT_FOLDER + file);
  });

  glob(cf.CLIENT_CONFIG_GLOB, { cwd : cf.ROOT_FOLDER }, function(err, matches) {
    for(var i = 0; i < matches.length; i++) {
      var configurations = require(cf.ROOT_FOLDER + matches[i]);

      var startWrap  = 'window.' + configurations.NAMESPACE + ' = (function() { var configs = '
        , body       = JSON.stringify(configurations, null, 2) + ';'
        , makeRegExp = 'for(var key in configs) { if(/REGEX/.test(key)) { configs[key] = new RegExp(configs[key]); } }'
        , endWrap    = 'return configs; })();';

      var str = startWrap + body + makeRegExp + endWrap;
      fs.writeFileSync(cf.ROOT_FOLDER + cf.CLIENT_CONFIG_BUILD + '/' + configurations.NAMESPACE + '.js', str);
    }
  });
};

/**
 * Export `config` instance
 */

module.exports = new Config;
