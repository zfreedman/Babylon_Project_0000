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

//  _        __      
// (_)      / _|     
//  _ _ __ | |_ ___  
// | | '_ \|  _/ _ \ 
// | | | | | || (_) |
// |_|_| |_|_| \___/ 

// Info master object
var info = {};
info.updateRate = 250;

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

  // Handoff to helper
  helper.initializeSocket({socketID: socket.id});

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

  // On local client update
  socket.on('client:localUpdate', function (data) {
    // Add socketID
    data.socketID = socket.id;
    // Handoff to helper
    helper.localUpdate(data);
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

// Helper initialize socket
helper.initializeSocket = function (data) {
  serverData.initializeSocketInfo(data);
};

// Helper verify
helper.verify = function (data) {
  // Get result
  var result = {
    'verified': true,
    'username': data.username,
    'password': data.password
  };
  // Update socket info
  serverData.updateSocketInfo({
    socketID: data.socketID,
    username: result.username
  });
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
    // Add player to room
    io.sockets.connected[data.socketID]
      .join(result.roomName);
    // Add update rate to result
    result.updateRate = 250;
    // Emit to player room joined
    io.sockets.connected[data.socketID]
      .emit('server:joinRoom', result);
  }
};

// Helper local client update
helper.localUpdate = function (data) {
  // Update player in room
  serverData.updatePlayerInRoom(data);
};

// Helper server update
helper.serverGameUpdate = function () {
  // Get all rooms
  var rooms = serverData.rooms;
  // Iterate over each room
  for (var room in rooms) {
    // Emit to all sockets in the room
    io.to(room).emit('server:gameUpdate',
      rooms[room]);
  }
};

//                  _       _       
//                 | |     | |      
//  _   _ _ __   __| | __ _| |_ ___ 
// | | | | '_ \ / _` |/ _` | __/ _ \
// | |_| | |_) | (_| | (_| | ||  __/
//  \__,_| .__/ \__,_|\__,_|\__\___|
//       | |                        
//       |_|                        

setInterval(helper.serverGameUpdate, info.updateRate);

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
};

//Listen to port 3000
http.listen(3000, function () {
  console.log("Listening on *:3000");
});
