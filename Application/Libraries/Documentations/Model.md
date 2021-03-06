Model
=====
`Model` extends `Backbone.Model` and it fetches through an API interface from the client and the server. The `Composer` object will instantiate `Model` instances and provide state data to the `Model` object during fetching. It is up to the `Model` object to handle this state data and present it for the `View`. State data in the server is anything from request headers and request payloads. State data in the client is session data and URL changes.

Model's methods and behaviors:

###`void autocalled constructor(*...)`
Set any identity data if possible and meta data.

If data is bootstrapped in the HTML document. You should try to fetch and set the data.

```javascript
  constructor : function() {
    if(inClient) {
      this._bindMethods();
      // Get bootstrapped data DOM element
      var $json = $('.js-json-edit');
      // Check the length
      if($json.length) {
        // Set data to object
        this.set(JSON.parse($json.html()));
        // Remove the DOM object to release some memory
        $json.remove();
      }
    }
  },
```

###`void autocalled sync(String method, Model model, Object options, Request request)`
`sync()` will be called whenever `Model#fetch()|#save()|#destroy()` is called. The `method` parameter could have values `create|read|update|write` depending on the state of the `Model` instance and also which method `Model#fetch()|#save()|#destroy()` is called. You should use the the global variables `inClient` and `inServer` to decide how to fetch the model's data on each environment.

###`void setPageTitle(String title)`
Convenience method for setting the page title.

###`void setPageDescription(String description)`
Convenience method for setting the page description.

###`void setPageKeywords(Array keywords)`
Convenience method for setting the page keyword.

