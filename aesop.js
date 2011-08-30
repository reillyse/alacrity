/*

  Implementation of Aesop for ranking

  basic structure to start with is circa 20 inputs, when we get an new one we want to recalculte the ranking and then update the redis data store
  we'll end up with at least one of these per players.

  Also we should be able to cope with failure and just query the values from the redis data store

  I envisage that the data store has all the data stored locally we just store it to prevent having to query for it on every update

  We can also distribute the aesop performance over many machines in a cluster as there is no inter-dependance between the nodes, they only rely on the event communication mechanism and on the central redis server that they update
*/
var eventBroker = require("./eventBroker");

require("sys");
MEH={};
//inputs is a list of channels to susbcribe to 
function createMeh(name,inputs,callback){
    MEH[name] = initialize(name,inputs,callback);
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
    inputs.forEach(function(c){
	data['input_values'][c] = undefined;
    });
    data['callback'] = callback;
    console.log("assigned name as " + data['name']);
    console.log("assigned inputs to " + data['inputs']);
    inputs.forEach(function(i) {
	eventBroker.addChannel(i);
	eventBroker.subscribe(i,data);
    }); 
    return data;
}

//this is looking like its redundant
function startMeh(name){
    meh = MEH[name];
    meh.started = true;
}

function checkInputs(event,meh){
    meh.input_values[event.channel] = event.payload;
    var halt = false;
    meh.inputs.forEach(function(i){
	if(typeof(meh.input_values[i]) == 'undefined'){
	    console.log("we don't have a value for channel = " + i);
	    halt  = true;
	}
    });
    if (halt) {
	console.log("not enough inputs");
	return false;
	
    }
}

exports.createMeh = createMeh;
exports.start = startMeh;


