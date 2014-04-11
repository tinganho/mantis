View
====

The `View` constructor are extended from `Backbone.View`. The main task is to render `Models` both in the server and the client. In the client, `View` and `Model` objects are composed by the `Composer` object. In the server, `View` and `Model` objects are composed by the `Page` object. A `page definition` is written using the `Page` constructor and it is given to the `Composer` to generate a page. The `View` object central role is to generate HTML in the server and HTML and interactions in the client.

These are methods and behaviors of `View` constructor:

###`void constructor(Model model, ...)`
During initialization of a `View` constructor. A `Model` instance should always be passed. A `View` instance can't exist without a `Model` instance. The constructor method will always check if it is on the client or if it is on the server. If it is on the client and the specified `root` element for the view is not available on the DOM. The `View` object will call `render()` to render the `View` to the DOM. That the `root` element is not on the current DOM happens when the `Composer` object want to compose a new page or if you want to render a `Model` explicitly. If the element is on the DOM, which happens oftenly when the server renders the page it will set the `root` element and call `_setElements()` to set all elements object properties. 

###`void render()`
A `View` object will call `render` in the client if the HTML doesn't exist in the DOM. On the server `render()` will be called when the `Page` object compose the page. It is up to the developer to render the page correctly. The developer needs to figure out if the current instance is in the server or in the client using the global variables `inClient` and `inServer` that exist both in the client and the server. 

####In client
If it is in the client `render()` should edit the current DOM so that the HTML for the view is on the DOM. After editing the DOM, `render()` should set the root element property with `setRootElement()` and all the other element properties with `_setElements()`. After setting the element properties, `render()` should also call `_bindDOM()` to bind interactions and DOM updates with the `View` object. It should also call `_bindModel()` to bind model changes to the `View` object.

####In server
If it is in the server it will just return the correct HTML string corresponding to the `Model` state. The `Page` object, which is the server composer, will take the HTML string and insert it to the correct place in the HTML document.

####Sub views

###`CssString root`



