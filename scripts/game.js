const Game = {
    canvas: document.createElement("canvas"),
    components: {
        background: null,
        header: {
            component: null,
            balance: null,
            border: null,
            logo: null
        },
        balance : null,
        game: {
            component: null,
            plane: null
        },
        actions: {
            component: null,
            border: null,
            inputs: {
                amount: null,
                autoK: null
            },
            buttons: {
                manualPlay: null,
                autoPlay: null,
                placeBet: null
            }
        },
        stats: {
            component: null,
            buttons: {
                liveBets: null,
                userBets: null
            }
        },
        plane: null,
        buttons: {
            playMode: null,
            autoMode: null,
            placeBet: null,
            allBetsHistory: null,
            userBetsHistory: null
        }
    },
    modal: null,
    visual: {
        header: {
            height: 58
        },
        game: {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        },
        actions: {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        },
        modal: {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        }
    },
    data: {
        user: null,
        running: false,
        resolved: false,
        game: {
            mode: "manual", // manual, auto
            x: 1,
            y: 0
        },
        bet: {
            selectedInput: "",
            mode: "bet", // bet, cashOut
            amount: '',
            value: '',
            baseBet: 10,
            currentBet: '',
            betsLimit: 8000,
            cashOutAt: 2,
            lossIncreaseOn: false,
            lossIncrease: 2,
            winIncreaseOn: false,
            winIncrease: 3,
            autoPlayOn: false
        },
        stats: {
            mode: "live", // live, user
            history: {
                user: [],
                live: [],
                visible: [],
                rounds: []
            }
        },
        result: {
            lastBetAmount: 0,
            lastBetValue: 0,
            winAmount: 0,
        },
        round: {
            id: 0,
            ts: 0,
            latency: 0
        },
        graph: {
            x: 1,
            y: 0,
            exploded: false,
            countDownOn: false,
            countDownSeconds: 10
        },
        zIndex: 1,
        placeBetDisabled: true,
        placeBetMode: 'disabled'  // disabled, betOn, betPlaced, cashOutOn,
    },
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.context.fillStyle = colorScheme.app.background;
        this.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
        initResolution();
    },
    clear: function () {
        this.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    }
};

function initResolution() {
    if (window.innerWidth > window.innerHeight) {
        Game.visual.header.height = 49;

        Game.visual.game.width = window.innerWidth / 2;
        Game.visual.game.height = window.innerHeight - Game.visual.header.height;
        Game.visual.game.x = 0;
        Game.visual.game.y = Game.visual.header.height;

        Game.visual.actions.width = window.innerWidth / 2;
        Game.visual.actions.height = window.innerHeight - Game.visual.header.height;
        Game.visual.actions.x = window.innerWidth / 2;
        Game.visual.actions.y = Game.visual.header.height;

        Game.visual.modal.width = window.innerWidth / 2;
        Game.visual.modal.height = window.innerHeight - 60;
        Game.visual.modal.x = window.innerWidth / 4;
        Game.visual.modal.y = 30;

    }
    else {
        Game.visual.game.width = window.innerWidth;
        Game.visual.game.height = window.innerHeight / 2;
        Game.visual.game.x = 0;
        Game.visual.game.y = Game.visual.header.height;

        Game.visual.actions.width = window.innerWidth;
        Game.visual.actions.height = window.innerHeight / 2 - Game.visual.header.height;
        Game.visual.actions.x = 0;
        Game.visual.actions.y = Game.visual.header.height + Game.visual.game.height;

        // Game.visual.modal.width = window.innerWidth / 2;
        // Game.visual.modal.height = window.innerHeight - Game.visual.header.height;
        // Game.visual.modal.x = window.innerWidth / 2;
        // Game.visual.modal.y = Game.visual.header.height;

        Game.visual.modal.width = window.innerWidth;
        Game.visual.modal.height = window.innerHeight/2;
        Game.visual.modal.x = 0;
        Game.visual.modal.y = window.innerHeight/4;
    }
}

