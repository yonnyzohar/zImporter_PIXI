"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZUpdatables = void 0;
class ZUpdatables {
    static init(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();
        this.startTime = this.then;
    }
    static addUpdateAble(mc) {
        ZUpdatables.updatables.set(mc, true);
    }
    static update() {
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            for (const [key] of ZUpdatables.updatables) {
                key.update();
            }
        }
    }
    static removeUpdateAble(mc) {
        ZUpdatables.updatables.delete(mc);
    }
}
exports.ZUpdatables = ZUpdatables;
ZUpdatables.updatables = new Map();
ZUpdatables.fpsInterval = 0;
ZUpdatables.then = 0;
ZUpdatables.now = 0;
ZUpdatables.elapsed = 0;
ZUpdatables.startTime = 0;
//# sourceMappingURL=ZUpdatables.js.map