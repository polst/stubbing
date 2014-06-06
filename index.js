/**
 * Created by papostol on 05/06/2014.
 */

var _ = require("lodash");
var globs = require('globs');

var Router = require("routes");
var router = new Router();

var routeGenerator = require('./lib/generator');
var routeResponder = require('./lib/responder');

var options = {
  baseDir: 'foo',
  timeout: 0
};

var fileTypes = [
    '**/*.js',
    '**/*.json'
];

module.exports = function stubbing(opt, ok) {
  options = _.merge(options, opt);
  globs(fileTypes, { cwd: options.baseDir }, function fileWalker(err, files) {
      if (err) throw err;
      routeGenerator(router, files, options.baseDir);
      ok(routeResponder(router, options.timeout));
  });
};
