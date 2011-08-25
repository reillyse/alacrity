/*
Implementation of Aesop for ranking

basic structure to start with is circa 20 inputs, when we get an new one we want to recalculte the ranking and then update the redis data store
we'll end up with at least one of these per players.
Also we should be able to cope with failure and just query the values from the redis data store

I envisage that the data store has all the data stored locally we just store it to prevent having to query for it on every update

We can also distribute the aesop performance over many machines in a cluster as there is no inter-dependance between the nodes, they only rely on the event communication mechanism and on the central redis server that they update
*/

require("sys");
MEH={};
function create_meh(name,inputs,callback){
    MEH[name] = initialize(name,inputs,callback);
    return MEH[name];
}

function initialize (name,inputs,callback){
    var data = {}
    data['name']= name;
    data['inputs'] = inputs;
    data['callback'] = callback;
    console.log("assigned name as " + data['name']);
    console.log("assigned inputs to " + data['inputs']);
    return data;
}
function startMeh(name){
    meh = MEH[name];
    
}
exports.create_meh = create_meh;



