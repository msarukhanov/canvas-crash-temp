let frameIndex = 0, isClicking = false;

const particlesPerExplosion = 20;
const particlesMinSpeed = 3;
const particlesMaxSpeed = 6;
const particlesMinSize = 1;
const particlesMaxSize = 3;
let explosions = [];

let now, delta;
let then = Date.now();

let F = function (x) {
    //const res = Math.exp((x * 30) / 10000);
    return Math.exp(x / 10000);
};

const requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;


function startGame() {
    console.log("STARTING GAME +=========================");
    Game.start();
    Game.components.background = new Background();
    Game.components.background.init(0, 0);
    initComponents();
    // renderGame();
    draw();
}

function renderGame() {
    Header.update();
    Actions.update();
    Stats.update();
}

let now1 = new Date().getTime(), then1;


function draw() {
    then1 = new Date().getTime();
    // console.log(then1-now1);

    if(then1 - now1 < 10) {
        now1=then1;
        requestAnimationFrame(draw);
        return;
    }
    now1=then1;
    requestAnimationFrame(draw);

    Game.clear();

    if(isOffline) {
        modal = new DisconnectModal();
        modal.update();
        return;
    }

    if (Game.data.running) {

        if(frameIndex%5 === 0) {
            const now = new Date().getTime();
            Game.data.game.x = now - Game.data.round.ts + Game.data.round.latency / 2;
        }
        Game.data.graph.x++;

        Game.data.game.y = (Math.round(F(Game.data.game.x) * 100) / 100); //F(Game.data.graph.x*30);
        Game.data.graph.y = F(Game.data.graph.x*30);

        if (Game.data.graph.x <= (Game.visual.game.width / 3 - 30)) {
            Game.components.game.plane.speedX = 1;
            Game.components.game.plane.speedY = 0;
            Game.components.background.draw(0, 0);
        }
        else if (Game.data.graph.x <= (Game.visual.game.width / 2 - 30)) {
            // Game.data.graph.y = y;
            Game.components.game.plane.speedX = 1;
            Game.components.game.plane.speedY = -Game.data.graph.y;
            Game.components.background.draw(0, 0);
        }
        else {
            // Game.data.graph.y = Game.data.graph.y;
            Game.components.game.plane.speedX = 0;
            Game.components.game.plane.speedY = 0;
            Game.components.background.draw(Game.data.graph.x, Game.data.graph.y);
        }

        Game.components.game.plane.newPos();

        frameIndex++;
    }
    else {
        Game.components.background.speed = 0;
        Game.components.background.draw(Game.data.graph.x, Game.data.graph.y);
        frameIndex = 0;
    }

    renderGame();
    drawExplosion();

    if (Game.data.graph.countDownOn) {
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) + 15, null, colorScheme.game.countdownColor);
    }
    else if((Game.data.graph.x > 1) && !Game.data.resolved) {
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) - 15, "x" + Game.data.game.y.toFixed(2), colorScheme.game.countdownColor);
    }
    else if(Game.data.resolved && Game.data.result.lastBetAmount) {
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) - 15,
            Game.data.result.winAmount ? "You won" : "You lost", colorScheme.game.countdownColor);
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) + 25,
            Game.data.result.winAmount ? Game.data.result.winAmount : "0", colorScheme.game.countdownColor);
    }
    else if(Game.data.resolved && !Game.data.result.lastBetAmount) {
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) - 15, "x" + Game.data.game.y.toFixed(2), colorScheme.game.countdownColor);
    }
    else {
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) - 15, "Waiting for", colorScheme.game.countdownColor);
        GameCountDown(Game.visual.game.width / 2, Game.visual.header.height + (Game.visual.game.height / 2) + 15, "new round", colorScheme.game.countdownColor);
    }

    //Game.modal = 'keyboard';
    if(Game.modal) {
        let modal;
        Game.data.zIndex = 2;
        switch (Game.modal) {
            case 'history':
                modal = new Stats.modal(0, 0, Game.canvas.width, Game.canvas.height, Game.data.stats.history.visible);
                modal.update();
                break;
            case 'keyboard':
                modal = new Keyboard(0, 0, Game.canvas.width, Game.canvas.height, Game.data.stats.history.visible);
                modal.update();
                break;
        }
    }
}

function startGameRound() {
    Game.data.game.x = 1;
    Game.data.game.y = 0;
    Game.data.graph.x = 1;
    Game.data.graph.y = 0;
    Game.data.graph.exploded = false;
    Game.components.background = new Background();
    Game.components.background.init(0, 0);
    Game.components.game.plane.x = Game.visual.game.x;
    Game.components.game.plane.y = Game.visual.game.y + Game.visual.game.height - 38;
    Game.components.game.plane.speedX = 0;
    Game.components.game.plane.speedY = 0;
    Game.components.game.plane.newPos();
    Game.data.running = true;
    Game.data.resolved = false;
}

function endGameRound() {
    Game.components.background.speed = 0;
    Game.data.running = false;
    if (!Game.data.graph.exploded) {
        Game.data.graph.exploded = true;
        explosions = [new explosion(   Game.components.game.plane.x + 30,    Game.components.game.plane.y + 15)];
    }
}

function startGameCountDown() {
    Game.data.graph.countDownSeconds = 10;
    Game.data.graph.countDownOn = true;
    let interval = setInterval(function () {
        Game.data.graph.countDownSeconds -= 1;
        if (Game.data.graph.countDownSeconds < 1) {
            clearInterval(interval);
            Game.data.graph.countDownOn = false;
        }
    }, 1000);
}

function initComponents() {
    Header.init();
    Game.components.game.component = new ctx.Component(Game.visual.game.x, Game.visual.game.y, Game.visual.game.width, Game.visual.game.height, {}, 'rect', colorScheme.header.backgroundColor);
    Game.components.game.plane = new ctx.Component(Game.visual.game.x, Game.visual.game.y + Game.visual.game.height - 38, 60, 30, {}, 'image', colorScheme.game.objectImg);
    Actions.init();
    Stats.init();
}

var imageRepository = new function () {
    this.background = new Image();
    this.background.src = colorScheme.game.backgroundImg;
};

function drawExplosion() {

    if (explosions.length === 0) {
        return;
    }

    ctx = Game.context;
    ctx.lineWidth = 1;

    for (let i = 0; i < explosions.length; i++) {

        const explosion = explosions[i];
        const particles = explosion.particles;

        if (particles.length === 0) {
            explosions.splice(i, 1);
            return;
        }

        const particlesAfterRemoval = particles.slice();
        for (let ii = 0; ii < particles.length; ii++) {

            const particle = particles[ii];

            if (particle.size <= 0) {
                particlesAfterRemoval.splice(ii, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
            ctx.closePath();
            ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
            ctx.fill();

            particle.x += particle.xv;
            particle.y += particle.yv;
            particle.size -= .1;
        }
        explosion.particles = particlesAfterRemoval;
    }
}

function explosion(x, y) {
    this.particles = [];
    for (let i = 0; i < particlesPerExplosion; i++) {
        this.particles.push(
            new particle(x, y)
        );
    }
}

function particle(x, y) {
    this.x = x;
    this.y = y;
    this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.size = randInt(particlesMinSize, particlesMaxSize, true);
    this.r = randInt(113, 222);
    this.g = '00';
    this.b = randInt(105, 255);
}

function randInt(min, max, positive) {
    let num;
    if (positive === false) {
        num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    } else {
        num = Math.floor(Math.random() * max) + min;
    }
    return num;
}

function Background() {
    this.speed = 0;
    this.width = 0;
    this.height = 0;
    this.speed = 1;
    this.init = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.draw = function (x, y) {
        ctx = Game.context;

        this.x -= (x > 0) ? this.speed : 0;
        this.y += (y > 0) ? this.speed : 0;

        let w = imageRepository.background.width, h = imageRepository.background.height;

        ctx.drawImage(imageRepository.background, this.x, this.y);
        ctx.drawImage(imageRepository.background, this.x - w, this.y);
        ctx.drawImage(imageRepository.background, this.x, this.y - h);
        ctx.drawImage(imageRepository.background, this.x - w, this.y - h);
        ctx.drawImage(imageRepository.background, this.x + w, this.y);
        ctx.drawImage(imageRepository.background, this.x + w, this.y - h);

        if (this.x >= w)
            this.x = 0;
        if (this.y >= h)
            this.y = 0;


        // ctx.drawImage(imageRepository.background, this.x, this.y, w, h,
        //     Game.visual.game.x, Game.visual.game.y, Game.visual.game.width, Game.visual.game.height);
        // ctx.drawImage(imageRepository.background, this.x, this.y, w, h,
        //     Game.visual.game.x - w, Game.visual.game.y + h, Game.visual.game.width, Game.visual.game.height);
        // ctx.drawImage(imageRepository.background, this.x, this.y - h);
        // ctx.drawImage(imageRepository.background, this.x, this.y + h);
    };
}


function GameCountDown(x, y, num, color) {
    let cd = num || Game.data.graph.countDownSeconds;
    ctx.font = "40px Ruda, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(num ? num : "00:" + (cd > 9 ? cd : ("0" + cd)), x, y);
}

function DisconnectModal() {
    this.update = () => {
        ctx = Game.context;
        ctx.fillStyle = colorScheme.app.background;
        ctx.RoundRect(0, 0, Game.canvas.width, Game.canvas.height, {}, true, false);
        ctx.font = colorScheme.header.balanceFont;
        ctx.fillStyle = colorScheme.header.balanceColor;
        ctx.textAlign = 'center';
        ctx.fillText("Disconnected", Game.canvas.width/2, Game.canvas.height/2-20);
        ctx.textAlign = 'left';
        let reconnectButton = new ctx.Button(Game.canvas.width/2 - 55, Game.canvas.height/2 - 9, 110, 34, 2, 'Reconnect', {
            'default': colorScheme.actions.placeBetButtonDefault,
            'hover': colorScheme.actions.placeBetButtonDefault,
            'active': colorScheme.actions.placeBetButtonActive,
            'disabled': colorScheme.actions.placeBetButtonDisabled
        }, {upperLeft: 6, upperRight: 6, lowerLeft: 6, lowerRight: 6}, ()=>{return false}, () => {
            if(reconnecting == false) {
                reconnecting == true;
                console.log("reconnect button");
                wsConnect();

            }
        });
        reconnectButton.update();
    };
}

let ts1, ts2, ts3, round = 0;

if(intervalLatency) {
    clearInterval(intervalLatency);
    intervalLatency = null;
}
intervalLatency = setInterval(()=>{
    const now = new Date().getTime();
    if((now - tempLatency) > reconnectInterval) {
        connected = false;
        noConnection++;
    }
    if((connected === false) && ((now - tempLatency) <= reconnectInterval)) {
        connected = true;
        noConnection = 0;
        console.log("Reconnected");
    }
    if(noConnection === 5) {
        clearInterval(intervalLatency);
        intervalLatency = null;
        console.log("No connection");
        ws.close();
        ws = null;
    }
}, reconnectInterval);

const actions = {
    'latency': ({data}) => {
        const now = new Date().getTime();
        tempLatency = now;
        Game.data.round.latency = now - data.client;
    },
    'game': (eventData) => {
        switch (eventData.name) {
            case 'run':
                ts1 = Date.now();
                ts3 = Date.now();
                Game.data.placeBetDisabled = true;
                Game.data.round.id = eventData.data.id;
                Game.data.round.ts = eventData.data.ts;
                startGameRound();
                break;
            case 'resolve':
                ts2 = Date.now();
                round++;
                Game.data.result.winAmount = 0;
                if((Game.data.result.lastBetAmount > 0) && !Game.data.resolved) {
                    if(Game.data.result.lastBetValue <= eventData.data.k) {
                        Game.data.result.winAmount = (Game.data.result.lastBetAmount * Game.data.result.lastBetValue).toFixed(2);
                    }
                }
                Game.data.resolved = true;
                Game.data.placeBetDisabled = true;
                if(Game.data.running) {
                    endGameRound();
                }
                Game.data.stats.history.rounds.unshift({id: eventData.data.id, k: eventData.data.k});
                if(Game.data.stats.history.rounds.length > 5) Game.data.stats.history.rounds.pop();
                Game.data.stats.history.live = [];
                break;
            case 'stop':
                ts3 = Date.now();

                if(Game.data.bet.autoPlayOn) {
                    AutoPlay.result = JSON.parse(JSON.stringify(Game.data.result));
                }

                Game.data.resolved = false;
                Game.data.result.winAmount = 0;
                Game.data.result.lastBetValue = 0;
                Game.data.result.lastBetAmount = 0;
                Game.data.placeBetDisabled = false;
                startGameCountDown();
                break;
            case 'seed':
                if(Game.data.bet.autoPlayOn) {
                    AutoPlay.on();
                }
                break;
            case 'placebet':
                //console.log(Game.data.round.id);
                break;
        }
    },
    'bets': (eventData) => {
        switch (eventData.name) {
            case 'place':
                //console.log("PLACE ========= ", eventData.data);
                console.log(eventData.data);
                Game.data.stats.history.live.push({
                    ...eventData.data.bet,
                    ...eventData.data.user,
                    winAmount: eventData.data.bet ? (eventData.data.bet.winAmount || 0) : 0
                });
                if(Game.data.stats.history.live.length > 5) {
                    Game.data.stats.history.live.pop();
                }
                Game.data.stats.history.visible = Game.data.stats.history.live;
                break;
        }
    },
    'subscribe': (eventData) => {
        // console.log(eventData);
    },
    'user': (eventData) => {
        if(eventData.data.clientId) {
            Game.data.user = eventData.data;
        }
        else {
            Game.data.user.balance = eventData.data;
        }
    },
    'user-bets': (eventData) => {
        console.log(eventData);
        Game.data.stats.history.user = eventData.data.results;
        Game.data.stats.history.visible = Game.data.stats.history.user;
        Game.modal = 'history';
    },
    'round-history': (eventData) => {
        console.log(eventData.data);
        if(eventData.data.results && eventData.data.results.length) {
            Game.data.stats.history.rounds = eventData.data.results;
        }
        // Game.data.stats.history.user = eventData.data.results;
        // Game.data.stats.history.visible = Game.data.stats.history.user;
        // Game.modal = 'history';
    }
};

const listenWS = (actions) => {
    (ws.onmessage = (event) => {
        const {name, data, error} = JSON.parse(event.data);
        // console.log(name, data);
        const [handler] = name.split('/');
        const eventData = {
            data,
            error,
            name: name.split('/').pop(),
        };
        if (typeof actions[handler] !== 'function') {
            return;
        }
        actions[handler](eventData);
    });
    (ws.onclose = (event) => {
        console.log("close", event);
    });
    (ws.onerror = (event) => {
        console.log("error", event);
    });
};

listenWS(actions);