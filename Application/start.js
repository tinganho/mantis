
/**
 * Set inServer and inClient globals
 */

global.inServer = true;
global.inClient = false;

/**
 * Environmental vars dependencies
 */

if(!process.env.NODE_ENV) {
  console.log('[' + ':('.red + ']' + ' You forgot to set your environmental variable NODE_ENV?'.yellow);
  process.kill();
}
else if(!/development|staging|production/.test(process.env.NODE_ENV)) {
  console.log('[' + ':('.red + ']' + ' NODE_ENV must have the value development|staging|production'.yellow);
  process.kill();
}

/**
 * Set ENV
 */

var ENV;
switch(process.env.NODE_ENV) {
  case 'development':
    ENV = 'DEV';
    break;
  case 'staging':
    ENV = 'STAG';
    break;
  case 'production':
    ENV = 'PROD';
    break;
  default:
    ENV = 'DEV';
    break;
}
global.ENV = ENV;

/**
 * Set distribution mode
 */

var paths = __dirname.split('/');
global.inDistribution = paths[paths.length - 1] === 'distribution';

/**
 * Set root folder
 */

global.rootFolder = __dirname;

/**
 * Requirejs.
 */

var requirejs = require('requirejs');

/**
 * Requirejs config.
 */

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require
});

global.requirejs = requirejs;

/**
 * Configurations.
 */

global.cf = require('./configurations/server')

/**
 * Module dependencies.
 */

var fs = require('fs')
  , requirejs = require('requirejs')
  , http = require('http')
  , path = require('path')
  , cluster = require('cluster')
  /*jshint unused:false */
  , helmet = require('helmet')
  , autoRoute = require('autoroute')
  , autoRoutes = require('./configurations/autoRoutes')
  , configuration = require('./core/configuration')
  , configure = require('./configurations/express')
  , page = require('./Core/Page')
  , readTemplates = page.readTemplates
  , createComposer = page.createComposer;


/**
 * Define cluster
 */

var numCPUs = require('os').cpus().length;
http.globalAgent.maxSockets = cf.MAX_SOCKETS;

if(cluster.isMaster && process.env.NODE_ENV === 'production') {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
}
else {

  /**
   * Content templates
   */

  global.content_appTemplates = requirejs('./public/templates/content/templates');

  /**
   * Read document and layout templates
   */

  readTemplates();

  /**
   * Create necessary folders
   */

  fs.mkdir(cf.ROOT_FOLDER + cf.UPLOAD_FOLDER, function(error) {});
  fs.mkdir(cf.ROOT_FOLDER + cf.TEMPORARY_FOLDER, function(error) {});

  /**
   * Set global `requireLocale`
   */

  configuration.setRequireLocale();

  /**
   * Set client configuration mapping
   */

  configuration.setClientConfigurationMappings();

  /**
   * Write client config file
   */

  configuration.writeClientConfigurations();

  /**
   * App namespace.
   */

  global.app = require('./Core/Application');

  /**
   * Add default security
   */

  helmet.defaults(app, { xframe: false, csp: false });

  /**
   * App configuration.
   */

  configure(app);

  /**
   * Autoroute.
   */

  autoRoute(autoRoutes, app);

  /**
   * Pages
   */

  require('./Pages/RollingNumbers')(page);

  /**
   * Create composer object.
   */

  createComposer();

  /**
   * Server start.
   */

  http.createServer(app).listen(app.get('port'), function() {
    console.log('[%s] Express app listening on port ' + app.get('port'), process.pid);
  });

  /**
   * Set process title
   */

  process.title = cf.PROCESS_TITLE;

  /**
   * Export app.
   */

  module.exports = app;

}

