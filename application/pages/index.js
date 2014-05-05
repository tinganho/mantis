
module.exports = function(page) {
  page('/')
    .hasDocument('default')
      .withProperties({
        title : null,
        description : null,
        locale : 'en',
        styles : [
          '/public/styles/documents/default.css',
          '/public/styles/content/app.css'
        ],
        main : '/documents/mains/app',
        templates : '/public/templates/content/app.js'
      })
    .hasLayout('three-rows')
      .withRegions({
        search : {
          model : 'content/search/Search',
          view : 'content/search/SearchView'
        },
        body : {
          model : 'content/translations/Translations',
          view : 'content/translations/TranslationsView'
        },
        translation : {
          model : 'content/translation/Translation',
          view : 'content/translation/TranslationView'
        }
      })
    .handleErrorsUsing(function(err) {});
};
