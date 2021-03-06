/**
 * Created by papostol on 05/06/2014.
 */

var _ = require("lodash");
var globs = require('globs');
var express = require('express');
var bodyParser = require('body-parser');

var Router = require("i40");
var router = new Router();

var routeGenerator = require('./lib/generator');
var routeResponder = require('./lib/responder');

var app = express();
app.use(bodyParser.json());

var options = {
  baseDir: './services',
  timeout: 0,
  cors: true,
  port: 3000,
  middleware: false
};

var fileTypes = [
    '**/*.js',
    '**/*.json'
];

var callback = function(hook, options) {
  if(!hook) hook = function (err, stdout, stderr) {
    console.log("OUT: " + stdout);
    console.log("ERR: " + stderr);
  };
  if(options.cors) {
    app.all('*', function (req, res, next) {
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Expose-Headers", "");
      res.header("Access-Control-Allow-Headers", req.headers['access-control-request-headers']);
      if (req.method === 'OPTIONS')
        res.send(200);
      else
        next();
    });
  }
  app.use(hook);
  if(!options.middleware){
    app.listen(options.port);
    console.log('Up and running! Port: ' + options.port );
  }

};

module.exports.callback = callback;

module.exports = function stubbing(opt, ok) {
  if(!ok) ok = callback;
  options = _.merge(options, opt);

  globs(fileTypes, { cwd: options.baseDir }, function fileWalker(err, files) {
      if (err) throw err;
      routeGenerator(router, files, options.baseDir);
      ok(routeResponder(router, options.timeout, options.middleware), opt);
  });
  return app;
};
