// testing event broker
var util = require("util");
var broker =require("./eventBroker");

event = broker.createEvent("first1","seans","horse");

broker.addChannel("seans");


function handler(event) {
    console.log("in the handler");
    console.log("the event is " + util.inspect(event));
}
channel = "seans";
broker.subscribe(channel,handler);
broker.subscribe(channel,handler);
broker.publish(event);