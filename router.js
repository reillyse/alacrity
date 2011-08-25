var util = require('util');
function route(handle, pathname, response, request,params) {
    console.log("Routing request for " + pathname);
    if (typeof handle[pathname] === 'function') {
	handle[pathname](response, request,params);
    } else {
	console.log("No request handler found for " + pathname);
	response.writeHead(404, {"Content-Type": "text/html"});
	response.write("404 Not found");
	response.end();
    }
}

exports.route = route;