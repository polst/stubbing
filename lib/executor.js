/**
 * Created by Paul on 6/5/2014.
 */
var logger = require('./util').log;
require('json5/lib/require');
var fs = require('fs');
var _ = require('lodash');

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

module.exports.readFile = function readFile(params, req, ok) {
  var file = getFileName(params);
  try {
    var data = require(file);
    if (_.isUndefined(data)) {
      return ok('Value undefined!', null);
    }
    if (_.isFunction(data)) {
      return data(params, req, ok);
    }

    return ok(null, data);
  }
  catch(e) {
    logger.error('Error: ' + e);
    ok('Module failed!', null);
  }
};

//in case we want a proxy. A priority is needed, maybe.
function proxyRequest() {

}
