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
		console.log('set to 1 a');
	}
	return hilbert;
}

function drawL2(hilbert,H4,L4){
	for(var j = L4-1; j < 3*L4-1; j++){
		hilbert._data[H4][j] = 1;
		console.log('set to 1 b: ', H4, j);
	}
	return hilbert;
}

function drawL3(hilbert,H4,L4){
	for(var k = H4-1; k < 3*H4-1; k++){
		hilbert._data[k][3*L4] = 1;
		console.log('set to 1 c');
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
	for(var i =0; i <n; i++){
		for(var j=0; j<n; j++){
			hilbert._data[th+i][tw+j] = matrix._data[th+j][tw+i]
		}
	}
	return hilbert;
}

//function to rotate right on square nxn matrix with top corner at height = th, width = tw
function reflectHorizMatrix(matrix,hilbert,n,th,tw){
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			hilbert._data[th+i][tw+n-j-1] = matrix._data[i][j];
		}	
	}
	return hilbert;
}

function rotateRight(matrix,hilbert,n,th,tw){
	reflectHorizMatrix(transposeSquareMatrix(matrix,hilbert,n,th,tw));
	return hilbert;
}



//split into 4 quadrants and draw four unicornshoes
function drawFourSmall(matrix,hilbert,n){
	for(var i=0; i<n/2; i++){
		for(var j=0; j<n/2; j++){
			hilbert._data[i][j]=matrix._data[2*i][2*j];
			hilbert._data[i+n/2][j]=matrix._data[2*i][2*j];
			hilbert._data[i][j+n/2]=matrix._data[2*i][2*j];
			hilbert._data[i+n/2][j+n/2]=matrix._data[2*i][2*j];
		}
	}

	return hilbert;
}

function rotateQuadrants(foursmall,hilbert,n){
//lower left - rotateRight
	rotateRight(foursmall,hilbert,n/2,n/2,0);
// top left - do nothing

// top right - reflectHorizMatrix
	reflectHorizMatrix(foursmall,hilbert,n/2,0,0);

// lower right - transposeSquareMatrix	
	transposeSquareMatrix(foursmall,hilbert,n/2,n/2,n/2);
}


function drawUnicornShoe(squareunicornmatrix,hilbert,n,itnum,h,sw){
	//h,sw are height and width of output
	//n -- should = h?
	//drawFourSmall
	var foursmall = drawFourSmall(squareunicornmatrix,hilbert,n);
	//rotateQuadrants
	rotateQuadrants(foursmall,hilbert,n);

	//connectshoes
	size = math.pow(2,itnum);
	for(var i=0;i < h/(4*size); i++){
		var a = h/2-h/(8*size)+i;
		var b = h/(8*size);
		hilbert._data[a][b] = 1;
	}
	for(var i=0;i < h/(4*size); i++){
		hilbert._data[h/2-h/(8*size)][sw/2-h/(8*size)+i] = 1;
	}
	for(var i=0;i < h/(4*size); i++){
		hilbert._data[h/2-h/(8*size)+i][sw-h/(8*size)] = 1;
	}
	return hilbert;
}

function displayLeftandRightShoes(squareunicornmatrix,hilbert,n,itnum,h,sw){

	//leftshoe
	// drawUnicornShoe(squareunicornmatrix,hilbert,n,itnum,h,sw);
	//rightshoe
	reflectHorizMatrix(squareunicornmatrix,hilbert,n,0,sw);

	//connect left and right shoe
	// console.log(h/(4*size));
	var size = math.pow(2,itnum);

	for(var i=0; i < h/(2*size); i++){
		var a = 3*h/(4*size);
		var b = sw- h/(4*size) + i;
		hilbert._data[a][b] = 1;
	}
	return hilbert;
}

function hilbertCurve() {
	//basecase
	var itnum = 0;
	horseshoe = drawHorseshoe(hilbert,h,sw);
	hilbert = displayLeftandRightShoes(horseshoe,hilbert,h,itnum,h,sw);

	squareunicornmatrix = horseshoe;
	//induction

	// return 'done';
	// for(var i=0;i<5;i++){
	// 	// hilbert = math.zeros(w,h);
	// 	// horseshoe = drawHorseshoe(hilbert,h,sw);

	// 	// animate
	// 	// function() {

	// 	// }

	// 	squareunicornmatrix = drawUnicornShoe(squareunicornmatrix,hilbert,h,itnum,h,sw);
	// 	hilbert = displayLeftandRightShoes(squareunicornmatrix,hilbert,h,itnum,h,sw);
	// 	itnum++;

	// 	//then print hilbert
	// }
	// drawHilbert(hilbert);


	// animate
	function animateHilbert() {
		squareunicornmatrix = drawUnicornShoe(squareunicornmatrix,hilbert,h,itnum,h,sw);
		hilbert = displayLeftandRightShoes(squareunicornmatrix,hilbert,h,itnum,h,sw);
		itnum++;
		if (itnum > 1) return;
		drawHilbert(hilbert);

		setTimeout(animateHilbert, 1000, false);
	}

	animateHilbert();
}

function drawHilbert(hilbert) {
	background(0);
	noStroke();
	fill(255, 0, 0);
	var m = hilbert.size()[0]; // 512
	var n = hilbert.size()[1]; // 1024
	for (var i = 0; i < m; i++) {
		for (var j = 0; j < n; j++) {
			if (hilbert._data[i][j] === 1) {
				// console.log(i, j);
				if (hiddenCanvas.pixels) {
					var c = hiddenCanvas.get(i, j, 1, 1);
					fill(c);
				}
				rect(j, i, 1, 1);
			}
		}
	}
	return 'done drawing';
}

