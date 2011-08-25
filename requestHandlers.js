var querystring = require("querystring");
var redisServer = require("./redisInterface");
var qs = require('querystring');
var util = require('util');

//this is a get request

function getPlayerRanking(response, request,params) {
    player = params.playerNum;
    redisServer.queryRank(player,response);    
}

// this is a post request

function updatePlayerRanking(response, request) {
    console.log("updatePlayerRanking");
    var postData = "";
    request.setEncoding("utf8");
    
    request.addListener("data", function(postDataChunk) {
	postData += postDataChunk;
	console.log("Received POST data chunk '"+ postDataChunk + "'.");
    });
    
    request.addListener("end", function() {
	console.log(postData);
	var parsed = qs.parse(postData);
	var player = parsed["playerNum"];
	var rank = parsed["rank"];
	redisServer.updateRank(player,rank,response);
    });
    }

exports.getPlayerRanking = getPlayerRanking;
exports.updatePlayerRanking = updatePlayerRanking;

