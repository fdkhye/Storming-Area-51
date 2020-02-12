window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameEngine() {
    this.entities = [];
    // this.factionEntities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.click = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var that = this;

    function checkForHover(rects, x, y) {
        var isHovering = false;
        for (var i = 0, len = rects.length; i < len; i++) {
            var left = rects[i].x, right = rects[i].x + rects[i].w;
            var top = rects[i].y, bottom = rects[i].y + rects[i].h;
            if (right >= x
                && left <= x
                && bottom >= y
                && top <= y) {
                isHovering = rects[i];
            }
        }
        return isHovering;
    }

    var elem = this.ctx.canvas;

    if (elem && elem.getContext) {
        // list of rectangles to render
        var rects = [{ name: "endTurn", x: 1018, y: 678, w: 136, h: 35 },
        { name: "buildTroop", x: 75, y: 0, w: 50, h: 50 }];
        // get context

        var context = elem.getContext('2d');
        if (context) {

            for (var i = 0, len = rects.length; i < len; i++) {
                context.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
            }

        }

        // elem.addEventListener('mousemove', function (e) {
        //     var rect = checkForHover(rects, e.offsetX, e.offsetY);
        //     console.log(rect);
        //     if (rect.name === "endTurn") {
        //         that.endTurnButtonHoverFlag = true;
        //         console.log('Mouseover!: ' + rect.x + '/' + rect.y);
        //     } else {
        //         that.endTurnButtonHoverFlag = false;
        //         console.log('no collision');
        //     }
        // }, false);

        // Animation Mouse Down Listener
        elem.addEventListener('click', function (e) {
            this.click = { x: e.x, y: e.y };
        }, false);


    }

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

// GameEngine.prototype.addFactionEntity = function (entity) {
//     console.log('added entity');
//     this.factionEntities.push(entity);
// }

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.endTurnButtonHoverFlag = null;
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

// function FactionEntity(game, x, y) {
//     this.game = game;
//     this.x = x;
//     this.y = y;
//     this.removeFromWorld = false;
// }

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
}