
/**
 * @fileoverview specify modrewrites of urls. Check rules
 * and other infos at the link below.
 *
 * More info: https://github.com/tinganho/connect-modrewrite
 */

var phonegapResources = [
  'phonegap\\.js',
  'cordova\\.js',
  'cordova_plugins\\.js',
  'plugins\\/.*'
].join('|');

module.exports = [
  // For application cache
  '^\\/(yourapp.appcache)$ /$1 [L,T=text/cache-manifest]',
  // Robots.txt
  '^\\/robots.txt /public/robots.txt [L]',
  // iOS web wiew
  '^\\/(' + phonegapResources + ') /native/platforms/ios/www/$1 [H=^ios.webview\\..*, L]',
  // Android web wiew
  '^\\/(' + phonegapResources + ') /native/platforms/android/www/$1 [H=^android.webview\\..*, L]'
];
