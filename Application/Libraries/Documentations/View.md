View
====

The `View` constructor are extended from `Backbone.View`. The main task is to render `Models` both in the server and the client. In the client, `View` and `Model` objects are composed by the `Composer` object. In the server, `View` and `Model` objects are composed by the `Page` object. A `page manifest` is written using the `Page` constructor and it is given to the `composer` to generate a page. The `View` object central role is to generate HTML in the server and render DOM and apply interactions in the client.

These are methods and behaviors of `View` constructor:

###`Model model`
The `View's` model.

###`void autocalled constructor(Model model, ...)`
During initialization of a `View` constructor. A `Model` instance should always be passed. A `View` instance can't exist without a `Model` instance. The constructor method will always check if it is on the client or if it is on the server. If it is on the client and the specified `root` element for the view is not available on the DOM. The `View` object will call `render()` to render the `View` to the DOM. That the `root` element is not on the current DOM happens when the `Composer` object want to compose a new page or if you want to render a `Model` explicitly. If the element is on the DOM, which happens oftenly when the server renders the page it will set the `root` element and call `_setElements()` to set all elements object properties.

###`String autocalled toHTML()`
`toHTML()` is called by the `composer` to get the HTML to render the content. The composer figures out by itself where to put the HTML. Please use the templates and the model to return the appropriate HTML. The HTML also needs to contain a `data-content` attribute that specifies the content type.

A template example:

```html
<div class="feed" data-content="feed">
  <ul class="feed-entreis">
    <li class="feed-entry"></li>
    ...
  </ul>
</div>
```

A method example:

```javascript
toHTML: function() {
  return template['Feed'](this._getText());
},
```

###`Object _getText()`
Get text from labels and content. `_getText()` will just return a merged object of `this.model.toJSON()` and `this.labels`.

###`void autocalled setLabels(String locale)`
`setLabels()` is autocalled by the `composer` to set the views labels. A locale string is provided. Every label should be kept under the object `labels`.

```javascript
setLabels: function(locale) {
  var gt = gt || requireLocale(locale);
  this.labels: {
    buttonText: gt('BASE__DONE'),
    ...
  };
},
```

###`void autocalled bindModel()`
A developer should use `bindModel()` to bind model changes. Use the property `this.model`to bind all the model events.
```javascript
bindModel: function() {
  this.model.on('change:title', function() {...});
  this.model.on('change:description', function() {...});
},
```
###`void autocalled addTouchInteractions()`
Bind touch event listeners.
```javascript
addTouchInteractions: function() {
  this.$root.on('release', '.show-modal', this._showModal);
  this.$root.on('release', '.exit', this._exit);
},
```
###`void autocalled addMouseInteractions()`
Bind mouse event listeners.
```javascript
addMouseInteractions: function() {
  this.$root.on('click', '.show-modal', this._showModal);
  this.$root.on('click', '.exit', this._exit);
},
```
###`void autocalled remove()`
The `remove()` method will be autocalled by the `composer` whenever the `composer` calls `should()` method and it returns the string `remove`.

###`String autocalled should()`
The composer will call `should()` whenever a view with the same `Constructor` exists on the previous url. It could happpen whenever a node page redirects to an another node page. The method `should()` should decide whether to `re-render` the page, `remove` the old view or `keep` the old view.

`should()` should always return the string:

1. `keep`
2. `render`
3. `remove`
