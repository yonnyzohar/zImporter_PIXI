import { ZContainer } from "./ZContainer";
/**
 * Represents a customizable button component extending ZContainer.
 * Handles different visual states (up, over, down, disabled) and user interactions.
 * Supports label display and animated feedback on click.
 */
export class ZButton extends ZContainer {
    labelContainer;
    overState;
    disabledState;
    downState;
    upState;
    //methods
    onClickBinded;
    onOutBinded;
    onOverBinded;
    onDownBinded;
    callback;
    constructor(_labelStr = "") {
        super();
        console.log("Button!");
        this.interactive = true;
        this.interactiveChildren = true;
        this.onClickBinded = this.onClicked.bind(this);
        this.onOutBinded = this.onOut.bind(this);
        this.onOverBinded = this.onOver.bind(this);
        this.onDownBinded = this.onDown.bind(this);
    }
    setCallback(func) {
        this.callback = func;
    }
    removeCallback() {
        this.callback = undefined;
    }
    //this is called once all children of the container are loaded
    init() {
        this.enable();
    }
    enable() {
        this.cursor = "pointer";
        if (this.overState && this.upState) {
            this.overState.visible = false;
            this.on('mouseout', this.onOutBinded);
            this.on('mouseover', this.onOverBinded);
            this.overState.visible = false;
        }
        if (this.downState && this.upState) {
            this.on('mousedown', this.onDownBinded);
            this.on('mouseup', this.onOutBinded);
            this.downState.visible = false;
        }
        if (this.disabledState) {
            this.disabledState.visible = false;
        }
        if (this.disabledState) {
            this.disabledState.visible = false;
        }
        if (this.upState) {
            this.upState.visible = true;
            this.addChild(this.upState);
        }
        if (this.labelContainer) {
            this.addChild(this.labelContainer);
            this.labelContainer.alpha = 1;
        }
        this.on('touchend', this.onClickBinded);
        this.on('click', this.onClickBinded);
        this.onOut();
    }
    disable() {
        this.cursor = "default";
        this.off('mousedown', this.onDownBinded);
        this.off('mouseup', this.onOutBinded);
        this.off('mouseout', this.onOutBinded);
        this.off('mouseover', this.onOverBinded);
        this.off('touchend', this.onClickBinded);
        this.off('mouseupoutside', this.onClickBinded);
        this.off('touchendoutside', this.onClickBinded);
        if (this.disabledState) {
            this.disabledState.visible = true;
            this.addChild(this.disabledState);
        }
        if (this.labelContainer) {
            this.addChild(this.labelContainer);
            this.labelContainer.alpha = 0.5;
        }
    }
    onDown() {
        if (this.overState) {
            this.overState.visible = false;
        }
        if (this.disabledState) {
            this.disabledState.visible = false;
        }
        if (this.upState) {
            this.upState.visible = false;
        }
        if (this.downState) {
            this.downState.visible = true;
            this.addChild(this.downState);
        }
        if (this.labelContainer) {
            this.addChild(this.labelContainer);
        }
    }
    onOut() {
        if (this.overState) {
            this.overState.visible = false;
        }
        if (this.upState) {
            this.upState.visible = true;
            this.addChild(this.upState);
        }
        if (this.labelContainer) {
            this.addChild(this.labelContainer);
        }
        console.log("onOut");
    }
    onOver() {
        if (this.overState) {
            this.overState.visible = true;
            this.addChild(this.overState);
        }
        if (this.labelContainer) {
            this.addChild(this.labelContainer);
        }
    }
    onClicked() {
        if (this.callback) {
            console.log("onClicked");
            this.callback();
        }
    }
}
//# sourceMappingURL=ZButton.js.map