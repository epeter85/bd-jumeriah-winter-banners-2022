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
  main_image = generateSprite('images/main_image.jpg', 738, 100);
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

  // template = generateSprite('images/backup.jpg');
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

  masterTimeline.to(stage, 0.25, { opacity: 1 }, 'master+=.25').call(frame01, null, 'master+=.5').call(frame02, null, 'master+=2.5').call(resolve, null, 'master+=6');

  bannerDuration = 7.5;
}

function frame01() {
  var fr1 = gsap.timeline();
  fr1.to(main_image, { duration: bannerDuration, x: -10, y: 0, scale: 1, ease: panEaseStyle }, 'fr1');
}

function frame02() {
  var fr3 = gsap.timeline();

  fr3.to(copy1, easeSpeed, { opacity: 0, ease: easeStyle }, 'fr2').to(copy2, easeSpeed, { opacity: 1, ease: easeStyle }, 'fr2+=.5');
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
