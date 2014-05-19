
var glob = require('glob')
  , path = require('path');

/**
 * Get paths of different resources depending on environment
 *
 * @constructor Path
 */

function Path() {
  this._modernizr;
  this._requirejs;
}

/**
 * Get path to requirejs resouce files
 *
 * @return {String}
 * @api public
 */

Path.prototype.requirejs = function() {
  if(this._requirejs) return this._requirejs;

  var distributionPath =  glob.sync('/vendor/requirejs/*.require.js', { root : path.join(__dirname, '../') })
    , developmentPath = '/vendor/requirejs/require.js';

  this._requirejs = inDistribution ? '/' + path.relative(rootFolder, distributionPath[0]) : developmentPath;

  return this._requirejs;
};

/**
 * Get path to modernizr resource file
 *
 * @return {String}
 * @api public
 */

Path.prototype.modernizr = function() {
  if(this._modernizr) return this._modernizr;

  var distributionPath = glob.sync('/vendor/modernizr/*.modernizr.js', { root : global.rootFolder })
    , developmentPath = '/vendor/modernizr/modernizr.js';

  this._modernizr = inDistribution ? '/' + path.relative(rootFolder, distributionPath[0]) : developmentPath;

  return this._modernizr;
};

/**
 *
 */

module.exports = new Path;
