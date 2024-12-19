var runLevels = function (window) {
  window.opspark = window.opspark || {};

  var draw = window.opspark.draw;
  var createjs = window.createjs;
  let currentLevel = 0;

  window.opspark.runLevelInGame = function (game) {
    // some useful constants
    var groundY = game.groundY;

    // this data will allow us to define all of the
    // behavior of our game
    var levelData = window.opspark.levelData;

    // set this to true or false depending on if you want to see hitzones
    game.setDebugMode(true);

    // TODOs 5 through 11 go here
    // BEGIN EDITING YOUR CODE HERE
    function createSawBlade(x, y){
    var hitZoneSize = 25;
    var damageFromObstacle = 10;
    var sawBladeHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
    sawBladeHitZone.x = x;
    sawBladeHitZone.y = y;
    game.addGameItem(sawBladeHitZone);

    var obstacleImage = draw.bitmap("img/sawblade.png");
    obstacleImage.x = -25;
    obstacleImage.y = -25;
sawBladeHitZone.addChild(obstacleImage);
    }
createSawBlade(500, 550);
createSawBlade(400, 450);
createSawBlade(700, 450);



function createEnemy(x, y) {

  var enemy = game.createGameItem("enemy", 25);
  enemy.x = x;
enemy.y = y;
var redSquare = draw.bitmap('img/enemy.png');
enemy.velocityX = -2;
enemy.rotationalVelocity = 0;
redSquare.x = -40;
redSquare.y = -60;
enemy.addChild(redSquare);
game.addGameItem(enemy);

enemy.onPlayerCollision = function () {
  game.changeIntegrity(-10)
};
enemy.onProjectileCollision = function () {
  game.increaseScore(100);
  enemy.fadeOut();
};

}
createEnemy(400, groundY - 20);
createEnemy(800, groundY - 70);
createEnemy(1200, groundY - 50);

function createReward(x, y) {
  var reward = game.createGameItem("reward", 25);
  reward.x = x;
reward.y = y;
  var yellowSquare = draw.rect(50, 50, "yellow");
  reward.velocityX = -2;
reward.rotationalVelocity = 0;
yellowSquare.x = -25;
yellowSquare.y = -25;
reward.addChild(yellowSquare);
game.addGameItem(reward);

reward.onPlayerCollision = function () {
  game.changeIntegrity(10)
 reward.fadeOut();
};
};
createReward(1000, groundY - 50);

function createMarker(x, y){
  var square = game.createGameItem("square", 25);
  square.x = x;
square.y = y;
  var greenSquare = draw.rect(50, 50, "green");
  square.velocityX = -2;
square.rotationalVelocity = 0;
greenSquare.x = -25;
greenSquare.y = -25;
square.addChild(greenSquare);
game.addGameItem(square);

  square.onProjectileCollision = function () {
    location.reload()
startLevel();
  };
  square.onPlayerCollision = function () {
    location.reload()
startLevel();
  };
}
createMarker(1500, groundY - 50);



    function startLevel() {
      // TODO 13 goes below here



      //////////////////////////////////////////////
      // DO NOT EDIT CODE BELOW HERE
      //////////////////////////////////////////////
      if (++currentLevel === levelData.length) {
        startLevel = () => {
          console.log("Congratulations!");
        };
      }
    }
    startLevel();
  };
};


// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if (
  typeof process !== "undefined" &&
  typeof process.versions.node !== "undefined"
) {
  // here, export any references you need for tests //
  module.exports = runLevels;
}
