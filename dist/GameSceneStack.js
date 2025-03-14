"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSceneStack = void 0;
class GameSceneStack {
    static push(resource) {
        this.stack[this.top] = resource;
        this.top++;
        this.stackSize++;
    }
    static pop() {
        if (this.stackSize > 0) {
            this.top--;
            this.stackSize--;
            return this.stack[this.top];
        }
        return null;
    }
    static peek() {
        if (this.stackSize > 0) {
            return this.stack[this.top - 1];
        }
        return null;
    }
    static getStackSize() {
        return this.stackSize;
    }
    static clear() {
        this.stack = [];
        this.stackSize = 0;
        this.top = 0;
    }
    //////
    static spawn(templateName) {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            let gameScene = this.stack[i];
            let ent = gameScene.spawn(templateName);
            if (ent) {
                return ent;
            }
        }
    }
}
exports.GameSceneStack = GameSceneStack;
//the following is a stack of resources of tyoe T
GameSceneStack.stack = [];
GameSceneStack.stackSize = 0;
GameSceneStack.top = 0;
//# sourceMappingURL=GameSceneStack.js.map