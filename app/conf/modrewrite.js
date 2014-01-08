
/**
 * @fileoverview specify rewrites of urls. Check rules
 * and other infos at the link below.
 *
 * More info: https://github.com/tinganho/connect-modrewrite
 */

module.exports = [
  // For application cache
  '^/(yourapp.appcache)$ /$1 [T=text/cache-manifest]'
];