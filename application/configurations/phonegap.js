
/**
 * Specify your phonegap resources. All resources that is used that
 * originates from phonegap needs to be delared below.
 */

var phonegapResources = [
  'phonegap\\.js',
  'cordova\\.js',
  'cordova_plugins\\.js',
  'plugins\\/.*'
]

.join('|');

/**
 * Platforms. Use lowercase letters to specify all platforms used
 * for webview.
 */

var phoneGapPlatforms = [
  'ios',
  'android'
]

.map(function(platform) {
  return '^\\/(' + phonegapResources + ') /native/platforms/' + platform + '/www/$1 [H=^' + platform + '.webview\\..*, L]';
});

/**
 * Export phonegap platforms
 */

module.exports = phoneGapPlatforms;
