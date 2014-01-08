
define([

  'superagent'

], function(

  request

) {

  function getRequestObject(method, url, data, fn) {
    var req = request(method, url);
    req.set('X-Requested-By', cf.X_REQUESTED_BY || '1');
    req.timeout(cf.AJAX_TIMEOUT);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  /**
   * We wrap all state changing request with a custom X-Reuested-By
   * header to prevent CSRF attacks.
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   */

  request.post = function(url, data, fn) {
    return getRequestObject('POST', url, data, fn);
  };

  request.put = function(url, data, fn) {
    return getRequestObject('PUT', url, data, fn);
  }

  request.patch = function(url, data, fn) {
    return getRequestObject('PATCH', url, data, fn);
  }

  return request;

});
