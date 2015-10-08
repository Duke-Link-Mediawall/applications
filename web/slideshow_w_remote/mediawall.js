var socket = io.connect();

// DEFINES  //*******************************************************************************************************************************************

var 	CURRENT_DIR = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + "/";
var		SLIDES_FILE_PATH = CURRENT_DIR + 'slides/';
var		TITLES_FILE_PATH = CURRENT_DIR + 'titles/';
var		FRAME_RATE = 60;
var		ALPHA_TRANSITION = 5;  //seconds to fade in/out
var		ALPHA_STEP = 1/(ALPHA_TRANSITION * FRAME_RATE); //alpha change each frame when fade in/out
var		SLIDE_ADVANCE_INTERVAL = 8; //seconds between alternating slides
var		TITLE_DISPLAY_ON = 10; //seconds to display title
var		TITLE_DISPLAY_INTERVAL = 60; //seconds between titles
var		OVERLAY_TIMEOUT = 120; //seconds of inactivity before slideshow resumes

// VARIABLES //*******************************************************************************************************************************************

var windowWidth, windowHeight;
var startTime = new Date().getTime();

var canvasFull, canvasOverlayLeft, canvasOverlayRight, canvasLeft, canvasRight;
var contextFull, contextOverlayLeft, contextOverlayRight, contextLeft, contextRight;
var elementFull, elementOverlayLeft, elementOverlayRight, elementLeft, elementRight; 

var slidesInfo, titlesInfo, exhibitInfo; 
var slides = []; 
var titles = [];
var isPreloaded = false;

// slides
var slideTimer = 0;
var slideChange = false; slideFade = true;
var slideChangeSide = 0; 	// 0 - left, 1 - right
var slideAdvance = 0; 		//slide iterator
var slideCurrent = [0,0]; 	//current slide playing on each side
var slideAlpha = [0,0]; 	//current alpha of each slide

// titles
var titleCurrent = 0; //iterator for current title image
var titleOn = true; // start slideshow with first title displayed
var titleTimer = 0;
var titleAlpha = 1;

// overlay
var overlayOn = false;
var overlayTimer = 0;
var overlayCurrent = [0,0];
var overlayAlpha = [0,0];

var faderAlpha = 1;

// VARIABLES //*******************************************************************************************************************************************

//load json files with configuration information
$.getJSON(CURRENT_DIR + "slides.json", function(json){slidesInfo = json;});
$.getJSON(CURRENT_DIR + "titles.json", function(json){titlesInfo = json;});
$.getJSON(CURRENT_DIR + "exhibitinfo.json", function(json){
	exhibitInfo = json;
	ALPHA_TRANSITION = exhibitInfo.fade_in_out_time;
	ALPHA_STEP = 1/(ALPHA_TRANSITION * FRAME_RATE);
	TITLE_DISPLAY_ON = exhibitInfo.title_on_duration; 
	TITLE_DISPLAY_INTERVAL = exhibitInfo.title_display_interval; 
	SLIDE_ADVANCE_INTERVAL = exhibitInfo.slide_advance_time;
	OVERLAY_TIMEOUT = exhibitInfo.overlay_timeout;
	document.title = exhibitInfo.title;
});

//preload images - slides and title images
function preload(){

	for(var i = 0; i < slidesInfo.slides.length; i++){
		slides[i] = new Image();
		slides[i].src = SLIDES_FILE_PATH + slidesInfo.slides[i].filename;
	}
	
	for(var i = 0; i < titlesInfo.titles.length; i++){
		titles[i] = new Image();
		titles[i].src = TITLES_FILE_PATH + titlesInfo.titles[i].filename;
	}
	isPreloaded = true;
}

// update loop - will not execute main logic / draw call until images have preloaded 
function update(){

	if ((!isPreloaded) && (slidesInfo != null) && (titlesInfo != null)) preload();
	if (isPreloaded){
	
		//slideshow update - new slide on alternating sides
		if ((!overlayOn) && (!titleOn)){
			slideTimer++;
			if (slideTimer >= (SLIDE_ADVANCE_INTERVAL*FRAME_RATE)) {slideChange = true; slideTimer = 0;}
			if (slideChange){
				if (slideAlpha[slideChangeSide] == 0) {
					slideCurrent[slideChangeSide] = slideAdvance; slideAdvance += 1;
					if (slideAdvance > slidesInfo.slides.length-1) slideAdvance = 0;
					slideFade = false;
					var thisElement;
					if (slideChangeSide == 0) thisElement = document.getElementById("label_left"); 
					else thisElement = document.getElementById("label_right"); 
					thisElement.getElementsByClassName("title")[0].innerHTML = slidesInfo.slides[slideCurrent[slideChangeSide]].title;
					thisElement.getElementsByClassName("author")[0].innerHTML = slidesInfo.slides[slideCurrent[slideChangeSide]].author;
					thisElement.getElementsByClassName("caption")[0].innerHTML = slidesInfo.slides[slideCurrent[slideChangeSide]].caption;
				}
				slideAlpha[slideChangeSide] = (!slideFade) ? (slideAlpha[slideChangeSide]+ALPHA_STEP) : (slideAlpha[slideChangeSide]-ALPHA_STEP);
				if (slideAlpha[slideChangeSide] < 0) slideAlpha[slideChangeSide] = 0; if (slideAlpha[slideChangeSide] > 1) slideAlpha[slideChangeSide] = 1;
				if ((!slideFade) && (slideAlpha[slideChangeSide] == 1)){
					slideChange = false; slideFade = true;  
					if (slideChangeSide == 0) slideChangeSide = 1; else slideChangeSide = 0;
				}
			}
		}
		
		//titles update
		if (!overlayOn){
			titleTimer++;
			titleAlpha = (titleOn) ? (titleAlpha+ALPHA_STEP) : (titleAlpha-ALPHA_STEP);
			if (titleAlpha < 0) titleAlpha = 0; if (titleAlpha > 1) titleAlpha = 1;
			
			if (titleOn){if (titleTimer >= (TITLE_DISPLAY_ON*FRAME_RATE)){titleOn = false;titleTimer = 0;}}
			else {
				if (titleTimer >= (TITLE_DISPLAY_INTERVAL*FRAME_RATE)){
					titleOn = true; titleTimer = 0;
					titleCurrent++; if (titleCurrent > titlesInfo.titles.length-1) titleCurrent = 0;
				}
			}
		}
		
		//overlays update
		if (overlayOn){
			overlayTimer++;
			if (overlayTimer >= (OVERLAY_TIMEOUT*FRAME_RATE)) {overlayOn = false; overlayTimer = 0;}
		}
		for(var i = 0; i < 2; i++){
			overlayAlpha[i] = (overlayOn) ? (overlayAlpha[i]+ALPHA_STEP) : (overlayAlpha[i]-ALPHA_STEP);
			if (overlayAlpha[i] < 0) overlayAlpha[i] = 0; if (overlayAlpha[i] > 1) overlayAlpha[i] = 1;
		}

		//update css div opacity - will dim main slides when title or overlay is displayed
		elementLeft.style.opacity = String(slideAlpha[0] * (1-titleAlpha) * (1-overlayAlpha[0]*0.85)); 
		elementRight.style.opacity = String(slideAlpha[1] * (1-titleAlpha) * (1-overlayAlpha[0]*0.85));
		elementFull.style.opacity = String(titleAlpha * (1-overlayAlpha[0]*0.85));
		elementOverlayLeft.style.opacity = String(overlayAlpha[0]);
		elementOverlayRight.style.opacity = String(overlayAlpha[1]);

		draw();
	}
}

function draw(){

	drawImageScaled(slides[slideCurrent[0]],contextLeft);
	drawImageScaled(slides[slideCurrent[1]],contextRight);
	drawImageScaled(titles[titleCurrent],contextFull);
	drawImageScaled(slides[overlayCurrent[0]],contextOverlayLeft);
	drawImageScaled(slides[overlayCurrent[1]],contextOverlayRight);
}

function drawImageScaled(image, context) {
   
   //scales image draw to fit in particular context
   var canvas = context.canvas ;
   var hRatio = canvas.width  / image.width    ;
   var vRatio =  canvas.height / image.height  ;
   var ratio  = Math.min ( hRatio, vRatio );
   var centerShift_x = (canvas.width - image.width*ratio)/2;
   var centerShift_y = (canvas.height - image.height*ratio)/2; 
   context.clearRect(0,0,canvas.width, canvas.height);
   context.drawImage(image, 0,0, image.width, image.height, centerShift_x,centerShift_y,image.width*ratio, image.height*ratio);  
}

socket.on('onSelectUpdate', function (data) {

	if (data.overlay != null){
		//remote client turns on/off overlay
		if (data.overlay == 'on') overlayOn = true; if (data.overlay == 'off') overlayOn = false;
	} else {
		//remote client selects particular slide
		overlayOn = true;
		for(var i = 0; i < slidesInfo.slides.length; i++){
			if (slidesInfo.slides[i].filename == data.filename){
				overlayCurrent[1] = overlayCurrent[0];
				overlayAlpha[1] = overlayAlpha[0];
				overlayCurrent[0] = i; 
				var thisLeftElement = document.getElementById("label_overlay_left");
				var thisRightElement = document.getElementById("label_overlay_right"); 
				thisLeftElement.getElementsByClassName("title")[0].innerHTML = slidesInfo.slides[overlayCurrent[0]].title;
				thisLeftElement.getElementsByClassName("author")[0].innerHTML = slidesInfo.slides[overlayCurrent[0]].author;
				thisLeftElement.getElementsByClassName("caption")[0].innerHTML = slidesInfo.slides[overlayCurrent[0]].caption;
				thisRightElement.getElementsByClassName("title")[0].innerHTML = slidesInfo.slides[overlayCurrent[1]].title;
				thisRightElement.getElementsByClassName("author")[0].innerHTML = slidesInfo.slides[overlayCurrent[1]].author;
				thisRightElement.getElementsByClassName("caption")[0].innerHTML = slidesInfo.slides[overlayCurrent[1]].caption;
				break;
			}
		}
	}
	overlayTimer = 0;
	if (isPreloaded) draw();
});

setInterval(update, 1000/FRAME_RATE); 	// call update loop every 1/FRAME_RATE seconds

$(document).ready( function() {

	canvasFull = document.getElementById("canvas_full"); contextFull = canvasFull.getContext('2d');
	canvasLeft = document.getElementById("canvas_left"); contextLeft = canvasLeft.getContext('2d');
	canvasRight = document.getElementById("canvas_right"); contextRight = canvasRight.getContext('2d');
	canvasOverlayLeft = document.getElementById("canvas_overlay_left"); contextOverlayLeft = canvasOverlayLeft.getContext('2d');
	canvasOverlayRight = document.getElementById("canvas_overlay_right"); contextOverlayRight = canvasOverlayRight.getContext('2d');
	elementFull = document.getElementById('full');
	elementOverlayLeft = document.getElementById('overlay_left'); elementOverlayRight = document.getElementById('overlay_right');
	elementLeft = document.getElementById('left'); elementRight = document.getElementById('right');
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
});

function resizeCanvas(){

	canvasFull.width = windowWidth = window.innerWidth;
    canvasOverlayLeft.width = canvasOverlayRight.width = canvasRight.width = canvasLeft.width = windowWidth/2;
    canvasFull.height = canvasOverlayLeft.height = canvasOverlayRight.height = canvasRight.height = canvasLeft.height = windowHeight = window.innerHeight;
    if (isPreloaded) draw();
}