var redis = require("redis-node");
var client = redis.createClient();    // Create the client
var util = require("util");
client.select(4);                     // Select database 2
var main_set = "set1";
function updateRank(player,rank,response){
    console.log("updateRank+");
    console.log("setting player num = " + player + " to rank = " + rank);
    client.zadd(main_set,rank,player, function() {
	response.writeHead(200, {"Content-Type": "text/json"});
	body = JSON.stringify({'player':player , 'rank':rank});
	response.write(body);
	response.end();
    });
}


function updatePartialRank(player,rank,type){
    set = 'partial_rank_' + type;
    console.log("setting player num = " + player + " with type = " + type + " to rank = " + rank);
    client.zadd(set,parseInt(rank),player, function() {
	
	console.log("set " + set + " player " + player + " to " +rank);
    });
}

function queryRank(player,response) {
    console.log("requesting the rank of player = " + player);
    client.zrank(main_set,player,function(a,rank) {
	console.log("playerNum = " + player + " has rank " + rank);
	response.writeHead(200, {"Content-Type": "text/json"});
	response.write(JSON.stringify({'player':player , 'rank':rank}));
	response.end();
    });

}

function queryPartialScore(player,type,inputs,index,callback) {

    console.log(player + " :" + type + ": " + inputs + ": " + index);
    console.log("requesting the rank of player = " + player + " for type = " + type);
    set = 'partial_rank_' + type;
    console.log("set = " + set);
    console.log("inputs = " + util.inspect(inputs));
    client.zscore(set,player,function(a,rank) {
	console.log("playerNum = " + player + " with type = " + type + " has rank " + rank);
	console.log("inputs = " + util.inspect(inputs));
	inputs[index] = rank;
	console.log("inputs are now " + util.inspect(inputs));
	callback();
    });

}

exports.updateRank = updateRank;
exports.queryRank = queryRank;
exports.updatePartialRank = updatePartialRank;
exports.queryPartialScore =queryPartialScore;