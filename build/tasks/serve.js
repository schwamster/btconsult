var gulp = require('gulp');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');
var proxy = require('proxy-middleware');
var url = require('url');
var paths = require('../paths');

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {

  browserSync({
    online: false,
    open: false,
    port: process.env.PORT || 9000,
    server: {
      baseDir: ['.'],
      middleware: getMiddleware()
    }
  }, done);
});

function getMiddleware()
{
  var proxyOptionsAccessControl = function(req,res, next){
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
  };

  var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  var proxyUrl =  paths.localAuthEndpoint;
  if(env == 'production')
  {
    var proxyUrl =  paths.remoteAuthEndpoint;
  }


  var proxyOptionsApiRoute = url.parse(proxyUrl +  '/api') ;
  proxyOptionsApiRoute.route = '/api';

  var proxyOptionsAuthRoute = url.parse(proxyUrl +  '/auth') ;
  proxyOptionsAuthRoute.route = '/auth';

  var middleware = [proxyOptionsAccessControl,  proxy(proxyOptionsApiRoute),  proxy(proxyOptionsAuthRoute)];

  return middleware;
}

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve-bundle', ['bundle'], function(done) {
  browserSync({
    online: false,
    open: false,
    port: process.env.PORT || 9000,
    server: {
      baseDir: ['.'],
      middleware: getMiddleware()
    }
  }, done);
});

gulp.task('serve-prod', ['export'], function() {
  connect.server({
    root: [paths.exportSrv],
    port: process.env.PORT || 9000,
    // middleware: getMiddleware(),
    livereload: false
  });
});
