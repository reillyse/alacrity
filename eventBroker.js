/* 
   event broker
   clients can register on a channel & provide a object with a callback method
   the callbacks get called sequentially whenever we receive an event.

   going to store all the callbacks in a hash, so an array of callbacks in a hash of 
   whenever we get an event on a channel we call all the callbacks associated with it
   channels are distinct, there is no hierarchy of channels.
*/
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

// the object here has a method called callback which is called
function subscribe(channel,object){
    if (CHANNELS[channel]) {
	CHANNELS[channel].push(object);
	return true;
    } else {
	return false;
    }
}


function unsubscribe(channel,object){
    if (CHANNELS[channel]) {
	c = CHANNELS[channel].indexOf(object);
	if (c >= 0) {
	    CHANNELS[channel].splice(c,1);
	    return true;
	} 
	
    }
    console.log("cannot find channel");
    return false;
}

function publish(event){
    console.log("publishing");
    channel = event.channel;
    console.log(util.inspect(CHANNELS));
    CHANNELS[channel].forEach( 
	function (object) {
	    console.log("calling callback");
	    object.callback(event);
	}
    );
    console.log("finished publishing");
}
exports.createEvent = createEvent;
exports.addChannel = addChannel;
exports.subscribe = subscribe;
exports.publish=publish;