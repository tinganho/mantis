Collection
==========
`Collection` have similar behaviors and methods as `Model`. Though in a collection you can set some meta data, which is useful for pagination.

Collection's methods and behaviors:

###`void autocalled constructor(*...)`
Set any identity data if possible and meta data.

###`void autocalled sync(String method, Collection collection, Object options, Request request)`
`sync()` will be called whenever `Collection#fetch()|#save()|#destroy()` is called. The `method` parameter could have values `create|read|update|write` depending on the state of the `Collection` instance and also which method `Collection#fetch()|#save()|#destroy()` is called. You should use the the global variables `inClient` and `inServer` to decide how to fetch the collection's data on each environment. 

###`void setMeta()`
Set meta data. `metaadd` and `metachange` event will be fired depending on that state change.

###`void getMeta()`
Get meta data.
