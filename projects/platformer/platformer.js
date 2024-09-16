$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }
    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); //top
    createPlatform(-50, canvas.height - 10, canvas.width + 100, 200); //right
    createPlatform(-50, -50, 50, canvas.height + 500); //bottom
    createPlatform(canvas.width, -50, 50, canvas.height + 100);

    /**
     * Uncomment the drawGrid() function call below to add a "grid" to your platformer game's screen
     * The grid will place both horizontal and vertical platforms incremented 100 pixels apart
     * This can help you determine specific x any y values throughout the game
     * Comment the function call out to remove the grid
     */

    //drawGrid();

    /////////////////////////////////////////////////
    //////////ONLY CHANGE BELOW THIS POINT///////////
    /////////////////////////////////////////////////

    // TODO 1
    // Create platforms
    // You must decide the x position, y position, width, and height of the platforms
    // example usage: createPlatform(x,y,width,height)



    
    // TODO 2
    // Create collectables
    // You must decide on the collectable type, the x position, the y position, the gravity, and the bounce strength
    // Your collectable choices are 'database' 'diamond' 'grace' 'kennedi' 'max' and 'steve'; more can be added if you wish
    // example usage: createCollectable(type, x, y, gravity, bounce)



    
    // TODO 3
    // Create cannons
    // You must decide the wall you want the cannon on, the position on the wall, and the time between shots in milliseconds
    // Your wall choices are: 'top' 'left' 'right' and 'bottom'
    // example usage: createCannon(side, position, delay, width, height)

    createPlatform(0, 250, 200, 2000);
    createPlatform(394, 575, 206, 20);
    createPlatform(400, 721, 400, 0);
    createPlatform(200, 650, 20, 0)
    createPlatform(400, 0, 200, 465);
    createPlatform(600, 575, 200, 20);
    createPlatform(800, 100, 20, 800);
    createPlatform(600, 445, 50, 20);
    createPlatform(750, 350, 50, 20);
    createPlatform(600, 250, 50, 20);
    createPlatform(750, 150, 50, 20);

    createPlatform(800, 100, 500, 0);
    createPlatform(900, 300, 500, 0);
    createPlatform(900, 250, 0, 50);
    createPlatform(900, 100, 0, 60);
    createPlatform(1000, 210, 0, 90);
    createPlatform(1100, 100, 0, 115);
    createPlatform(1000, 721, 400, 0);
    
  

     
    createCollectable("astro", 480, 500);
    createCollectable("alien", 725, 600);
    createCollectable("ship", 1302, 600);

    createCannon("left", 675, 0, 100);
   createCannon("bottom", 640, 750);
   
   
    

    
    /////////////////////////////////////////////////
    //////////ONLY CHANGE ABOVE THIS POINT///////////
    /////////////////////////////////////////////////
  }

  registerSetup(setup);
});
