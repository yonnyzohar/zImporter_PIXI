"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZResizeables = void 0;
class ZResizeables {
    static addResizeable(mc) {
        ZResizeables.resizeables.set(mc, true);
    }
    static resize() {
        for (const [key] of ZResizeables.resizeables) {
            key.resize();
        }
    }
    static removeResizeable(mc) {
        ZResizeables.resizeables.delete(mc);
    }
}
exports.ZResizeables = ZResizeables;
ZResizeables.resizeables = new Map();
//# sourceMappingURL=ZResizeables.js.map