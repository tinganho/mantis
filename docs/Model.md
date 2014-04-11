Model
=====
`Model` extends `Backbone.Model` and it fetches through an API interface from the client and the server. The `Composer` object will instantiate `Model` instances and provide state data to the `Model` object during fetching. It is up to the `Model` object to handle this state data and present it for the `View`. State data in the server is anything from request headers and request payloads. State data in the client is session data and URL changes.

Model's methods and behaviors:

###`void constructor(...)`
Set any identity data if possible and meta data.

#####`void sync(String method, Model model | Collection collection, Object options, Request request)`

