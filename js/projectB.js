// Chapter 5: ColoredTriangle.js (c) 2012 matsuda  AND
// Chapter 4: RotatingTriangle_withButtons.js (c) 2012 matsuda
// BasicShapes.js  MODIFIED for EECS 351-1, 
//									Northwestern Univ. Jack Tumblin
// became:
//
// McMichenTommy_ProjB.js MODIFIED for COMP_SCI 351
//									Northwestern Univ. Tommy McMichen

// Vertex shader program----------------------------------
var VSHADER_SOURCE = 
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program----------------------------------
var FSHADER_SOURCE = 
//  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
//  '#endif GL_ES\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// Global Variables
var ANGLE_STEP = 45.0;		// Rotation angle rate (degrees/second)

/* # of Float32Array elements used for each vertex
 *   (x,y,z,w)position + (r,g,b)color
 *   Later, see if you can add:
 *   (x,y,z) surface normal + (tx,ty) texture addr.
 */
var floatsPerVertex = 7;

var g_canvas = document.getElementById('webgl');

var gl;

function main() {
  var canvas = g_canvas;
  
  gl = getWebGLContext(canvas);
  
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  var n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Enable 3D depth-test when drawing: don't over-draw at any pixel 
	// unless the new Z value is closer to the eye than the old one..
	gl.enable(gl.DEPTH_TEST);

  // Get handle to graphics system's storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  window.addEventListener("keydown", myKeyDown, false);
	window.addEventListener("keyup", myKeyUp, false);

	// MOUSE:
	window.addEventListener("mousedown", myMouseDown); 
  window.addEventListener("mousemove", myMouseMove); 
	window.addEventListener("mouseup", myMouseUp);	
	window.addEventListener("click", myMouseClick);				
	window.addEventListener("dblclick", myMouseDblClick);

  // Create the local viewing matrices.
  var modelMatrix = new Matrix4();
  
  // Create, init current rotation angle value in JavaScript
  var currentAngle = 0.0;

  resizeCanvas();

  // Start drawing: create 'tick' variable whose value is this function:
  var tick = function() {
    currentAngle = animate(currentAngle);

    // Clear <canvas>  colors AND the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // Create the perspective matrix
    modelMatrix.setIdentity();
    var aspect = (g_canvas.width / 2) / g_canvas.height;
    modelMatrix.perspective(
      35,   // FOVY: top-to-bottom vertical image angle, degrees
      aspect,   // Image Aspect Ratio
      1.0,   // camera z-near distance (always positive)
      1000.0  // camera z-far distance (always positive)
    );

    gl.viewport(
      0,
      0,
      g_canvas.width/2,
      g_canvas.height
    );
  
    drawAll(gl, n, currentAngle, modelMatrix, u_ModelMatrix);

    // Create the orthographic matrix
    modelMatrix.setIdentity();
    modelMatrix.ortho(
      -1.5,  // left
      1.5,   // right
      -1.0,  // bottom
      1.0,   // top
      1.0,   // near
      3001.0 // far
    );
    
    gl.viewport(
      g_canvas.width/2,
      0,
      g_canvas.width,
      g_canvas.height
    );
  
    drawAll(gl, n, currentAngle, modelMatrix, u_ModelMatrix);    
    
    requestAnimationFrame(tick, canvas);
  };

  tick();
}

function initVertexBuffer(gl) {
//==============================================================================
// Create one giant vertex buffer object (VBO) that holds all vertices for all
// shapes.
 
 	// Make each 3D shape in its own array of vertices:
  makeCylinder();					// create, fill the cylVerts array
  makeSphere();						// create, fill the sphVerts array
  makeTorus();						// create, fill the torVerts array
  makeGroundGrid();				// create, fill the gndVerts array
  // how many floats total needed to store all shapes?
	var mySiz = (cylVerts.length + sphVerts.length + 
							 torVerts.length + gndVerts.length);						

	// How many vertices total?
	var nn = mySiz / floatsPerVertex;
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex);
  
	// Copy all shapes into one big Float32 array:
  var colorShapes = new Float32Array(mySiz);
  
	// Copy them:  remember where to start for each shape:
	cylStart = 0;							// we stored the cylinder first.
  for(i=0,j=0; j< cylVerts.length; i++,j++) {
  	colorShapes[i] = cylVerts[j];
	}
  
	sphStart = i;						// next, we'll store the sphere;
	for(j=0; j< sphVerts.length; i++, j++) {
		colorShapes[i] = sphVerts[j];
	}
  
	torStart = i;						// next, we'll store the torus;
	for(j=0; j < torVerts.length; i++, j++) {
		colorShapes[i] = torVerts[j];
	}

  gndStart = i;						// next we'll store the ground-plane;
	for(j=0; j< gndVerts.length; i++, j++) {
		colorShapes[i] = gndVerts[j];
		}
  // Create a buffer object on the graphics hardware:
  var shapeBufferHandle = gl.createBuffer();  
  if (!shapeBufferHandle) {
    console.log('Failed to create the shape buffer object');
    return false;
  }

  // Bind the the buffer object to target:
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferHandle);
  // Transfer data from Javascript array colorShapes to Graphics system VBO
  // (Use sparingly--may be slow if you transfer large shapes stored in files)
  gl.bufferData(gl.ARRAY_BUFFER, colorShapes, gl.STATIC_DRAW);
    
  //Get graphics system's handle for our Vertex Shader's position-input variable: 
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  var FSIZE = colorShapes.BYTES_PER_ELEMENT; // how many bytes per stored value?

  // Use handle to specify how to retrieve **POSITION** data from our VBO:
  gl.vertexAttribPointer(
  		a_Position, 	// choose Vertex Shader attribute to fill with data
  		4, 						// how many values? 1,2,3 or 4.  (we're using x,y,z,w)
  		gl.FLOAT, 		// data type for each value: usually gl.FLOAT
  		false, 				// did we supply fixed-point data AND it needs normalizing?
  		FSIZE * floatsPerVertex, // Stride -- how many bytes used to store each vertex?
  									// (x,y,z,w, r,g,b) * bytes/value
  		0);						// Offset -- now many bytes from START of buffer to the
  									// value we will actually use?
  gl.enableVertexAttribArray(a_Position);  
  									// Enable assignment of vertex buffer object's position data

  // Get graphics system's handle for our Vertex Shader's color-input variable;
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // Use handle to specify how to retrieve **COLOR** data from our VBO:
  gl.vertexAttribPointer(
  	a_Color, 				// choose Vertex Shader attribute to fill with data
  	3, 							// how many values? 1,2,3 or 4. (we're using R,G,B)
  	gl.FLOAT, 			// data type for each value: usually gl.FLOAT
  	false, 					// did we supply fixed-point data AND it needs normalizing?
  	FSIZE * 7, 			// Stride -- how many bytes used to store each vertex?
  									// (x,y,z,w, r,g,b) * bytes/value
  	FSIZE * 4);			// Offset -- how many bytes from START of buffer to the
  									// value we will actually use?  Need to skip over x,y,z,w
  									
  gl.enableVertexAttribArray(a_Color);  
  									// Enable assignment of vertex buffer object's position data

	//--------------------------------DONE!
  // Unbind the buffer object 
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return nn;
}

// simple & quick-- 
// I didn't use any arguments such as color choices, # of verts,slices,bars, etc.
// YOU can improve these functions to accept useful arguments...
//
function makeDiamond() {
//==============================================================================
// Make a diamond-like shape from two adjacent tetrahedra, aligned with Z axis.

	// YOU write this one...
	
}

function makePyramid() {
//==============================================================================
// Make a 4-cornered pyramid from one OpenGL TRIANGLE_STRIP primitive.
// All vertex coords are +/1 or zero; pyramid base is in xy plane.

  	// YOU write this one...
}


function makeCylinder() {
//==============================================================================
// Make a cylinder shape from one TRIANGLE_STRIP drawing primitive, using the
// 'stepped spiral' design described in notes.
// Cylinder center at origin, encircles z axis, radius 1, top/bottom at z= +/-1.
//
 var ctrColr = new Float32Array([0.2, 0.2, 0.2]);	// dark gray
 var topColr = new Float32Array([0.4, 0.7, 0.4]);	// light green
 var botColr = new Float32Array([0.5, 0.5, 1.0]);	// light blue
 var capVerts = 16;	// # of vertices around the topmost 'cap' of the shape
 var botRadius = 1.6;		// radius of bottom of cylinder (top always 1.0)
 
 // Create a (global) array to hold this cylinder's vertices;
 cylVerts = new Float32Array(  ((capVerts*6) -2) * floatsPerVertex);
										// # of vertices * # of elements needed to store them. 

	// Create circle-shaped top cap of cylinder at z=+1.0, radius 1.0
	// v counts vertices: j counts array elements (vertices * elements per vertex)
	for(v=1,j=0; v<2*capVerts; v++,j+=floatsPerVertex) {	
		// skip the first vertex--not needed.
		if(v%2==0)
		{				// put even# vertices at center of cylinder's top cap:
			cylVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,1,1
			cylVerts[j+1] = 0.0;	
			cylVerts[j+2] = 1.0; 
			cylVerts[j+3] = 1.0;			// r,g,b = topColr[]
			cylVerts[j+4]=ctrColr[0]; 
			cylVerts[j+5]=ctrColr[1]; 
			cylVerts[j+6]=ctrColr[2];
		}
		else { 	// put odd# vertices around the top cap's outer edge;
						// x,y,z,w == cos(theta),sin(theta), 1.0, 1.0
						// 					theta = 2*PI*((v-1)/2)/capVerts = PI*(v-1)/capVerts
			cylVerts[j  ] = Math.cos(Math.PI*(v-1)/capVerts);			// x
			cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts);			// y
			//	(Why not 2*PI? because 0 < =v < 2*capVerts, so we
			//	 can simplify cos(2*PI * (v-1)/(2*capVerts))
			cylVerts[j+2] = 1.0;	// z
			cylVerts[j+3] = 1.0;	// w.
			// r,g,b = topColr[]
			cylVerts[j+4]=topColr[0]; 
			cylVerts[j+5]=topColr[1]; 
			cylVerts[j+6]=topColr[2];			
		}
	}
	// Create the cylinder side walls, made of 2*capVerts vertices.
	// v counts vertices within the wall; j continues to count array elements
	for(v=0; v< 2*capVerts; v++, j+=floatsPerVertex) {
		if(v%2==0)	// position all even# vertices along top cap:
		{		
				cylVerts[j  ] = Math.cos(Math.PI*(v)/capVerts);		// x
				cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts);		// y
				cylVerts[j+2] = 1.0;	// z
				cylVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
				cylVerts[j+4]=topColr[0]; 
				cylVerts[j+5]=topColr[1]; 
				cylVerts[j+6]=topColr[2];			
		}
		else		// position all odd# vertices along the bottom cap:
		{
				cylVerts[j  ] = botRadius * Math.cos(Math.PI*(v-1)/capVerts);		// x
				cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v-1)/capVerts);		// y
				cylVerts[j+2] =-1.0;	// z
				cylVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
				cylVerts[j+4]=botColr[0]; 
				cylVerts[j+5]=botColr[1]; 
				cylVerts[j+6]=botColr[2];			
		}
	}
	// Create the cylinder bottom cap, made of 2*capVerts -1 vertices.
	// v counts the vertices in the cap; j continues to count array elements
	for(v=0; v < (2*capVerts -1); v++, j+= floatsPerVertex) {
		if(v%2==0) {	// position even #'d vertices around bot cap's outer edge
			cylVerts[j  ] = botRadius * Math.cos(Math.PI*(v)/capVerts);		// x
			cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v)/capVerts);		// y
			cylVerts[j+2] =-1.0;	// z
			cylVerts[j+3] = 1.0;	// w.
			// r,g,b = topColr[]
			cylVerts[j+4]=botColr[0]; 
			cylVerts[j+5]=botColr[1]; 
			cylVerts[j+6]=botColr[2];		
		}
		else {				// position odd#'d vertices at center of the bottom cap:
			cylVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,-1,1
			cylVerts[j+1] = 0.0;	
			cylVerts[j+2] =-1.0; 
			cylVerts[j+3] = 1.0;			// r,g,b = botColr[]
			cylVerts[j+4]=botColr[0]; 
			cylVerts[j+5]=botColr[1]; 
			cylVerts[j+6]=botColr[2];
		}
	}
}

function makeSphere() {
//==============================================================================
// Make a sphere from one OpenGL TRIANGLE_STRIP primitive.   Make ring-like 
// equal-lattitude 'slices' of the sphere (bounded by planes of constant z), 
// and connect them as a 'stepped spiral' design (see makeCylinder) to build the
// sphere from one triangle strip.
  var slices = 13;		// # of slices of the sphere along the z axis. >=3 req'd
											// (choose odd # or prime# to avoid accidental symmetry)
  var sliceVerts	= 27;	// # of vertices around the top edge of the slice
											// (same number of vertices on bottom of slice, too)
  var topColr = new Float32Array([0.7, 0.7, 0.7]);	// North Pole: light gray
  var equColr = new Float32Array([0.3, 0.7, 0.3]);	// Equator:    bright green
  var botColr = new Float32Array([0.9, 0.9, 0.9]);	// South Pole: brightest gray.
  var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.

	// Create a (global) array to hold this sphere's vertices:
  sphVerts = new Float32Array(  ((slices * 2* sliceVerts) -2) * floatsPerVertex);
										// # of vertices * # of elements needed to store them. 
										// each slice requires 2*sliceVerts vertices except 1st and
										// last ones, which require only 2*sliceVerts-1.
										
	// Create dome-shaped top slice of sphere at z=+1
	// s counts slices; v counts vertices; 
	// j counts array elements (vertices * elements per vertex)
	var cos0 = 0.0;					// sines,cosines of slice's top, bottom edge.
	var sin0 = 0.0;
	var cos1 = 0.0;
	var sin1 = 0.0;	
	var j = 0;							// initialize our array index
	var isLast = 0;
	var isFirst = 1;
	for(s=0; s<slices; s++) {	// for each slice of the sphere,
		// find sines & cosines for top and bottom of this slice
		if(s==0) {
			isFirst = 1;	// skip 1st vertex of 1st slice.
			cos0 = 1.0; 	// initialize: start at north pole.
			sin0 = 0.0;
		}
		else {					// otherwise, new top edge == old bottom edge
			isFirst = 0;	
			cos0 = cos1;
			sin0 = sin1;
		}								// & compute sine,cosine for new bottom edge.
		cos1 = Math.cos((s+1)*sliceAngle);
		sin1 = Math.sin((s+1)*sliceAngle);
		// go around the entire slice, generating TRIANGLE_STRIP verts
		// (Note we don't initialize j; grows with each new attrib,vertex, and slice)
		if(s==slices-1) isLast=1;	// skip last vertex of last slice.
		for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {	
			if(v%2==0)
			{				// put even# vertices at the the slice's top edge
							// (why PI and not 2*PI? because 0 <= v < 2*sliceVerts
							// and thus we can simplify cos(2*PI(v/2*sliceVerts))  
				sphVerts[j  ] = sin0 * Math.cos(Math.PI*(v)/sliceVerts); 	
				sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts);	
				sphVerts[j+2] = cos0;		
				sphVerts[j+3] = 1.0;			
			}
			else { 	// put odd# vertices around the slice's lower edge;
							// x,y,z,w == cos(theta),sin(theta), 1.0, 1.0
							// 					theta = 2*PI*((v-1)/2)/capVerts = PI*(v-1)/capVerts
				sphVerts[j  ] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);		// x
				sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);		// y
				sphVerts[j+2] = cos1;																				// z
				sphVerts[j+3] = 1.0;																				// w.		
			}
			if(s==0) {	// finally, set some interesting colors for vertices:
				sphVerts[j+4]=topColr[0]; 
				sphVerts[j+5]=topColr[1]; 
				sphVerts[j+6]=topColr[2];	
				}
			else if(s==slices-1) {
				sphVerts[j+4]=botColr[0]; 
				sphVerts[j+5]=botColr[1]; 
				sphVerts[j+6]=botColr[2];	
			}
			else {
					sphVerts[j+4]=Math.random();// equColr[0]; 
					sphVerts[j+5]=Math.random();// equColr[1]; 
					sphVerts[j+6]=Math.random();// equColr[2];					
			}
		}
	}
}

function makeTorus() {
//==============================================================================
// 		Create a torus centered at the origin that circles the z axis.  
// Terminology: imagine a torus as a flexible, cylinder-shaped bar or rod bent 
// into a circle around the z-axis. The bent bar's centerline forms a circle
// entirely in the z=0 plane, centered at the origin, with radius 'rbend'.  The 
// bent-bar circle begins at (rbend,0,0), increases in +y direction to circle  
// around the z-axis in counter-clockwise (CCW) direction, consistent with our
// right-handed coordinate system.
// 		This bent bar forms a torus because the bar itself has a circular cross-
// section with radius 'rbar' and angle 'phi'. We measure phi in CCW direction 
// around the bar's centerline, circling right-handed along the direction 
// forward from the bar's start at theta=0 towards its end at theta=2PI.
// 		THUS theta=0, phi=0 selects the torus surface point (rbend+rbar,0,0);
// a slight increase in phi moves that point in -z direction and a slight
// increase in theta moves that point in the +y direction.  
// To construct the torus, begin with the circle at the start of the bar:
//					xc = rbend + rbar*cos(phi); 
//					yc = 0; 
//					zc = -rbar*sin(phi);			(note negative sin(); right-handed phi)
// and then rotate this circle around the z-axis by angle theta:
//					x = xc*cos(theta) - yc*sin(theta) 	
//					y = xc*sin(theta) + yc*cos(theta)
//					z = zc
// Simplify: yc==0, so
//					x = (rbend + rbar*cos(phi))*cos(theta)
//					y = (rbend + rbar*cos(phi))*sin(theta) 
//					z = -rbar*sin(phi)
// To construct a torus from a single triangle-strip, make a 'stepped spiral' 
// along the length of the bent bar; successive rings of constant-theta, using 
// the same design used for cylinder walls in 'makeCyl()' and for 'slices' in 
// makeSphere().  Unlike the cylinder and sphere, we have no 'special case' 
// for the first and last of these bar-encircling rings.
//
var rbend = 1.0;										// Radius of circle formed by torus' bent bar
var rbar = 0.5;											// radius of the bar we bent to form torus
var barSlices = 23;									// # of bar-segments in the torus: >=3 req'd;
																		// more segments for more-circular torus
var barSides = 13;										// # of sides of the bar (and thus the 
																		// number of vertices in its cross-section)
																		// >=3 req'd;
																		// more sides for more-circular cross-section
// for nice-looking torus with approx square facets, 
//			--choose odd or prime#  for barSides, and
//			--choose pdd or prime# for barSlices of approx. barSides *(rbend/rbar)
// EXAMPLE: rbend = 1, rbar = 0.5, barSlices =23, barSides = 11.

	// Create a (global) array to hold this torus's vertices:
 torVerts = new Float32Array(floatsPerVertex*(2*barSides*barSlices +2));
//	Each slice requires 2*barSides vertices, but 1st slice will skip its first 
// triangle and last slice will skip its last triangle. To 'close' the torus,
// repeat the first 2 vertices at the end of the triangle-strip.  Assume 7

var phi=0, theta=0;										// begin torus at angles 0,0
var thetaStep = 2*Math.PI/barSlices;	// theta angle between each bar segment
var phiHalfStep = Math.PI/barSides;		// half-phi angle between each side of bar
																			// (WHY HALF? 2 vertices per step in phi)
	// s counts slices of the bar; v counts vertices within one slice; j counts
	// array elements (Float32) (vertices*#attribs/vertex) put in torVerts array.
	for(s=0,j=0; s<barSlices; s++) {		// for each 'slice' or 'ring' of the torus:
		for(v=0; v< 2*barSides; v++, j+=7) {		// for each vertex in this slice:
			if(v%2==0)	{	// even #'d vertices at bottom of slice,
				torVerts[j  ] = (rbend + rbar*Math.cos((v)*phiHalfStep)) * 
																						 Math.cos((s)*thetaStep);
							  //	x = (rbend + rbar*cos(phi)) * cos(theta)
				torVerts[j+1] = (rbend + rbar*Math.cos((v)*phiHalfStep)) *
																						 Math.sin((s)*thetaStep);
								//  y = (rbend + rbar*cos(phi)) * sin(theta) 
				torVerts[j+2] = -rbar*Math.sin((v)*phiHalfStep);
								//  z = -rbar  *   sin(phi)
				torVerts[j+3] = 1.0;		// w
			}
			else {				// odd #'d vertices at top of slice (s+1);
										// at same phi used at bottom of slice (v-1)
				torVerts[j  ] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * 
																						 Math.cos((s+1)*thetaStep);
							  //	x = (rbend + rbar*cos(phi)) * cos(theta)
				torVerts[j+1] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) *
																						 Math.sin((s+1)*thetaStep);
								//  y = (rbend + rbar*cos(phi)) * sin(theta) 
				torVerts[j+2] = -rbar*Math.sin((v-1)*phiHalfStep);
								//  z = -rbar  *   sin(phi)
				torVerts[j+3] = 1.0;		// w
			}
			torVerts[j+4] = Math.random();		// random color 0.0 <= R < 1.0
			torVerts[j+5] = Math.random();		// random color 0.0 <= G < 1.0
			torVerts[j+6] = Math.random();		// random color 0.0 <= B < 1.0
		}
	}
	// Repeat the 1st 2 vertices of the triangle strip to complete the torus:
			torVerts[j  ] = rbend + rbar;	// copy vertex zero;
						  //	x = (rbend + rbar*cos(phi==0)) * cos(theta==0)
			torVerts[j+1] = 0.0;
							//  y = (rbend + rbar*cos(phi==0)) * sin(theta==0) 
			torVerts[j+2] = 0.0;
							//  z = -rbar  *   sin(phi==0)
			torVerts[j+3] = 1.0;		// w
			torVerts[j+4] = Math.random();		// random color 0.0 <= R < 1.0
			torVerts[j+5] = Math.random();		// random color 0.0 <= G < 1.0
			torVerts[j+6] = Math.random();		// random color 0.0 <= B < 1.0
			j+=7; // go to next vertex:
			torVerts[j  ] = (rbend + rbar) * Math.cos(thetaStep);
						  //	x = (rbend + rbar*cos(phi==0)) * cos(theta==thetaStep)
			torVerts[j+1] = (rbend + rbar) * Math.sin(thetaStep);
							//  y = (rbend + rbar*cos(phi==0)) * sin(theta==thetaStep) 
			torVerts[j+2] = 0.0;
							//  z = -rbar  *   sin(phi==0)
			torVerts[j+3] = 1.0;		// w
			torVerts[j+4] = Math.random();		// random color 0.0 <= R < 1.0
			torVerts[j+5] = Math.random();		// random color 0.0 <= G < 1.0
			torVerts[j+6] = Math.random();		// random color 0.0 <= B < 1.0
}

function makeGroundGrid() {
//==============================================================================
// Create a list of vertices that create a large grid of lines in the x,y plane
// centered at x=y=z=0.  Draw this shape using the GL_LINES primitive.

	var xcount = 100;			// # of lines to draw in x,y to make the grid.
	var ycount = 100;		
	var xymax	= 50.0;			// grid size; extends to cover +/-xymax in x and y.
 	var xColr = new Float32Array([1.0, 1.0, 0.3]);	// bright yellow
 	var yColr = new Float32Array([0.5, 1.0, 0.5]);	// bright green.
 	
	// Create an (global) array to hold this ground-plane's vertices:
	gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));
						// draw a grid made of xcount+ycount lines; 2 vertices per line.
						
	var xgap = xymax/(xcount-1);		// HALF-spacing between lines in x,y;
	var ygap = xymax/(ycount-1);		// (why half? because v==(0line number/2))
	
	// First, step thru x values as we make vertical lines of constant-x:
	for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
		if(v%2==0) {	// put even-numbered vertices at (xnow, -xymax, 0)
			gndVerts[j  ] = -xymax + (v  )*xgap;	// x
			gndVerts[j+1] = -xymax;								// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			gndVerts[j  ] = -xymax + (v-1)*xgap;	// x
			gndVerts[j+1] = xymax;								// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		gndVerts[j+4] = xColr[0];			// red
		gndVerts[j+5] = xColr[1];			// grn
		gndVerts[j+6] = xColr[2];			// blu
	}
	// Second, step thru y values as wqe make horizontal lines of constant-y:
	// (don't re-initialize j--we're adding more vertices to the array)
	for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
		if(v%2==0) {		// put even-numbered vertices at (-xymax, ynow, 0)
			gndVerts[j  ] = -xymax;								// x
			gndVerts[j+1] = -xymax + (v  )*ygap;	// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		else {					// put odd-numbered vertices at (+xymax, ynow, 0).
			gndVerts[j  ] = xymax;								// x
			gndVerts[j+1] = -xymax + (v-1)*ygap;	// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		gndVerts[j+4] = yColr[0];			// red
		gndVerts[j+5] = yColr[1];			// grn
		gndVerts[j+6] = yColr[2];			// blu
	}
}

var g_rate = 0.05;
var g_movingX = 0.0;
var g_movingY = 0.0;
var g_movingZ = 0.0;
var g_lookingX = 0.0;
var g_lookingY = 0.0;
var g_lookingZ = 0.0;
var g_camX = 5.0;
var g_camY = 5.0;
var g_camZ = 5.0;
var g_lookX = 0.0;
var g_lookY = 0.0;
var g_lookZ = 0.0;

function drawAll(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
//==============================================================================
  
  // Create the view matrix...
  modelMatrix.lookAt(
    g_camX,  g_camY,  g_camZ,	  // center of projection
    g_lookX, g_lookY, g_lookZ,	// look-at point 
    0,       0,       1 	      // View UP vector.
  );


  //===========================================================
  //
  pushMatrix(modelMatrix);     // SAVE world coord system;
  {
    	//-------Draw Spinning Cylinder:
    modelMatrix.translate(-0.4,-0.4, 0.0);  // 'set' means DISCARD old matrix,
    						// (drawing axes centered in CVV), and then make new
    						// drawing axes moved to the lower-left corner of CVV. 
    modelMatrix.scale(0.2, 0.2, 0.2);
    						// if you DON'T scale, cyl goes outside the CVV; clipped!
    modelMatrix.rotate(currentAngle, 0, 1, 0);  // spin around y axis.
  	// Drawing:
    // Pass our current matrix to the vertex shaders:
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // Draw the cylinder's vertices, and no other vertices:
    gl.drawArrays(gl.TRIANGLE_STRIP,
    							cylStart/floatsPerVertex,
    							cylVerts.length/floatsPerVertex);
  }
  modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
  //===========================================================
  //  
  pushMatrix(modelMatrix);  // SAVE world drawing coords.
  {
    //--------Draw Spinning Sphere
    modelMatrix.translate( 0.8, 0.8, 0.0);
    modelMatrix.scale(0.3, 0.3, 0.3);
    // Make it smaller:
    //modelMatrix.rotate(g_sphereAngleX, 1, 0, 0);
    //modelMatrix.rotate(g_sphereAngleY, 0, 1, 0);
    
    var sphereMatrix = new Matrix4();
    sphereMatrix.setIdentity();
    sphereMatrix.rotate(g_sphereAngleX, 1, 0, 0);
    sphereMatrix.rotate(g_sphereAngleY, 0, 1, 0);

    modelMatrix.concat(sphereMatrix);

    // Pass our current matrix to the vertex shaders:
    gl.uniformMatrix4fv(
      u_ModelMatrix,
      false,
      modelMatrix.elements
    );
    
    // Draw just the sphere's vertices
    gl.drawArrays(gl.TRIANGLE_STRIP,
    							sphStart/floatsPerVertex,
    							sphVerts.length/floatsPerVertex);
  }
  modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
  
  //===========================================================
  //  
  pushMatrix(modelMatrix);  // SAVE world drawing coords.
  //--------Draw Spinning torus 1
  {
    modelMatrix.translate(-1.0, 1.0, 0.0);
  
    modelMatrix.scale(0.2, 0.2, 0.2);
    modelMatrix.rotate(g_torusAngle1, 0, 0, 1);

    //=========================================================
    //  
    pushMatrix(modelMatrix);  // SAVE world drawing coords.
    //--------Draw Spinning torus 2
    {
      modelMatrix.translate(0.0, 2.4, 0.0);
      modelMatrix.scale(0.8, 0.8, 0.8);
      modelMatrix.rotate(g_torusAngle2, 0, 0, 1);
      //=======================================================
      //  
      pushMatrix(modelMatrix);  // SAVE world drawing coords.
      //--------Draw Spinning torus 3
      {
        modelMatrix.translate(0.0, 2.4, 0.0);
        modelMatrix.scale(0.8, 0.8, 0.8);
        modelMatrix.rotate(g_torusAngle3, 0, 0, 1);
        //=====================================================
        //  
        pushMatrix(modelMatrix);  // SAVE world drawing coords.
        //--------Draw Spinning torus 3
        {
          modelMatrix.translate(0.0, 2.4, 0.0);
          modelMatrix.scale(0.8, 0.8, 0.8);
          modelMatrix.rotate(g_torusAngle4, 0, 0, 1);
          

          // Drawing:		
    	    // Pass our current matrix to the vertex shaders:
          gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
          // Draw just the torus's vertices
          gl.drawArrays(gl.TRIANGLE_STRIP,
    						        torStart/floatsPerVertex,
    						        torVerts.length/floatsPerVertex);
        }
        modelMatrix = popMatrix();
        //=====================================================
        //  

        // Drawing:		
    	  // Pass our current matrix to the vertex shaders:
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        // Draw just the torus's vertices
        gl.drawArrays(gl.TRIANGLE_STRIP,
    						      torStart/floatsPerVertex,
    						      torVerts.length/floatsPerVertex);
      }
      modelMatrix = popMatrix();
      //=======================================================
      //
      

      // Drawing:		
    	// Pass our current matrix to the vertex shaders:
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      // Draw just the torus's vertices
      gl.drawArrays(gl.TRIANGLE_STRIP,
    						    torStart/floatsPerVertex,
    						    torVerts.length/floatsPerVertex);
    }
    modelMatrix = popMatrix();
    //=========================================================
    //

  	// Drawing:		
  	// Pass our current matrix to the vertex shaders:
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    		// Draw just the torus's vertices
    gl.drawArrays(gl.TRIANGLE_STRIP, 				// use this drawing primitive, and
    						  torStart/floatsPerVertex,	// start at this vertex number, and
    						  torVerts.length/floatsPerVertex);	// draw this many vertices.
  }
  modelMatrix = popMatrix();
  //===========================================================
  //
  pushMatrix(modelMatrix);
  //---------Draw Ground Plane, without spinning.
  {
  	// position it.
  	modelMatrix.translate( 0.6, -0.6, 0.0);
    // scale it.
  	modelMatrix.scale(0.1, 0.1, 0.1);

  	// Drawing:
  	// Pass our current matrix to the vertex shaders:
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // Draw just the ground-plane's vertices
    gl.drawArrays(
      gl.LINES,
    	gndStart/floatsPerVertex,
    	gndVerts.length/floatsPerVertex
    );
  }
  modelMatrix = popMatrix();
  //===========================================================
}

// Last time that this function was called:  (used for animation timing)
var g_last = Date.now();

var g_sphereAngleX = 0.0;
var g_sphereAngleY = 0.0;

var g_torusAngle1 = 0.0;
var g_torusAngle2 = 0.0;
var g_torusAngleMin2 = -30.0;
var g_torusAngleMax2 = 30.0;
var g_torusAngleDir2 = 1.0;
var g_torusAngle3 = 0.0;
var g_torusAngleMin3 = -30.0;
var g_torusAngleMax3 = 30.0;
var g_torusAngleDir3 = 1.0;
var g_torusAngle4 = 0.0;
var g_torusAngleMin4 = -30.0;
var g_torusAngleMax4 = 30.0;
var g_torusAngleDir4 = 1.0;

function animate(angle) {
//==============================================================================
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;    

  // Calculate the camera
  g_camX += g_movingX * g_rate;
  g_camY += g_movingY * g_rate;
  g_camZ += g_movingZ * g_rate;
  g_lookX += (g_lookingX * g_rate) + (g_movingX * g_rate);
  g_lookY += (g_lookingY * g_rate) + (g_movingY * g_rate);
  g_lookZ += (g_lookingZ * g_rate) + (g_movingZ * g_rate);

  // Calculate the toruses? tori?
  g_torusAngle1 += (ANGLE_STEP * elapsed) / 1000.0;
  g_torusAngle1 = g_torusAngle1 % 360;
  
  g_torusAngle2 += g_torusAngleDir2 * (ANGLE_STEP * elapsed) / 1000.0;
  if (g_torusAngle2 > g_torusAngleMax2) {
    g_torusAngleDir2 = -1.0;
  } else if (g_torusAngle2 < g_torusAngleMin2) {
    g_torusAngleDir2 = 1.0;
  }

  g_torusAngle3 += g_torusAngleDir3 * (ANGLE_STEP * elapsed) / 1000.0;
  if (g_torusAngle3 > g_torusAngleMax3) {
    g_torusAngleDir3 = -1.0;
  } else if (g_torusAngle3 < g_torusAngleMin3) {
    g_torusAngleDir3 = 1.0;
  }
  
  g_torusAngle4 += g_torusAngleDir4 * (ANGLE_STEP * elapsed) / 1000.0;
  if (g_torusAngle4 > g_torusAngleMax4) {
    g_torusAngleDir4 = -1.0;
  } else if (g_torusAngle4 < g_torusAngleMin4) {
    g_torusAngleDir4 = 1.0;
  }
  
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

//==================HTML Button Callbacks
function nextShape() {
	shapeNum += 1;
	if(shapeNum >= shapeMax) shapeNum = 0;
}

function spinDown() {
  ANGLE_STEP -= 25; 
}

function spinUp() {
  ANGLE_STEP += 25; 
}

function runStop() {
  if(ANGLE_STEP*ANGLE_STEP > 1) {
    myTmp = ANGLE_STEP;
    ANGLE_STEP = 0;
  }
  else {
  	ANGLE_STEP = myTmp;
  }
}
 
function myKeyDown(kev) {
	switch(kev.code) {
		//------------------Look-at keys---------------------
	case "KeyD":
    g_movingX = -1.0;
		break;
  case "KeyA":
    g_movingX = 1.0;
		break;
	case "KeyW":
    g_movingY = -1.0;
		break;
	case "KeyS":
    g_movingY = 1.0;
		break;
	case "KeyQ":
    g_movingZ = -1.0;
		break;
	case "KeyE":
    g_movingZ = 1.0;
		break;
		//----------------Look-at keys------------------------
  case "ArrowLeft":
    g_lookingX = 1.0;
  	break;
  case "ArrowRight":
    g_lookingX = -1.0;
		break;
	case "ArrowUp":
    g_lookingY = 1.0;
		break;
	case "ArrowDown":
    g_lookingY = -1.0;
  	break;
  case "Space":
    g_lookingZ = 1.0;
    break;
  case "ShiftLeft":
    g_lookingZ = -1.0;
    break;
  default:
    break;
	}
}

function myKeyUp(kev) {
	switch(kev.code) {
		//------------------Look-at keys---------------------
	case "KeyD":
    g_movingX = 0.0;
		break;
  case "KeyA":
    g_movingX = 0.0;
		break;
	case "KeyW":
    g_movingY = 0.0;
		break;
	case "KeyS":
    g_movingY = 0.0;
		break;
	case "KeyQ":
    g_movingZ = 0.0;
		break;
	case "KeyE":
    g_movingZ = 0.0;
		break;
		//----------------Look-at keys------------------------
  case "ArrowLeft":
    g_lookingX = 0.0;
  	break;
  case "ArrowRight":
    g_lookingX = 0.0;
		break;
	case "ArrowUp":
    g_lookingY = 0.0;
		break;
	case "ArrowDown":
    g_lookingY = 0.0;
  	break;
  case "Space":
    g_lookingZ = 0.0;
    break;
  case "ShiftLeft":
    g_lookingZ = 0.0;
    break;
  default:
    break;
	}
}

var g_xMclik = 0.0;
var g_yMclik = 0.0;
var g_isDrag = false;
var g_sphereMult = -30.0;

function myMouseDown(ev) {
  var rect = ev.target.getBoundingClientRect();
  var xp = ev.clientX - rect.left;
  var yp = g_canvas.height - (ev.clientY - rect.top);

  // Convert to Canonical View Volume (CVV) coordinates
  var x = (xp - g_canvas.width/2) / (g_canvas.width/2);
	var y = (yp - g_canvas.height/2) / (g_canvas.height/2);
	
	g_isDrag = true;
	g_xMclik = x;
	g_yMclik = y;
};


function myMouseMove(ev) {
	if(g_isDrag == false) {
    return;
  }
  
  var rect = ev.target.getBoundingClientRect();
  var xp = ev.clientX - rect.left;
	var yp = g_canvas.height - (ev.clientY - rect.top);

  // Convert to Canonical View Volume (CVV) coordinates
  var x = (xp - g_canvas.width/2) / (g_canvas.width/2);
	var y = (yp - g_canvas.height/2) / (g_canvas.height/2);

	g_sphereAngleX += g_sphereMult * (x - g_xMclik);
	g_sphereAngleY += g_sphereMult * (y - g_yMclik);

	g_xMclik = x;
	g_yMclik = y;
};

function myMouseUp(ev) {
  var rect = ev.target.getBoundingClientRect();
  var xp = ev.clientX - rect.left;
	var yp = g_canvas.height - (ev.clientY - rect.top);
  
	// Convert to Canonical View Volume (CVV) coordinates
  var x = (xp - g_canvas.width/2) / (g_canvas.width/2);
	var y = (yp - g_canvas.height/2) / (g_canvas.height/2);
	
	g_isDrag = false;
  
	// accumulate any final bit of mouse-dragging we did:
	g_sphereAngleX += g_sphereMult * (x - g_xMclik);
	g_sphereAngleY += g_sphereMult * (y - g_yMclik);
}

function myMouseClick(ev) {
  // Do nothing.
}	

function myMouseDblClick(ev) {
  g_sphereAngleY = 0.0;
  g_sphereAngleX = 0.0;
}

function resizeCanvas() {	
	//Make canvas fill the top 2/3 of our browser window:
	var xtraMargin = 16;    // keep a margin (otherwise, browser adds scroll-bars)
	g_canvas.width = (innerWidth - xtraMargin);
	g_canvas.height = (innerHeight*(2/3)) - xtraMargin;
}
