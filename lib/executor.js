/**
 * Created by Paul on 6/5/2014.
 */
var logger = require('loggy');

var fs = require('fs');

function getFileName(params) {
    var file;
    switch(params.type) {
        case 'single':
            file = params.file;
            break;
        case 'loop':
            if(params.file[params.seq]) {
                file = params.file[params.seq++];
            } else {
                params.seq = 0;
                file = params.file[params.seq];
            }
            break;
        case 'stall':
            if(params.seq < params.file.length - 1) {
                file = params.file[params.seq++];
            } else {
                file = params.file[params.seq];
            }
            break;
    }
    return file;
}

module.exports.readFile = function readFile(params, ok) {
    var file = getFileName(params);

    fs.readFile(file, function (err, data) {
        if (err) {
          logger.error('         => Error: ' + err);
            ok('Error: ' + err, null)
        }
        try {
          var t = JSON.parse(""+data)
          ok(null, t);
        }
      catch (er) {
        ok(null, {});
      }

    });
};

module.exports.executeFile = function executeFile(params, req, ok) {
    var file = getFileName(params);
    try {
        var fc = require(file);
        return fc(params, req, ok);
    }
    catch(err) {
      logger.error('         => Error: ' + err);
        ok('Module execution failed!', null);
    }
};

//in case we want a proxy. A priority is needed, maybe.
function proxyRequest() {

}
