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

// Initialize rooms
serverData.rooms = {};

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
  // Get username
  var username = data.username;
  // Get playerData
  var playerData = data.playerData;
  // Get roomName
  var roomName = data.roomName;
  // Get rooms
  var rooms = this.rooms;
  // Set key value pair in room
  rooms[roomName][username] = playerData;
  // Return success
  return {roomJoined: true};
};

// Server data initialize
serverData.initialize = function () {
  // Set roomNames
  this.roomNames = [
    'Alpha', 'Beta', 'Delta', 'Omega'
  ];
  // Add one room
  this.addRoom();
};

// Initialize server data
serverData.initialize();

// Add serverData to exports
module.exports = serverData;