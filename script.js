let myGamePiece;

let headerBalanceComponent,
    gameComponent,
    actionsComponent,
    statsComponent;

let GameWidth, GameHeight;


const colorScheme = {
    header: {
        backgroundColor: "#FFFFFF",
        balanceColor: "#000000",
        balanceFont: "200 16px Ruda, sans-serif",
        borderColor: "rgba(105, 122, 143, 0.2)",
        logoImg: "./assets/images/logo.png"
    },
    game: {
        backgroundColor: "#E9ECEE"
    },
    actions: {
        backgroundColor: "#FFFFFF",
        inputBackground: "#FFFFFF",
        inputBorder: "rgba(105,122,143,0.5)",
        inputButtonFont: "300 14px Ruda, sans-serif",
        inputButtonSelectedColor: "#1D2733",
        inputButtonColor: "#697A8F",
        inputButtonSelectedBorder: "#2CC0AD",
        inputLabelFont: "200 12px Ruda, sans-serif",
        inputLabelColor: "#697A8F",
        inputValueFont: "400 16px Ruda, sans-serif",
        inputValueColor: "#000000"
    },
    stats: {
        backgroundColor: "#fff"
    }
};


function startGame() {
    myGameArea.start();

    initHeader();
    initGame();
    initActions();
    initStats();
}

const myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function initHeader() {
    let headerComponent = new component(15, 10, window.innerWidth - 30, 29, {}, 'rect', colorScheme.header.backgroundColor),
        headerBorderComponent = new component(0, 49, window.innerWidth, 1, {}, 'rect',colorScheme.header.borderColor),
        headerLogoComponent = new component((window.innerWidth/2 - 84), 10, 168, 29, {}, 'image', colorScheme.header.logoImg);
    headerBalanceComponent = new createText(window.innerWidth - 23, 27, colorScheme.header.balanceFont, colorScheme.header.balanceColor, "1000 $");

    headerComponent.update();
    headerBorderComponent.update();
    headerLogoComponent.update();
    headerBalanceComponent.update();
}

function initGame() {
    ctx = myGameArea.context;
    gameComponent = new component(0, 58, window.innerWidth, 363, {}, 'rect', colorScheme.game.backgroundColor);
    gameComponent.update();
    GameWidth = window.innerWidth;
    GameHeight = 363;
    var F = function(x) {
        // return Math.sin(x) ;
        // Try:
        // console.log(x);
        const res = Math.exp((x * 30) / 10000).toFixed(2);
        console.log(res);
        // return x*x;
        return res;
    };
    // ctx.clearRect(0,363,GameWidth,GameHeight) ;
    DrawAxes();
    RenderFunction(F);
}

function initActions() {
    actionsComponent = new component(0, 422, window.innerWidth, 210, {}, 'rect', colorScheme.actions.backgroundColor);
    actionsComponent.update();
    let actionsBorderComponent = new component(0, 471, window.innerWidth, 1, {}, 'rect',colorScheme.header.borderColor);
    actionsBorderComponent.update();

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = colorScheme.actions.inputBorder;
    ctx.lineWidth = 2;
    ctx.roundRect(22, 508, (window.innerWidth - 164), 40, {
        upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8
    }, true, true);

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = colorScheme.actions.inputBorder;
    ctx.lineWidth = 2;
    ctx.roundRect((window.innerWidth - 112), 508, 90, 40, {
        upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8
    }, true, true);

    ctx.fillStyle = colorScheme.actions.inputBorder;
    ctx.strokeStyle = colorScheme.actions.inputBorder;
    ctx.lineWidth = 1;
    ctx.roundRect(0, 507, window.innerWidth, 1, {}, true, false);

    ctx.lineWidth = 1;
    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Bet Amount", 22, 496);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("1000", 38, 532);

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Auto Cashout", (window.innerWidth - 112), 496);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("0", (window.innerWidth - 96), 532);

    ctx.font = colorScheme.actions.inputButtonFont;
    ctx.fillStyle = colorScheme.actions.inputButtonSelectedColor;
    ctx.textAlign = "center";
    ctx.fillText("PLAY", 40, 451);

    ctx.font = colorScheme.actions.inputButtonFont;
    ctx.fillStyle = colorScheme.actions.inputButtonColor;
    ctx.textAlign = "center";
    ctx.fillText("AUTOPLAY", 120, 451);

    ctx.fillStyle = colorScheme.actions.inputButtonSelectedBorder;
    ctx.roundRect(0, 469, 80, 3, {}, true, false);

    // ctx.fillStyle = colorScheme.actions.inputButtonSelectedColor;
    // ctx.roundRect(80, 469, 80, 3, {}, true, false);
}

function initStats() {
    actionsComponent = new component(0, 632, window.innerWidth, 210, {}, 'rect', colorScheme.stats.backgroundColor);
    actionsComponent.update();
}

function component(x, y, width, height, radius, type, color) {
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
            ctx.drawImage(this.image, x, y, width, height);
        }
        else {
            ctx.fillStyle = color;
            ctx.roundRect(x, y, width, height, radius, true, false);
        }
    }
}

function createText(x, y, font, color, text) {
    this.update = function() {
        ctx = myGameArea.context;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "end";
        ctx.fillText(text, x, y)
    }
}

function updateGameArea() {
    myGameArea.clear();
    headerComponent.update();
    placeBetComponent.update();
}



CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
};


function MaxX() {
    return 1000;
}
function MinX() {
    return 0;
}
function MaxY() {
    return 50;
}
function MinY() {
    return 1;
}
function XC(x) {
    return (x - MinX()) / (MaxX() - MinX()) * GameWidth ;
}
function YC(y) {
    return 58 + GameHeight - (y - MinY()) / (MaxY() - MinY()) * GameHeight ;
}

function XTickDelta() {
    return 1;
}

function YTickDelta() {
    return 1;
}

function DrawAxes() {
    myGameArea.context.save() ;
    myGameArea.context.lineWidth = 2 ;
    // +Y axis
    myGameArea.context.beginPath() ;
    myGameArea.context.moveTo(XC(0),YC(0)) ;
    myGameArea.context.lineTo(XC(0),YC(MaxY())) ;
    myGameArea.context.stroke() ;

    // -Y axis
    myGameArea.context.beginPath() ;
    myGameArea.context.moveTo(XC(0),YC(0)) ;
    myGameArea.context.lineTo(XC(0),YC(MinY())) ;
    myGameArea.context.stroke() ;

    // Y axis tick marks
    var delta = YTickDelta() ;
    for (var i = 1; (i * delta) < MaxY() ; ++i) {
        myGameArea.context.beginPath() ;
        myGameArea.context.moveTo(XC(0) - 5,YC(i * delta)) ;
        myGameArea.context.lineTo(XC(0) + 5,YC(i * delta)) ;
        myGameArea.context.stroke() ;
    }

    var delta = YTickDelta() ;
    for (var i = 1; (i * delta) > MinY() ; --i) {
        myGameArea.context.beginPath() ;
        myGameArea.context.moveTo(XC(0) - 5,YC(i * delta)) ;
        myGameArea.context.lineTo(XC(0) + 5,YC(i * delta)) ;
        myGameArea.context.stroke() ;
    }

    // +X axis
    myGameArea.context.beginPath() ;
    myGameArea.context.moveTo(XC(0),YC(0)) ;
    myGameArea.context.lineTo(XC(MaxX()),YC(0)) ;
    myGameArea.context.stroke() ;

    // -X axis
    myGameArea.context.beginPath() ;
    myGameArea.context.moveTo(XC(0),YC(0)) ;
    myGameArea.context.lineTo(XC(MinX()),YC(0)) ;
    myGameArea.context.stroke() ;

    // X tick marks
    var delta = XTickDelta() ;
    for (var i = 1; (i * delta) < MaxX() ; ++i) {
        myGameArea.context.beginPath() ;
        myGameArea.context.moveTo(XC(i * delta),YC(0)-5) ;
        myGameArea.context.lineTo(XC(i * delta),YC(0)+5) ;
        myGameArea.context.stroke() ;
    }

    var delta = XTickDelta() ;
    for (var i = 1; (i * delta) > MinX() ; --i) {
        myGameArea.context.beginPath() ;
        myGameArea.context.moveTo(XC(i * delta),YC(0)-5) ;
        myGameArea.context.lineTo(XC(i * delta),YC(0)+5) ;
        myGameArea.context.stroke() ;
    }
    myGameArea.context.restore() ;
}



function RenderFunction(f) {
    var first = true;
    var XSTEP = (MaxX()-MinX()) / GameWidth ;
    myGameArea.context.beginPath() ;
    for (var x = MinX(); x <= MaxX(); x += XSTEP) {
        var y = f(x) ;
        if (first) {
            myGameArea.context.moveTo(XC(x),YC(y)) ;
            first = false ;
        } else {
            myGameArea.context.lineTo(XC(x),YC(y)) ;
        }
    }
    myGameArea.context.stroke() ;
}




