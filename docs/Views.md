View
====

The `View` constructor are extended from `Backbone.View`. The main task is to render `Models` both in the server and the client. In the client, `View`and `Model` objects are composed by the `Composer` object. In the server, `View` and `Model` objects are composed by the `Page` object. A `page definition` is written using the `Page` constructor and it is given to the `Composer` and instruction are generated to generate a page. The `View` object central role is to generate HTML in the server and HTML and interactions in the client.

These are methods and behaviors of `View` constructor:

###`#constructor(Model model, ...)`
During initialization of a `View` constructor. A `Model` instance should always be passed. A `View` instance can't exist without a `Model` instance. 

###`#render`
A `View` object will call `#render` in the client if the HTML doesn't exist in the DOM.


###`#root`


