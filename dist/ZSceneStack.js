export class ZSceneStack {
    //the following is a stack of resources of tyoe T
    static stack = [];
    static stackSize = 0;
    static top = 0;
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
    static resize(width, height) {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            let gameScene = this.stack[i];
            gameScene.resize(width, height);
        }
    }
}
//# sourceMappingURL=ZSceneStack.js.map