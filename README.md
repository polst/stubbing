stubbing
========

#JSON REST API from file system.

Inspired by [Stubb](https://github.com/knuton/stubb)

Compatible with browser sync.

    var api = stubbing({
      baseDir: './services',
      timeout: 0,
      cors: false,
      middleware: true
    });
    var cfg = { ... };
    cfg.middleware = function(req, res, next) {
        api(req, res, next);

    };
    return browserSync(cfg);

## command line parameters

    -p  server port
    -t  response timeout
    -d  directory where the api is defined

## option object when used as module

    {
      baseDir: 'foo',
      timeout: 0
    }

## javascript over json

If a certain JSON file must be handled, create a JS file with same name in the same directory.
The server will load the JS file and the JSON file is ignored.

The JS file should be like this:

    var fs = require('fs'),
        path = require('path');

    var file = path.resolve(__dirname,'GET.json');

    module.exports = function(params, req, ok) {
        fs.readFile(file, function (err, data) {
            if (err) {
                ok('Error: ' + err, null)
            }

            var json = JSON.parse('' + data);

            return ok(null, json);
        });
    };


so, a normal NodeJS stuff.

## Response Sequences

Yes, are present, like in Stubb link above, needs more work as there are some untreated cases.

## Stubb differences

All files must have extensions: JSON and JS.

CORS by default.

Returned headers are not configurable, yet.

Parameters for URL are defined with a `_` in front of the name, NO need for another one at the end.

## TODO

On error improve the response code. - Today the response is 500, in some cases a 404 is more appropriate.
