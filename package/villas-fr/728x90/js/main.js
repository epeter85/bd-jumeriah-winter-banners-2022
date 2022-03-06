var isProduction = true;
var config = {"isiAutoscrollDelay":3000};
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

/* GLOBAL MAIN JS FOR BANNER CREATIVES */

function enableRollOvers() {
  rollover_hit.addEventListener('mouseover', function () {
    //cta.style.willChange = 'transform';
    gsap.to(cta, 0.33, {
      scale: 0.55,
      force3D: false,
      rotation: 0.1,
      ease: Power1.easeIn,
    });
  });

  rollover_hit.addEventListener('mouseout', function () {
    //cta.style.willChange = 'auto';
    gsap.to(cta, 0.33, {
      scale: 0.5,
      force3D: false,
      rotation: 0.1,
      ease: Power1.easeOut,
    });
  });

  if (typeof replay_hit != 'undefined') {
    replay_hit.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      init();
    });
  }
}

function mainInit() {
  ///////////////////////////////
  //set up sprites and containers
  ///////////////////////////////

  //setup stage
  stage = document.querySelectorAll('.container')[0];
  stage.style.width = dimensions.width + 'px';
  stage.style.height = dimensions.height + 'px';
  stage.style.overflow = 'hidden';
  stage.style.position = 'absolute';
  stage.style.display = 'none';
  stage.style.opacity = 0;
  stage.style.filter = 'alpha(opacity=0)';
  stage.style.zIndex = 2;
  //stage.style.border = '1px solid #979797';

  //Backgrounds
  main_image = generateSprite('images/main_image.jpg', 733, 100);
  stage.appendChild(main_image);
  main_image.style.willChange = 'transform';

  copy1 = addSprite('icon-copy1');
  copy2 = addSprite('icon-copy2');
  copy3 = addSprite('icon-copy3');

  logo1 = addSprite('icon-logo1');
  logo2 = addSprite('icon-logo2');
  cta = addSprite('icon-cta');
  cta.style.zIndex = 2;
  replay = addSprite('icon-replay');

  rollover_hit = generateContainer();
  stage.appendChild(rollover_hit);
  rollover_hit.style.zIndex = 3;

  replay_hit = generateContainer(40, 40);
  //replay_hit.style.backgroundColor = 'red';
  stage.appendChild(replay_hit);
  replay_hit.style.zIndex = 4;

  // template = generateSprite('images/template/728x90_F3.jpg');
  // stage.appendChild(template);
  // template.style.opacity = 0.5;

  easeStyle = Power1.easeOut;
  transitionEaseSyle = Power1.easeInOut;
  textSlideEaseSyle = Quint.easeOut;

  panEaseStyle = Linear.easeInOut;
  lineEaseStyle = 'none';

  easeSpeed = 0.5;
}

function init() {
  //set init visibility
  gsap.set([main_image, logo1, cta, copy1], { opacity: 1 });
  gsap.set([logo2, copy2, copy3, replay], { opacity: 0 });
  gsap.set(cta, { rotationZ: 0.01 });
  gsap.set(replay_hit, { bottom: 0, right: 0, opacity: 0.5 });

  //set init placement
  gsap.set(main_image, { x: 0, y: -10, scale: 1 });

  frame00();
}

function frame00() {
  stopWatch = new Date().getTime();
  stage.style.display = 'block';

  var masterTimeline = gsap.timeline();

  masterTimeline
    .to(stage, 0.25, { opacity: 1 }, 'master+=.25')
    .call(frame01, null, 'master+=.5')
    .call(frame02, null, 'master+=2.5')
    .call(resolve, null, 'master+=6');

  bannerDuration = 7.5;
}

function frame01() {
  var fr1 = gsap.timeline();
  fr1.to(
    main_image,
    { duration: bannerDuration, x: -5, y: 0, scale: 1, ease: panEaseStyle },
    'fr1'
  );
}

function frame02() {
  var fr3 = gsap.timeline();

  fr3
    .to(copy1, easeSpeed, { opacity: 0, ease: easeStyle }, 'fr2')
    .to(copy2, easeSpeed, { opacity: 1, ease: easeStyle }, 'fr2+=.5');
}

function resolve() {
  var resolve = gsap.timeline();
  resolve
    .to([copy2, logo1], 0.75, { opacity: 0, ease: easeStyle }, 'resolve')
    .to(logo2, easeSpeed, { opacity: 1, ease: easeStyle }, 'resolve+=1')
    .to(copy3, easeSpeed, { opacity: 1, ease: easeStyle }, 'resolve+=1')
    .to(replay, easeSpeed, { opacity: 1, ease: easeStyle }, 'resolve+=2')
    .call(enableRollOvers, null, 'resolve+=1');
}
