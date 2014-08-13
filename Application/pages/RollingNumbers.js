
module.exports = function(page) {
  page('/games/rolling-numbers')
    .onPlatform('mobile')
      .hasDocument('Default')
        .withProperties({
          googleAnalyticsId: cf.GOOGLE_ANALYTICS_ID,
          pingdomId: cf.PINGDOM_ID,
          configurations: ['Default'],
          styles: [
            '/Public/Styles/Documents/Default.css',
            '/Public/Styles/Contents/Content.css'
          ],
          main: '/Documents/Mains/Application',
          templates: '/Public/Templates/Contents/Templates.js'
        })
      .hasLayout('Body')
        .withRegions({
          'body': {
            model: 'Contents/RollingNumbers/RollingNumbers',
            view: 'Contents/RollingNumbers/RollingNumbersView'
          }
        })
};
