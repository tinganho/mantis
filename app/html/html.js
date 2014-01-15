
/**
 * The html object builds up the whole html for your website.
 * You can specify boilerplate, layout, module and components to
 * customize the html you want.
 *
 * @constructor Html
 */

function Html() {
  this.html = '';
  this.styles = '';
  this.defaultStyle = cf.DEFAULT_STYLE;
  this.boilerplate = cf.boilerplate;
}

/**
 *
 *
 */

Html.prototype.withDocument = function(name, opts) {
  if(typeof this.boilerplates[name] === 'undefined') {
    throw new TypeError('boilerplate ' + name + ' does not exist');
  }

  this._addStyle(this.defaultStyle);

  // Title
  if(opts.title) {
    this._setTitle(opts.title);
  }
  else {
    this._setTitle('');
  }

  // Description
  if(opts.description) {
    this._setDescription(opts.description);
  }
  else {
    this._setDescription('');
  }
};

/**
 * Add style to current html
 *
 * @param {String} href
 * @return {void}
 * @api private
 */

Html.prototype._addStyle = function(href) {
  if(typeof href !== 'string') {
    throw new TypeError('first parameter must be string to a CSS resource');
  }

  this.styles += this.boilerplate.style({
    href : href
  });
};

/**
 * Set web page title
 *
 * @param {String} title
 * @return {void}
 * @api private
 */

Html.prototype._setTitle = function(title) {
  this.title = this.boilerplate.title({
    title : title
  });
};

/**
 * Set web page description
 *
 * @param {String} title
 * @return {void}
 * @api private
 */

Html.prototype._setDescription = function(description) {
  this.description = this.boilerplate.description({
    description : description
  });
};

Html.prototype.withLayout = function(name, opts) {

};

Html.prototype.withModule = function(name, opts) {

};

Html.prototype.withComponents = function() {

};
