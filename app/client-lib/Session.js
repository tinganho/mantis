
define([

  'backbone',
  'request'

], function(

  Backbone,
  request

) {

  /**
   * Session Model
   *
   * @constructor
   */

  return Backbone.Model.extend({

    /**
     * Default values
     */

    defaults : {
      refreshToken : null,
      expire : null
      username : null,
      password : null
    },

    /**
     * Overriding the Backbone sync method
     *
     * @param {String} method (create|read|update|delete)
     * @param {BackboneModel} model
     * @param {=Object} opts
     *
     * @handler
     * @override Backbone#sync
     */

    sync : function(method, model, opts) {
      switch(method) {
        case 'create':
          request
            .post('/login')
            .send({
              username : this.get('username'),
              password : this.get('password')
            })
            .end(function(err, res) {

            });
          break;
        case 'delete':
          request
            .post('/logout')
            .send()
            .end(function(err, res) {

            });
          break;
      }

    }
  });
});
