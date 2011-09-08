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
    console.log("the player is " + player );
    redisServer.queryRank(player,response); 
   }

// this is a post request
// perhaps should be a PUT, but because it is updating on a subset of the resource it should probably remain a POST

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
    

	check_for_values(response,player, type,process_event,rank)

   });
    
}

function check_for_values(response,player,type,callback,rank) {
  if(!aesop.hasMEH("player" + player)){
      console.log("can't find player meh = " + player);
      console.log("need to create a new meh");
      player_id = "player" + player;
      inputs = [player_id + "_eats",player_id + "_kills"];
      meh = aesop.createMeh(player_id,inputs,aggregate_rank);
      meh.player = player;
      aesop.getInitialValuesFromDataStore(meh.input_values,inputs,player,callback,response,type,rank);
  } else {
      callback(response,player,type,rank);
  }
}

function process_event(response,player,type,rank){
	channel = "player"+ player + "_" + type;
	event= broker.createEvent("ev",channel,rank);
	event.player = player;
	event.response = response;
	console.log("about to publish");
	broker.publish(event);
 
}


exports.getPlayerRanking = getPlayerRanking;
exports.updatePlayerRanking = updatePlayerRanking;


function aggregate_rank(event){
    console.log("aggrank called --------------- ");
    if(!this.checkInputs(event,this)){
	console.log("not enough ranks yet");
	event.response.writeHead(200, {"Content-Type": "text/json"});
	body = JSON.stringify({'rank':-1});
	event.response.write(body);
	event.response.end();
    } else {
	console.log("updating rank");
	new_rank = 0;
	input_values = this.input_values;
	for ( i in inputs ) { 
	    new_rank = parseInt(new_rank) + parseInt(input_values[i]) ;
	}
	console.log("end of aggrank ");
	redis_server.updateRank(this.player,new_rank,event.response);
    }
    
    return true;
    
}

