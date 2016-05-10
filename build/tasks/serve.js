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

  var proxyOptionsAccessControl = function(req,res, next){
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
  };
  var proxyOptionsApiRoute = url.parse(paths.remoteAuthEndpoint +  '/api') ;
  proxyOptionsApiRoute.route = '/api';

  var proxyOptionsAuthRoute = url.parse(paths.remoteAuthEndpoint +  '/auth') ;
  proxyOptionsAuthRoute.route = '/auth';

  browserSync({
    online: false,
    open: false,
    port: process.env.PORT || 9000,
    server: {
      baseDir: ['.'],
      middleware: [
        proxyOptionsAccessControl,
        proxy(proxyOptionsApiRoute),
        proxy(proxyOptionsAuthRoute)]
    }
  }, done);
});

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
      middleware: function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});

gulp.task('serve-prod', ['export'], function() {
  connect.server({
    root: [paths.exportSrv],
    port: process.env.PORT || 9000,
    livereload: false
  });
});
