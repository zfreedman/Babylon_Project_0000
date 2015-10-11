// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                 _        _   
//                | |      | |  
//  ___  ___   ___| | _____| |_ 
// / __|/ _ \ / __| |/ / _ \ __|
// \__ \ (_) | (__|   <  __/ |_ 
// |___/\___/ \___|_|\_\___|\__|

// Initialize socket
var socket = io();

//                                ___                   _   
//                               / _ \                 | |  
//  ___  ___ _ ____   _____ _ __/ /_\ \ __ _  ___ _ __ | |_ 
// / __|/ _ \ '__\ \ / / _ \ '__|  _  |/ _` |/ _ \ '_ \| __|
// \__ \  __/ |   \ V /  __/ |  | | | | (_| |  __/ | | | |_ 
// |___/\___|_|    \_/ \___|_|  \_| |_/\__, |\___|_| |_|\__|
//                                      __/ |               
//                                     |___/                       

// Server agent master object
var serverAgent = {};

// Server agent initialize
serverAgent.initialize = function () {

  // Socket on server verify
  socket.on('server:verify', function (data) {
    // Create scene
    main.createScene();
    // Render scene
    main.renderScene_start();
  });
};

// Server agent verify
serverAgent.verify = function () {
  // Attempt to verify client
  socket.emit('client:verify', {
    'username': 'zach',
    'password': 'zach'
  });
};

// Initialize serverAgent
serverAgent.initialize();

// Verify the client
serverAgent.verify();
