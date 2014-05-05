Pages
=======

Please specify your page manifest files here. Each page manifest should represent just one page. The page manifest tells the `Composer` object which document, layout and models and views each page uses. An example manifestation file is provided below:
```javascript
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
      templates : '/public/templates/content/app.js',
      noScroll : true
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

```
We begin with and export function statement that takes an `Page` instance as an argument:
```javascript
module.exports = function(page) {
```
We define the URL used for this page:
```javascript
page('/')
```
We define which document to use:
```javascript
  .hasDocument('default')
```
We define which layout to use:
```javascript
  .hasLayout('three-rows')
```
Define what content each region will placehold.
```javascript
  .withRegions({
    topbar : {
      model : 'content/search/Search',
      view : 'content/search/SearchView'
    },
    body : {
      model : 'content/translations/Translations',
      view : 'content/translations/TranslationsView'
    },
      footer : {
        model : 'content/translation/Translation',
        view : 'content/translation/TranslationView'
      }
  })
```
At last we must handle potential errors. All errors will bubble up to the error callback.
```javascript
  .handleErrorsUsing(function(error) {});
```

