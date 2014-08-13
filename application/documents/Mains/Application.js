
requirejs.config({
  paths : {
    'jquery' : 'Vendors/jquery/jquery',
    'jquery.cookie' : 'Vendors/jquery.cookie/jquery.cookie',
    'underscore' : 'Vendors/underscore/underscore',
    'backbone' : 'Vendors/backbone/backbone',
    'backbone.queryparams' : 'Vendors/backbone-query-parameters-patch/backbone.queryparams',
    'backbone-relational' : 'Vendors/backbone-relational/backbone-relational',
    'superagent' : 'Vendors/superagent/superagent',
    'jquery.hammer' : 'Vendors/hammerjs/dist/jquery.hammer',
    'purl' : 'Vendors/purl/purl',
    'jquery.formParams' : 'Vendors/jquery.formParams/jquery.formParams',
    'xregexp' : 'Vendors/xregexp/xregexp-all'
  },

  shim : {
    'superagent' : {
      exports : 'request'
    },
    'jquery' : {
      exports : 'jQuery'
    },
    'underscore' : {
      exports : '_'
    },
    'backbone' : {
      exports : 'Backbone',
      deps : ['underscore', 'jquery']
    },
    'stackblur' : {
      exports : 'stackBlurCanvasRGB'
    },
    'xregexp' : {
      exports : 'XRegExp'
    },

    // Plugins
    'backbone.queryparams' : ['backbone'],
    'backbone-relational' : ['backbone', 'underscore', 'jquery'],
    'jquery.cookie' : ['jquery'],
    'jquery.hammer' : ['jquery'],
    'purl' : ['jquery'],
    'jquery.formParams' : ['jquery']
  },

  map : {
    '*': {
      'View' : 'Libraries/View',
      'Collection' : 'Libraries/Collection',
      'Model' : 'Libraries/Model',
      'contentTemplates' : 'Public/Templates/Contents/Templates',

      'CompositeRouter' : 'Public/Scripts/Routers/Composer',
      'request' : 'Libraries/Client/Request',
      'Document' : 'Libraries/Document',
      'DocumentView' : 'Libraries/DocumentView',
      'layoutTemplates' : 'Public/Templates/Layouts/Templates'
    }
  },

  waitSeconds : 90,

  baseUrl : '/'
});

define('modernizr', function() {
  return Modernizr;
});

require([

  'backbone',
  'backbone-relational',
  'CompositeRouter',
  'Document',
  'DocumentView',
  'layoutTemplates'

], function(

  Backbone,
  BackboneRelational,
  CompositeRouter,
  Document,
  DocumentView,
  layoutTemplates

) {

  var $body = $(document.body);

  // App
  window.app = {
    routers : {},
    models : {},
    collections : {},
    views : {},
    components : {},
    document : new Document,
    $document : $(document),
    layoutTemplates : layoutTemplates,
    landingPath : window.location.pathname,
    $body : $body,
    $layout : $body.find('[data-layout]'),
    navigate : function(path) {
      Backbone.Router.prototype.navigate(path, { trigger : true });
    }
  };

  /**
   * Initialize App
   */

  app.initialize = function() {
    this.delegateRouters();
    this.startBackbone();
  };

  /**
   * Start backbone router
   */

  app.startBackbone = function() {
    Backbone.history.start({ pushState : true, hashChange : false });
    app.views.document = new DocumentView(app.document);
  };

  /**
   * Delegate Backbone routers
   */

  app.delegateRouters = function() {
    new CompositeRouter();
  };

  // Initialize App
  app.initialize();

});

