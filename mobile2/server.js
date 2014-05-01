var io = require('socket.io-client'),
	socket = io.connect('http://polar-thicket-8413.herokuapp.com/');
var a = require('bonescript');
var b = require('bonescript');
var c = require('bonescript');
var blindOpen = new Boolean();
var timeout;

a.pinMode("P8_10", 'out');
b.pinMode("P8_12", 'out');
c.pinMode("P8_14", 'out');
blindOpen = true;//always start out as open 
socket.on("beaglebone", function (data) {
	if(data == "on" && blindOpen == false){
		a.digitalWrite("P8_10", 1);
		b.digitalWrite("P8_12", 1);
		setTimeout(function(){b.digitalWrite("P8_12", 0);a.digitalWrite("P8_10", 0);},1600);
		blindOpen = true;
	}else if(data == "off" && blindOpen == true){
        	a.digitalWrite("P8_10", 1);
        	c.digitalWrite("P8_14", 1);
		setTimeout(function(){c.digitalWrite("P8_14", 0);a.digitalWrite("P8_10", 0);},1000);
		blindOpen = false;
	}else if (data != "off" && data != "on"){
  		console.log(data);
		clearTimeout(timeout);
		var h = parseInt(data)/60;
	        var m = parseInt(data)%60;
		var now = new Date();
		var t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(h), m, 0, 0) - now;
		if (t < 0) {
		     t += 86400000; 
		}
			
		timeout = setTimeout(function(){
		
		if(blindOpen == false){
	                a.digitalWrite("P8_10", 1);
	                b.digitalWrite("P8_12", 1);
        	        setTimeout(function(){b.digitalWrite("P8_12", 0);a.digitalWrite("P8_10", 0);},1600);
	                blindOpen = true;
       		 }else {
        	        a.digitalWrite("P8_10", 1);
        	        c.digitalWrite("P8_14", 1);
        	        setTimeout(function(){c.digitalWrite("P8_14", 0);a.digitalWrite("P8_10", 0);},1000);
        	        blindOpen = false;
	}}, t);
	}

});
