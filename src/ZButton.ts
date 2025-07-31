import { gsap } from 'gsap';
import { ZContainer } from "./ZContainer";

/**
 * Represents a customizable button component extending ZContainer.
 * Handles different visual states (up, over, down, disabled) and user interactions.
 * Supports label display and animated feedback on click.
 */

export const RemoveClickListener = (container: ZContainer): void => {
    container.removeAllListeners('click');
    container.removeAllListeners('tap');
};


export const AttachClickListener = (container: ZContainer, callback: () => void): void => {
    container.interactive = true;
    container.interactiveChildren = true;
    container.on('click', callback);
    container.on('tap', callback);
};

export class ZButton extends ZContainer {

    labelContainer: ZContainer;
    overState: ZContainer;
    disabledState: ZContainer;
    downState: ZContainer;
    upState: ZContainer;

    //methods
    onPointerDownBinded: any;
    onPointerUpBinded: any;
    onOutBinded: any;
    onOverBinded: any;
    onDownBinded: any;
    callback?: () => void;
    longPressCallback?: () => void;

    longPressTimer: any = null;
    LONG_PRESS_DURATION = 500; // in ms
    longPressFired = false;
    

    init(_labelStr: string = "") {
        super.init();
        ////console.log("Button!");
        this.interactive = true;
        this.interactiveChildren = true;
        this.onPointerDownBinded = this.onPointerDown.bind(this);
        this.onPointerUpBinded = this.onPointerUp.bind(this);
        this.onOutBinded = this.onOut.bind(this);
        this.onOverBinded = this.onOver.bind(this);
        this.onDownBinded = this.onDown.bind(this);

        this.enable();
        this.onOut();
        

        this.on('mousedown', this.onPointerDownBinded);
        this.on('touchstart', this.onPointerDownBinded);

        this.on('mouseup', this.onPointerUpBinded);
        this.on('touchend', this.onPointerUpBinded);
        this.on('touchendoutside', this.onPointerUpBinded);
        this.on('mouseupoutside', this.onPointerUpBinded);
    }

    onPointerDown() {
        this.longPressFired = false;
        this.longPressTimer = setTimeout(() => {
            this.longPressFired = true;
            if (this.longPressCallback) {
                this.longPressCallback();
            }
        }, this.LONG_PRESS_DURATION);
    };

    onPointerUp() {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
        if (!this.longPressFired) {
            this.onClicked();
        }
    };


    setLabel(name: string): void {
        if (this.labelContainer) {
            this.labelContainer.visible = true;
            this.labelContainer.setText(name);
        }
    }


    setCallback(func: () => void) {
        this.callback = func;
    }

    removeCallback() {
        this.callback = undefined;
    }

    setLongPressCallback(func: () => void) {
        this.longPressCallback = func;
    }

    removeLongPressCallback () {
        this.longPressCallback = undefined;
    }

    onClicked() {
        if (this.callback) {
            this.callback();
        }
    }

    enable() {
        this.cursor = "pointer";
        [this.upState, this.overState, this.downState].forEach((state) => {
            if (state) {
                state.cursor = "pointer";
            }
        });
        this.removeAllListeners();
        if (this.overState && this.upState) {
            this.overState.visible = false;
            this.on('mouseout', this.onOutBinded);
            this.on('mouseover', this.onOverBinded);
            this.on('touchendoutside', this.onOutBinded);
            this.on('touchend', this.onOutBinded);
            this.on('touchendoutside', this.onOutBinded);
        }

        if (this.downState && this.upState) {
            this.on('mousedown', this.onDownBinded);
            this.on('touchstart', this.onDownBinded);
            this.on('mouseup', this.onOutBinded);
            this.on('touchendoutside', this.onOutBinded);
            this.on('touchend', this.onOutBinded);
            this.on('touchendoutside', this.onOutBinded);
            this.downState.visible = false;
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
    }

    disable() {
        this.cursor = "default";
        [this.upState, this.overState, this.downState].forEach((state) => {
            if (state) {
                state.cursor = "default";
            }
        });
        this.removeAllListeners();
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
        if (this.upState && this.downState) {
            this.upState.visible = false;
        }
        if (this.downState && this.upState) {
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

        ////console.log("onOut");
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
}

