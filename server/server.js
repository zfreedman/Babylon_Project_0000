// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                       _              _ 
//                      (_)            | |
//  _ __ ___  __ _ _   _ _ _ __ ___  __| |
// | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
// | | |  __/ (_| | |_| | | | |  __/ (_| |
// |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
//              | |                       
//              |_|                         

// Requirements
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serverData = require('./serverData');

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

  // On verify attempt
  socket.on('client:verify', function (data) {
    // Add socketID
    data.socketID = socket.id;
    // Handoff to helper
    helper.verify(data);
  });

  // On player room join
  socket.on('client:joinRoom', function (data) {
    // Add socketID
    data.socketID = socket.id;
    // Handoff to helper
    helper.joinRoom(data);
  });
});

//  _          _                 
// | |        | |                
// | |__   ___| |_ __   ___ _ __ 
// | '_ \ / _ \ | '_ \ / _ \ '__|
// | | | |  __/ | |_) |  __/ |   
// |_| |_|\___|_| .__/ \___|_|   
//              | |              
//              |_|              

// Helper master object
var helper = {};

// Helper verify
helper.verify = function (data) {
  // Get result
  var result = {
    'verified': true,
    'username': 'zach',
    'password': 'zach'
  };

  // Emit mock object
  io.sockets.connected[data.socketID]
    .emit('server:verify', result);
};

// Helper join room
helper.joinRoom = function (data) {

  // Add available room
  var tmpRoom = Object.keys(serverData.rooms)[0];
  data.roomName = tmpRoom;
  // Get result
  var result = serverData.addPlayerToRoom(data);
  // If player successfully added
  if (result.roomJoined) {
    // Emit to player room joined
    io.sockets.connected[data.socketID]
      .emit('server:joinRoom', {
        roomJoined: result.roomJoined
      });
  }
};

 //  _                             
 // | |                            
 // | | ___   __ _  __ _  ___ _ __ 
 // | |/ _ \ / _` |/ _` |/ _ \ '__|
 // | | (_) | (_| | (_| |  __/ |   
 // |_|\___/ \__, |\__, |\___|_|   
 //           __/ | __/ |          
 //          |___/ |___/           

var logger = {};

// Log socket connection status
logger.logConnection = function (socketID, bool) {
  console.log('SOCKET', socketID, '| CONNECTED:', bool);
}

//Listen to port 3000
http.listen(3000, function () {
  console.log("Listening on *:3000");
});
