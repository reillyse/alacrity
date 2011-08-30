// Testing Event broker
// and aesop functionality

var util = require("util");
var broker =require("./eventBroker");
var aesop = require("./aesop.js");
event = broker.createEvent("first1","seans","horse");

function me_handler(event) {
    if(!this.checkInputs(event,this)){
	return false;
    }
    console.log(this.input_values['joes'] + " " + this.input_values['seans']);    
    return 1;
}

channel = "seans";
channel2 = "joes";
inputs = [channel,channel2];

aesop.createMeh("first_meh",inputs,me_handler);
aesop.start("first_meh");

broker.publish(event);
event2 = broker.createEvent("second1","joes","cow");
broker.publish(event2);

channel3= "socks";
inputs2 = [channel3];

function second_handler(event){
    if(!this.checkInputs(event,this)){
	return false;
    }
    console.log("result of meh is ..");
    console.log(this.input_values['socks']);
}
aesop.createMeh("second_meh",inputs2,second_handler);
aesop.start("second_meh");
event3 = broker.createEvent("new_event","socks","paisely");
broker.publish(event3);
