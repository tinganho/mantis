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
  , acceptLanguage = require('accept-language');

/**
 * Accept language configuration
 */

acceptLanguage.default({
  code : 'en',
  region : 'US'
});
acceptLanguage.codes(['en', 'zh']);

/**
 * Export middleware
 */

module.exports = function(req, res, next) {
  if(typeof req.cookies.locale === 'undefined' || !localeSyntax.test(req.cookies.locale)) {
    var languages = acceptLanguage.parse(req.get('Accept-Language'));
    res.cookie('locale', languages[0].code, { maxAge : cf.LOCALE_COOKIE_MAX_AGE });
    req.cookies.locale = languages[0].code;
  }
  next();
};
