/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;

  // Game Item Objects
  // Maps key codes to readable names for both Arrow keys and WASD
  const KEY = {
    // Player 1 (Arrows)
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
    // Player 2 (WASD)
    W: 87, A: 65, S: 83, D: 68
  };

  // Player 1 Object
  var walker = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0
  };

  // Player 2 Object (Added for second player)
  var walker2 = {
    x: 300, // Starts at a different position
    y: 300,
    speedX: 0,
    speedY: 0
  };

  // one-time setup: execute newFrame every 0.0166 seconds
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);

  // Event Listeners
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);

  // Click Event: Change player color to a random hex code on click
  $("#walker, #walker2").on("click", function() {
    var randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
    $(this).css("background-color", randomColor);
  });

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function newFrame() {
    repositionGameItem(); // Update positions for both walkers
    wallCollision();      // Keep both walkers inside the board
    handleTagCollision(); // Check if walkers are touching (Tag!)
    redrawGameItem();     // Move the HTML elements on screen
  }

  function handleKeyDown(event) {
    // Player 1 Controls (Arrows)
    if (event.which === KEY.LEFT) { walker.speedX = -5; }
    if (event.which === KEY.RIGHT) { walker.speedX = 5; }
    if (event.which === KEY.UP) { walker.speedY = -5; }
    if (event.which === KEY.DOWN) { walker.speedY = 5; }

    // Player 2 Controls (WASD)
    if (event.which === KEY.A) { walker2.speedX = -5; }
    if (event.which === KEY.D) { walker2.speedX = 5; }
    if (event.which === KEY.W) { walker2.speedY = -5; }
    if (event.which === KEY.S) { walker2.speedY = 5; }
  }

  function handleKeyUp(event) {
    // Player 1 Stop Logic
    if (event.which === KEY.LEFT || event.which === KEY.RIGHT) { walker.speedX = 0; }
    if (event.which === KEY.UP || event.which === KEY.DOWN) { walker.speedY = 0; }

    // Player 2 Stop Logic
    if (event.which === KEY.A || event.which === KEY.D) { walker2.speedX = 0; }
    if (event.which === KEY.W || event.which === KEY.S) { walker2.speedY = 0; }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function repositionGameItem() {
    // Update Walker 1
    walker.x += walker.speedX;
    walker.y += walker.speedY;

    // Update Walker 2 (Added movement logic for second player)
    walker2.x += walker2.speedX;
    walker2.y += walker2.speedY;
  }

  function wallCollision() {
    var boardWidth = $("#board").width();
    var boardHeight = $("#board").height();

    // Boundary check for Walker 1
    if (walker.x < 0 || walker.x > boardWidth - $("#walker").width()) {
      walker.x -= walker.speedX;
    }
    if (walker.y < 0 || walker.y > boardHeight - $("#walker").height()) {
      walker.y -= walker.speedY;
    }

    // Boundary check for Walker 2 (Added boundary logic for second player)
    if (walker2.x < 0 || walker2.x > boardWidth - $("#walker2").width()) {
      walker2.x -= walker2.speedX;
    }
    if (walker2.y < 0 || walker2.y > boardHeight - $("#walker2").height()) {
      walker2.y -= walker2.speedY;
    }
  }

  let currentIt = "walker"; // Start with walker 1 as 'It'
let canTag = true;        // The cooldown flag

// --- COLLISION FUNCTION ---
function handleTagCollision() {
    if (walker.x < walker2.x + $("#walker2").width() &&
        walker.x + $("#walker").width() > walker2.x &&
        walker.y < walker2.y + $("#walker2").height() &&
        walker.y + $("#walker").height() > walker2.y) {

        // Check the cooldown
        if (canTag) {
            canTag = false; // Disable tagging immediately
            
            //console.log("Collision detected! Current 'It' is: " + currentIt);

             if (currentIt === "walker") {
                // Walker 1 was 'It', now Walker 2 is 'It'
                currentIt = "walker2";
                $("#walker").css({ "background-color": "#00d2ff", "box-shadow": "0 0 15px #00d2ff" }); // Reset to Cyan
                $("#walker2").css({ "background-color": "#ff0055", "box-shadow": "0 0 25px #ff0055" }); // Set to Hot Pink (It)
            } else {
                // Walker 2 was 'It', now Walker 1 is 'It'
                currentIt = "walker";
                $("#walker").css({ "background-color": "#ff0055", "box-shadow": "0 0 15px #ff0055" }); // Reset to Pink
                $("#walker2").css({ "background-color": "#00d2ff", "box-shadow": "0 0 25px #00d2ff" }); // Set to Cyan (It)
            }


            // Cooldown: wait 500ms before allowing another tag
            setTimeout(() => {
                canTag = true;
                console.log("Cooldown finished. Tagging ready!");
            }, 4000);
        }
    }
}
  

  function redrawGameItem() {
    // Update visual position for Walker 1
    $("#walker").css("left", walker.x);
    $("#walker").css("top", walker.y);

    // Update visual position for Walker 2 (Added drawing logic for second player)
    $("#walker2").css("left", walker2.x);
    $("#walker2").css("top", walker2.y);
  }

  function endGame() {
    clearInterval(interval);
    $(document).off();
  }
}
