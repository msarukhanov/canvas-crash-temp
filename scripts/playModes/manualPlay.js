function manualPlayMode() {
    if(!Game) return;
    ctx = Game.context;

    initBetAmount();
    initAutoCashOutK();
    initPlaceBet();

    ctx.font = colorScheme.actions.modeButtonFont;
    Game.components.actions.buttons.manualPlay.update();
    Game.components.actions.buttons.autoPlay.update();

    ctx.font = colorScheme.header.balanceFont;
    Game.components.actions.buttons.placeBet.y = (Game.data.game.mode === "auto" ? (Game.visual.actions.y + Game.visual.actions.height - 100) : (Game.visual.actions.y + 146));
    Game.components.actions.buttons.placeBet.update();

    ctx.fillStyle = colorScheme.actions.inputButtonSelectedBorder;
    ctx.RoundRect(Game.visual.actions.x + ((Game.data.game.mode === "auto") ? 90 : 0), Game.visual.actions.y + 48, 90, 3, {}, true, false);
}

function initPlaceBet() {
    Game.components.actions.buttons.placeBet = new ctx.Button(
        Game.visual.actions.x + 22,
        Game.visual.actions.y + 146,
        Game.visual.actions.width - 44,
        48,
        1,
        'Place Bet',
        {
            'default': colorScheme.actions.placeBetButtonDefault,
            'hover': colorScheme.actions.placeBetButtonDefault,
            'active': colorScheme.actions.placeBetButtonActive,
            'disabled': colorScheme.actions.placeBetButtonDisabled
        },
        {upperLeft: 6, upperRight: 6, lowerLeft: 6, lowerRight: 6},
        ()=>{return Game.data.placeBetDisabled},
        () => {
            if (!Game.data.placeBetDisabled) {
                Game.data.placeBetDisabled = true;
                placeBet(Game.data.bet.amount, Game.data.bet.value, Game.data.round.id+1);
                Game.data.result.lastBetAmount = Game.data.bet.amount;
                Game.data.result.lastBetValue = Game.data.bet.value;
            }
            console.log("bet placed");
        });
}

function initBetAmount() {
    if(!Game) return;
    ctx = Game.context;

    let x = Game.visual.actions.x + 22, y = Game.visual.actions.y + 87, w = (Game.visual.actions.width - 164), h = 40;
    let x1 = (window.innerWidth - 112), y1 = Game.visual.actions.y + 87, w1 = 90, h1 = 40;

    if ((mousePosition.x !== -1) && mousePosition.x >= x && mousePosition.x <= x + w &&
        mousePosition.y >= y && mousePosition.y <= y + h && Game.data.zIndex < 3) {
        if (mousePressed) {
            mousePressed = false;
            if (!isClicking) {
                isClicking = true;
                Game.data.bet.selectedInput = 'amount';
                Game.modal = 'keyboard';
            }
        }
        else {
            isClicking = false;
        }
    }
    else if ((mousePosition.x !== -1) && mousePosition.x >= x1 && mousePosition.x <= x1 + w1 &&
        mousePosition.y >= y1 && mousePosition.y <= y1 + h1 && Game.data.zIndex < 3) {
        if (mousePressed) {
            mousePressed = false;
            if (!isClicking) {
                isClicking = true;
                Game.data.bet.selectedInput = 'value';
                Game.modal = 'keyboard';
            }
        }
        else {
            isClicking = false;
        }
    }
    else {
        if(Game.data.zIndex === 1) {
            Game.data.bet.selectedInput = '';
        }
        isClicking = false;
    }

    ctx.lineWidth = 1;
    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput == 'amount') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Bet Amount", x, Game.visual.actions.y + 75);

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = (Game.data.bet.selectedInput == 'amount') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;

    ctx.RoundRect(x, y, w, h, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8}, true, true);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.amount, Game.visual.actions.x + 38, Game.visual.actions.y + 112);
}

function initAutoCashOutK() {
    if(!Game) return;

    ctx = Game.context;

    ctx.fillStyle = colorScheme.actions.inputBackground;
    ctx.strokeStyle = (Game.data.bet.selectedInput == 'value') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputBorder;
    ctx.lineWidth = 3;
    ctx.RoundRect((window.innerWidth - 112), Game.visual.actions.y + 87, 90, 40, {
        upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8
    }, true, true);

    ctx.font = colorScheme.actions.inputLabelFont;
    ctx.fillStyle = (Game.data.bet.selectedInput == 'value') ? colorScheme.actions.inputBorderSelected : colorScheme.actions.inputLabelColor;
    ctx.textAlign = 'start';
    ctx.fillText("Auto Cashout", (window.innerWidth - 112), Game.visual.actions.y + 75);

    ctx.font = colorScheme.actions.inputValueFont;
    ctx.fillStyle = colorScheme.actions.inputValueColor;
    ctx.textAlign = 'start';
    ctx.fillText("" + Game.data.bet.value, (window.innerWidth - 96), Game.visual.actions.y + 112);
}

