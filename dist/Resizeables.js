"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resizeables = void 0;
class Resizeables {
    static addResizeable(mc) {
        Resizeables.resizeables.set(mc, true);
    }
    static resize() {
        for (const [key] of Resizeables.resizeables) {
            key.resize();
        }
    }
    static removeResizeable(mc) {
        Resizeables.resizeables.delete(mc);
    }
}
exports.Resizeables = Resizeables;
Resizeables.resizeables = new Map();
//# sourceMappingURL=Resizeables.js.map