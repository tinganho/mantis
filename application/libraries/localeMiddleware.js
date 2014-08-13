
/**
 * Export middleware
 *
 * Example:
 *
 *
 *    var gtMiddleware = require('./cookieMiddleware');
 *    ...
 *    express()
 */

var localeSyntax = /^[a-z]{2}$/
  , acceptLocale = require('accept-locale');

/**
 * Accept language configuration
 */

acceptLocale.default(cf.DEFAULT_LOCALE);
acceptLocale.locales(cf.LOCALES);


/**
 * Export middleware
 */


module.exports = function(req, res, next) {
  if(typeof req.cookies.locale === 'undefined'
  || !localeSyntax.test(req.cookies.locale)
  || /\.webview\./i.test(req.headers.host)
  || /platform=(ios|android)/.test(req.url)) {
    var locales = acceptLocale.parse(req.get('Accept-Language'));
    res.cookie('locale', locales[0].language, { maxAge : cf.LOCALE_COOKIE_MAX_AGE });
    req.cookies.locale = locales[0].value;
  }
  if(req.cookies.locale === 'en') {
    req.cookies.locale = 'en-US';
  }
  else if(req.cookies.locale === 'zh') {
    req.cookies.locale = 'zh-CN';
  }
  next();
};
