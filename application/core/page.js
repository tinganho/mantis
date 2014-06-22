
/**
 * Module dependencies
 */

var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , _Model = requirejs('libraries/Model')
  , _Collection = requirejs('libraries/Collection')
  , glob = require('glob')
  , isArray = require('../libraries/isArray')
  , importNames = []
  , imports = []
  , pages = [];

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

  this._platform = cf.DEFAULT_PLATFORM;

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
  this._platform = platform;

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

  this._documentTemplates = this._documentTemplates[name];

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
  properties.configurations = properties.configurations.map(function(configuration) {
    return '/' + cf.CLIENT_CONFIGURATIONS_BUILD + '/'  + cf.CLIENT_CONFIGURATIONS_MAP[configuration] + '.js';
  });

  this._documentProperties = properties;

  if(typeof properties.title === 'string') {
    this._documentProps.renderedTitle = properties.title;
  }
  if(typeof properties.description === 'string') {
    this._documentProps.renderedDescription = properties.description;
  }
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

  this._layout = name;

  this._layoutTemplates = this._layoutTemplates[name];

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
  this.regions = regions;
  this._serve();
  this.error = this._defaultErrorHandler

  return this;
};

/**
 * Get content
 *
 * @param {Function} callback
 * @return {void}
 * @api private
 */

Page.prototype._getRegions = function(request, response, callback) {
  var n = 0, regions = {}, _this = this, size = _.size(this.regions)
    , jsonScripts = '';

  if(size === 0) {
    return callback(regions, '');
  }

  for(var name in this.regions) {
    if(!this.regions[name].model) {
      throw new TypeError('name `' + name + '` doesn\'t have a model');
    }
    if(!this.regions[name].view) {
      throw new TypeError('name `' + name + '` doesn\'t have a view');
    }

    var Model = require('../' + this.regions[name].model)
      , View = require('../' + this.regions[name].view);

    if(!Model.prototype.fetch) {
      throw new TypeError(this.regions[name].model + ' is not an instance of Model or Collection');
    }

    var model = new Model
      , view = new View(model);

    model.sync = function(method, model, options) {
      Model.prototype.sync.call(this, method, model, options, request);
    };


    (function(name, view, Model, View) {

      try {
        model.fetch({
          success : function() {
            view = new View(model);
            regions[name] = view.toHTML();

            if(typeof model.page.title === 'string'
            && model.page.title.length > 0
            && typeof _this._documentProperties.title !== 'string') {
              _this._documentProperties.renderedTitle = model.page.title;
            }
            if(typeof model.page.description === 'string'
            && model.page.description.length > 0
            && typeof _this._documentProperties.description !== 'string') {
              _this._documentProperties.renderedDescription = model.page.description;
            }

            // Push json scripts
            jsonScripts += coreTemplates.jsonScript({
              name : _this.regions[name].model.split('/')[2].toLowerCase(),
              json : JSON.stringify(model.toJSON())
            });

            n++;
            if(n === size) {
              callback(regions, jsonScripts);
            }
          },

          // The backbone takes in argument  model, response and options
          // We send in the error object in the middle argument. So we rename
          // response to error instead.
          error : function(model, error, options) {
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

    })(name, view, Model, View);
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
 * Serve the page
 *
 * @return {void}
 * @api private
 */

Page.prototype._serve = function() {
  var _this = this;
  this._addContent();
  this._addPages();
  app.get(this._url, _this._next);
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
  var forcedPlatform = request.param('platform');
  var definedWebView = cf.WEB_VIEW_DETECT.exec(this._platform);
  if(definedWebView && definedWebView.length >= 1) {
    definedWebView = definedWebView[1];
    var requestedWebView = cf.WEB_VIEW_DETECT.exec(request.headers['host']);
    if(requestedWebView && requestedWebView.length >= 1) {
      requestedWebView = requestedWebView[1];
      if(definedWebView !== requestedWebView) {
        var forcedWebView = cf.WEB_VIEW_DETECT.exec(forcedPlatform);
        if(forcedWebView && forcedWebView.length >= 1) {
          forcedWebView = forcedWebView[1];
          if(forcedWebView !== definedWebView) {
            return false;
          }
        }
        else {
          return false;
        }
      }
    }
    else {
      var forcedWebView = cf.WEB_VIEW_DETECT.exec(forcedPlatform);
      if(forcedWebView && forcedWebView.length >= 1) {
        forcedWebView = forcedWebView[1];
        if(forcedWebView !== definedWebView) {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }

  return true;
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
  if(this._platform === 'mobile') {
    var userAgent = request.headers['user-agent'];
    if(!(cf.MOBILE_DEVICE_DETECT_1.test(userAgent) || cf.MOBILE_DEVICE_DETECT_2.test(userAgent.substr(0,4)))) {
      if(!forcedPlatform || forcedPlatform !== 'mobile') {
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
  var _this = this;

  // Mobile platform check.
  if(!this._isMobilePageRequest(request)) {
    return next();
  }

  // Webview platform check.
  if(!this._isWebViewPageRequest(request)) {
    return next();
  }

  // If in a distribution use minified/uglified scripts
  if(inDistribution && !this._usingDistributionProperties) {
    _this._documentProperties.main = '/' + glob.sync(
      cf.DISTRIBUTION_MAIN_FOLDER +
      '/*.' +
      path.basename(_this._documentProperties.main) +
      '.js'
      , { cwd: rootFolder });

    if(!this._usingDistributionStyles) {
      _this._documentProperties.styles = _this._documentProperties.styles.map(function(style) {
        var paths = style.split('/');
        paths[paths.length - 1] = '*.' + paths[paths.length - 1];

        return '/' + glob.sync(paths.join('/').substr(1), { cwd: rootFolder })[0];
      });

      this._usingDistributionProperties = true;
    }
  }

  this._getRegions(request, response, function(regions, jsonScripts) {
    var html = _this._documentTemplates(_.extend(_this._documentProperties, {
      title: _this._documentProperties.renderedTitle,
      description: _this._documentProperties.renderedDescription,
      locale: request.cookies.locale,
      jsonScripts: jsonScripts,
      layout: _this._layoutTemplates(regions),
      modernizr: cf.MODERNIZR,
      requirejs: cf.REQUIREJS,
      platform: _this._platform
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
 * We want to add content to the content varaiable, to compile
 * the composite routers.
 *
 * @param {Object} content
 * @api private
 */

Page.prototype._addContent = function() {
  for(var i in this.regions) {
    var region = this.regions[i];
    var name = this._getConstructorName(region.model);

    // If content have been stored continue the loop
    if(importNames.indexOf(name) !== -1) {
      continue;
    }

    var _import = {
      model : {
        name : name,
        path : region.model
      },
      view : {
        name : this._getConstructorName(region.view),
        path : region.view
      }
    }
    imports.push(_import);
    importNames.push(name);
  }
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
  var page = {
    path : path,
    layout : this._layout
  };
  var regions = [], views = [];
  for(var name in this.regions) {
    var map = {};
    var model = this._getConstructorName(this.regions[name].model);
    map['model'] = model;
    map['view'] = this._getConstructorName(this.regions[name].view);
    map['region'] = name;
    map['path'] = path;
    views.push(model.toLowerCase());
    regions.push(map);
  }
  page.contentScript = coreTemplates['contentScript'](regions);
  page.renderScript = coreTemplates['renderScript'](regions);
  page.mapScript = coreTemplates['mapScript'](regions);
  page.noViewsScript = coreTemplates['noViewsScript'](views);
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
  var router = coreTemplates['compositeRouter']({ pages : pages, imports : imports });
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
