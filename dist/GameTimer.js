"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTimer = void 0;
class GameTimer {
    static init(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();
        this.startTime = this.then;
    }
    static addUpdateAble(mc) {
        GameTimer.updatables.set(mc, true);
    }
    static update() {
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            for (const [key] of GameTimer.updatables) {
                key.update();
            }
        }
    }
    static removeUpdateAble(mc) {
        GameTimer.updatables.delete(mc);
    }
}
exports.GameTimer = GameTimer;
GameTimer.updatables = new Map();
GameTimer.fpsInterval = 0;
GameTimer.then = 0;
GameTimer.now = 0;
GameTimer.elapsed = 0;
GameTimer.startTime = 0;
//# sourceMappingURL=GameTimer.js.map