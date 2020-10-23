function Keyboard(x, y, w, h, items) {
    if(!Game) return;
    ctx = Game.context;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.items = items;

    this.update = () => {

        ctx = Game.context;
        ctx.fillStyle = colorScheme.app.transparent;
        ctx.RoundRect(0, 0, Game.canvas.width, Game.canvas.height, {}, true, false);
        let x = Game.visual.actions.x, y = Game.visual.actions.y + Game.visual.actions.height - 146, w = Game.visual.actions.width, h = 146;

        if ((mousePosition.x < x || mousePosition.x > x + w) || (mousePosition.y < y || mousePosition.y > y + h)) {
            if (mousePressed) {
                mousePressed = false;
                if (!isClicking) {
                    Game.modal = '';
                    Game.data.zIndex = 1;
                    return;
                }
            }
            else {
                isClicking = false;
            }

        }
        else {
            isClicking = false;
        }

        ctx.fillStyle = colorScheme.keyboard.backgroundColor;
        ctx.RoundRect(x, y, w, h, {}, true, false);

        let temp = Game.data.bet[Game.data.bet.selectedInput];

        let buttonBG = {
            'default': colorScheme.keyboard.buttonColor,
            'hover': colorScheme.keyboard.buttonColor,
            'active': colorScheme.keyboard.buttonColorActive,
            'disabled': colorScheme.actions.placeBetButtonDisabled
        };

        let buttonW = (w-50)/4, buttonH = 30, buttonZ = 2, buttons=[0, ".", "<-", "OK"];

        for(let i = 0; i < buttons.length; i++) {
            ctx.font = colorScheme.keyboard.buttonFont;
            ctx.textAlign = "center";
            let btn = new ctx.Button(x + 10 + (i*(buttonW + 10)), y + h - 35,
                buttonW, buttonH, buttonZ, buttons[i], buttonBG, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8},
                ()=>{return false}, () => {
                    switch (buttons[i]) {
                        case 0:
                            temp += "" + buttons[i];
                            break;
                        case ".":
                            temp += "" + buttons[i];
                            break;
                        case "<-":
                            temp = temp.slice(0, -1);
                            break;
                        case "OK":
                            Game.modal = '';
                            Game.data.zIndex = 1;
                            break;
                    }
                });
            btn.update();
        }
        buttonW = (w-100)/9; buttonH = 30; buttonZ = 2; buttons=[1,2,3,4,5,6,7,8,9];
        for(let i = 0; i < buttons.length; i++) {
            ctx.font = colorScheme.keyboard.buttonFont;
            ctx.textAlign = "center";
            let btn = new ctx.Button(x + 10 + (i*(buttonW + 10)), y + h - 70,
                buttonW, buttonH, buttonZ, buttons[i], buttonBG, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8},
                ()=>{return false}, () => {
                    console.log(buttons[i]);
                    temp += "" + buttons[i];
                });
            btn.update();
        }
        buttonW = (w-50)/4; buttonH = 30; buttons=[10, 100, 1000, 10000];
        for(let i = 0; i < buttons.length; i++) {
            ctx.font = colorScheme.keyboard.buttonFont;
            ctx.textAlign = "center";
            let btn = new ctx.Button(x + 10 + (i*(buttonW + 10)), y + h - 105,
                buttonW, buttonH, buttonZ, "+"+buttons[i], buttonBG, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8},
                ()=>{return false}, () => {
                    console.log(buttons[i]);
                    temp = Number(Number(temp) + buttons[i]);
                });
            btn.update();
        }
        buttonW = (w-40)/3; buttonH = 30; buttons=["MIN", 100000, "MAX"];
        for(let i = 0; i < buttons.length; i++) {
            ctx.font = colorScheme.keyboard.buttonFont;
            ctx.textAlign = "center";
            let btn = new ctx.Button(x + 10 + (i*(buttonW + 10)), y + h - 140,
                buttonW, buttonH, buttonZ, buttons[i], buttonBG, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8},
                ()=>{return false}, () => {
                    console.log(buttons[i]);
                });
            btn.update();
        }

        Game.data.bet[Game.data.bet.selectedInput] = temp;

        //
        // let body = new BetHistoryItems();
        // body.update(Game.visual.modal.x, Game.visual.modal.y, Game.visual.modal.width, Game.visual.modal.height, this.items);
    };
}