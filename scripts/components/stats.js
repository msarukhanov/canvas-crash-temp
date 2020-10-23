const Stats = {
    init: () => {
        if (!Game) return;
        ctx = Game.context;

        Game.components.stats.buttons.liveBets = new ctx.Button(
            Game.visual.actions.x,
            Game.visual.actions.y + Game.visual.actions.height - 47,
            Game.visual.actions.width / 4,
            47,
            1,
            'Live bets',
            {
                'default': colorScheme.actions.gameModeButtonDefault,
                'hover': colorScheme.actions.gameModeButtonDefault,
                'active': colorScheme.actions.gameModeButtonActive
            }, {}, () => {
                return false
            }, () => {
                console.log("live bets");
                Game.data.stats.history.visible = Game.data.stats.history.live;
                Game.data.stats.mode = "live";
                Game.modal = 'history';
            });

        Game.components.stats.buttons.userBets = new ctx.Button(
            Game.visual.actions.x + Game.visual.actions.width / 4,
            Game.visual.actions.y + Game.visual.actions.height - 47,
            Game.visual.actions.width / 4,
            47,
            1,
            'My Bets',
            {
                'default': colorScheme.actions.gameModeButtonDefault,
                'hover': colorScheme.actions.gameModeButtonDefault,
                'active': colorScheme.actions.gameModeButtonActive
            }, {}, () => {
                return false
            }, () => {
                console.log("user bets");
                getUserBets({page: 0, size: 5});
                Game.data.stats.mode = "user";
            });
    },

    update: () => {
        if (!Game) return;
        ctx = Game.context;

        Game.components.stats.buttons.liveBets.update();
        Game.components.stats.buttons.userBets.update();

        // ctx.fillStyle = colorScheme.actions.inputButtonSelectedBorder;
        // ctx.RoundRect(Game.visual.actions.x + 27 + (Game.data.stats.mode == "user" ? 90 : 0), Game.visual.actions.y + 248, 90, 3, {}, true, false);
        //Game.components.stats.component.update(Game.visual.actions.x + 22, Game.visual.actions.y + 258, Game.visual.actions.width - 44, 100, Game.data.stats.history.visible);
    },

    table: function (x, y, w, h, items) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.items = items;

        this.update = (x, y, w, h, items) => {
            if (!Game) return;
            ctx = Game.context;

            ctx.fillStyle = colorScheme.app.background;
            ctx.RoundRect(x, y, w, h, {}, true, false);

            ctx.textAlign = "center";
            ctx.lineWidth = 1;
            ctx.fillStyle = colorScheme.stats.headerColor;
            ctx.font = colorScheme.stats.headerFont;
            ctx.fillText("Name", x + 30, y + 20);
            ctx.fillText("Time", x + 30 + w - 240, y + 20);
            ctx.fillText("Bet", x + 30 + w - 180, y + 20);
            ctx.fillText("Odds", x + 30 + w - 120, y + 20);
            ctx.fillText("Win", x + 30 + w - 60, y + 20);

            ctx.fillStyle = colorScheme.stats.borderColor;
            ctx.RoundRect(x, y + 30, w, 1, {}, true, false);

            if (!items.length) {
                return;
            }
            items.forEach((item, i) => {
                index = i + 1;
                let bottomBorder = new ctx.Component(x, y + index * 30, w, 1, {}, 'rect', colorScheme.stats.borderColor);
                bottomBorder.update();
                ctx.fillStyle = colorScheme.stats.rowColor;
                ctx.font = colorScheme.stats.rowFont;
                let name = item.name ? (item.name.length > 13 ? item.name.substring(0, 10) + "..." : item.name.length) : item.userId;
                let createdAt = new Date(item.created_at || item.createdAt).getHours() + ":" + new Date(item.created_at || item.createdAt).getMinutes();
                ctx.fillText(name, x + 30, y + 20 + index * 30);
                ctx.fillText(createdAt, x + 30 + w - 240, y + 20 + index * 30);
                ctx.fillText(item.amount.toFixed(2), x + 30 + w - 180, y + 20 + index * 30);
                ctx.fillText(item.k.toFixed(2), x + 30 + w - 120, y + 20 + index * 30);
                ctx.fillText(item.winAmount.toFixed(2), x + 30 + w - 60, y + 20 + index * 30);
                ctx.font = "16px Ruda, sans-serif";
            })
        }
    },

    modal: function (x, y, w, h, items) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.items = items;

        this.update = () => {
            if (!Game) return;
            ctx = Game.context;

            ctx.fillStyle = colorScheme.app.modalBackground;
            ctx.RoundRect(this.x, this.y, this.w, this.h, {}, true, false);
            if ((mousePosition.x < Game.visual.modal.x || mousePosition.x > Game.visual.modal.x + Game.visual.modal.width)
                || (mousePosition.y < Game.visual.modal.y || mousePosition.y > Game.visual.modal.y + Game.visual.modal.height)) {
                if (mousePressed) {
                    this.state = 'active';
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
                this.state = 'default';
                isClicking = false;
            }

            let body = new Stats.table(Game.visual.modal.x, Game.visual.modal.y, Game.visual.modal.width, Game.visual.modal.height, this.items);
            body.update(Game.visual.modal.x, Game.visual.modal.y, Game.visual.modal.width, Game.visual.modal.height, this.items);
        };
    }

};