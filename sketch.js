var hiddenCanvas;
var visibleCanvas;
var stateNum = 0
var pIndex = 0;
var percentLoadedDiv;

function setup() {
  pixelDensity(1);

  // create canvas
  visibleCanvas = createCanvas(1024, 512);
  background(100);
  noStroke();

  // Add an event for when a file is dropped onto the canvas
  visibleCanvas.drop(gotFile);
  
  percentLoadedDiv = createDiv(' ');
  percentLoadedDiv.position(20, windowHeight - 20);
  percentLoadedDiv.style('background-color', '#22222');

  initHilbert(width, height);
}

function draw() {
  noStroke();

  if (stateNum === 0) {
    fill(255);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text('Drag an image onto the canvas.', width/2, height/2);
    noLoop();
  } else if (stateNum === 1) {

    for (var i = 0; i < 800; i++) {
      drawNextPixel(pIndex);
      pIndex += 4;
      // var i = random
    }

    if (pIndex >= hiddenCanvas.pixels.length) {
      stateNum = 2;
    } else {
      var percentLoaded = pIndex/hiddenCanvas.pixels.length * 100;
      percentLoadedDiv.html('Percent loaded: ' + percentLoaded);
    }
  }
  
  else if (stateNum === 2) {
      var percentLoaded = Number(percentLoadedDiv.html().split(':')[1]);
      if (percentLoaded < 100) {
        percentLoaded += percentLoaded * 0.00000001;
        percentLoadedDiv.html('Percent loaded: ' + percentLoaded);
      } else {
        percentLoadedDiv.html('Percent loaded: ' + percentLoaded + '9');
      }
    
  }
  
}

function drawNextPixel(p) {
  var r = hiddenCanvas.pixels[p];
  var g = hiddenCanvas.pixels[p + 1];
  var b = hiddenCanvas.pixels[p + 2];
  fill(r, g, b, 255);
  var x = p/4 % width;
  var y = (p/4/width) % height;
  rect(x, y, 1, 1);
}

function gotFile(file) {
  // If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it

    var img = createImg(file.data).hide();
    hiddenCanvas = createGraphics(width, height);
    
    hiddenCanvas.image(img, 0, 0, width, height);

    var ctx = hiddenCanvas.elt.getContext('2d');
    hiddenCanvas.pixels = ctx.getImageData(0,0,width,height).data;

    background(20);
    console.log(hiddenCanvas.pixels.length);
    
    stateNum = 1;
    loop();
  } else {
    console.log('Not an image file!');
  }
}