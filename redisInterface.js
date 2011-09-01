var redis = require("redis-node");
var client = redis.createClient();    // Create the client
client.select(4);                     // Select database 2

function updateRank(player,rank,response){
    console.log("setting player num = " + player + " to rank = " + rank);
    client.zadd('set1',parseInt(rank),player, function() {
	response.writeHead(200, {"Content-Type": "text/json"});
	body = JSON.stringify({'player':player , 'rank':rank});
	response.write(body);
	response.end();
    });
}

function queryRank(player,response) {
    console.log("requesting the rank of player = " + player);
    client.zrank('set1',player,function(a,rank) {
	console.log("playerNum = " + player + " has rank " + rank);
	response.writeHead(200, {"Content-Type": "text/json"});
	response.write(JSON.stringify({'player':player , 'rank':rank}));
	response.end();
    });

}
exports.updateRank = updateRank;
exports.queryRank = queryRank;