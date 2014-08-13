
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../Libraries/Model') : require('Model');

  return Model.extend({

    /**
     * Backbone's sync method
     *
     * @return {void}
     * @api public
     * @handler
     */

    sync: function(method, model, options, requestData) {
      if(method === 'read') {
        if(inServer) {
          this._readRequestFromServer(model, options, requestData);
        }
        else {
          this._readRequestFromClient(model, options, requestData);
        }
      }
    },

    /**
     * Handle reads from server
     *
     * @return {void}
     * @api private
     * @handler
     */

    _readRequestFromServer: function(model, options, requestData) {
      var l = requireLocale(requestData.cookies.locale);
      this.set('l10ns', {
        gameDescription: l('INDEX__GAME_DESCRIPTION')
      });
      options.success();
    },

    /**
     * Handle reads from server
     *
     * @return {void}
     * @api private
     * @handler
     */

    _readRequestFromClient: function(model, options, requestData) {
      var $json = $('.js-json-rollingnumbers');
      var json = $json.html();
      this.set(JSON.parse(json));
      $json.remove();
      options.success();
    }
  });
});
