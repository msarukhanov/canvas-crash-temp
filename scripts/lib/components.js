CanvasRenderingContext2D.prototype.RoundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = {upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0};
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

CanvasRenderingContext2D.prototype.Component = function (x, y, width, height, radius, type, color) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = Game.context;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.RoundRect(this.x, this.y, this.width, this.height, radius, true, false);
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.update();
    }
};

CanvasRenderingContext2D.prototype.Text = function (x, y, font, color, text) {
    this.update = function () {
        ctx = Game.context;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "end";
        ctx.fillText(text, x, y)
    }
};

CanvasRenderingContext2D.prototype.Button = function (x, y, w, h, z, text, colors, radius, disabled, clickCB) {

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.colors = colors;
    this.text = text;
    this.radius = radius;
    this.z = z;

    this.state = 'default';

    this.update = function () {
        ctx = Game.context;
        if (disabled()) {
            this.state = 'disabled';
        }
        else if ((mousePosition.x !== -1) && mousePosition.x >= this.x && mousePosition.x <= this.x + this.width &&
            mousePosition.y >= this.y && mousePosition.y <= this.y + this.height && Game.data.zIndex === z) {
            this.state = 'hover';
            if (mousePressed) {
                this.state = 'active';
                mousePressed = false;
                if (typeof clickCB === 'function' && !isClicking) {
                    isClicking = true;
                    clickCB();
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

        ctx.fillStyle = this.colors[this.state].background;
        ctx.RoundRect(this.x, this.y, this.width, this.height, this.radius, true, false);
        let size = ctx.measureText(this.text);
        //let x = this.x + (this.width - size.width) / 2, y = this.y + (this.height - 15) / 2 + 12;
        ctx.textAlign = "center";
        let x = this.x + this.width/2, y = this.y + (this.height - 15) / 2 + 12;
        ctx.fillStyle = this.colors[this.state].text;
        ctx.fillText(this.text, x, y);
    };
};

