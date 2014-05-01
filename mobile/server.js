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
 
io.sockets.on("connection", function(socket){
	socket.on("beaglebone", function(data){
	    if(data == "test"){
		io.sockets.emit("beaglebone", {"message": "Server is running!!"});
	    }
	});
	socket.on("led", function(data){
            if(data == "on"){
		io.sockets.emit("beaglebone", "on");
		}
	    else if(data == "off"){
		io.sockets.emit("beaglebone", "off");
		}            
            else {
               io.sockets.emit("beaglebone", data);
            }
	});
});
