/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = $("#board").width() 
  const BOARD_HEIGHT = $("#board").height() 
  
  // Game Item Objects
 var ball = ObjectFactory("#ball") 
 var leftPaddle = ObjectFactory("#leftPaddle") 
 var rightPaddle = ObjectFactory("#rightPaddle") 
 var p1score = 0 
 var p2score = 0 

  // one-time setup

  var KEY = {
    W: 87,
    S: 83,
    DOWN: 40,
    UP: 38,
  }
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);  
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
 startBall()
 
  function newFrame() {
    moveObject(ball)
    moveObject(leftPaddle)
    moveObject(rightPaddle)
    wallCollision(ball)
    wallCollision(leftPaddle)
    wallCollision(rightPaddle)
     checkScore()
  }
  
  
function handleKeyDown(event) { 
      if (event.which === KEY.UP) {
     leftPaddle.speedY = -5;
    }
    if (event.which === KEY.DOWN) {
      leftPaddle.speedY = 5;

    }
    if (event.which === KEY.W) {
      rightPaddle.speedY = -5

    }
    if (event.which === KEY.S) {
      rightPaddle.speedY = 5
    }
  }
    function handleKeyUp(event) { 
    if (event.which === KEY.UP) {
      leftPaddle.speedY = 0;
    }
    if (event.which === KEY.DOWN) {
      leftPaddle.speedY = 0;

    }
    if (event.which === KEY.W) {
      rightPaddle.speedY = 0

    }
    if (event.which === KEY.S) {
      rightPaddle.speedY = 0
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

 function ObjectFactory (id){ 
  var newObj = {}
  newObj.id = id
  newObj.x = parseFloat($(id).css("left"))
  newObj.y = parseFloat($(id).css("top"))
  newObj.speedX = 0
  newObj.speedY = 0
  newObj.width = $(id).width()
  newObj.height = $(id).height()
  return newObj
 }
 
    function startBall() { 
      ball.speedX = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
      ball.speedY = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
      ball.x = 350
      ball.y = 200
    }
  function moveObject(obj) { 
    obj.x += obj.speedX
    obj.y += obj.speedY
    $(obj.id).css("left", obj.x);
    $(obj.id).css("top", obj.y);
  }
  function wallCollision(obj) { 
    if(obj.y < 0) { 
      obj.y = obj.y - obj.speedY
      obj.speedY *= -1 
    }
    if (obj.y + obj.height > BOARD_HEIGHT) { 
      obj.y = obj.y - obj.speedY
      obj.speedY *= -1 
    }
     if(obj.x < 0) { 
      p2score++
      $("#P2score").text("Player2 score: " + p2score)
      startBall()
    }
    if(doCollide(ball, rightPaddle)){ 
      obj.x = obj.x - obj.speedX;
      obj.speedX *= -1;
    }
    if (obj.x + obj.width > BOARD_WIDTH) {
      p1score++
      $("#P1score").text("Player1 score: " + p1score)
      startBall()
    }
    if(doCollide(ball, leftPaddle)){ 
      obj.x = obj.x - obj.speedX;
      obj.speedX *= -1;
    }
  }
  function doCollide(square1, square2) { 
    square1.leftX = square1.x;
    square1.topY = square1.y;
    square1.rightX = square1.x+square1.width;
    square1.bottomY = square1.y+square1.height;
    // TODO: Do the same for square2
    square2.leftX = square2.x;
    square2.topY = square2.y;
    square2.rightX = square2.x+square2.width;
    square2.bottomY = square2.y+square2.height;
    //debugger;
    // TODO: Return true if they are overlapping, false otherwise
    if(square1.leftX > square2.rightX){
      return false;
    } else if(square1.rightX < square2.leftX){
      return false;
    } else if(square1.topY > square2.bottomY){
      return false;
    } else if(square1.bottomY < square2.topY){
      return false;
    } else {
      return true;
    }
    // Hint: use the following conditions:
      // red left < blue right
      // red right > blue left
      // red top < blue bottom
      // red bottom > blue top
  }
  function checkScore() { 
    if (p1score >= 10) {
      alert("Player 1 wins!")
      endGame()
    }
    if (p2score >= 10) {
      alert("Player 2 wins!")
      endGame()
    }
  }
  function endGame() { 
    clearInterval(interval);

    
    $(document).off();
  }
  
}
