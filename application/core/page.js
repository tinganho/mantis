
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

  _.bindAll(this, '_next');

  return this;
}

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
    return cf.CLIENT_CONFIGURATIONS_BUILD + '/'  + cf.CLIENT_CONFIGURATIONS_MAP[configuration] + '.js';
  });
  this._documentProps = properties;
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

  return this;
};

/**
 * Get content
 *
 * @param {Function} callback
 * @return {void}
 * @api private
 */

Page.prototype._getRegions = function(callback, req) {
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

    model.sync = function(method, model, opts) {
      Model.prototype.sync.call(this, method, model, opts, req);
    };

    try {
      model.fetch({
        success : function() {
          view = new View(model)
          regions[name] = view.toHTML();

          if(typeof model.page.title === 'string' && model.page.title.length > 0) {
            _this._documentProps.title = model.page.title;
          }
          if(typeof model.page.description === 'string' && model.page.description.length > 0) {
            _this._documentProps.description = model.page.description;
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
        error : this.fail
      });
    }
    catch(err) {
      if(err.message === 'A "url" property or function must be specified') {
        regions[name] = view.toHTML();
        n++;
        if(n === size) {
          callback(regions, jsonScripts);
        }
      }
      else {
        throw err;
      }
    }
  }
};

/**
 * If something fails it will be forwarded to this callback
 *
 * @callback
 */

Page.prototype.handleErrorsUsing = function(callback) {
  this.error = callback;
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
 * Next callback
 */

Page.prototype._next = function(req, res) {
  var _this = this;

  var webView = cf.WEB_VIEW_DETECT.exec(req.headers['host']);
  if(webView && webView.length) {
    webView = webView[1];
  }

  this._getRegions(function(regions, jsonScripts) {
    var html = _this._documentTemplates({
      title : _this._documentProperties.title,
      description : _this._documentProperties.description,
      configurations : _this._documentProps.configurations,
      locale : req.cookies.locale,
      styles : _this._documentProperties.styles,
      main : _this._documentProperties.main,
      jsonScripts : jsonScripts,
      layout : _this._layoutTemplates(regions),
      modernizr : cf.MODERNIZR,
      requirejs : cf.REQUIREJS,
      webView : webView
    });

    res.send(html);
  }, req);
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
