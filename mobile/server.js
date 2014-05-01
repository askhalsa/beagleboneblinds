//Amritpal Khalsa, CSE '15 
//297DP Spring 2014 
//askhalsa@umass.edu 
//The server file running on a Heroku server


var port = process.env.PORT || 3000;
 
var app = require('express').createServer();
var io = require('socket.io').listen(app);
 
app.listen(port);
 
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});
 
io.configure(function(){
	io.set("transports",[
		"xhr-polling",
		"websocket",
		"flashsocket",
		"jsonp-polling",
		"htmlfile"]);
	io.set("polling duration", 1000);
});
//Heroku server acts as a middle man, html website talks to Heroku server, Heroku server talks to beaglebone and vice versa
io.sockets.on("connection", function(socket){//this function defines what will happen when the Heroku server receives a signal
	socket.on("beaglebone", function(data){
	    if(data == "test"){
		io.sockets.emit("beaglebone", {"message": "Server is running!!"});
	    }
	});
	socket.on("led", function(data){//when the user clicks "open" or "close", the Heroku server 
            if(data == "on"){           //signals the beaglebone
		io.sockets.emit("beaglebone", "on");//emit is used to send out data for a certain event (beaglebone)
		}
	    else if(data == "off"){
		io.sockets.emit("beaglebone", "off");
		}            
            else {                                 //and if the user does anything besides "open" or "close", such as "set"
               io.sockets.emit("beaglebone", data);//the Heroku server will send data to the beaglebone
            }
	});
});
