var server = require("./server");
var router = require("./router");
var Meh = require("./aesop");
var requestHandlers = require("./requestHandlers");
var handle = {}
handle["/getPlayerRanking"] = requestHandlers.getPlayerRanking;
handle["/updatePlayerRanking"] = requestHandlers.updatePlayerRanking;

meh = Meh.create_meh("some_name","some_inputs");
server.start(router.route,handle);
