// assuming image is w:h = 2:1

var w;
var h;
var hilbert, sw;
// var itnum = 0;
// var hilbert2ndlast, hilbertlast;
var slowness = 800;
var height = 512;
var MAX = Math.log2(height) - 2;  //7 
var extra = 0;
var percentLoaded = 0;
var maxits = 100;
var gifct = 0;
// var basecase = 0;

function initHilbert(_w, _h) {
	w = _w;
	h = _h;
	hilbert = math.zeros(h,w);
	sw = w/2;
	console.log('init hilbert complete');
}

//base case

function drawL1(hilbert,H4,L4){
	for(var i = 3*H4-1; i > H4-1; i--){
		hilbert._data[i][L4] = 1;
	}
	return hilbert;
}

function drawL2(hilbert,H4,L4){
	for(var j = L4-1; j < 3*L4-1; j++){
		hilbert._data[H4][j] = 1;
	}
	return hilbert;
}

function drawL3(hilbert,H4,L4){
	for(var k = H4-1; k < 3*H4-1; k++){
		hilbert._data[k][3*L4] = 1;
	}
	return hilbert;
}

//draws the horseshoe shape upright in a square of dimensions h*sw
function drawHorseshoe(hilbert,h,sw){
	H4 = h/4;
	L4 = sw/4;
	hilbert = drawL1(hilbert,H4,L4);
	hilbert = drawL2(hilbert,H4,L4);
	hilbert = drawL3(hilbert,H4,L4);

	return hilbert;
}


//function transpose a square nxn matrix with top corner at height = th, width = tw
function transposeSquareMatrix(matrix,hilbert,n,th,tw){
	var orig = math.zeros(n,n);
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			orig._data[i][j] = matrix._data[i][j];
		}
	}
	for(var i =0; i <n; i++){
		for(var j=0; j<n; j++){
			hilbert._data[th+i][tw+j] = orig._data[j][i]
		}
	}
	return hilbert;
}

//function to rotate right on square nxn matrix with top corner at height = th, width = tw
function reflectHorizMatrix(matrix,hilbert,n,th,tw){
	var orig = math.zeros(n,n);
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			orig._data[i][j] = matrix._data[th+i][tw+j];
		}
	}
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			hilbert._data[th+i][tw+n-j] = orig._data[i][j];
		}	
	}
	return hilbert;
}

function rotateRight(matrix,hilbert,n,th,tw){
	hilbert = transposeSquareMatrix(matrix,hilbert,n,th,tw);
	reflectHorizMatrix(hilbert,hilbert,n,th,tw);
	return hilbert;
}

//split into 4 quadrants and draw four unicornshoes
function drawFourSmall(matrix,hilbert,n){
	var orig = math.zeros(n,n);
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			orig._data[i][j] = matrix._data[i][j];
		}
	}

	for(var i=0; i<n/2; i++){
		for(var j=0; j<n/2; j++){
			hilbert._data[i][j]=orig._data[2*i][2*j];
			hilbert._data[i+n/2][j]=orig._data[2*i][2*j];
			hilbert._data[i][j+n/2]=orig._data[2*i][2*j];
			hilbert._data[i+n/2][j+n/2]=orig._data[2*i][2*j];
		}
	}

	return hilbert;
}

function rotateQuadrants(foursmall,hilbert,n){
	var orig = math.zeros(n,n);
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			orig._data[i][j] = foursmall._data[i][j];
		}
	}	
//lower left - rotateRight
	rotateRight(orig,hilbert,n/2,n/2,0);
// top left - do nothing

// top right - reflectHorizMatrix
	hilbert = reflectHorizMatrix(orig,hilbert,n/2,0,0);

// lower right - transposeSquareMatrix	
	transposeSquareMatrix(orig,hilbert,n/2,n/2,n/2);
	return hilbert;
}


function drawUnicornShoe(squareunicornmatrix,hilbert,n,itnum,h,sw){
	var foursmall = drawFourSmall(squareunicornmatrix,hilbert,n);
	//rotateQuadrants
	rotateQuadrants(foursmall,hilbert,n);
//connectshoes
	size = math.pow(2,itnum);
	for(var i=0;i <= h/(4*size); i++){
		var a = h/2-h/(8*size)+i;
		var b = h/(8*size);
		hilbert._data[a][b] = 1;
	}
	for(var i=0;i <= h/(4*size); i++){
		hilbert._data[h/2-h/(8*size)][sw/2-h/(8*size)+i] = 1;
	}
	for(var i=0;i <= h/(4*size); i++){
		hilbert._data[h/2-h/(8*size)+i][sw-h/(8*size)] = 1;
	}

	
	return hilbert;
}

function displayLeftandRightShoes(squareunicornmatrix,hilbert,n,itnum,h,sw){

	//leftshoe - already there

	//rightshoe 
	var size;
	for(var i = 0; i<n; i++){
		for(var j=0; j<n; j++){
			hilbert._data[i][2*sw-j]= hilbert._data[i][j];
		}
	}

	//connect left and right shoe
	size = math.pow(2,itnum);

	for(var i=0; i < h/(2*size); i++){
		var a = h - h/(4*size);
		var b = sw- h/(4*size) + i;
		hilbert._data[a][b] = 1;
	}
	return hilbert;
}

function hilbertCurve(origPixels) {
	//basecase
	var itnum = 0;
	var basecase = 0;

	// animate
	function animateHilbert() {

		if(basecase ==0){	
			squareunicornmatrix = math.zeros(h,h);
			horseshoe = math.zeros(h,h);
			hilbert = math.zeros(h,2*sw);
			horseshoe = drawHorseshoe(hilbert,h,sw);
			for(var i=0; i<h; i++){
				for(var j=0; j<h; j++){
					squareunicornmatrix._data[i][j]= horseshoe._data[i][j];
				}
			}
			hilbert = displayLeftandRightShoes(horseshoe,hilbert,h,0,h,sw);
			drawHilbert(hilbert, origPixels);
			itnum++;
		
		}
	
		if(basecase > 0 && itnum < MAX){
			hilbert = math.zeros(h,2*sw);	
			hilbert = drawUnicornShoe(squareunicornmatrix,hilbert,h,itnum-1,h,sw);
			for(var i=0; i<h; i++){
				for(var j=0; j<h; j++){
					squareunicornmatrix._data[i][j]= hilbert._data[i][j];
				}
			}
			hilbert = displayLeftandRightShoes(squareunicornmatrix,hilbert,h,itnum,h,sw);
			drawHilbert(hilbert, origPixels);


			hilbert2ndlast = math.zeros(h,2*sw);
			for(var i=0; i<h; i++){
				for(var j=0; j<2*h; j++){
					hilbert2ndlast._data[i][j]= hilbert._data[i][j];
				}
			}
			itnum++;
			basecase = 0;
			

		}

		if(basecase > 0 && itnum == MAX){
			hilbert = math.zeros(h,2*sw);	
			hilbert = drawUnicornShoe(squareunicornmatrix,hilbert,h,itnum-1,h,sw);
			for(var i=0; i<h; i++){
				for(var j=0; j<h; j++){
					squareunicornmatrix._data[i][j]= hilbert._data[i][j];
				}
			}
			hilbert = displayLeftandRightShoes(squareunicornmatrix,hilbert,h,itnum,h,sw);

		
			hilbertlast = math.zeros(h,2*sw);
			for(var i=0; i<h; i++){
				for(var j=0; j<2*h; j++){
					hilbertlast._data[i][j]= hilbert._data[i][j];
				}
			}
			itnum++;

		}
		drawHilbert(hilbert, origPixels);
	    basecase++;

		
		if(itnum > MAX + maxits) return;

		
		if (itnum > MAX){

			if (itnum%2 == 1){
				hiddenCtx.drawImage(hiddenCanvas.elt, width/4 - 1, height/4 - 1, width/2, height/2, 0, 0, width, height);
				hiddenCanvas.pixels = hiddenCtx.getImageData(0,0,width,height).data;
				origPixels = hiddenCtx.getImageData(0,0,width,height).data;

				drawHilbert(hilbert2ndlast, origPixels, itnum);
			}

			else{
				drawHilbert(hilbertlast, origPixels, itnum);

			}
			extra++;
			itnum++;
		} 
		
		
		setTimeout(animateHilbert, slowness, false);


	}

	animateHilbert();
}

function drawHilbert(hilbert, origPixels, itnum) {
	// background(0);


	image(img, 0, 0, width, height);
	var newPixels = new Uint8ClampedArray(origPixels);
	var newImageData = new ImageData(newPixels, width, height);

	noStroke();
	fill(0, 0, 0);

	var m = hilbert.size()[0]; // 512
	var n = hilbert.size()[1]; // 1024

	var numBlack = 0;
	for (var i = 0; i < m; i++) {
		for (var j = 0; j < n; j++) {
			if (hilbert._data[i][j] === 0) {
				newImageData.data[n*4*i+4*j+0]=0;
				newImageData.data[n*4*i+4*j+1]=0;
				newImageData.data[n*4*i+4*j+2]=0;					

				numBlack++;	
			}
		}
	}

	// show new pixels
	cnvCtx.putImageData(newImageData, 0, 0);

	// update percent loaded HTML

	if(extra < 1) {
		percentLoaded = (100 * (m * n - numBlack) / (m*n)) ;
	
	}
	else{
		if(extra%2 == 0){
			percentLoaded += 100/Math.pow(2,2+extra/2);
		}
	}
	 

	percentLoadedSpan.html(percentLoaded);	

	// // update percent loaded canvas
	// fill(0,255,0);
	// text('Percent Loaded: ' + percentLoaded + '%', 20, height - 20);

	// saveCanvas('giffinal_' + gifct, 'png');	
	// gifct++;


	return 'done drawing';
}

