/* global $, sessionStorage */

////////////////////////////////////////////////////////////////////////////////
///////////////////////// VARIABLE DECLARATIONS ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var board = $('#board');
var scoreElement = $('#score');
var highScoreElement = $('#highScore');

var score = 0;
var started = false;
var apple = {};
const snake = {};

var ROWS = 20;
var COLUMNS = 20;
var SQUARE_SIZE = 20;
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// Rainbow Theme Variables
const RAINBOW_COLORS = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3'  // Violet
];
var colorIndex = 0;

var updateInterval;
var nextDirection = 'right'; // Buffer for the next move

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME SETUP //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

$('body').on('keydown', handleKeyDown);

setupSettings();
init();

function init() {
  snake.body = []; 
  makeSnakeSquare(10, 10); 
  snake.head = snake.body[0]; 
  snake.head.direction = 'right';
  nextDirection = 'right';

  makeApple();

  var currentSpeed = getSpeedFromSlider();
  updateInterval = setInterval(update, currentSpeed);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// PROGRAM FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function update() {
  if (started) {
    moveSnake();
  }

  if (hasHitWall() || hasCollidedWithSnake()) {
    endGame();
    return;
  }

  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
}

function moveSnake() {
  // Update the head's direction from the buffered input
  snake.head.direction = nextDirection;

  // Move body segments from back to front
  for (var i = snake.body.length - 1; i > 0; i--) {
    var currentSnakeSquare = snake.body[i];
    var snakeSquareInFront = snake.body[i - 1];
    moveBodyAToBodyB(currentSnakeSquare, snakeSquareInFront);
    repositionSquare(currentSnakeSquare);
  }

  // Move the head based on direction
  if (snake.head.direction === 'left') {
    snake.head.column -= 1;
  } else if (snake.head.direction === 'right') {
    snake.head.column += 1;
  } else if (snake.head.direction === 'up') {
    snake.head.row -= 1;
  } else if (snake.head.direction === 'down') {
    snake.head.row += 1;
  }

  repositionSquare(snake.head);
}

function moveBodyAToBodyB(bodyA, bodyB) {
  bodyA.row = bodyB.row;
  bodyA.column = bodyB.column;
}

function hasHitWall() {
  return (
    snake.head.column < 0 ||
    snake.head.column >= COLUMNS ||
    snake.head.row < 0 ||
    snake.head.row >= ROWS
  );
}

function hasCollidedWithApple() {
  return snake.head.column === apple.column && snake.head.row === apple.row;
}

function handleAppleCollision() {
  score++;
  scoreElement.text('Score: ' + score);

  triggerShake();

  // Rainbow logic: cycle color
  if ($('body').hasClass('theme-rainbow')) {
    colorIndex = (colorIndex + 1) % RAINBOW_COLORS.length;
    applyRainbowTheme();
  }

  apple.element.remove();
  makeApple();

  // Grow the snake: add square at current tail position
  var row = snake.tail.row;
  var column = snake.tail.column;
  makeSnakeSquare(row, column);
}

function hasCollidedWithSnake() {
  for (var i = 1; i < snake.body.length; i++) {
    var segment = snake.body[i];
    if (snake.head.row === segment.row && snake.head.column === segment.column) {
      return true;
    }
  }
  return false;
}

function endGame() {
  triggerShake();
  
  clearInterval(updateInterval);
  started = false;
  board.empty();

  highScoreElement.text('High Score: ' + calculateHighScore());
  scoreElement.text('Score: 0');
  score = 0;
  colorIndex = 0; // Reset rainbow

  setTimeout(init, 500);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function applyRainbowTheme() {
  if ($('body').hasClass('theme-rainbow')) {
    var currentColor = RAINBOW_COLORS[colorIndex];
    $('.snake').css('background-color', currentColor);
    $('#snake-head').css('background-color', '#FFFFFF'); // Keep head distinct
  } else {
    // Reset inline styles for other themes
    $('.snake').css('background-color', '');
  }
}

function triggerShake() {
  board.addClass('shake');
  setTimeout(function() {
    board.removeClass('shake');
  }, 200);
}

function makeApple() {
  apple.element = $('<div>').addClass('apple').appendTo(board);
  var pos = getRandomAvailablePosition();
  apple.row = pos.row;
  apple.column = pos.column;
  repositionSquare(apple);
}

function makeSnakeSquare(row, column) {
  const snakeSquare = { row: row, column: column };
  snakeSquare.element = $('<div>').addClass('snake').appendTo(board);

  if (snake.body.length === 0) {
    snakeSquare.element.attr('id', 'snake-head');
  }

  repositionSquare(snakeSquare);
  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;

  // Apply rainbow color to new segment if active
  if ($('body').hasClass('theme-rainbow')) applyRainbowTheme();
}

function handleKeyDown(event) {
  var key = event.which;

  // Start game on any arrow key
  if (key >= 37 && key <= 40) {
    started = true; 
  }

  // Direction buffer: Prevent turning directly backward
  if (key === KEY.LEFT && snake.head.direction !== 'right') {
    nextDirection = 'left';
  } else if (key === KEY.UP && snake.head.direction !== 'down') {
    nextDirection = 'up';
  } else if (key === KEY.RIGHT && snake.head.direction !== 'left') {
    nextDirection = 'right';
  } else if (key === KEY.DOWN && snake.head.direction !== 'up') {
    nextDirection = 'down';
  }
}

function repositionSquare(square) {
  var buffer = 20;
  square.element.css({
    left: (square.column * SQUARE_SIZE + buffer) + "px",
    top: (square.row * SQUARE_SIZE + buffer) + "px"
  });
}

function getRandomAvailablePosition() {
  var spaceIsAvailable = false;
  var pos = {};
  while (!spaceIsAvailable) {
    pos.column = Math.floor(Math.random() * COLUMNS);
    pos.row = Math.floor(Math.random() * ROWS);
    spaceIsAvailable = true;
    for (var i = 0; i < snake.body.length; i++) {
      if (pos.row === snake.body[i].row && pos.column === snake.body[i].column) {
        spaceIsAvailable = false;
        break;
      }
    }
  }
  return pos;
}

function calculateHighScore() {
  var highScore = sessionStorage.getItem('highScore') || 0;
  if (score > highScore) {
    sessionStorage.setItem('highScore', score);
    highScore = score;
    alert('New High Score!');
  }
  return highScore;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETTINGS LOGIC //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function getSpeedFromSlider() {
  var val = $('#speed-slider').val();
  if (val === "1") return 150; 
  if (val === "2") return 100; 
  return 60;                   
}

function setupSettings() {
  $('#settings-toggle').on('click', function() {
    $('#settings-menu').fadeToggle(200);
  });

  $('#speed-slider').on('input', function() {
    var val = $(this).val();
    var labels = { "1": "Slow", "2": "Normal", "3": "Fast" };
    $('#speed-label').text(labels[val]);

    if (started) {
      clearInterval(updateInterval);
      updateInterval = setInterval(update, getSpeedFromSlider());
    }
  });

  $('#theme-select').on('change', function() {
    var theme = $(this).val();
    $('body').removeClass('theme-neon theme-monochrome theme-rainbow');
    
    if (theme !== 'slate') {
      $('body').addClass('theme-' + theme);
    }
    
    applyRainbowTheme();
  });
}