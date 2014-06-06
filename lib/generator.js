var path = require('path'),
    _ = require("lodash");
var logger = require('loggy');
var methods = [
//    'OPTIONS',  //if cors is enabled doesn't reach this area, also, no response definition for it
    'GET',
//    'HEAD',    //really needed?
    'POST',
    'PUT',
    'DELETE'
];

//verify if the given word is a HTTP method
function getMethod(meth) {
    var method = meth.toUpperCase();
    if (methods.indexOf(method) === -1) {
      logger.error('Method does not exist: ' + meth);
        return '';
    } else  return method;
}

//convert path _ to url param :
function prepareParameters(segs) {
    for (var i = 0; i < segs.length; i++)
        if (segs[i][0] === '_')
            segs[i] = ':' + segs[i].substring(1);
    return segs;
}

//add prepared routes to router
function addRoutes(router, segs, params, seqNumber) {
    var routePath = '/' + segs.join('/');
    if (seqNumber > 0) {
        // when is a sequence, add only the file
        if (!_.has(router.routeMap, routePath)) {
            router.addRoute(routePath, params);
        } else {
            router.routeMap[routePath].file.push(params.file[0]);
        }
    } else {
        if (!_.has(router.routeMap, routePath)) {
            router.addRoute(routePath, params);
        }
        // force JS files over JSON
        else if(params.ext === '.js') {
            router.routeMap[routePath].fn = params;
        }
    }
}

//get a list of files and make the routes available
module.exports = function createRoutes(router, files, dir){
    _.each(files, function (file) {
        var segs = file.split('/')
            , seqNumber;

        var fileName = segs.pop(),
            ext = path.extname(fileName),
            nameSegs = path.basename(fileName, ext).split('.'),
            params = {
                file: path.resolve(dir + '/' + file),
                ext: ext,
                seq: null,
                type: 'single'
            };

        if (nameSegs.length === 1) {
            params.method = getMethod(nameSegs[0]);
        }
        else {
            var lSeg = nameSegs.pop();
            if (!_.isNaN(+lSeg)) {
                ///if is in sequence
                seqNumber = +lSeg;
                params.file = [params.file];
                params.type = seqNumber === 0 ? 'loop' : 'stall';
                params.seq = 0;//seqNumber;
                lSeg = nameSegs.pop();
            }
            segs = segs.concat(nameSegs);
            params.method = getMethod(lSeg);
        }
        addRoutes(router, prepareParameters(segs), params, seqNumber);
    });
  logger.success('Routes registered.');
//    console.dir(router.routeMap)
};