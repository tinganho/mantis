if(inServer) {

/**
 * Module dependenices.
 */

var request = require('superagent');

/**
 * Request
 *
 * @constructor Request
 */

function Request() {
  var apiUrl;

  if(cf.DEFAULT_API_URL === 'undefined') {
    throw new TypeError('You must set DEFAULT_API_URL in your configuration');
  }
  apiUrl = cf[cf.DEFAULT_API_URL.toUpperCase() + '_API_URL'];
  if(typeof apiUrl === 'undefined') {
    throw new TypeError('Default API URL is undefined');
  }
  this.apiUrl = apiUrl;
  this.authorization;
}

/**
* Set API
*
* @param {String} name
* @return {Request}
* @api public
*/

Request.prototype.api = function(name) {
  var apiUrl = name.toUpperCase() + '_API_URL';
  if(typeof cf[apiName] === 'undefined') {
    throw new TypeError('API: ' + name + ' is undefined');
  }

  this.apiUrl = apiUrl;

  return this;
};


/**
 * Set `Authroization header
 *
 *   Example:
 *
 *     this
 *       .setAuthorization('oweijfoiwjefio')
 *       .post('activation/token')
 *       .end(function() {
 *
 *       })
 * @param {String} authorization
 *
 * @return {Request}
 * @api public
 */

Request.prototype.setAccessToken = function(accessToken) {
  this.authorization = 'Bearer ' + accessToken;

  return this;
};

/**
 * Set Authroization header
 *
 *   Example:
 *
 *     this
 *       .setAuthorization('oweijfoiwjefio')
 *       .post('activation/token')
 *       .end(function() {
 *
 *       })
 * @param {String} authorization
 *
 * @return {Request}
 * @api public
 */

Request.prototype.setAuthorization = function(authorization) {
  this.authorization = authorization;

  return this;
};

/**
 * Set `Content Type` header
 *
 *   Example:
 *
 *     this
 *       .setContentType('application/json')
 *       .post('activation/token')
 *       .end(function() {
 *
 *       })
 * @param {String} authorization
 *
 * @return {Request}
 * @api public
 */

Request.prototype.setContentType = function(contentType) {
  this.contentType = contentType;

  return this;
};

/**
 * Get the request object with proper method
 *
 * @param {String} (get|post|put|patch)
 *
 * @return {Request}
 * @api private
 */

Request.prototype._getReqestObject = function(method, path) {
  var url = this.apiUrl + path
    , req = request[method](url);

  if(this.authorization !== false) {
    req.set('Authorization', (this.authorization || cf.AUTHORIZATION) + '');
  }

  this.authorization = null;

  return req
    .set('User-Agent', cf.DEFAULT_WEB_SERVER_USER_AGENT)
    .set('Content-Type', this.contentType || cf.DEFAULT_CONTENT_TYPE)
    .set('Accept', '*/*');
};

/**
 * Issue a new GET request.
 *
 *   Example:
 *
 *     this
 *       .get('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.get = function(path) {
  return this._getReqestObject('get', path);
};

/**
 * Issue a new POST request.
 *
 *   Example:
 *
 *     this
 *       .post('/activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @param path {String}
 * @param type {String}, Optional and should be the URL for an API
 *
 * @return {Request}
 * @api public
 */

Request.prototype.post = function(path) {
  return this._getReqestObject('post', path);
};

/**
 * Issue a new PUT request.
 *
 *   Example:
 *
 *     this
 *       .put('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.put = function(path) {
  return this._getReqestObject('put', path);
};

/**
 * Issue a new PATCH request.
 *
 *   Example:
 *
 *     this
 *       .patch('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.patch = function(path) {
  return this._getReqestObject('patch', path);
};

/**
 * Issue a new DELETE request.
 *
 *   Example:
 *
 *     this
 *       .del('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.delete = function(path) {
  return this._getReqestObject('del', path);
};

/**
 * Issue a new HEAD request.
 *
 *   Example:
 *
 *     this
 *       .head('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.head = function(path) {
  return this._getReqestObject('head', path);
};

/**
 * Export request object
 */

module.exports = function() {
  return new Request();
};

/**
 * Exports `Request` constructor
 */

module.exports.Requst = Request;

}
