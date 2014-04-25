View
====

The `View` constructor are extended from `Backbone.View`. The main task is to render `Models` both in the server and the client. In the client, `View` and `Model` objects are composed by the `Composer` object. In the server, `View` and `Model` objects are composed by the `Page` object. A `page definition` is written using the `Page` constructor and it is given to the `Composer` to generate a page. The `View` object central role is to generate HTML in the server and HTML and interactions in the client.

These are methods and behaviors of `View` constructor:

###`Model model`
The `View's` model.

###`void autocalled constructor(Model model, ...)`
During initialization of a `View` constructor. A `Model` instance should always be passed. A `View` instance can't exist without a `Model` instance. The constructor method will always check if it is on the client or if it is on the server. If it is on the client and the specified `root` element for the view is not available on the DOM. The `View` object will call `render()` to render the `View` to the DOM. That the `root` element is not on the current DOM happens when the `Composer` object want to compose a new page or if you want to render a `Model` explicitly. If the element is on the DOM, which happens oftenly when the server renders the page it will set the `root` element and call `_setElements()` to set all elements object properties. 

###`void autocalled render()`
A `View` object will call `render` in the client if the HTML doesn't exist in the DOM. On the server `render()` will be called when the `Page` object compose the page. It is up to the developer to render the page correctly. The developer needs to figure out if the current instance is in the server or in the client using the global variables `inClient` and `inServer` that exist both in the client and the server. 

####In client
If it is in the client `render()` should edit the current DOM so that the HTML for the view is on the DOM. After editing the DOM, `render()` should set the root element property with `setRootElement()` and all the other element properties with `_setElements()`. After setting the element properties, `render()` should also call `_bindDOM()` to bind interactions and DOM updates with the `View` object. It should also call `_bindModel()` to bind model changes to the `View` object.

####In server
If it is in the server it will just return the correct HTML string corresponding to the `Model` state. The `Page` object, which is the server composer, will take the HTML string and insert it to the correct place in the HTML document.

####Sub views
Any sub views will be initiated with their corresponding sub models. The model will have properties pointing to sub models. And it is up to the parent view to instantiate the correct subviews with the correct sub models. The model will always have synced properties that corresponds to the sub models properties. Don't use this synced properties to render the DOM or to render the HTML string. Instead use the sub model property with a sub view to render the DOM or HTML string. All subviews should have a link to their parent using a parent property. The link is used for syncing interactions with both the parent and child views. Sub views will call `render()` to render sub views in HTML or appending the DOM to their parent `render()` call. 

###`CssSelectorString root`
A CSS string that corresponds to the root element. The root element will be checked on instantiation to bind the DOM with the `View` object. If the `root` element is not currently on DOM `render()` function will be called. This property will be converted to a `HtmlObject` corresponding to the root element, whenever `setRootElement()` is called.

###`void autocalled setRootElement()`
Set the root element using the `root` property. It will convert the `root` property from a CSS selector string to an `HTMLObject` that corresponds to to the root element of the `View` object.

###`HTMLObject root`
The root element.

###`jQuery $root`
A jQuery object represenation of the root element.


###`void autocalled bindDOM()`
`bindDOM()` will be called on instantiation of a class if the `root` element is currently present on the DOM. if the `root` element is present on the DOM it will be called during the `render()` call. Best practice is to use jQuery's event delegation `on()` to bind all interactions with the DOM to the `View` object. 

```javascript
  bindDOM : function() {
    this.$root.on('click', '.element1', function() {...});
    this.$root.on('click', '.element2', function() {...});
  }
```
Sub view elements shouldn't be binded. You should call the sub view's `bindDOM()` method.
```javascript
  bindDOM : function() {
    this.$root.on('click', '.element1', function() {...});
    this.$root.on('click', '.element2', function() {...});
    this.subView.bindDOM();
  }
```

###`void _addTouchInteractions()`
Bind touch event listeners.

###`void _addMouseInteractions()`
Bind mouse event listeners.

###`void autocalled remove()`
The remove method will be called whenever the `Composer` object don't have this view specified on the next page and if the current `layout` of the page is the same as the next page.


