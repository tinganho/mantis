
module.exports = function(app) {
  app.configure(function() {
    app.use(express.query());
    app.use(express.compress());
    app.set('port', process.env.PORT || 3000);
    app.set('dist', path.dirname(__dirname) === 'dist');
    app.use(express.favicon(cf.FAVICON, { maxAge: 2592000000 }));
    app.use(helmet.xframe('SAMEORIGIN'));
    app.use(modrewrite(modrewriteConfigs));
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
    app.use(express.cookieParser());
    app.use(express.bodyParser({ uploadDir: __dirname + '/public/uploads' }));
    // Translation
    app.use(gtMiddleware);
    // Static
    app.use(app.router);
  });

  /**
   * Development configurations
   */

  app.configure('development', function() {
      app.use(express.static(__dirname + '/'));
  });

  /**
   * Staging and production configurations
   */

  app.configure(['staging', 'production'], function() {
    app.use(function(req, res, next) {
      if(/^\/public/.test(req.url)) {
        res.setHeader('Cache-Control', 'public, max-age=' + cf.LONG_TIME_CACHE_LIFE_TIME/1000);
        res.setHeader('Expires', new Date(Date.now() + cf.LONG_TIME_CACHE_LIFE_TIME).toUTCString());
      }
      next();
    });
    app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: cf.LONG_TIME_CACHE_LIFE_TIME }));
    app.use('/vendor', express.static(path.join(__dirname, 'vendor'), { maxAge: cf.LONG_TIME_CACHE_LIFE_TIME }));
  });
};
