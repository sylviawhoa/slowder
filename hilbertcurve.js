// assuming image is w:h = 2:1

var w;
var h;

var hilbert = math.ones(w,h);

var sw = w/2;

//base case

function drawL1(hilbert,H4,L4){
	for(i = 3*H4-1; i > H4-1; i--){
		hilbert[i,L4] = 1;
	}
}

function drawL2(hilbert,H4,L4){
	for(j = L4-1; j < 3*L4-1; j++){
		hilbert[H4,j] = 1;
	}
}

function drawL3(hilbert,H4,L4){
	for(k = H4-1; k < 3*H4-1; k++){
		hilbert[k,3*L4] = 1;
	}
}

//draws the horseshoe shape upright in a square of dimensions h*sw
function drawHorseshoe(hilbert,h,sw){
	H4 = h/4;
	L4 = sw/4;
	drawL1(hilbert,H4,L4);
	drawL2(hilbert,H4,L4);
	drawL3(hilbert,H4,L4);
}


//function transpose a square nxn matrix with top corner at height = th, width = tw
function transposeSquareMatrix(matrix,hilbert,n,th,tw){
	for(i =0; i <n; i++){
		for(j=0; j<n; j++){
			hilbert[th+i][tw+j] = matrix[th+j][tw+i]
		}
	}
}

//function to rotate right on square nxn matrix with top corner at height = th, width = tw
function reflectHorizMatrix(matrix,hilbert,n,th,tw){
	for(i=0; i<n; i++){
		for(j=0; j<n; j++){
			hilbert[th+i][tw+n-j-1] = matrix[th+i][tw+j];
		}	
	}
}

function rotateRight(matrix,hilbert,n,th,hw){
	reflectHorizMatrix(transposeSquareMatrix(matrix,hilbert,n,th,tw));
}



//split into 4 quadrants and draw four unicornshoes
function drawFourSmall(matrix,hilbert,n){
	for(i=0; i<n/2; i++){
		for(j=0; j<n/2; j++){
			hilbert[i][j]=matrix[2*i][2*j];
			hilbert[i+n/2][j]=matrix[2*i][2*j];
			hilbert[i][j+n/2]=matrix[2*i][2*j];
			hilbert[i+n/2][j+n/2]=matrix[2*i][2*j];
		}
	}		
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
	for(i=0;i < size/4; i++){
		hilbert[h/2-size/8+i][size/8] = 1;
	}
	for(i=0;i < size/4; i++){
		hilbert[h/2-size/8][sw/2-size/8+i] = 1;
	}
	for(i=0;i < size/4; i++){
		hilbert[h/2-size/8+i][sw-size/8] = 1;
	}

}

function displayLeftandRightShoes(squareunicornmatrix,hilbert,n,itnum,h,sw){
	//leftshoe
	drawUnicornShoe(squareunicornmatrix,hilbert,n,itnum,h,sw);
	//rightshoe
	reflectHorizMatrix(hilbert,hilbert,n,0,sw);
	//connect left and right shoe
	for(i=0;i < size/4; i++){
		matrix[h/2-size/8][sw-size/8+i] = 1;
	}

}


hilbert = math.zeros(w,h);
//basecase
var itnum = 0;
horseshoe = drawHorseshoe(hilbert,h,sw);
displayLeftandRightShoes(horseshoe,h,itnum,h,sw);

squareunicornmatrix = horseshoe;
//induction

for(i=0;i<100;i++){
	hilbert = math.zeros(w,h);
	itnum++;
	displayLeftandRightShoes(squareunicornmatrix,hilbert,n,itnum,h,sw);
	//then print hilbert
}














