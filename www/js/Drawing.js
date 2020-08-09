//get canvas information
var canvas = document.getElementById("Canvas"); 
var canvas_Context = canvas.getContext("2d");
var prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    flag = false,
    dot_flag = false,
    weird_orange = '#f2895c';

canvas.height = window.screen.height;   
canvas.width = window.screen.width; 
var button1 = document.getElementById("goButton");
var button2 = document.getElementById("resetButton"); 
var button3 = document.getElementById("canvasButton"); 
// array for x values
var xVal = [0]; 
var i = 0; 
//Wiggle wiggle wiggle room for drawing, so that its not so strict. 
var drawError = 30; 
//Drawing tells if mouse button has been pressed. 
var isDrawing; 
// bool to tell if the user has been alerted to drawing backwards, so that it does not become annoying. 
var hasBeenAlerted = false; 
//set 0,0 so that it fits on any screen. 
var startX = canvas.width - canvas.width; 
var startY = canvas.height / 2; 
var startLocation = false; 
//distance between each segment
var xSegmentLength = Math.floor(canvas.width / 50);
//array for just y values test
var yCoords = [0]; 
//checks to see if drawing has been done, and can send cords to the engine. 
var updateReady = false;

//draw a starting location on the canvas. 
var draw_Circle = function() {
    canvas_Context.beginPath(); 
    canvas_Context.lineWidth=5;
    canvas_Context.arc(currX, currY, 25, 0, 2*Math.PI);
    canvas_Context.moveTo(currX,currY);
    canvas_Context.stroke(); 
    canvas_Context.strokeStyle=weird_orange
    canvas_Context.lineTo(canvas.width,currY);
    canvas_Context.stroke(); 
    canvas_Context.closePath();
}

//methods for drawing
var setTouchDrawingTrue = function (e) 
{
    //move cords to new start location.
    canvas_Context.moveTo(e.touches[0].clientX-this.offsetLeft, e.touches[0].clientY - this.offsetTop);
    isDrawing = true;
}

//sets drawing to false
var setDrawingFalse = function (e) 
{          
    isDrawing = false;
    //show buttons
    button1.style.visibility = "visible";
    button2.style.visibility = "visible";
    button3.style.visibility = "visible";
}
//draw on Touchscreens 
var touchDraw = function (e)
{
    //hide buttons
    button1.style.visibility = "hidden";
    button2.style.visibility = "hidden";
    button3.style.visibility = "hidden";
    //prevents scrolling
    e.preventDefault();
    //add to array 
    xVal.push(e.touches[0].clientX-this.offsetLeft);
    //check X value 
    if(xVal[i] < e.touches[0].clientX-this.offsetLeft)
    {
        //start from 0,0
        if(!startLocation)
        {
        canvas_Context.moveTo(startX,startY); 
        startLocation = true; 
        }
        if(isDrawing)
        {
            canvas_Context.lineTo(e.touches[0].clientX-this.offsetLeft, e.touches[0].clientY-this.offsetTop);
            canvas_Context.lineWidth=5;
            canvas_Context.stroke();
            if(xVal[i] % xSegmentLength == 0 )
            {
                cordGenerator(e.touches[0].clientY);
                i++;
            }
            else
            { 
                i++;
            }
        }
    } 
    //if current value is less than or equal to old value than erase the canvas. 
    else if(xVal[i] >= e.touches[0].clientX-this.offsetLeft + drawError || xVal[i] < e.touches[0].clientX-this.offsetLeft - drawError )
    {
        errorAlert();     
    }
}

// alert for drawing backwards
var errorAlert = function()
{
    setDrawingFalse();
    if(!hasBeenAlerted)
    {
        var r = window.confirm("You cannot draw backards"); 
        if(r == true){
            canvasRedraw();
        } else {
            canvasRedraw(); 
        }
    }  
}

//Clear the canvas without popup
var canvasRedraw = function()
{
    //clear canvas
    arrayReset(); 
    //reset start local
    startLocation = false; 
    canvas_Context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_Context.beginPath();
    setDrawingFalse();  
    //redraw start location bubble and X line
    draw_Circle(startX, startY); 
 
}

//clear canvas and redraw circle
var canvasClear = function()
{
    //alert user they cant draw backwards
    errorAlert();  
     //clear canvas
    arrayReset(); 
    //reset start local
    startLocation = false; 
    canvas_Context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_Context.beginPath();
    setDrawingFalse();  
    //redraw start location bubble and X line
    draw_Circle(startX, startY);
}

//generates Coordinates. 
var cordGenerator = function(yPixels)
{
    //send Y corrds to array. 
    yCoords.push((yPixels - startY) * (-1));
    i++;           
}

var getOut = function()
{
    goToWorld();
}

var sendCoords = function()
{
    console.log(xVal)
    storeDS(xVal);
}

//resize the Canvas to fit the screen. 
var resize = function()
{
    arrayReset();
    startX = canvas.width - canvas.width;
    startY = canvas.height / 2;
    draw_Circle(startX, startY);
}

//reset arrays
var arrayReset = function()
{
    //reset Xvalue array
    xVal = [0];
    // reset Y array 
    yCoords = [0];
    i = 0;
    //reset start location
    startLocation = false;
    setDrawingFalse();
}

//save canvas drawing as image to display. 
var saveCanvas = function()
{
    canvas_Context.save();
}

//redraw the canvas with the image. 
var loadCanvas = function()
{
    canvas_Context.restore();
}
function draw() {
    canvas_Context.beginPath();
    canvas_Context.moveTo(prevX, prevY);
    canvas_Context.lineTo(currX, currY);
    canvas_Context.strokeStyle = weird_orange;
    canvas_Context.lineWidth = 5;
    canvas_Context.stroke();
    canvas_Context.closePath();
}
function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX;
        currY = e.clientY;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            canvas_Context.beginPath();
            canvas_Context.fillStyle = x;
            canvas_Context.fillRect(currX, currY, 2, 2);
            canvas_Context.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX;
            currY = e.clientY;
            xVal.push(currX)
            draw();
        }
    }
}

//event listeners for drawing with finger on touch screen
canvas.addEventListener('touchstart',   setTouchDrawingTrue,  false );
canvas.addEventListener("touchmove",    touchDraw,            false );
canvas.addEventListener("touchend",     setDrawingFalse,      false );

//event listeners for drawing with mouse cursor for computer screens
canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);

//checks to see if the window gets resized
window.addEventListener('load',              resize,          false );
window.addEventListener('orientationchange', resize,          false );