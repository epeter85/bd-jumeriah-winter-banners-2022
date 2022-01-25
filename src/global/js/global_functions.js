var extractSize = function (str) {
    var widthMatch = /width\=(\d+)/.exec(str);
    var heightMatch = /height\=(\d+)/.exec(str);
    console.log(widthMatch[1], heightMatch[1]);
    return {
        width: parseInt(widthMatch[1])
        , height: parseInt(heightMatch[1])
    }
}

var sizeMeta = document.querySelectorAll("[name='ad.size']")[0].getAttributeNode("content").value;
var dimensions = extractSize(sizeMeta);
var stopWatch = new Date().getTime();

function generateSprite(imgURL, imgWidth, imgHeight) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.overflow = "hidden";
    if (imgWidth == null) {
        div.style.width = dimensions.width + "px";
        div.style.height = dimensions.height + "px";
    }
    else {
        div.style.width = imgWidth + "px";
        div.style.height = imgHeight + "px";
    }
    div.style.backgroundRepeat = 'no-repeat';
    div.style.backgroundImage = "url(" + imgURL + ")"
    div.style.backgroundSize = '100%';
    div.style.opacity = '0';
    div.style.filter = 'alpha(opacity=0)';
    return div;
}

function generateButton(btnWidth, btnHeight, xPos, yPos) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.overflow = "hidden";
    div.style.width = btnWidth + "px";
    div.style.height = btnHeight + "px";
    div.style.backgroundColor = 'red';
    div.style.left = xPos + 'px';
    div.style.top = yPos + 'px';
    div.style.opacity = '0';
    div.style.filter = 'alpha(opacity=0)';
    /*div.style.opacity = '.5';
    div.style.filter = 'alpha(opacity=50)';*/
    return div;
}

function generateSVG(svgURL, parentDiv) {
    var img = document.createElement('img');
    img.src = svgURL;
    img.style.position = "absolute";
    img.style.overflow = "hidden";
    img.style.opacity = '0';
    img.style.filter = 'alpha(opacity=0)';
    if (parentDiv == null) {
        stage.appendChild(img);
    }
    else {
        parentDiv.appendChild(img);
    }
    return img;
}

function generateCanvas(imgURL) {
    var mycanvas = document.createElement("canvas");
    mycanvas.style.position = "absolute";
    mycanvas.style.overflow = "hidden";
    mycanvas.style.width = dimensions.width + "px";
    mycanvas.style.height = dimensions.height + "px";
    mycanvas.id = 'canvas';
    var img = document.createElement('img');
    img.src = imgURL;
    mycanvas.appendChild(img);
    mycanvas.style.opacity = '0';
    mycanvas.style.filter = 'alpha(opacity=0)';
    return mycanvas;
}

function generateContainer(contWidth, contHeight) {
    var div = document.createElement("div");
    if (contWidth == null) {
        div.style.width = dimensions.width + "px";
        div.style.height = dimensions.height + "px";
    }
    else {
        div.style.width = contWidth + "px";
        div.style.height = contHeight + "px";
    }
    div.style.position = "absolute";
    div.style.overflow = "hidden";
    //div.style.opacity = '1';
    return div;
}

//add png sprite to stage or parent
function addSprite(className, parentDiv) {
    var div = document.createElement("div");
    div.setAttribute('class', className);
    div.style.position = "absolute";
    div.style.overflow = "hidden";
    div.style.opacity = '0';
    div.style.filter = 'alpha(opacity=0)';
    if (parentDiv == null) {
        stage.appendChild(div);
    }
    else {
        parentDiv.appendChild(div);
    }
    return div;
}

//This will echo how many seconds have passed
function returnTimer() {
    stopWatch = ((new Date().getTime()) - stopWatch) * .001;
    console.log(stopWatch + " seconds");
}
/**
 * Called on the window load event.
 */
function preInit() {

  if (Enabler.isInitialized()) {
    initDom();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, initDom);
  }
}

/**
 * The Enabler is now initialized and any extra modules have been loaded.
 */
function initDom() {

    //add elements to dom
    mainInit();


  // Wait for the page to load (also known as polite loading).
  if (Enabler.isPageLoaded()) {
    init();
  }
  else {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, init);
  }
}


function exitClickHandler() {
  Enabler.exit('BackgroundExit');
}

mainInit(); 
init();
//!isProduction ? (function () { mainInit(); init(); })() : window.addEventListener('load', preInit);
