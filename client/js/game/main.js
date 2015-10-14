// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                  _       
//                 (_)      
//  _ __ ___   __ _ _ _ __  
// | '_ ` _ \ / _` | | '_ \ 
// | | | | | | (_| | | | | |
// |_| |_| |_|\__,_|_|_| |_|

// Find canvas
var canvas = document.querySelector('#renderCanvas');

// Load Babylon
var engine = new BABYLON.Engine(canvas, true);

// Main master object
var main = {};

// Main create scene
main.createScene = function () {

  // Create scene object
  this.scene = new BABYLON.Scene(engine);
  var scene = this.scene;

  // Set main serverInfo
  this.serverInfo = {};

  // Make environment
  this.makeEnvironment();

  // Make player
  this.makePlayer();

  // Initialize foreign players
  this.foreignData = {};
  // The foreign player player data
  this.foreignData.players = {};
  // The current animation time of foreign player movement
  this.foreignData.gradientTime = 0;
  // Make camera
  this.makeCamera();

  // // Return the scene
  return scene;
};

// Main start scene rendering
main.renderScene_start = function () {
  // Set main old time
  main.newTime = Date.now()/1000;
  // Render
  engine.runRenderLoop(function () {
    // Update time
    main.updateTime();
    // Move player
    main.movePlayer();
    // Move foreign players
    main.moveForeignPlayers();
    // Render scene
    main.scene.render();
  });
};

// Main update time
main.updateTime = function () {
  main.oldTime = main.newTime;
  main.newTime = Date.now()/1000;
  main.deltaTime = main.newTime - main.oldTime;
};

// Main make environment
main.makeEnvironment = function () {
  // Get scene reference
  var scene = main.scene;

  // Add light pointing directly up
  var light = new BABYLON.HemisphericLight('light0',
    new BABYLON.Vector3(0, 1, 0), scene);
  // Dim light
  light.intensity = .5;

  // Create floor
  main.floor = BABYLON.Mesh.CreateBox('floor0',
    1, scene);
  var floor = main.floor;
  // Scale
  floor.scaling.y = 2;
  floor.scaling.x = 100;
  floor.scaling.z = 100;
  floor.position.y -= floor.scaling.y/2;
  // Create floor material
  var floorMaterial = new BABYLON.StandardMaterial('floorMat',
    scene);
  // Set wireframe
  floorMaterial.wireframe = true;
  // Set material of floor
  floor.material = floorMaterial;
  // Check collisions on floor
  floor.checkCollisions = true;

  // Set gravity
  main.gravity = -10;
};

// Make camera
main.makeCamera = function () {
  // Create camera
  var camera = new BABYLON.FreeCamera('camera0',
    new BABYLON.Vector3(0, 3, -7), main.scene);
  // Set camera target
  camera.setTarget(BABYLON.Vector3.Zero());
  // Add camera to canvas
  camera.attachControl(canvas, false);
  // Set camera
  main.camera = camera;
  // Dont move camera
  camera.speed = 0;
  // Set camera's parent to be player's parent
  camera.parent = main.player.gameObject_parent;
};

//  _                 _        _ _            _   
// | |               | |      | (_)          | |  
// | | ___   ___ __ _| |   ___| |_  ___ _ __ | |_ 
// | |/ _ \ / __/ _` | |  / __| | |/ _ \ '_ \| __|
// | | (_) | (_| (_| | | | (__| | |  __/ | | | |_ 
// |_|\___/ \___\__,_|_|  \___|_|_|\___|_| |_|\__|

// Main make player
main.makePlayer = function () {
  // Make player object
  main.player = {};
  var player = main.player;
  // Set player speed
  player.speed = 10;
  // Set player jumpTime
  player.jumpTime = -1;
  // Set player jumpVelocity_Start
  player.jumpVelocity_Start = 6;
  // Set player jumpHeight_Start
  player.jumpHeight_Start = -1;
  // Set player jump count
  player.jumpCount = 2;
  player.jumpCount_Start = 2;
  // Player completed flip bool
  player.flipComplete = false;
  // Set player gravity multiplier
  player.gravMult = 1.0;
  // Get player max jump height time
  player.maxJumpHeightTime
    = -player.jumpVelocity_Start/(main.gravity
      * main.player.gravMult);

  // Set player LR rotation speed
  player.rotationSpeed = 2;

  // Set player velocites
  player.currentVelocities = {};

  // Get scene reference
  var scene = main.scene;

  // Set player game object's parent
  var boxParent = BABYLON.Mesh.CreateBox('playerParent',
    1.0, scene);
  boxParent.position.y = .5;
  main.player.gameObject_parent = boxParent;
  main.player.gameObject_parent.isVisible = false;
  // Set player game object
  var boxChild = BABYLON.Mesh.CreateBox('playerChild',
    1.0, scene);
  boxChild.position.y = .5;
  main.player.gameObject_child = boxChild;
  // Check collisions on child
  boxChild.checkCollisions = true;
  // Parent boxChild to boxParent
  boxChild.parent = boxParent;

  // Set player ground
  main.player.groundedHeight
    = boxChild.scaling.y * .5;
};

// Main move player
main.movePlayer = function () {
  // Reset player velocities
  this.resetPlayerVelocities();

  // Left and right input
  var x = 0;
  // If left key
  if (inputs[37]) {
    x -= 1;
  }
  // If right key
  if (inputs[39]) {
    x += 1;
  }

  // Back and forward input
  var z = 0;
  // If down arrow key
  if (inputs[38]) {
    z +=1;
  }
  // If up arrow key
  if (inputs[40]) {
    z -= 1;
  }

  // Player
  var player = main.player;
  // Player game object
  var playerParent = player.gameObject_parent;
  var playerChild = player.gameObject_child;
  // Player speed
  var playerSpeed = player.speed;

  // Move player left, right, forward, and back
  var netAddedXZ = {
    x: 0,
    z: 0
  };

  // If player net-left/right motion isn't 0
  if (x !== 0) {
    // Add relative to rotation
    var relativeLR
      = main.relativeRight(playerParent.rotation.y);
    netAddedXZ.x += x * relativeLR.x;
    netAddedXZ.z += x * relativeLR.z;
  }
  // If player net-forward/back motion isn't 0
  if (z !== 0) {
    // Add relative to rotation
    var relativeFB
      = main.relativeForward(playerParent.rotation.y);
    netAddedXZ.x += z * relativeFB.x;
    netAddedXZ.z += z * relativeFB.z;
  }
  // Update player positions
  playerParent.position.x
    += netAddedXZ.x * main.deltaTime * playerSpeed;
  playerParent.position.z
    += netAddedXZ.z * main.deltaTime * playerSpeed;

  // Set current player x and z velocites for server update
  player.currentVelocities.x = netAddedXZ.x * playerSpeed;
  player.currentVelocities.z = netAddedXZ.z * playerSpeed;

  // Jump input
  // If player has reached top of jump
  // and has jumps left
  if (inputs[32]
    && (player.jumpTime === -1
      || player.maxJumpHeightTime < player.jumpTime)
    && 0 < player.jumpCount) {
    // Set time in jump to now
    player.jumpTime = 0;
    // Set jump initial height
    player.jumpHeight_Start
      = playerParent.position.y;
    // Decrement jump count
    --player.jumpCount;
  }
  // If player has jumped
  if (player.jumpTime !== -1) {
    // Increase time in jump
    player.jumpTime += main.deltaTime;
    // Get reference to old player position
    var oldPlayerHeight = playerParent.position.y;
    // Get current jump position
    var y = main.jumpInterpretter();
    // If player has finished first half of jump
    // AND y is too low
    if (player.maxJumpHeightTime < player.jumpTime
      && y < player.groundedHeight) {
      // Place player on ground
      y = player.groundedHeight;
      // Reset jump parameters
      player.jumpTime = -1;
      player.jumpHeight_Start = -1;
      player.jumpCount = player.jumpCount_Start;
      player.flipComplete = false;
    }
    // Move player vertically
    playerParent.position.y = y;

    // Set y velocity
    player.currentVelocities.y
      = (y - oldPlayerHeight) / main.deltaTime;
  }

  // Left right rotation
  var y_r = 0;
  // If Q
  if (inputs[69]) {
    y_r += 1;
  }
  // If E
  if (inputs[81]) {
    y_r -= 1;
  }

  // Rotate player
  if (y_r !== 0) {
    playerParent.rotation.y
      += (y_r * main.deltaTime * player.rotationSpeed);
  }

  // Set player y rotation
  player.currentVelocities.y_r = y_r * player.rotationSpeed;

  // Flip player
  var x_r = 0;
  // If used both jumps
  if (!player.flipComplete && player.jumpCount === 0) {
    // Get current x rotation
    var oldPlayerXRotation = playerChild.rotation.x;
    // Get flip ratio
    var flipRatio = main.flipInterpretter();
    // If ratio exceeds 1
    if (1 < flipRatio) {
      // Set flip ratio to 0
      flipRatio = 0
      // Complete flip
      player.flipComplete = true;
    }
    // Set new rotation
    playerChild.rotation.x = flipRatio * 2 * Math.PI;

    // Set x rotational velocity
    player.currentVelocities.x_r
      = (playerChild.rotation.x -
          oldPlayerXRotation) / main.deltaTime;
  }
};

// Main clear local player velocity
main.resetPlayerVelocities = function () {
  // Get reference to local player
  var player = main.player;
  // Reset all velocities to 0

  // Positional velocity
  player.currentVelocities.x = 0;
  player.currentVelocities.y = 0;
  player.currentVelocities.z = 0;
  // Rotational velocity
  player.currentVelocities.x_r = 0;
  player.currentVelocities.y_r = 0;
};

//   __               _                    _ _            _   
//  / _|             (_)                  | (_)          | |  
// | |_ ___  _ __ ___ _  __ _ _ __     ___| |_  ___ _ __ | |_ 
// |  _/ _ \| '__/ _ \ |/ _` | '_ \   / __| | |/ _ \ '_ \| __|
// | || (_) | | |  __/ | (_| | | | | | (__| | |  __/ | | | |_ 
// |_| \___/|_|  \___|_|\__, |_| |_|  \___|_|_|\___|_| |_|\__|
//                       __/ |                                
//                      |___/                                 

// Main make foreign players
main.makeForeignPlayers = function (data) {
  // Delete data about us
  delete data[main.player.username];
  // Get foreign players
  var foreignPlayers = this.foreignData.players;
  // Iterate over all players
  for (var username in data) {
    // If the username isn't a current foreign player
    if (foreignPlayers[username] === undefined) {
      // Add object and attributes
      foreignPlayers[username] = {
        position: data.position,
        rotation: data.rotation,
        scaling: data.scaling,
        velocities: data.velocities
      };
      // Make the player gameObject
      foreignPlayers[username].gameObject
        = BABYLON.Mesh.CreateBox(username, 1.0, main.scene);
    }
  }
  // Reset the current foreignPlayers animation percentage
  this.foreignData.gradientTime = 0;
};

// Main move foreign players
main.moveForeignPlayers = function () {
  // Get animation gradient
  var gradientTime = this.foreignData.gradientTime;
  var updateRate = this.serverInfo.updateRate;
  var gradient = gradientTime / updateRate;

  // Iterate over all players
  var foreignPlayers = this.foreignData.players;
  for (var username in foreignPlayers) {
    // Get reference
    var player = foreignPlayers[username];
    // Get velocities
    var velocities = player.velocities;
    // Interpolate position
    var newPosition
      = BABYLON.Animation.prototype.vector3InterpolateFunction(
          player.gameObject.position,
          this.makeVector3(data[username].position),
          gradient
        );
    player.gameObject.position = newPosition;
    // Set rotation
    var newRotation
      = BABYLON.Animation.prototype.vector3InterpolateFunction(
          player.gameObject.rotation,
          this.makeVector3(data[username].rotation),
          gradient
        );
    player.gameObject.rotation = newRotation;
    // Set scaling
    var newScaling
      = BABYLON.Animation.prototype.vector3InterpolateFunction(
          player.gameObject.scaling,
          this.makeVector3(data[username].scaling),
          gradient
        );
    player.gameObject.scaling = newScaling;
  }

  // Update gradient by delta time
  this.foreignData.gradient += main.deltaTime;
};

// Main make BABYLON.Vector3
main.makeVector3 = function (data) {
  return new BABYLON.Vector3(data.x, data.y, data.z);
};

// Main relative forward
main.relativeForward = function (rad) {
  return {
    x: Math.sin(rad),
    z: Math.cos(rad)
  };
}

// Main relative right
main.relativeRight = function (rad) {
  return {
    x: Math.cos(rad),
    z: -Math.sin(rad)
  };
}

// Main jump interpreter
main.jumpInterpretter = function () {
  // Local player
  var player = main.player;
  // Height of jump start
  var jumpHeight_Start = player.jumpHeight_Start;
  // Time in jump
  var jumpTime = player.jumpTime;
  // Jump velocity
  var jumpVelocity_Start = player.jumpVelocity_Start;
  // Gravity
  var gravity = player.gravMult * main.gravity;

  // Return kinematics
  return jumpHeight_Start + jumpVelocity_Start * jumpTime
    + .5 * gravity * jumpTime * jumpTime;
};

// Main flip interpreter
main.flipInterpretter = function () {
  // Local player
  var player = main.player;
  // Time in jump
  var jumpTime = player.jumpTime;
  // Flip ratio
  var flipRatio = .75 * jumpTime / player.maxJumpHeightTime;
  // Return rotation
  return flipRatio;
};

// Main get local update
main.getLocalUpdate = function () {
  // Get reference to player game objects
  var playerParent = main.player.gameObject_parent;
  var playerChild = main.player.gameObject_child;
  // Get required attributes
  return {
    // Username
    username: main.player.username,
    // Game object attributes
    playerData: {
      position: {
        x: playerParent.position.x,
        y: playerParent.position.y,
        z: playerParent.position.z
      },
      rotation: {
        x: playerChild.rotation.x,
        y: playerParent.rotation.y,
        z: playerParent.rotation.z
      },
      scaling: {
        x: playerParent.scaling.x,
        y: playerParent.scaling.y,
        z: playerParent.scaling.z
      },
      velocities: 2
    }
  };
};

// On window resize
window.addEventListener('resize', function () {
  engine.resize();
});