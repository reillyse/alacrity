// testing event broker
var util = require("util");
var broker =require("./eventBroker");
var aesop = require("./aesop.js");
event = broker.createEvent("first1","seans","horse");




function handler(event) {
    console.log("in the handler");
    console.log("the event is " + util.inspect(event));
}
function handler2(event) {
    console.log("in the second handler");
    console.log("the event is " + util.inspect(event));
}
function me_handler(meh) {
    console.log("in the MEH handler");
    console.log("the meh is " + util.inspect(meh));
}

channel = "seans";
broker.subscribe(channel,handler);
broker.subscribe(channel,handler2);
broker.publish(event);
inputs = ["seans"];

aesop.createMeh("first1",inputs,me_handler);
aesop.start("first1");

broker.publish(event);