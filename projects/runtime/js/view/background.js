var background = function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    var draw = window.opspark.draw;
    var createjs = window.createjs;
    
    /*
     * Create a background view for our game application
     */
    window.opspark.makeBackground = function(app,ground) {
        /* Error Checking - DO NOT DELETE */
        if(!app) {
            throw new Error("Invalid app argument");
        }
        if(!ground || typeof(ground.y) == 'undefined') {
            throw new Error("Invalid ground argument");
        }
        
        // useful variables
        var canvasWidth = app.canvas.width;
        var canvasHeight = app.canvas.height;
        var groundY = ground.y;
        
        // container which will be returned
        var background;
        
        //////////////////////////////////////////////////////////////////
        // ANIMATION VARIABLES HERE //////////////////////////////////////
        //////////////////////////////////////////////////////////////////
        // TODO (several):
      var car;
      var buildings = [];
      
        // called at the start of game and whenever the page is resized
        // add objects for display in background. draws each image added to the background once
        function render() {
            background.removeAllChildren();

            // TODO 1:
            // this currently fills the background with an obnoxious yellow;
            // you should modify both the height and color to suit your game
            //var backgroundFill = draw.rect(canvasWidth, groundY, "white");
            var backgroundFill = draw.bitmap("img/bg.png");
            backgroundFill.x = 0;
            backgroundFill.y = 0;
            backgroundFill.scaleX = 5;
            backgroundFill.scaleY = 2.5;
            background.addChild(backgroundFill);
            
            // TODO 2: - Add a moon and starfield
            for(var i = 0; i < 100; i++){
                var circle = draw.bitmap("img/stars.png");
                circle.scaleY = .2;
                circle.scaleX = .2;
                circle.x = canvasWidth * Math.random();
                circle.y = groundY * Math.random();
                background.addChild(circle);
    }
            var moon = draw.bitmap("img/sun.png");
            moon.x = 150;
            moon.y = -530;
            moon.scaleX = 3.0;
            moon.scaleY = 3.0;
            background.addChild(moon);

          
            
            // TODO 4: Part 1 - Add buildings!     Q: This is before TODO 4 for a reason! Why?
            

            for (var i = 0; i < 6; ++i) {
                var eachBuilding = buildings[i];
                var buildingHeight = 300 * 1.7;
                eachBuilding = draw.bitmap('img/building 1.png');
                eachBuilding.x = 200 * i;
                eachBuilding.y = groundY - buildingHeight;
                background.addChild(eachBuilding);
                buildings.push(eachBuilding);
              }
            
            // TODO 3: Part 1 - Add a tree
            car = draw.bitmap("img/cars.png");
            car.x = 300;
            car.y = 450;
            car.scaleX = 2.0;
            car.scaleY = 2.0;
            background.addChild(car);
            
            
        } // end of render function - DO NOT DELETE
        
        
        // Perform background animation
        // called on each timer "tick" - 60 times per second
        function update() {
            // useful variables
            var canvasWidth = app.canvas.width;
            var canvasHeight = app.canvas.height;
            var groundY = ground.y;
            
            // TODO 3: Part 2 - Move the tree!
            car.x = car.x -6;

            if (car.x < -200) {
            car.x = canvasWidth;
        }
            
            // TODO 4: Part 2 - Parallax
        
            for (var i = 0; i < buildings.length; i++) {
                var eachElement = buildings[i];
            eachElement.x = eachElement.x - 2;
            if (eachElement.x < -200) {
                eachElement.x = canvasWidth;
            }
            }
            

        } // end of update function - DO NOT DELETE
        
        
        
        /* Make a createjs Container for the background and let it know about the render and upate functions*/
        background = new createjs.Container();
        background.resize = render;
        background.update = update;
        
        /* make the background able to respond to resizing and timer updates*/
        app.addResizeable(background);
        app.addUpdateable(background);
        
        /* render and return the background */
        render();
        return background;
    };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = background;
}
