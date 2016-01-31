var express = require('express'),
	app = express(),
	http = require('http'),
	port = process.env.PORT || 4000,
	server = http.createServer(app).listen(port);
	io = require('socket.io').listen(server);


var Gpio 	= require('onoff').Gpio;
var led 	= new Gpio(17, 'out');


app.get('/', function (req, res) {
   res.sendFile(__dirname + '/default.html');
});

function readAndReport(){
	led.read(function(err, value){
		if (err) {
			throw err;
		}
		io.emit('console message', 'LED is: '+value);
	});
}

io.on('connection', function(socket){
	readAndReport();


  socket.on('led control', function(msg){
	switch(msg) {
	    case "on":
	    	io.emit('console message', "LED will be switched ON now");
	    	led.write(1, readAndReport);
	        break;
	    case "off":
  			io.emit('console message', "LED will be switched OFF now");
  			led.write(0, readAndReport);
	        break;
	    default:
	        io.emit('console message', "No such command");
	}

  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
