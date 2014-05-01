//Amritpal Khalsa, CSE '15 
//297DP Spring 2014 
//askhalsa@umass.edu 
//The server file running on the beaglebone
//be sure to synchronize the beaglebone by running "sudo ntpdate pool.ntp.org"
var io = require('socket.io-client'),
	socket = io.connect('http://polar-thicket-8413.herokuapp.com/');
var a = require('bonescript');//individual variable for each GPIO port
var b = require('bonescript');//
var c = require('bonescript');//
var blindOpen = new Boolean();//boolean variable that indicates if blinds are open or not, 1 is open, 0 is closed
var timeout;//variable that will be used to reference active timeouts

a.pinMode("P8_10", 'out');//assigning a pin for each GPIO variable
b.pinMode("P8_12", 'out');//
c.pinMode("P8_14", 'out');//
blindOpen = true;//always start out the blinds as open before running 
socket.on("beaglebone", function (data) {//function that is called everytime a signal is sent to the beaglebone
	if(data == "on" && blindOpen == false){//only open the blinds if they are closed, and data received is "on"
		a.digitalWrite("P8_10", 1);//enable H bridge
		b.digitalWrite("P8_12", 1);//send signal to turn spindle for opening
		setTimeout(function(){b.digitalWrite("P8_12", 0);a.digitalWrite("P8_10", 0);},1600);//wait 1.6 seconds, then turn off motor
		blindOpen = true;//record that blinds are open
	}else if(data == "off" && blindOpen == true){//only open the blinds if they are closed, and data received is "off"
        	a.digitalWrite("P8_10", 1);//enable H bridge
        	c.digitalWrite("P8_14", 1);//send signal to turn spindle for closing
		setTimeout(function(){c.digitalWrite("P8_14", 0);a.digitalWrite("P8_10", 0);},1000);//wait 1.0 seconds, then turn off motor
		blindOpen = false;//record that blinds are open
	}else if (data != "off" && data != "on"){//if time data is received, not on or off messages,
  		console.log(data);//prints out time received to console (for debugging)
		clearTimeout(timeout);//clears the last timeout if there was one, prevents multiple timers
		var h = parseInt(data)/60;//get hour
	        var m = parseInt(data)%60;//get minute
		var now = new Date();//get current time
		var t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(h), m, 0, 0) - now;//take the time entered for the future (the time set by the user) and subtract the current time, this gets a countdown time in milliseconds, t
		if (t < 0) {//if the time was negative, that means the time received has already passed
		     t += 86400000;//so a day needs to be added to the countdown time t
		}
			
		timeout = setTimeout(function(){//sets a timeout that will run this function after it has waited t milliseconds
		
		if(blindOpen == false){//recognize this from above? This will open the blinds if they were closed
	                a.digitalWrite("P8_10", 1);
	                b.digitalWrite("P8_12", 1);
        	        setTimeout(function(){b.digitalWrite("P8_12", 0);a.digitalWrite("P8_10", 0);},1600);
	                blindOpen = true;
       		 }else {//this will close the blinds if they were open
        	        a.digitalWrite("P8_10", 1);
        	        c.digitalWrite("P8_14", 1);
        	        setTimeout(function(){c.digitalWrite("P8_14", 0);a.digitalWrite("P8_10", 0);},1000);
        	        blindOpen = false;
	}}, t);//count to time t
	}

});
