var hiddenCanvas;
var visibleCanvas;
var cnvCtx;
var hiddenCtx;
var stateNum = 0
var pIndex = 0;
var percentLoadedSpan;
var img;

function setup() {
  pixelDensity(1);

  // create canvas
  visibleCanvas = createCanvas(1024, 512);
  cnvCtx = visibleCanvas.elt.getContext('2d');

  background(100);
  noStroke();
  
  textFont("Courier New");
  textStyle(BOLD);
  textSize(16);

  // Add an event for when a file is dropped onto the canvas
  visibleCanvas.drop(gotFile);

  percentLoadedSpan = select('#percent-num');
  initHilbert(width, height);
}

function draw() {
  noStroke();

  if (stateNum === 0) {
    fill(255);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text('Drag an image here.', width/2, height/2);
    noLoop();
  }

  // else if (stateNum === 1) {

  //   for (var i = 0; i < 800; i++) {
  //     drawNextPixel(pIndex);
  //     pIndex += 4;
  //     // var i = random
  //   }

  //   if (pIndex >= hiddenCanvas.pixels.length) {
  //     stateNum = 2;
  //   } else {
  //     var percentLoaded = pIndex/hiddenCanvas.pixels.length * 100;
  //     percentLoadedDiv.html('Percent loaded: ' + percentLoaded);
  //   }
  // }
  
  // else if (stateNum === 2) {
  //     var percentLoaded = Number(percentLoadedDiv.html().split(':')[1]);
  //     if (percentLoaded < 100) {
  //       percentLoaded += percentLoaded * 0.00000001;
  //       percentLoadedDiv.html('Percent loaded: ' + percentLoaded);
  //     } else {
  //       percentLoadedDiv.html('Percent loaded: ' + percentLoaded + '9');
  //     }
    
  // }
  
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

    img = createImg(file.data).hide();
    hiddenCanvas = createGraphics(width, height);
    
    hiddenCanvas.image(img, 0, 0, width, height);

    hiddenCtx = hiddenCanvas.elt.getContext('2d');
    hiddenCanvas.pixels = hiddenCtx.getImageData(0,0,width,height).data;

    hilbertCurve(hiddenCanvas.pixels);



  } else {
    console.log('Not an image file!');
  }
}