const Header = {
    init: () => {
        if(!Game) return;
        ctx = Game.context;

        Game.components.header.component = new ctx.Component(0, 0, window.innerWidth, Game.visual.header.height, {}, 'rect', colorScheme.header.backgroundColor);
        Game.components.header.border = new ctx.Component(0, 49, window.innerWidth, 1, {}, 'rect', colorScheme.header.borderColor);
        Game.components.header.logo = new ctx.Component(5, 10, 168, 29, {}, 'image', colorScheme.header.logoImg);
    },
    update: () => {
        if(!Game) return;
        ctx = Game.context;

        Game.components.header.component.update();
        Game.components.header.logo.update();
        Game.components.header.border.update();

        if(Game.data.user && Game.data.user.balance && Game.data.user.balance.currency) {
            Game.components.header.balance = new ctx.Text(window.innerWidth - 5, 27, colorScheme.header.balanceFont, colorScheme.header.balanceColor,
                Game.data.user.balance.amount + " " + Game.data.user.balance.currency);
            Game.components.header.balance.update();
        }
    }
};