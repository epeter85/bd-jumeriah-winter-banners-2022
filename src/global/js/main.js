/* GLOBAL MAIN JS FOR BANNER CREATIVES */

function enableRollOvers() {

    rollover_hit.addEventListener("mouseover", function () {
        gsap.to(cta, .33, {
            scale:.55,
            force3D: false,
            rotation:0.1,
            ease: Power1.easeIn
        })
    });
    
    rollover_hit.addEventListener("mouseout", function () {
        gsap.to(cta, .33, {
            scale:.5,
            force3D: false,
            rotation:0.1,
            ease: Power1.easeOut
        })
    });

    if (typeof replay_hit != 'undefined') {

        replay_hit.addEventListener('click', function (e) {
            e.stopPropagation()
            e.preventDefault()
            init();
        })
    }
}