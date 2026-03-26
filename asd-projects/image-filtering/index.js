// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here
//applyFilter(reddify);

smudge(image);

 applyFilterNoBackground(vintage);

applyFilterNoBackground(invert);

applyFilter(reddify);
applyFilterNoBackground(decreaseBlue);
applyFilter(increaseGreenByBlue);
applyFilterNoBackground(reddify);


  

  // do not change the below line of code
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2, 3 & 5: Create the applyFilter function here
function applyFilter(filterFunction){
   // Outer loop iterates through each row
  for (var i = 0; i < image.length; i++) {
    // Inner loop iterates through each pixel (column) in that row
    for (var j = 0; j < image[i].length; j++) {

      var pixel = image[i][j];

      var pixelArray = rgbStringToArray(pixel);

     filterFunction(pixelArray);


      var updatedPixel = rgbArrayToString(pixelArray);

      image[i][j] = updatedPixel;

      // Accessing each individual pixel
      //console.log(image[i][j]);
    }
  }
}

// TODO 9 Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunction) {
  
  var backgroundColor = image[0][0];


  for (var i = 0; i < image.length; i++) {
    for (var j = 0; j < image[i].length; j++) {
      

      if (image[i][j] !== backgroundColor) {
        
     
        var pixel = image[i][j];
        var pixelArray = rgbStringToArray(pixel);
        
        filterFunction(pixelArray);
        
        var updatedPixel = rgbArrayToString(pixelArray);
        image[i][j] = updatedPixel;
      }
    }
  }
}

// TODO 6: Create the keepInBounds function
function keepInBounds(num) {
  if (num < 0) {
    return 0;
  } else if (num > 255) {
    return 255;
  } else {
    return num;
  }
}
console.log(keepInBounds(-20));  // should print 0
console.log(keepInBounds(300));  // should print 255
console.log(keepInBounds(125));  // should print 125

// TODO 4: Create reddify filter function
function reddify(pixelArray) {
  pixelArray[RED] = 200;
}
var testArray = [100, 100, 100];
reddify(testArray);
console.log(testArray); // Should show [200, 100, 100]


// TODO 7 & 8: Create more filter functions
function decreaseBlue(pixelArray) {
  
  var newBlue = pixelArray[BLUE] - 50;

 
  pixelArray[BLUE] = keepInBounds(newBlue);
}

  function increaseGreenByBlue(pixelArray) {
  
  var currentGreen = pixelArray[GREEN];
  var currentBlue = pixelArray[BLUE];


  var newGreen = currentGreen + currentBlue;


  pixelArray[GREEN] = keepInBounds(newGreen);
  }


// CHALLENGE code goes below here
function vintage(pixelArray) {

  var warmRed = pixelArray[RED] + 40;
  var warmGreen = pixelArray[GREEN] + 20;

  
  var coolBlue = pixelArray[BLUE] - 30;

  pixelArray[RED] = keepInBounds(warmRed);
  pixelArray[GREEN] = keepInBounds(warmGreen);
  pixelArray[BLUE] = keepInBounds(coolBlue);
}

function invert(pixelArray) {
  
  pixelArray[RED] = 255 - pixelArray[RED];
  
  
  pixelArray[GREEN] = 255 - pixelArray[GREEN];
  pixelArray[BLUE] = 255 - pixelArray[BLUE];
}
function smudge(image) {
  
  for (var i = 0; i < image.length - 1; i++) {
    for (var j = 0; j < image[i].length; j++) {
      
      
      var currentPixel = rgbStringToArray(image[i][j]);
      var neighborPixel = rgbStringToArray(image[i+1][j]);

      
      var newRed = (currentPixel[RED] + neighborPixel[RED]) / 2;
      var newGreen = (currentPixel[GREEN] + neighborPixel[GREEN]) / 2;
      var newBlue = (currentPixel[BLUE] + neighborPixel[BLUE]) / 2;

     
      var blendedArray = [newRed, newGreen, newBlue];
      image[i][j] = rgbArrayToString(blendedArray);
    }
  }
}