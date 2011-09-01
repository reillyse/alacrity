var querystring = require("querystring");
var redisServer = require("./redisInterface");
var qs = require('querystring');
var util = require('util');
var rtest = require('./ranking_test');
var broker = require("./eventBroker");
var aesop  = require("./aesop");
var redis_server = require("./redisInterface");
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
	var type = parsed["type"];
    
    if(!aesop.hasMEH("player" + player)){
	console.log("can't find player meh = " + player);
	console.log("need to create a new meh");
	player_id = "player" + player;
	aesop.createMeh(player_id,[player_id + "_eats",player_id + "_kills"],aggregate_rank).player=player;
    }

	channel = "player"+ player + "_" + type;
	event= broker.createEvent("ev",channel,rank);
	event.response = response;
	console.log("about to publish");
	broker.publish(event);
    });
}

exports.getPlayerRanking = getPlayerRanking;
exports.updatePlayerRanking = updatePlayerRanking;


function aggregate_rank(event){
    console.log("aggrank called --------------- ");
    if(!this.checkInputs(event,this)){
	console.log("no rank yet");
	event.response.writeHead(200, {"Content-Type": "text/json"});
	body = JSON.stringify(-1);
	event.response.write(body);
	event.response.end();
    } else {
	console.log("updating rank");
	new_rank = 0;
	input_values = this.input_values;
	this.inputs.forEach(function(i){
	    new_rank = parseInt(new_rank) + parseInt(input_values[i]) ;
	})
	redis_server.updateRank(this.player,new_rank,event.response);
    }
    
    return true;
    
}

