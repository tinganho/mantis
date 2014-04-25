
/**
 * Module dependencies.
 */

var fs = require('fs'), data = {};

/**
 * Gt handler.
 */

var gtHandler = function(req, res) {
  res.set('Content-Type', 'application/javascript');

  if(typeof data[req.cookies.locale] !== 'undefined') {
    return res.send(data[req.cookies.locale]);
  }
  fs.readFile(cf.TRANSLATION_OUTPUT + '/' + req.cookies.locale + '.js', function(err, data) {
    data[req.cookies.locale] = data;
    res.send(data);
  });
};

/**
 * Export routes.
 */

module.exports = function(app) {
  app.get('/change-locale/:locale', function(req, res) {
    res.clearCookie('locale', { httpOnly: true });
    res.cookie('locale', req.param('locale'), { maxAge: cf.COOKIE_LOCALE_MAXAGE, httpOnly: true });
    res.redirect('back');
  });
  app.get('/gt.js', gtHandler);
};
