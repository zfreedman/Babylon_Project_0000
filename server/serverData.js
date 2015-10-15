// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                              ______      _        
//                              |  _  \    | |       
//  ___  ___ _ ____   _____ _ __| | | |__ _| |_ __ _ 
// / __|/ _ \ '__\ \ / / _ \ '__| | | / _` | __/ _` |
// \__ \  __/ |   \ V /  __/ |  | |/ / (_| | || (_| |
// |___/\___|_|    \_/ \___|_|  |___/ \__,_|\__\__,_|

// Server data master object
var serverData = {};

// Server data initialize
serverData.initialize = function () {
  // Initialize rooms
  serverData.rooms = {};
  // Set roomNames
  this.roomNames = [
    'Alpha', 'Beta', 'Delta', 'Omega'
  ];
  // Add one room
  this.addRoom();
};

//  _ __ ___   ___  _ __ ___  ___ 
// | '__/ _ \ / _ \| '_ ` _ \/ __|
// | | | (_) | (_) | | | | | \__ \
// |_|  \___/ \___/|_| |_| |_|___/

// Server data add room
serverData.addRoom = function () {
  // Get room count
  var roomCount = Object.keys(this.rooms).length;
  // Get rooms object
  var rooms = this.rooms;
  // Get room names array
  var roomNames = this.roomNames;
  // Initialize empty room
  rooms[roomNames[roomCount]] = {};
};

// Server data add player to room
serverData.addPlayerToRoom = function (data) {
  // Set player room
  this.updateSocketInfo({
    socketID: data.socketID,
    roomName: data.roomName
  });
  // Return success
  return {
    roomJoined: true,
    roomName: data.roomName
  };
};

// Server data update player in room
serverData.updatePlayerInRoom = function (data) {
  // Get username
  var username = data.username;
  // Get playerData
  var playerData = data.playerData;
  // Get roomName
  var roomName = this.sockets[data.socketID].roomName;
  // Get rooms
  var rooms = this.rooms;
  // Set key value pair in room
  if (Object.keys(playerData).length === 0) {
    console.log('no data');
  }
  rooms[roomName][username] = playerData;
};

//  _   _ ___  ___ _ __ ___ 
// | | | / __|/ _ \ '__/ __|
// | |_| \__ \  __/ |  \__ \
//  \__,_|___/\___|_|  |___/
       
// Master object for all connected sockets
serverData.sockets = {};

// Server data initialize socket info
serverData.initializeSocketInfo = function (data) {
  // Get socketID
  var socketID = data.socketID;
  // Initialize to empty object
  this.sockets[socketID] = {};
  var tmpSocket = this.sockets[socketID];
  // Set username
  tmpSocket.username = null;
  // Set roomName
  tmpSocket.roomName = null;

};
// Server data update socket info
serverData.updateSocketInfo = function (data) {
  // Get socketID
  var socketID = data.socketID;
  // Get username
  var username = data.username || null;
  // If username, set username
  if (username) {
    this.sockets[socketID].username = username;
  }
  // Get roomName
  var roomName = data.roomName || null;
  // If username, set username
  if (roomName) {
    this.sockets[socketID].roomName = roomName;
  }
};

//  _       _ _   _       _ _         
// (_)     (_) | (_)     | (_)        
//  _ _ __  _| |_ _  __ _| |_ _______ 
// | | '_ \| | __| |/ _` | | |_  / _ \
// | | | | | | |_| | (_| | | |/ /  __/
// |_|_| |_|_|\__|_|\__,_|_|_/___\___|

// Initialize server data
serverData.initialize();

// Add serverData to exports
module.exports = serverData;