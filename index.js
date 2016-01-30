var express = require('express'),
   app = express(),
   http = require('http'),
   port = process.env.PORT || 4000,
   server = http.createServer(app).listen(port);
   io = require('socket.io').listen(server);

////////////////////////////////
// SOUND
///////////////////////////////
var Player = require('player');
var player = new Player('http://soundjax.com/reddo/4122%5Edingdong.mp3');
player.play();

/////////////////////////////
// PINS
//////////////////////////////

// var Gpio = require('onoff').Gpio;
// var  led = new Gpio(17, 'out');
  // button = new Gpio(4, 'in', 'both');

// button.watch(function(err, value) {

// });
var interval;
var state = 0;
function startBlink(){
	interval = setInterval(function () {
		console.log('interval hit');
	  switchLed(1-state); // 1 = on, 0 = off :)
	}, 1000);

}
function stopBlink(){
	clearInterval(interval);
}

function switchLed(stated){
	state = stated;
	// led.writeSync(stated);
	console.log(stated);
}

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/default.html');
});


io.on('connection', function(socket){
  io.emit('welcome user', "Welcome");

  socket.on('chat message', function(msg){
	switch(msg) {
		case "blink":
			startBlink();
			break;
	    case "on":
	    	stopBlink();
  			switchLed(1);
	        break;
	    case "off":
  			switchLed(0);
  			stopBlink();
	        break;
	    default:
	        io.emit('chat message', msg);
	}

  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
