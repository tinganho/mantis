View
====

The `View` constructor are extended from `Backbone.View`. The main task is to render `Models` both in the server and the client. In the client, `View`and `Model` objects are composed by the `ClientComposer` object. In the server, `View` and `Model` objects are composed by the `ServerComposer`. A `page definition` is given to the `Composer` and instruction are generated to generate a page. The `View` object central role is to generate HTML in the server and HTML and interactions in the client.

These methods and behaviors of `View` constructor:

###`#render`
Render is called from Composer the composer object
