
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.addEventListener('touchmove', function (event) {
        mousePosition.x = event.offsetX || event.layerX;
        mousePosition.y = event.offsetY || event.layerY;
    });
    window.addEventListener("touchstart", function (event) {
        mousePosition.x = getTouchPos(event).x;
        mousePosition.y = getTouchPos(event).y;
        mousePressed = true;
    });
    window.addEventListener('touchend', function (event) {
        mousePressed = false;
    });
}
else {
    window.addEventListener('mousemove', function (event) {
        mousePosition.x = event.offsetX || event.layerX;
        mousePosition.y = event.offsetY || event.layerY;
    });
    window.addEventListener('mousedown', function (event) {
        mousePosition.x = getTouchPos(event).x;
        mousePosition.y = getTouchPos(event).y;
        mousePressed = true;
    });
    window.addEventListener('mouseup', function (event) {
        mousePressed = false;
    });
}

let mousePosition = {
    x: 0,
    y: 0
};
let mousePressed = false;

function getTouchPos(touchEvent) {
    // // const rect = Game.canvas;
    // console.log(touchEvent.touches[0].clientX, touchEvent.touches[0].clientY);
    return {
        x: touchEvent.touches[0].clientX,
        y: touchEvent.touches[0].clientY
    };
}

window.addEventListener('resize', () => {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    // draw();
});
window.addEventListener("orientationchange", () => {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    // draw();
});
window.addEventListener("keydown", event => {
    if(Game) {
        if(Game.modal == 'keyboard') {
            if(event.keyCode >= 48 && event.keyCode <= 57) { // 0-9
                Game.data.bet[Game.data.bet.selectedInput] += "" + (event.keyCode - 48);
            }
            if(event.keyCode === 8) { // backspace
                Game.data.bet[Game.data.bet.selectedInput] = Game.data.bet[Game.data.bet.selectedInput].slice(0, -1);
            }
            if(event.keyCode === 190) { // '.'
                Game.data.bet[Game.data.bet.selectedInput] += ".";
            }
        }
    }
});

let isOffline;
window.addEventListener('online', (event) => {
    console.log("The network connection has been recovered.");
    isOffline = false;
    if(Game) Game.modal = '';
    isOffline = false;
});

window.addEventListener('offline', (event) => {
    console.log("The network connection has been lost.");
    isOffline = true;
    Game.modal = 'disconnect';
});
