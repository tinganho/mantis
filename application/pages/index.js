
module.exports = function(page) {
  page('/')
    .hasDocument('default')
      .withProperties({
        styles : [
          '/public/styles/documents/default.css',
          '/public/styles/content/app.css'
        ],
        main : '/documents/mains/app',
        templates : '/public/templates/content/app.js'
      })
    .hasLayout('three-rows')
      .withRegions({
      })
    .handleErrorsUsing(function(error) {});
};
