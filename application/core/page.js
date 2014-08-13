
/**
 * Module dependencies
 */

var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , Backbone = require('backbone')
  , _Model = requirejs('libraries/Model')
  , _Collection = requirejs('libraries/Collection')
  , glob = require('glob')
  , isArray = require('../libraries/isArray')
  , imports = []
  , importNames = []
  , importPaths = []
  , urlPaths = []
  , pages = [];

/**
 * Add backbone relational
 */

require('backbone-relational');

/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * The Page object builds up the whole html for your website.
 * You can specify document, layout, module and components to
 * customize the html you want.
 *
 * @constructor Page
 * @return {Page}
 */

function Page(url) {
  if(typeof url !== 'string'
  && !isArray(url)) {
    throw new TypeError('first parameter must be a string or array of strings');
  }

  this._url = url;
  this._documentTemplates = documentTemplates;
  this._layoutTemplates = layoutTemplates;
  this._usingDistributionProperties = false;
  this._attachedUrlHandler = false;

  this._platforms = {};

  _.bindAll(this, '_next');

  return this;
}

/**
 * Specify platform
 *
 * @param {String} platform
 * @return {Page}
 * @api public
 */

Page.prototype.onPlatform = function(platform) {
  this._platforms[platform] = {
    imports: [],
    importNames: []
  };

  this._latestPlatform = this._platforms[platform];
  this._latestPlatformName = platform;


  return this;
};

/**
 * Set document
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Page}
 * @api public
 */

Page.prototype.hasDocument = function(name, props) {
  if(typeof this._documentTemplates[name] === 'undefined') {
    throw new TypeError('document ' + name + ' does not exist');
  }

  if(typeof this._latestPlatform === 'undefined') {
    throw new TypeError('You must define a platform with .onPlatform() method.')
  }

  this._latestPlatform._documentTemplate = this._documentTemplates[name];

  return this;
};

/**
 * Set document
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Page}
 * @api public
 */

Page.prototype.withProperties = function(properties) {
  properties.configurations = properties.configurations
    .map(function(configuration) {
      if(cf.RESOURCE_NAMESPACE) {
        return '/' + cf.RESOURCE_NAMESPACE + '/'
          + cf.CLIENT_CONFIGURATIONS_BUILD + '/'
          + cf.CLIENT_CONFIGURATIONS_MAP[configuration] + '.js';
      }
      else {
        return '/' + cf.CLIENT_CONFIGURATIONS_BUILD + '/'
        + cf.CLIENT_CONFIGURATIONS_MAP[configuration] + '.js';
      }
    });

  // Set default properties
  _.defaults(properties, {
    title: '',
    description: ''
  });

  this._latestPlatform._documentProperties = properties;

  return this;
};

/**
 * Set layout
 *
 * @param {String} name
 * @return {Page}
 * @api public
 */

Page.prototype.hasLayout = function(name) {
  if(typeof this._layoutTemplates[name] === 'undefined') {
    throw new TypeError(name + ' layout doesn\'t exists');
  }

  this._latestPlatform._layout = name;
  this._latestPlatform._layoutTemplates = this._layoutTemplates[name];

  return this;
};

/**
 * Define (modules) views and models
 *
 * @param {Object} modules
 * @return {void}
 * @api public
 */

Page.prototype.withRegions = function(regions) {
  this._latestPlatform.regions = regions;
  this._serve();
  this.error = this._defaultErrorHandler;

  return this;
};

/**
 * Serve the page
 *
 * @return {void}
 * @api private
 */

Page.prototype._serve = function() {
  var _this = this;
  this._addContent();
  this._addPages();
  if(!this._attachedUrlHandler) {
    app.get(this._url, _this._next);
    this._attachedUrlHandler = true;
  }
};

/**
 * Get content
 *
 * @param {Function} callback
 * @return {void}
 * @api private
 */

Page.prototype._getRegions = function(request, response, callback) {
  var _this = this
    , regions = {}
    , n = 0
    , platform = this._platforms[request.platform]
    , size = _.size(platform.regions)
    , jsonScripts = '';

  if(size === 0) {
    return callback(regions, '');
  }

  for(var name in platform.regions) {
    if(!platform.regions[name].model) {
      throw new TypeError('name `' + name + '` doesn\'t have a model');
    }
    if(!platform.regions[name].view) {
      throw new TypeError('name `' + name + '` doesn\'t have a view');
    }

    var Model = require('../' + platform.regions[name].model)
      , View = require('../' + platform.regions[name].view);

    if(!Model.prototype.fetch) {
      throw new TypeError(platform.regions[name].model + ' is not an instance of Model or Collection');
    }

    Backbone.Relational.store.reset();

    var model = new Model
      , view = new View(model);

    model.sync = function(method, model, options) {
      Model.prototype.sync.call(this, method, model, options, request);
    };


    (function(name, view, Model, View, platform) {
      try {
        model.fetch({
          success: function() {
            view = new View(model);
            regions[name] = view.toHTML();

            if(typeof model.page.title === 'string' && model.page.title.length > 0) {
              platform._documentProperties.title = model.page.title;
            }
            if(typeof model.page.description === 'string' && model.page.description.length > 0) {
              platform._documentProperties.description = model.page.description;
            }

            // Push json scripts
            jsonScripts += coreTemplates.jsonScript({
              name: platform.regions[name].model.split('/')[2].toLowerCase(),
              json: JSON.stringify(model.toJSON())
            });

            n++;
            if(n === size) {
              callback(regions, jsonScripts);
            }
          },

          // The backbone takes in argument  model, response and options
          // We send in the error object in the middle argument. So we rename
          // response to error instead.
          error: function(model, error, options) {
            _this.error(error, request, response);
          }
        });
      }
      catch(error) {
        if(error.message === 'A "url" property or function must be specified') {
          regions[name] = view.toHTML();
          n++;
          if(n === size) {
            callback(regions, jsonScripts);
          }
        }
        else {
          _this.error(error, request, response);
        }
      }

    })(name, view, Model, View, platform);
  }
};

/**
 * If something fails it will be forwarded to this callback
 *
 * @callback
 */

Page.prototype.handleErrorsUsing = function(callback) {
  this.error = callback || this._defaultErrorHandler;
};

/**
 * Default error handler
 *
 * @delegate
 */

Page.prototype._defaultErrorHandler = function(error, request, response) {
  if(typeof error.status === 'number' && error.status === 404) {
    response.send(404, 'Page not found');
  }
  else {
    if(process.env.NODE_ENV !== 'production') {
      throw error;
    }
    response.send(500, 'Internal server error');
  }
};

/**
 * Check if request is a web view page request
 *
 * @param {HTTPRequest} request
 * @param {String} forcedPlatform
 * @return {Boolean}
 * @api private
 */

Page.prototype._isWebViewPageRequest = function(request) {
  var forcedPlatform = request.param('platform')
    , definedWebView = cf.WEB_VIEW_DETECT.exec(this._platform)
    , platforms = Object.keys(this._platforms);

  if(cf.WEB_VIEW_DETECT.test(request.headers['host'])) {
    if(platforms.indexOf('ios') !== -1
    || platforms.indexOf('android') !== -1) {
      if(forcedPlatform !== 'ios' && forcedPlatform !== 'android') {
        return false;
      }

      return true;
    }

  }

  return false;
};

/**
 * Check if request is a mobile page request
 *
 * @param {HTTPRequest} request
 * @param {String} forcedPlatform
 * @return {Boolean}
 * @api private
 */

Page.prototype._isMobilePageRequest = function(request) {
  var forcedPlatform = request.param('platform');
  if(Object.keys(this._platforms).indexOf('mobile') !== -1) {
    var userAgent = request.headers['user-agent'];
    if(!(cf.MOBILE_DEVICE_DETECT_1.test(userAgent) || cf.MOBILE_DEVICE_DETECT_2.test(userAgent.substr(0,4)))) {
      if(forcedPlatform !== 'mobile') {
        return false;
      }
    }
  }

  return true;
};

/**
 * Next callback
 */

Page.prototype._next = function(request, response, next) {
  var _this = this, platform = 'all';

  // Mobile platform check.
  if(this._isMobilePageRequest(request)) {
    platform = 'mobile';
  }
  else if(this._isWebViewPageRequest(request)) {
    platform = cf.WEB_VIEW_DETECT.exec(request.headers['host'])[1];
  }
  else if(Object.keys(this._platforms).indexOf('desktop')) {
    platform = 'desktop';
  }

  // If in a distribution use minified/uglified scripts
  if(inDistribution && !this._usingDistributionProperties) {
    this._platforms[platform]._documentProperties.main = '/' + glob.sync(
      cf.DISTRIBUTION_MAIN_FOLDER +
      '/*.' +
      path.basename(this._platforms[platform]._documentProperties.main) +
      '.js'
      , { cwd: rootFolder });

    if(cf.RESOURCE_NAMESPACE) {
      this._platforms[platform]._documentProperties.main = '/' + cf.RESOURCE_NAMESPACE + this._platforms[platform]._documentProperties.main
    }

    if(!this._usingDistributionStyles) {
      this._platforms[platform]._documentProperties.styles = this._platforms[platform]._documentProperties.styles.map(function(style) {
        var paths = style.split('/');
        paths[paths.length - 1] = '*.' + paths[paths.length - 1];

        if(cf.RESOURCE_NAMESPACE) {
          return '/' + cf.RESOURCE_NAMESPACE + '/' + glob.sync(paths.join('/').substr(1), { cwd: rootFolder })[0];
        }

        return '/' + glob.sync(paths.join('/').substr(1), { cwd: rootFolder })[0];
      });

      this._usingDistributionProperties = true;
    }
  }

  // Set platform variable so that .getRegions() will know which platform
  // it comes from.
  request.platform = platform;

  this._getRegions(request, response, function(regions, jsonScripts) {
    var html = _this._platforms[platform]._documentTemplate(_.extend(_this._platforms[platform]._documentProperties, {
      locale: request.cookies.locale,
      jsonScripts: jsonScripts,
      layout: _this._platforms[platform]._layoutTemplates(regions),
      modernizr: cf.RESOURCE_NAMESPACE ? '/' + cf.RESOURCE_NAMESPACE + cf.MODERNIZR : cf.MODERNIZR,
      requirejs: cf.RESOURCE_NAMESPACE ? '/' + cf.RESOURCE_NAMESPACE + cf.REQUIREJS : cf.REQUIREJS,
      platform: platform
    }));

    response.send(html);
  });
};

/**
 * Get content name
 *
 * @param {String} path
 * @api private
 */

Page.prototype._getConstructorName = function(path) {
  return _.last(path.split('/'));
};

/**
 * We want to add content to the content variable, to compile
 * the composite routers.
 *
 * @param {Object} content
 * @api private
 */

Page.prototype._addContent = function() {
  for(var i in this._latestPlatform.regions) {
    var region = this._latestPlatform.regions[i];
    var name = this._getConstructorName(region.model);

    // If content have been stored continue the loop
    if(typeof this._latestPlatform.importNames !== 'undefined'
    && this._latestPlatform.importNames.indexOf(name) !== -1) {
      continue;
    }

    var _import = {
      model: {
        name: name,
        path: region.model
      },
      view: {
        name: this._getConstructorName(region.view),
        path: region.view
      }
    };

    if(importPaths.indexOf(name) === -1) {
      imports.push(_import);
      importNames.push(name);
      importPaths.push(region.model);
    }
  }
};

Page.prototype._findPage = function(path) {
  for(var i in pages) {
    if(pages[i].path === path) {
      return pages.splice(i, 1)[0];
    }
  }

  return null;
};

/**
 * We want to add pages to the pages variable, to compile
 * the composite routers.
 *
 * @param {Object} content
 * @api private
 */

Page.prototype._addPages = function() {
  var path = this._url.substr(1);

  var page = this._findPage(path);
  if(!page) {
    page = {};
    page.path = path;
    page.platforms = {};
  }

  page.platforms[this._latestPlatformName] = {
    layout: this._latestPlatform._layout
  };

  var regions = [], views = [];
  for(var name in this._latestPlatform.regions) {
    var map = {};
    var model = this._getConstructorName(this._latestPlatform.regions[name].model);
    map['model'] = model;
    map['view'] = this._getConstructorName(this._latestPlatform.regions[name].view);
    map['region'] = name;
    map['path'] = path;
    views.push(model.toLowerCase());
    regions.push(map);
  }

  page.platforms[this._latestPlatformName].contentScript = coreTemplates['contentScript'](regions);
  page.platforms[this._latestPlatformName].renderScript = coreTemplates['renderScript'](regions);
  page.platforms[this._latestPlatformName].mapScript = coreTemplates['mapScript'](regions);
  page.platforms[this._latestPlatformName].noViewsScript = coreTemplates['noViewsScript'](views);

  pages.push(page);
};

/**
 * Export constructor
 */

module.exports = function(url) {
  return new Page(url);
};

/**
 * Create compose object
 *
 * @return {void}
 * @api public
 */

module.exports.createComposer = function() {
  var router = coreTemplates['compositeRouter']({ pages: pages, imports: imports });
  fs.writeFileSync(cf.ROOT_FOLDER + cf.COMPOSER_BUILD_PATH, router);
};

/**
 * Read template
 *
 * @exit if built files doesn't exist
 * @return {void}
 */

module.exports.readTemplates = function() {
  if(!fs.existsSync(path.join(__dirname, '../', cf.DOCUMENT_TEMPLATES + '.js'))) {
    console.log('[:(]'.red + ' Have you built your document templates yet?');
    process.exit();
  }
  if(!fs.existsSync(path.join(__dirname, '../', cf.LAYOUT_TEMPLATES + '.js'))) {
    console.log('[:(]'.red + ' Have you built your layout templates yet?');
    process.exit();
  }

  global.documentTemplates = requirejs(cf.DOCUMENT_TEMPLATES);
  global.layoutTemplates = requirejs(cf.LAYOUT_TEMPLATES);
  global.coreTemplates = requirejs(cf.CORE_TEMPLATES);
};
