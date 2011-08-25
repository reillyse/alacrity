var http = require("http");
var url = require("url");
var util = require("util");
var querystring = require("querystring");
var aesop = require("./aesop");
function start(route, handle) {
    function onRequest(request, response) {
	
	var pathname = url.parse(request.url).pathname;
	var url_parts = url.parse(request.url,true);
	var params = url_parts.query;
	console.log(params);
	switch (request.method)
	{
	case "GET":
	    route(handle,  pathname, response, request,params);
	    break;
	case "POST":

	    route(handle, pathname, response, request,params);
	    break;
	default:
	    console.log("Method not implemented: " + request.method);
	}
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;