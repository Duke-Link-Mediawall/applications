var socket = io.connect();

// DEFINES  //*******************************************************************************************************************************************

var 	CURRENT_DIR = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + "/";
var		FRAME_RATE = 30;

// DEFINES  //*******************************************************************************************************************************************

// VARIABLES //*******************************************************************************************************************************************

var windowWidth, windowHeight;
var startTime = new Date().getTime();

var slidesInfo, exhibitInfo; 
var isPreloaded = false;

// VARIABLES //*******************************************************************************************************************************************

//load json files
$.getJSON(CURRENT_DIR + "slides.json", function(json){slidesInfo = json;});
$.getJSON(CURRENT_DIR + "exhibitinfo.json", function(json){
	exhibitInfo = json; 
	var title = exhibitInfo.title + " (remote client)"
	document.title = title;
	document.getElementById("title").innerHTML = title;
;});

//preload images
function preload(){

	var ulHTML = "";
	for(var i = 0; i < slidesInfo.slides.length; i++){
		ulHTML = ulHTML + "<li><img src='slides/" + slidesInfo.slides[i].filename + "'/><h4>" + slidesInfo.slides[i].title + "</h4><h5>" + slidesInfo.slides[i].author + "</h5><button id='"+ slidesInfo.slides[i].filename  +"'>view on mediawall</button></li>";
	}
	
	var thisElement = document.getElementsByTagName("ul")[0]; 
	thisElement.innerHTML = ulHTML;
	
	for(var i = 0; i < slidesInfo.slides.length; i++){
		document.getElementById(slidesInfo.slides[i].filename).addEventListener("click", function(e) {sendImageFilename(e.target.id);}, false);
	}
	
	isPreloaded = true;
}

// update loop - will not execute main logic / draw call until images have preloaded 
function update(){

	if ((!isPreloaded) && (slidesInfo != null) && (exhibitInfo != null)) preload();
	if (isPreloaded){draw();}
}

function draw(){}

function resizeCanvas(){

	windowWidth = window.innerWidth; windowHeight = window.innerHeight;
    if (isPreloaded) draw();
}

setInterval(update, 1000/FRAME_RATE); 	// call update loop every 1/FRAME_RATE seconds

$(document).ready( function() {

	document.getElementById("overlay_on").addEventListener("click", turnOverlayOn);
	document.getElementById("overlay_off").addEventListener("click", turnOverlayOff);
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
});

function sendImageFilename(thisImage) {

    var requestObject = {filename: ''}; requestObject.filename = thisImage;
    socket.emit('onSelectUpdate', requestObject);
}

function turnOverlayOn() {var requestOverlay = {overlay:'on'}; socket.emit('onSelectUpdate', requestOverlay);}
function turnOverlayOff() {var requestOverlay = {overlay:'off'}; socket.emit('onSelectUpdate', requestOverlay);}
