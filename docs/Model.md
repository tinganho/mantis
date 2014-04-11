Model
=====
`Model` extends `Backbone.Model` and it fetches through an API interface from the client and the server. The `Composer` object will instantiate `Model` instances and provide state data to the `Model` object during fetching. It is up to the `Model` object to handle this state data and present it for the `View`. State data in the server is anything from request headers and request payloads. State data in the client is session data and URL changes.

Model's methods and behaviors:

###`void callback constructor(*...)`
Set any identity data if possible and meta data.

###`void callback sync(String method, Model model, Object options, Request request)`
`sync()` will be called whenever `Model#fetch()|#save()|#destroy()` is called. The `method` parameter could have values `create|read|update|write` depending on the state of the `Model` instance and also which method `Model#fetch()|#save()|#destroy()` is called. You should use the the global variables `inClient` and `inServer` to decide how to fetch the model's data on each environment. 

###`void setPageTitle()`
Convenience method for setting the page title. 

###`void setPageDescription()`
Convenience method for setting the page description. 

###`void setPageKeywords()`
Convenience method for setting the page keyword. 

###`void callback onHistoryChange()`
This callback is called if the next page has defined the same object. It checks if `app.models[NAME]` and `app.views[NAME]` is defined or not to execute or not execute this callback.

