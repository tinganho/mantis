
module.exports = function(page) {
  page('/')
    .hasDocument('default')
      .withProperties({
        styles : [
          '/public/styles/documents/default.css',
          '/public/styles/content/content.css'
        ],
        main : '/documents/mains/app',
        templates : '/public/templates/content/templates.js'
      })
    .hasLayout('three-rows')
      .withRegions({
      })
    .handleErrorsUsing(function(error) {});
};
