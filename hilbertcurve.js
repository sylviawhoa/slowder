// assuming image is w:h = 2:1

var w;
var h;
var hilbert, sw;

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
	for(var i = 0; i<n; i++){
		for(var j=0; j<n; j++){
			hilbert._data[i][2*sw-j]= hilbert._data[i][j];
		}
	}

	//
	//connect left and right shoe
	var size = math.pow(2,itnum);

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
	var maxIter = 9;

	squareunicornmatrix = math.zeros(h,h);
	hilbert = math.zeros(h,2*sw);
	squareunicornmatrix = drawHorseshoe(hilbert,h,sw);

	// animate
	function animateHilbert() {
		// alert('drawing');
		hilbert = math.zeros(h,2*sw);	
		hilbert = drawUnicornShoe(squareunicornmatrix,hilbert,h,itnum,h,sw);
		for(var i=0; i<h; i++){
			for(var j=0; j<h; j++){
				squareunicornmatrix._data[i][j]= hilbert._data[i][j];
			}
		}

		hilbert = displayLeftandRightShoes(squareunicornmatrix,hilbert,h,itnum+1,h,sw);


	itnum++;
	if (itnum > maxIter) return;


	drawHilbert(hilbert, origPixels);

		setTimeout(animateHilbert, 2000, false);
	}

	animateHilbert();
}

function drawHilbert(hilbert, origPixels) {
	// background(0);
	
	image(img, 0, 0, width, height);
	// var newPixels = cnvCtx.getImageData(0,0,width,height).data;
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
				// console.log(i, j);
				// if (hiddenCanvas.pixels) {
				// 	var c = hiddenCanvas.get(i, j, 1, 1);
				// 	fill(c);
				// }
				// for(var k=0; k<3; k++){
				newImageData.data[n*4*i+4*j+0]=0;
				newImageData.data[n*4*i+4*j+1]=0;
				newImageData.data[n*4*i+4*j+2]=0;
				// }
				numBlack++;
				//hiddenCanvas.pixels[i]
				// rect(j, i, 1, 1);
			}
		}
	}

	// show new pixels
	console.log('numblack: ' + numBlack);

	cnvCtx.putImageData(newImageData, 0, 0);
	console.log('here!');
	return 'done drawing';
}

