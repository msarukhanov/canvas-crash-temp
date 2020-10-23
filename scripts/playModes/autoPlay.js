const AutoPlay = {

    started: false,
    maxBetsLimit: 0,
    result: null,

    init: () => {
        if(!Game) return;
        ctx = Game.context;

        checkSelected();

        initBaseBet();
        initCurrentBet();
        initBetsLimit();
        initCoefficient();
        initLossIncrease();
        initWinIncrease();

        initRunAutoPlay();

        ctx.font = colorScheme.actions.modeButtonFont;
        Game.components.actions.buttons.manualPlay.update();
        Game.components.actions.buttons.autoPlay.update();

        ctx.font = colorScheme.header.balanceFont;
        Game.components.actions.buttons.placeBet.y = (Game.data.game.mode === "auto" ? (Game.visual.actions.y + Game.visual.actions.height - 100) : (Game.visual.actions.y + 146));
        Game.components.actions.buttons.placeBet.update();

        ctx.fillStyle = colorScheme.actions.inputButtonSelectedBorder;
        ctx.RoundRect(Game.visual.actions.x + ((Game.data.game.mode === "auto") ? 90 : 0), Game.visual.actions.y + 48, 90, 3, {}, true, false);
    },
    on: () => {
        // Game.data.bet.baseBet, Game.data.bet.currentBet, Game.data.bet.betsLimit,
        //     Game.data.bet.cashOutAt, Game.data.bet.lossIncrease, Game.data.bet.winIncrease

        if(Game.data.bet.baseBet && Game.data.bet.cashOutAt) {
            console.log("ap");
            console.log(Game.data.bet.currentBet);

            console.log(AutoPlay.result);
            if(AutoPlay.result && AutoPlay.result.lastBetAmount > 0) {
                console.log("is prev bet", AutoPlay.result.lastBetAmount);
                // win case
                if(AutoPlay.result.winAmount) {
                    if(Game.data.bet.winIncreaseOn && Game.data.bet.winIncrease) {
                        Game.data.bet.currentBet *= Number(Game.data.bet.winIncrease);
                    }
                }
                // loss case
                else {
                    if(Game.data.bet.lossIncreaseOn && Game.data.bet.lossIncrease) {
                        Game.data.bet.currentBet *= Number(Game.data.bet.lossIncrease);
                    }
                }
            }

            if(Game.data.user.balance.amount < Game.data.bet.currentBet) {
                console.log("not enough balance", Game.data.user.balance.amount);
                Game.data.bet.autoPlayOn = false;
                return;
            }

            if(Game.data.bet.betsLimit) {
                console.log("bets limit", Game.data.bet.betsLimit);
                if(Number(AutoPlay.maxBetsLimit) > Number(Game.data.bet.currentBet)) {
                    console.log("bet limit not reached", AutoPlay.maxBetsLimit);
                    console.log("placebet - ", Game.data.round.id+1);
                    placeBet(Game.data.bet.currentBet, Game.data.bet.cashOutAt, Game.data.round.id+1);
                    Game.data.result.lastBetAmount = Game.data.bet.currentBet;
                    Game.data.result.lastBetValue = Game.data.bet.cashOutAt;
                    AutoPlay.maxBetsLimit -= Game.data.bet.currentBet;
                }
                else {
                    console.log("bet limit reached", Game.data.bet.currentBet);
                    Game.data.bet.autoPlayOn = false;
                }
            }
            else {
                console.log("no bets limit", Game.data.bet.betsLimit);
                placeBet(Game.data.bet.currentBet, Game.data.bet.cashOutAt, Game.data.round.id+1);
                Game.data.result.lastBetAmount = Game.data.bet.currentBet;
                Game.data.result.lastBetValue = Game.data.bet.cashOutAt;
            }

        }
    }
};


function autoPlayMode() {

}

function initRunAutoPlay() {
    Game.components.actions.buttons.placeBet = new ctx.Button(
        Game.visual.actions.x + 22,
        Game.visual.actions.y + 146,
        Game.visual.actions.width - 44,
        48,
        1,
        (Game.data.bet.autoPlayOn ? 'Stop' : 'Run'),
        {
            'default': colorScheme.actions.placeBetButtonDefault,
            'hover': colorScheme.actions.placeBetButtonDefault,
            'active': colorScheme.actions.placeBetButtonActive,
            'disabled': colorScheme.actions.placeBetButtonDisabled
        },
        {upperLeft: 6, upperRight: 6, lowerLeft: 6, lowerRight: 6},
        ()=>{return !(Game.data.bet.betsLimit && Game.data.bet.cashOutAt)},
        () => {
            Game.data.bet.autoPlayOn = !Game.data.bet.autoPlayOn;
            if(Game.data.bet.autoPlayOn) {
                if(Game.data.bet.betsLimit) {
                    AutoPlay.maxBetsLimit = Game.data.bet.betsLimit;
                    Game.data.bet.currentBet = Number(Game.data.bet.baseBet);
                }
                AutoPlay.started = true;
                if(Game.data.bet.autoPlayOn) {
                    AutoPlay.result = null;
                    console.log("next round - ", Game.data.round.id+1);
                    AutoPlay.on();
                }
            }
            else {
                AutoPlay.started = false;
            }
            console.log("auto play toggle", Game.data.bet.autoPlayOn);
        });
}

function initBaseBet() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22, y = Game.visual.actions.y + 87, w = (Game.visual.actions.width - 84)/4, h = 40;

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = (Game.data.bet.selectedInput == 'baseBet') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput == 'baseBet') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Base Bet", x, y - 12);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.baseBet, x + 16, y + 25);
}

function initCurrentBet() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22 + (Game.visual.actions.width - 79)/4 + 10, y = Game.visual.actions.y + 87, w = (Game.visual.actions.width - 84)/4, h = 40;

    ctx.fillStyle = colorScheme.actions.inputBackgroundDisabled;
    ctx.strokeStyle = (Game.data.bet.selectedInput === 'currentBet') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput === 'currentBet') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Current Bet", x, y - 12);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.currentBet, x + 16, y + 25);
}

function initBetsLimit() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22 + (Game.visual.actions.width - 79)*2/4 + 30, y = Game.visual.actions.y + 87, w = (Game.visual.actions.width - 84)/4, h = 40;

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = (Game.data.bet.selectedInput === 'betsLimit') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput === 'betsLimit') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Bets Limit", x, y - 12);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.betsLimit, x + 16, y + 25);
}

function initCoefficient() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22 + (Game.visual.actions.width - 79)*3/4 + 40, y = Game.visual.actions.y + 87, w = (Game.visual.actions.width - 84)/4, h = 40;

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = (Game.data.bet.selectedInput === 'cashOutAt') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput === 'cashOutAt') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Cash Out K", x, y - 12);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.cashOutAt, x + 16, y + 25);
}

function initLossIncrease() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22, y = Game.visual.actions.y + 167, w = (Game.visual.actions.width - 64)/2, h = 40;

    ctx.fillStyle = Game.data.bet["lossIncreaseOn"] ? colorScheme.actions.inputBackground : colorScheme.actions.inputBackgroundDisabled;
    ctx.strokeStyle = (Game.data.bet.selectedInput === 'lossIncrease') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorScheme.actions.checkBox;
    ctx.arc(x + 10, y - 16, 6, 0, 2 * Math.PI);
    ctx.stroke();

    if(Game.data.bet.lossIncreaseOn) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.fillStyle = colorScheme.actions.checkBox;
        ctx.arc(x + 10, y - 16, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput === 'lossIncrease') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("On Loss Increase By", x + 20, y - 12);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.lossIncrease, x + 16, y + 25);

    checkLabelSelected(x, y - 25, w, 20, 'lossIncreaseOn');
}

function initWinIncrease() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22 + (Game.visual.actions.width - 64)/2 + 20, y = Game.visual.actions.y + 167, w = (Game.visual.actions.width - 64)/2, h = 40;

    ctx.fillStyle = Game.data.bet["winIncreaseOn"] ? colorScheme.actions.inputBackground : colorScheme.actions.inputBackgroundDisabled;
    ctx.strokeStyle = (Game.data.bet.selectedInput === 'winIncrease') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorScheme.actions.checkBox;
    ctx.arc(x + 10, y - 16, 6, 0, 2 * Math.PI);
    ctx.stroke();

    if(Game.data.bet.winIncreaseOn) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.fillStyle = colorScheme.actions.checkBox;
        ctx.arc(x + 10, y - 16, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput === 'winIncrease') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("On Win Increase By", x + 20, y - 12);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.winIncrease, x + 16, y + 25);

    checkLabelSelected(x, y - 25, w, 20, 'winIncreaseOn');
}

function checkSelected() {

    let inputs = {
        'baseBet': {x: Game.visual.actions.x + 22, y: Game.visual.actions.y + 87, w: (Game.visual.actions.width - 84) / 4, h: 40},
        //'currentBet': {x: Game.visual.actions.x + 22 + (Game.visual.actions.width - 79) / 4 + 10, y: Game.visual.actions.y + 87, w: (Game.visual.actions.width - 84) / 4, h: 40},
        'betsLimit': {x: Game.visual.actions.x + 22 + (Game.visual.actions.width - 79) * 2 / 4 + 30, y: Game.visual.actions.y + 87, w: (Game.visual.actions.width - 84) / 4, h: 40},
        'cashOutAt': {x: Game.visual.actions.x + 22 + (Game.visual.actions.width - 79) * 3 / 4 + 40, y: Game.visual.actions.y + 87, w: (Game.visual.actions.width - 84) / 4, h: 40},
        'lossIncrease': {x: Game.visual.actions.x + 22, y: Game.visual.actions.y + 167, w: (Game.visual.actions.width - 64) / 2, h: 40},
        'winIncrease': {x: Game.visual.actions.x + 22 + (Game.visual.actions.width - 64) / 2 + 20, y: Game.visual.actions.y + 167, w: (Game.visual.actions.width - 64) / 2, h: 40}
    };

    let touched = false;
    Object.keys(inputs).forEach((label) => {
        if((label === 'lossIncrease' || label === 'winIncrease') && !Game.data.bet[label + "On"]) {
            return;
        }
        if ((mousePosition.x !== -1) && mousePosition.x >= inputs[label].x && mousePosition.x <= inputs[label].x + inputs[label].w &&
            mousePosition.y >= inputs[label].y && mousePosition.y <= inputs[label].y + inputs[label].h && Game.data.zIndex < 3) {
            touched = true;
            if (mousePressed) {
                mousePressed = false;
                if (!isClicking) {
                    isClicking = true;
                    Game.data.bet.selectedInput = label;
                    Game.modal = 'keyboard';
                }
            }
            else {
                isClicking = false;
            }
        }
    });
    if(!touched) {
        if(Game.data.zIndex === 1) {
            Game.data.bet.selectedInput = '';
        }
        isClicking = false;
    }
}

function checkLabelSelected(x, y, w, h, field) {
    if ((mousePosition.x !== -1) && mousePosition.x >= x && mousePosition.x <= x + w &&
        mousePosition.y >= y && mousePosition.y <= y + h && Game.data.zIndex === 1) {
        touched = true;
        if (mousePressed) {
            mousePressed = false;
            if (!isClicking) {
                isClicking = true;
                Game.data.bet[field] = !Game.data.bet[field];
            }
        }
        else {
            isClicking = false;
        }
    }
}