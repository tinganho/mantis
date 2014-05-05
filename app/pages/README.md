Pages
=======

Please specify your page manifest files here. Each page manifest should represent just one page. The page manifest tells the `Composer` object which document, layout and models and views each page uses. An example manifestation file is provided below:
```javascript
module.exports = function(page) {
  page('/')
    .document('default')
    .layout('three-rows')
    .content({
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
    .error(function(err) {});
};

```
We  begin with and export function statement that takes an `Page` instance as an argument:
```javascript
module.exports = function(page) {
```
We define the URL used for this page:
```javascript
page('/')
```
We define which document to use:
```javascript
  .document('default')
```
We define which layout to use:
```javascript
  .layout('three-rows')
```
All content is defined as paths to models and views. and the models and views is grouped in regions if the layout.
```javascript
  .content({
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
  .error(function(error) {});
```

