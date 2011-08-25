Alacrity: a high performance real-time ranking server
=====================================================

What is it for?

Its a server that provides ranking functionality for a large group of players. It is primarily designed for online games that might need to record the scores of their users and provide this in real-time to them. The various instances of the game update the server whenever a ranking changes. The rankings are then calculated and saved. When a ranking is required the server is queried and the rank of a player or a particular range is returned. It is designed for a large number of players who perform frequent actions that change their ranking and need to view the ranking in real-time.

How is it made ?

The basic server is written in node.js communicating with a redis backend.

How do I connect with it

two features are provided at present

a POST to 
http://localhost:8888/updatePlayerRanking with post data containing "playerNum=xx&rank=xx" updates the ranking 
while a GET from 
http://localhost:8888/getPlayerRanking?playerNum=xx
returns the current ranking of the player

external dependencies
redis-node
querystring

an installed redis server on the localhost 


to contact the author: reillyse@gmail.com
