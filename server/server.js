// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

// ______                 _              _ 
// | ___ \               (_)            | |
// | |_/ /___  __ _ _   _ _ _ __ ___  __| |
// |    // _ \/ _` | | | | | '__/ _ \/ _` |
// | |\ \  __/ (_| | |_| | | | |  __/ (_| |
// \_| \_\___|\__, |\__,_|_|_|  \___|\__,_|
//               | |                       
//               |_|                           

// Requirements
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Serve static files
app.use(express.static(__dirname + '/../client'));
// Path to serve static files
io.path('/');

//                 _        _     _       
//                | |      | |   (_)      
//  ___  ___   ___| | _____| |_   _  ___  
// / __|/ _ \ / __| |/ / _ \ __| | |/ _ \ 
// \__ \ (_) | (__|   <  __/ |_ _| | (_) |
// |___/\___/ \___|_|\_\___|\__(_)_|\___/ 

// On socket connection
io.on('connection', function (socket) {

  // Log on server
  logger.logConnection(socket.id, true);

  // On disconnect
  socket.on('disconnect', function () {
    logger.logConnection(socket.id, false);
  });
});

 //  _                             
 // | |                            
 // | | ___   __ _  __ _  ___ _ __ 
 // | |/ _ \ / _` |/ _` |/ _ \ '__|
 // | | (_) | (_| | (_| |  __/ |   
 // |_|\___/ \__, |\__, |\___|_|   
 //           __/ | __/ |          
 //          |___/ |___/           

var logger = {

  // Log socket connection status
  logConnection: function (socketID, bool) {
    console.log('\tSOCKET', socketID, '| CONNECTED:', bool);
  }

};

//Listen to port 3000
http.listen(3000, function () {
  console.log("Listening on *:3000");
});
