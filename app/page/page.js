
var _ = require('underscore');

/**
 * The Page object builds up the whole html for your website.
 * You can specify boilerplate, layout, module and components to
 * customize the html you want.
 *
 * @constructor Page
 * @return {Page}
 */

function page(url) {
  this._url = url;
  this._title = '';
  this._description = '';
  this._styles = [];
  this._scripts = [];
  this._documentTmpls = documentTmpls;
  this._layoutTmpls = layoutTmpls;
  this.defaultStyle = cf.DEFAULT_STYLE;
  this.boilerplate = cf.boilerplate;

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

Page.prototype.document = function(name, opts) {
  if(typeof this._documentTmpls[name] === 'undefined') {
    throw new TypeError('document ' + name + ' does not exist');
  }

  this._documentTmpl = this._documentTmpls[name];

  // Set document properties
  if(opts.title) {
    this._title = opts.title;
  }
  if(opts.description) {
    this._description = opts.description;
  }
  if(opts.styles && _.isArray(opts.styles)) {
    this._styles = opts._styles;
  }
  if(opts.scripts && _.isArray(opts.scripts)) {
    this._scripts = opts._scripts;
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

Page.prototype.layout = function(name) {
  if(typeof this._layoutTmpls[name] === 'undefined') {
    throw new TypeError(name + ' layout doesn\'t exists');
  }

  this._layoutTmpl = this._layoutTmpls[name];

  return this;
};

/**
 *
 */

Page.prototype.modules = function(modules) {
  this._serve();
};

/**
 * Serve the page
 *
 * @return {void}
 * @api private
 */

Page.prototype._serve = function() {
  var layout = this._layoutTmpl();

  var html = this._documentTmpl({
    title : this._title,
    description : this._description,
    styles : this._styles,
    scripts : this._scripts,
    layout : layout
  });

  app.get(this._url, function(req, res) {
    res.send(html);
  });
};

/**
 * Export constructor
 */

module.exports = Page;
