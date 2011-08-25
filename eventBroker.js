// event broker
// clients can register on a channel & provide a callback
// the callbacks get called sequentially whenever we receive an event.

// going to store all the callbacks in a hash, so an array of callbacks in a hash of 
// whenever we get an event on a channel we call all the callbacks associated with it

CHANNELS = {};

function add_channel(name){
    if (CHANNELS[name]) {
	console.log("channel already defined");
	return false;
    } else {
	console.log("adding channel " + name);
	CHANNELS[name] = [];
    }
}

function add_callbacks(channel,callback){
    if(CHANNEL[channel]) {
	CHANNEL[channel].append(callback);
	return true;
    } else {
	return false;
    }
}
function fire(event){

    channel = event.channel;
    for (c in CHANNEL[channel]) {
	c();
    }
}