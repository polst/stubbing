/**
 * Created by Paul on 6/5/2014.
 */
var exec = require('./executor'),
    timeout,
    router;
var logger = require('loggy');

function timeoutResponse(res, data) {
    setTimeout(function() {
      logger.info('         => Sent: ' + res.req.url);// + JSON.stringify(data));//.replace(/\r/g, "").replace(/\n/g, "")
        res.json(data);
    },timeout);
}

function errorResponse(res, err) {
  logger.error('         => Error: ' + err);
    res.send(500, err);
}

function setServer(req, res) {
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
      errorResponse(res, 'Doh: ' + error);
    }
    else {
      logger.info(' => ' + route.route + ' => ' +JSON.stringify(route.fn));
        switch (route.fn.ext) {
            case '.js':
                exec.executeFile(route.fn, req, function(error, data) {
                    if(error) return errorResponse(res, error);
                    return timeoutResponse(res, data);
                });
                break;
            case '.json':
                exec.readFile(route.fn, function (error, data) {
                    if (error) return errorResponse(res, error);
                    return timeoutResponse(res, data);
                });
                break;
        }
    }
}

module.exports = function responder(r, t) {
    router = r;
    timeout = t;
    return setServer;
}