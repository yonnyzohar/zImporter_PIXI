"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameButton = void 0;
const gsap_1 = require("gsap");
const GameContainer_1 = require("./GameContainer");
class GameButton extends GameContainer_1.GameContainer {
    constructor(_labelStr = "") {
        super();
        this.textBox;
        this.labelStr = _labelStr;
        this.origScaleX = this.scale.x;
        this.origScaleY = this.scale.y;
        this.interactive = true;
        this.canTouch = true;
        this.interactiveChildren = true;
        this.on('mouseup', this.onClicked);
        this.on('touchend', this.onClicked);
        this.on('mouseupoutside', this.onClicked);
        this.on('touchendoutside', this.onClicked);
    }
    onClicked() {
        if (this.canTouch) {
            this.canTouch = false;
            gsap_1.gsap.to(this.scale, {
                x: this.origScaleX * 0.95,
                y: this.origScaleY * 0.95,
                duration: 0.1,
                onComplete: this.tweenBack.bind(this)
            });
        }
    }
    tweenBack() {
        gsap_1.gsap.to(this.scale, {
            x: this.origScaleX,
            y: this.origScaleY,
            duration: 0.15,
            onComplete: this.animDone.bind(this)
        });
    }
    animDone() {
        this.canTouch = true;
    }
}
exports.GameButton = GameButton;
//# sourceMappingURL=GameButton.js.map