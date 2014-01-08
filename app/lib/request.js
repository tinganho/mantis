
/**
 * Module dependenices.
 */

var request = require('superagent');

/**
 * Request
 */

function Request(origin) {
  this.origin = origin;
  this.authorization;
}

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
 * @return {Object} Request
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
 * @return {Object} Request
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
 * @return {Object} Request
 */

Request.prototype.setContentType = function(contentType) {
  this.contentType = contentType;
  return this;
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
 * @return {Object} request
 */

Request.prototype.post = function(url) {
  url = /^http/.test(url) ? url : this.origin + url;

  var req = request.post(url);

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
 * @return {Object} request
 */

Request.prototype.get = function(url) {
  url = /^http/.test(url) ? url : this.origin + url;

  var req = request.get(url);

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
 * Exports `Request` constructor
 */

module.exports.Requst = Request;


