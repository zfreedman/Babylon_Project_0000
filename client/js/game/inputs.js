// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//  _                   _       
// (_)                 | |      
//  _ _ __  _ __  _   _| |_ ___ 
// | | '_ \| '_ \| | | | __/ __|
// | | | | | |_) | |_| | |_\__ \
// |_|_| |_| .__/ \__,_|\__|___/
//         | |                  
//         |_|                                                              

// Input handler master object
var inputs = {};

// Document key press
window.onkeydown = function (e) {
  console.log(e.which);
  // Set input to true
  inputs[e.which] = 1;
};

// Document on key up
window.onkeyup = function (e) {
  delete inputs[e.which];
};