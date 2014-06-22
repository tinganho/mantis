
define([

  'superagent'

], function(

  request

) {

  /**
   * We wrap all state changing request with a custom X-Reuested-By
   * header to prevent CSRF attacks. We also set a timeout
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   */

  function getRequestObject(method, path, data, callback) {
    var apiUrl;

    if(cf.DEFAULT_API_URL === 'undefined') {
      throw new TypeError('You must set DEFAULT_API_URL in your configuration');
    }
    apiUrl = cf[cf.DEFAULT_API_URL.toUpperCase() + '_API_URL'];

    var req = request(method, path);
    req.set('X-Requested-By', cf.X_REQUESTED_BY);
    req.timeout(cf.AJAX_TIMEOUT);
    if ('function' === typeof data) callback = data, data = null;
    if (data) req.send(data);
    if (callback) req.end(callback);
    return req;
  }

  /**
   * Set API
   *
   * @param {String} name
   * @return {Request}
   * @api public
   */

  request.api = function(name) {
    var apiUrl = name.toUpperCase() + '_API_URL';
    if(typeof cf[apiName] === 'undefined') {
    throw new TypeError('API: ' + name + ' is undefined');
    }

    this.apiUrl = apiUrl;

    return this;
  };

  /**
   * Overrides Request#get
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#post
   */

  request.get = function(path, data, callback) {
    return getRequestObject('GET', path, data, callback);
  };

  /**
   * Overrides Request#post
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#post
   */

  request.post = function(path, data, callback) {
    return getRequestObject('POST', path, data, callback);
  };

  /**
   * Overrides Request#put
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#put
   */

  request.put = function(path, data, callback) {
    return getRequestObject('PUT', path, data, callback);
  };

  /**
   * Overrides Request#patch
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#patch
   */

  request.patch = function(path, data, callback) {
    return getRequestObject('PATCH', path, data, callback);
  };

  /**
   * Overrides Request#head
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#head
   */

  request.head = function(path, data, callback) {
    return getRequestObject('HEAD', path, data, callback);
  };

  /**
   * Overrides Request#del
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#del
   */

  request.delete = function(path, data, callback) {
    return getRequestObject('DELETE', path, data, callback);
  };

  /**
   * Export instance
   */

  return function() {
    return request;
  };

});
