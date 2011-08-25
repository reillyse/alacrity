// event broker
// clients can register on a channel & provide a callback
// the callbacks get called sequentially whenever we receive an event.

// going to store all the callbacks in a hash, so an array of callbacks in a hash of 
// whenever we get an event on a channel we call all the callbacks associated with it
var util = require("util");

CHANNELS = {};

function createEvent(name,channel,payload){
    console.log("event created with name  = " + name + " and channel = " + channel + " with a payload = " + payload );
    var event = {};
    event['name'] = name;
    event['channel'] = channel;
    event['payload'] = payload;
    addChannel(channel);
    return event;
}

function addChannel(name){
    if (CHANNELS[name]) {
	console.log("channel already defined");
	return false;
    } else {
	console.log("adding channel " + name);
	CHANNELS[name] = [];
	return true;
    }
}

function subscribe(channel,callback){
    if (CHANNELS[channel]) {
	CHANNELS[channel].push(callback);
	return true;
    } else {
	return false;
    }
}


function unsubscribe(channel,callback){
    if (CHANNELS[channel]) {
	c = CHANNELS[channel].indexOf(callback);
	if (c >= 0) {
	    CHANNELS[channel].splice(c,1);
	    return true;
	} 
	
    }
	return false;
}

function publish(event){
    channel = event.channel;
    console.log(util.inspect(CHANNELS[channel]));
    CHANNELS[channel].forEach( 
	function (handler) {
	handler(event);
      }
    );
}
exports.createEvent = createEvent;
exports.addChannel = addChannel;
exports.subscribe = subscribe;
exports.publish=publish;