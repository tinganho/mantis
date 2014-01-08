
define([

  'superagent'

], function(

  request

) {

  /**
   * We wrap all state changing request with a custom X-Reuested-By
   * header to prevent CSRF attacks.
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   */

  request.post = function(url, data, fn) {
    var req = request('POST', url);
    req.set('X-Requested-By', cf.X_REQUESTED_BY || '1');
    req.timeout(cf.AJAX_TIMEOUT);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  request.put = function(url, data, fn) {
    var req = request('PUT', url);
    req.set('X-Requested-By', cf.X_REQUESTED_BY || '1');
    req.timeout(cf.AJAX_TIMEOUT);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  }

  request.patch = function(url, data, fn) {
    var req = request('PATCH', url);
    req.set('X-Requested-By', cf.X_REQUESTED_BY || '1');
    req.timeout(cf.AJAX_TIMEOUT);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  }

  return request;

});
