/*

  Implementation of Aesop for ranking

  basic structure to start with is circa 20 inputs, when we get an new one we want to recalculte the ranking and then update the redis data store
  we'll end up with at least one of these per players.

  Also we should be able to cope with failure and just query the values from the redis data store

  I envisage that the data store has all the data stored locally we just store it to prevent having to query for it on every update

  We can also distribute the aesop performance over many machines in a cluster as there is no inter-dependance between the nodes, they only rely on the event communication mechanism and on the central redis server that they update
*/
var eventBroker = require("./eventBroker");
var redis_server = require("./redisInterface");
var async = require("async");
var util  = require("util");
require("sys");
MEH={};
function hasMEH(name){
    return MEH[name];
}
// use this to persist the event changes to the db
function store_in_redis(){
    player = event.player;
    rank = event.payload;
    type = event.channel;  // this is unique per type/player combo
 //   response = event.response;
    redis_server.updatePartialRank(player,rank,type);
}

//inputs is a list of channels to susbcribe to 
function createMeh(name,inputs,callback){
    MEH[name] = initialize(name,inputs,callback);
//    getInitialValuesFromDataStore(input_values,inputs,player);
    return MEH[name];
}

function initialize (name,inputs,callback){
    var data = {}
    data['checkInputs']= checkInputs;
    data['name']= name;
    data['inputs'] = inputs;
    // this is a value array the size of the inputs
    data['input_values'] = [];
    // initialise all the values for the inputs to undefined
    for (c in inputs) {
	data['input_values'][c] = undefined;
    }
    data['callback'] = callback;
    console.log("assigned name as " + data['name']);
    console.log("assigned inputs to " + data['inputs']);
    inputs.forEach(function(i) {
	eventBroker.addChannel(i);
	eventBroker.subscribe(i,data);
	eventBroker.subscribe(i,{callback:store_in_redis});
    }); 
    return data;
}
function getInitialValuesFromDataStore(input_values,inputs,player,callback,response,type,rank){
    console.log("getInitialValuesFromDataStore+");
    console.log("the values arriving in getInitial are " + util.inspect(input_values));
    func_array = [];

    for (var i =0 ; i< inputs.length; i++) {

	if(input_values[i] === undefined){
	    (function(){


	    var keep_index = i;
	    var type = inputs[keep_index];
		func_array.push(function (callback){ redis_server.queryPartialScore(player,type,input_values,keep_index,callback)});
	    })();
	}
    }



    async.parallel(func_array,function(err,results) { callback(response,player,type,rank)});

}
//this is looking like its redundant
function startMeh(name){
    meh = MEH[name];
    meh.started = true;
}

function checkInputs(event,meh){
    meh.input_values[event.channel] = event.payload;
    var halt = false;
    for (i in meh.inputs){
	if(typeof(meh.input_values[i]) === undefined){
	    console.log("we don't have a value for channel = " + i);
	    halt  = true;
	}
    }
    if (halt) {
	console.log("not enough inputs");
	return false;
	
    }
    return true;
}

exports.createMeh = createMeh;
exports.start = startMeh;
exports.hasMEH = hasMEH;
exports.getInitialValuesFromDataStore = getInitialValuesFromDataStore;
