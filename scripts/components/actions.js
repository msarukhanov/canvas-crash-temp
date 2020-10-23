const Actions = {
    init: () => {
        if (!Game) return;
        ctx = Game.context;

        Game.components.actions.component = new ctx.Component(
            Game.visual.actions.x,
            Game.visual.actions.y,
            Game.visual.actions.width,
            Game.visual.actions.height,
            {},
            'rect',
            colorScheme.actions.backgroundColor);

        Game.components.actions.border = new ctx.Component(
            Game.visual.actions.x,
            Game.visual.actions.y,
            Game.visual.actions.width,
            1,
            {},
            'rect',
            colorScheme.header.borderColor);

        Game.components.actions.buttons.manualPlay = new ctx.Button(
            Game.visual.actions.x,
            Game.visual.actions.y + 1,
            90,
            47,
            1,
            'PLAY',
            {
                'default': colorScheme.actions.gameModeButtonDefault,
                'hover': colorScheme.actions.gameModeButtonDefault,
                'active': colorScheme.actions.gameModeButtonActive
            },
            {},
            ()=>{return false},
            () => {
                Game.data.game.mode = "manual";
            });

        // Auto Play - optional
        Game.components.actions.buttons.autoPlay = new ctx.Button(
            Game.visual.actions.x + 90,
            Game.visual.actions.y + 1,
            90,
            47,
            1,
            'AUTOPLAY',
            {
                'default': colorScheme.actions.gameModeButtonDefault,
                'hover': colorScheme.actions.gameModeButtonDefault,
                'active': colorScheme.actions.gameModeButtonActive
            },
            {},
            ()=>{return false},
            () => {
                Game.data.game.mode = "auto";
            });
        // -------------------------
    },
    update: () => {
        if(!Game) return;
        ctx = Game.context;

        Game.components.actions.component.update();
        Game.components.actions.border.update();

        // Rounds History - optional
        for(let i = 0; i < Game.data.stats.history.rounds.length; i++) {
            ctx.font = colorScheme.keyboard.buttonFont;
            ctx.textAlign = "center";
            let btn = new ctx.Button(Game.visual.actions.x + 190 + i*45, Game.visual.actions.y + 6, 40, 40, 1, "x" + Game.data.stats.history.rounds[i].k, {
                    'default': colorScheme.actions.placeBetButtonActive,
                    'hover': colorScheme.actions.placeBetButtonActive,
                    'active': colorScheme.actions.placeBetButtonActive,
                    'disabled': colorScheme.actions.placeBetButtonDisabled
                }, {upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8},
                ()=>{return false}, () => {
                    console.log("");
                });
            btn.update();
        }
        // -------------------------

        if(Game.data.game.mode === "manual") {
            manualPlayMode();
        }
        else {
            AutoPlay.init();
        }
    }
};