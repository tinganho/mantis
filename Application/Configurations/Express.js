
var modrewrite = require('connect-modrewrite')
  , modrewrites = require('./modrewrites')
  , path = require('path')
  , helmet = require('helmet')
  , express = require('express')
  , localeMiddleware = require('../libraries/localeMiddleware');

module.exports = function(app) {

  /**
   * General configurations
   */

  app.configure(function() {
    app.use(express.query());
    app.use(express.compress());
    app.set('port', process.env.PORT || cf.DEFAULT_PORT);
    app.set('dist', path.dirname(__dirname) === 'dist');
    app.use(helmet.xframe('SAMEORIGIN'));
    app.use(modrewrite(modrewrites));
    app.use(express.errorHandler());
    app.use(express.cookieParser());
    app.use(localeMiddleware);
    app.use('/native/platforms', express.static(path.join(__dirname, '../../', 'native/platforms')));
    app.use(express.bodyParser({ uploadDir: __dirname + cf.UPLOAD_FOLDER }));
    app.use(app.router);
  });

  /**
   * Development configurations
   */

  app.configure('development', function() {
    app.use(express.static(path.join(__dirname, '../')));
  });

  /**
   * Development and staging configurations
   */

  app.configure('development', 'staging', function() {
    app.use(express.logger('dev'));
  });

  /**
   * Staging and production configurations
   */

  app.configure('staging', 'production', function() {
    app.use(function(req, res, next) {
      if(/^\/Public|^\/Vendor/.test(req.url)) {
        res.setHeader('Cache-Control', 'public, max-age=' + cf.LONG_TIME_CACHE_LIFE_TIME/1000);
        res.setHeader('Expires', new Date(Date.now() + cf.LONG_TIME_CACHE_LIFE_TIME).toUTCString());
      }
      next();
    });
    app.use('/Public', express.static(path.join(__dirname, '../', 'Public'), { maxAge: cf.LONG_TIME_CACHE_LIFE_TIME }));
    app.use('/Vendor', express.static(path.join(__dirname, '../', 'Vendor'), { maxAge: cf.LONG_TIME_CACHE_LIFE_TIME }));
  });
};
