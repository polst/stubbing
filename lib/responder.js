/**
 * Created by Paul on 6/5/2014.
 */
var exec = require('./executor'),
  timeout,
  router,
  middleware;
var logger = require('./util').log;

function timeoutResponse(res, data, next) {
  setTimeout(function() {
    logger.success('Sent: ' + res.req.url);
      res.json(data);
    return next();
  },timeout);
}

function errorResponse(res, err, next) {
  logger.error(err);
  if(!middleware) res.send(500, err);
  else next();
}

function setServerResponse(req, res, next) {
  var error = null;
  //    var urlPath = req.path;
  //    var urlMethod = req.method;
  //    var urlParams = req.query;
  var route = router.match(req.path);
  if (route) {
    while (route.fn.method !== req.method) {
      route = route.next();
      if (!route) {
        error = 'Route METHOD not found!';
        break;
      }
    }
  }
  else {
    error = 'Route not found! ' + req.path;
  }
  if (error) {
    errorResponse(res, 'Doh: Route not found => ' + req.method + ': ' + req.path, next);
  }

  else {
    logger.info('Found route: ' + route.route + ' => ' +JSON.stringify(route.fn));
    exec.readFile(route.fn, req, function (error, data) {
      if (error) return errorResponse(res, error, next);
      return timeoutResponse(res, data, next);
    });
  }

}

module.exports = function responder(r, t, m) {
  router = r;
  timeout = t;
  middleware = m;
  return setServerResponse;
}
