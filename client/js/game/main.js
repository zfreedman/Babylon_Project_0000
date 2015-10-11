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
  main.scene = new BABYLON.Scene(engine);
  var scene = main.scene;

  // Change background color
  // scene.clearColor = new BABYLON.Color3(0, 1, 0);


  // Make environment
  main.makeEnvironment();

  // Make player
  main.makePlayer();

  // Make camera
  main.makeCamera();

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
  var floor = BABYLON.Mesh.CreateBox('floor0',
    1, scene);
  floor.scaling.y = 2;
  floor.scaling.x = 6;
  floor.scaling.z = 6;
  floor.position.y -= floor.scaling.y/2;
  // Create floor material
  var floorMaterial = new BABYLON.StandardMaterial('floorMat',
    scene);
  // Set wireframe
  floorMaterial.wireframe = true;
  // Set material of floor
  floor.material = floorMaterial;

  // Set gravity
  main.gravity = -15;
};

// Main make player
main.makePlayer = function () {
  // Make player object
  main.player = {};
  var player = main.player;
  // Set player speed
  player.speed = 5;
  // Set player jumpTime
  player.jumpTime = -1;
  // Set player jumpVelocity_Start
  player.jumpVelocity_Start = 5;
  // Set player jumpHeight_Start
  player.jumpHeight_Start = -1;
  // Set player jump count
  player.jumpCount = 2;
  player.jumpCount_Start = 2;
  // Set player gravity multiplier
  player.gravMult = 1.0;
  // Get player max jump height time
  player.maxJumpHeightTime
    = -player.jumpVelocity_Start/(main.gravity * main.player.gravMult);

  // Get scene reference
  var scene = main.scene;

  // Set player game object
  var box = BABYLON.Mesh.CreateBox('client_local',
    1.0, scene);
  box.position.y = .5;
  main.player.gameObject = box;

  // Set player ground
  main.player.groundedHeight
    = box.scaling.y * .5;
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
  main.camera.speed = 0;
};

// Main move player
main.movePlayer = function () {
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
  var playerGO = player.gameObject;
  // Player speed
  var playerSpeed = player.speed;
  // Move player left, right, forward, and back
  playerGO.position.x
    += x * main.deltaTime * playerSpeed;
  playerGO.position.z
    += z * main.deltaTime * playerSpeed;

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
      = playerGO.position.y;
    // Decrement jump count
    --player.jumpCount;
  }
  // If player has jumped
  if (player.jumpTime !== -1) {
    // Increase time in jump
    player.jumpTime += main.deltaTime;
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
    }
    // Move player vertically
    playerGO.position.y = y;
  }
};

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

// On window resize
window.addEventListener('resize', function () {
  engine.resize();
});