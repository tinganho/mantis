
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../Libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     * @handler
     */

    initialize: function(model) {
      this.model = model;
    },

    /**
     * To HTML
     *
     * @return {String}
     * @api public
     * @handler
     */

    toHTML: function() {
      return template['RollingNumbers']();
    }
  });
});
