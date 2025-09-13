﻿import { gsap } from 'gsap';
import { ZContainer } from "./ZContainer";
import { InstanceData } from './SceneData';

export const RemoveClickListener = (container: ZContainer): void => {
    container.removeAllListeners('mouseup');
    container.removeAllListeners('touchend');
    container.removeAllListeners('touchendoutside');
    container.removeAllListeners('mouseupoutside');
    container.removeAllListeners('mousedown');
    container.removeAllListeners('touchstart');
};

export const AttachClickListener = (
    container: ZContainer,
    pressCallback?: () => void,
    longPressCallback?: () => void
): void => {
    container.interactive = true;
    container.interactiveChildren = true;

    if (pressCallback) (container as any).pressCallback = pressCallback;
    if (longPressCallback) (container as any).longPressCallback = longPressCallback;

    let longPressTimer: any = null;
    const LONG_PRESS_DURATION = 500;
    const MAX_DRAG_DISTANCE = 20;

    let longPressFired = false;
    let startPos: { x: number; y: number } | null = null;

    const getPointerPos = (event: any) => {
        if (event.data && event.data.global) return { x: event.data.global.x, y: event.data.global.y };
        if (event.global) return { x: event.global.x, y: event.global.y };
        return null;
    }

    const onPointerDown = (event: any) => {
        longPressFired = false;
        startPos = getPointerPos(event);
        longPressTimer = setTimeout(() => {
            longPressFired = true;
            if ((container as any).longPressCallback) {
                (container as any).longPressCallback();
            }
        }, LONG_PRESS_DURATION);

        container.on('mouseup', onPointerUp);
        container.on('touchend', onPointerUp);
        container.on('touchendoutside', onPointerUp);
        container.on('mouseupoutside', onPointerUp);
    };

    const onPointerUp = (event: any) => {
        clearTimeout(longPressTimer);
        longPressTimer = null;

        let isDrag = false;
        const endPos = getPointerPos(event);
        if (startPos && endPos) {
            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > MAX_DRAG_DISTANCE) isDrag = true;
        }
        startPos = null;

        if (!longPressFired && !isDrag) {
            if ((container as any).pressCallback) {
                (container as any).pressCallback();
            }
        }

        container.off('mouseup', onPointerUp);
        container.off('touchend', onPointerUp);
        container.off('touchendoutside', onPointerUp);
        container.off('mouseupoutside', onPointerUp);
    };

    container.on('mousedown', onPointerDown);
    container.on('touchstart', onPointerDown);
};

type LabelState = "single" | "multi" | "none";

export class ZButton extends ZContainer {
    topLabelContainer2: ZContainer;
    topLabelContainer: ZContainer;

    overState: ZContainer;
    overLabelContainer: ZContainer;
    overLabelContainer2: ZContainer;

    downState: ZContainer;
    downLabelContainer: ZContainer;
    downLabelContainer2: ZContainer;

    upState: ZContainer;
    upLabelContainer: ZContainer;
    upLabelContainer2: ZContainer;

    disabledState: ZContainer;
    disabledLabelContainer: ZContainer;
    disabledLabelContainer2: ZContainer;

    callback?: () => void;
    longPressCallback?: () => void;

    private labelState: LabelState = "none";

    public getType(): string {
        return "ZButton";
    }

    init(_labelStr: string = "") {
        super.init();

        this.interactive = true;
        this.interactiveChildren = true;

        if (this.overState) {
            this.overLabelContainer = this.overState?.getChildByName("labelContainer") as ZContainer;
            this.overLabelContainer2 = this.overState?.getChildByName("labelContainer2") as ZContainer;
        }

        if (this.disabledState) {
            this.disabledLabelContainer = this.disabledState?.getChildByName("labelContainer") as ZContainer;
            this.disabledLabelContainer2 = this.disabledState?.getChildByName("labelContainer2") as ZContainer;
        }

        if (this.downState) {
            this.downLabelContainer = this.downState?.getChildByName("labelContainer") as ZContainer;
            this.downLabelContainer2 = this.downState?.getChildByName("labelContainer2") as ZContainer;
        }

        if (this.upState) {
            this.upLabelContainer = this.upState?.getChildByName("labelContainer") as ZContainer;
            this.upLabelContainer2 = this.upState?.getChildByName("labelContainer2") as ZContainer;
        }

        this.topLabelContainer = (this as any).labelContainer;
        this.topLabelContainer2 = (this as any).labelContainer2;

        // Detect single vs multi label
        if (this.topLabelContainer) {
            this.labelState = "single";
            this.upState.parent.addChild(this.upState);
            this.topLabelContainer.parent.addChild(this.topLabelContainer);
        } else if (this.overState && this.disabledState && this.downState && this.upState) {
            if (this.overLabelContainer && this.disabledLabelContainer && this.downLabelContainer && this.upLabelContainer) {
                this.labelState = "multi";

                // hide all by default
                //[this.overLabelContainer, this.disabledLabelContainer, this.downLabelContainer, this.upLabelContainer].forEach(l => (l.visible = false));
                //if (this.overLabelContainer2) this.overLabelContainer2.visible = false;
                //if (this.disabledLabelContainer2) this.disabledLabelContainer2.visible = false;
                //if (this.downLabelContainer2) this.downLabelContainer2.visible = false;
                //if (this.upLabelContainer2) this.upLabelContainer2.visible = false;
                this.upState.parent.addChild(this.upState);
                if (this.upLabelContainer) this.upState.parent.addChild(this.upLabelContainer);
                if (this.upLabelContainer2) this.upState.parent.addChild(this.upLabelContainer2);
            }
        }

        this.enable();
    }

    setLabel(name: string): void {
        if (this.labelState === "single" && this.topLabelContainer) {
            this.topLabelContainer.visible = true;
            this.topLabelContainer.setText(name);
            this.topLabelContainer.parent.addChild(this.topLabelContainer);
        } else if (this.labelState === "multi") {
            if (this.overLabelContainer) { this.overLabelContainer.visible = true; this.overLabelContainer.setText(name); }
            if (this.disabledLabelContainer) { this.disabledLabelContainer.visible = true; this.disabledLabelContainer.setText(name); }
            if (this.downLabelContainer) { this.downLabelContainer.visible = true; this.downLabelContainer.setText(name); }
            if (this.upLabelContainer) { this.upLabelContainer.visible = true; this.upLabelContainer.setText(name); }
        }
    }

    setLabel2(name: string): void {
        if (this.labelState === "single" && this.topLabelContainer2) {
            this.topLabelContainer2.visible = true;
            this.topLabelContainer2.setText(name);
        } else if (this.labelState === "multi") {
            if (this.overLabelContainer2) { this.overLabelContainer2.visible = true; this.overLabelContainer2.setText(name); }
            if (this.disabledLabelContainer2) { this.disabledLabelContainer2.visible = true; this.disabledLabelContainer2.setText(name); }
            if (this.downLabelContainer2) { this.downLabelContainer2.visible = true; this.downLabelContainer2.setText(name); }
            if (this.upLabelContainer2) { this.upLabelContainer2.visible = true; this.upLabelContainer2.setText(name); }
        }
    }

    setFixedTextSize(fixed: boolean): void {
        const containers: ZContainer[] = [
            this.topLabelContainer, this.topLabelContainer2,
            this.overLabelContainer, this.overLabelContainer2,
            this.disabledLabelContainer, this.disabledLabelContainer2,
            this.downLabelContainer, this.downLabelContainer2,
            this.upLabelContainer, this.upLabelContainer2
        ].filter(Boolean) as ZContainer[];

        containers.forEach(c => {
            if ((c as any).setFixedBoxSize) {
                (c as any).setFixedBoxSize(fixed);
            }
        });
    }

    setCallback(func: () => void) {
        this.callback = func;
        AttachClickListener(this, () => this.onClicked(), this.longPressCallback);
    }

    removeCallback() {
        this.callback = undefined;
        RemoveClickListener(this);
    }

    setLongPressCallback(func: () => void) {
        this.longPressCallback = func;
        AttachClickListener(this, this.callback ? () => this.onClicked() : undefined, func);
    }

    removeLongPressCallback() {
        this.longPressCallback = undefined;
        AttachClickListener(this, this.callback ? () => this.onClicked() : undefined, undefined);
    }

    onClicked() {
        if (this.callback) this.callback();
    }

    enable() {
        this.cursor = "pointer";
        [this.upState, this.overState, this.downState].forEach(state => state && (state.cursor = "pointer"));

        this.removeAllListeners();
        let overState = this.overState;
        let downState = this.downState;
        let upState = this.upState;
        let disabledState = this.disabledState;
        let topLabelContainer = this.topLabelContainer;
        let topLabelContainer2 = this.topLabelContainer2;
        let labelState = this.labelState;

        const onOut = () => this.onOut();
        const onOver = () => this.onOver();
        const onDown = () => this.onDown();

        if (overState && upState) {
            overState.visible = false;
            this.on('mouseout', onOut);
            this.on('mouseover', onOver);
            this.on('touchendoutside', onOut);
            this.on('touchend', onOut);
            this.on('touchendoutside', onOut);
            overState.visible = false;
        }
        if (downState && upState) {
            this.on('mousedown', onDown);
            this.on('touchstart', onDown);
            this.on('mouseup', onOut);
            this.on('touchendoutside', onOut);
            this.on('touchend', onOut);
            this.on('touchendoutside', onOut);
            downState.visible = false;
        }
        if (disabledState) {
            disabledState.visible = false;
        }

        if (upState) {
            upState.visible = true;
            this.addChild(upState);
        }
        if (labelState === "single" && topLabelContainer) {
            this.addChild(topLabelContainer);
            topLabelContainer.alpha = 1;
            if (topLabelContainer2) {
                this.addChild(topLabelContainer2);
                topLabelContainer2.alpha = 1;
            }
        }

        this.onOut();
        AttachClickListener(this, this.callback ? () => this.onClicked() : undefined, this.longPressCallback);
    }

    disable() {
        this.cursor = "default";
        this.interactive = false;
        [this.upState, this.overState, this.downState].forEach(state => state && (state.cursor = "default"));
        this.removeAllListeners();

        if (this.disabledState) {
            this.disabledState.visible = true;
            this.addChild(this.disabledState);
        }

        if (this.topLabelContainer) {
            this.addChild(this.topLabelContainer);
            this.topLabelContainer.alpha = 0.5;
        }
        if (this.topLabelContainer2) {
            this.addChild(this.topLabelContainer2);
            this.topLabelContainer2.alpha = 0.5;
        }
    }

    onDown() {
        if (this.overState) this.overState.visible = false;
        if (this.disabledState) this.disabledState.visible = false;
        if (this.upState && this.downState) this.upState.visible = false;
        if (this.downState) {
            this.downState.visible = true;
            this.addChild(this.downState);
        }
        if (this.topLabelContainer) {
            this.addChild(this.topLabelContainer);
            this.topLabelContainer.alpha = 0.5;
            if (this.topLabelContainer2) {
                this.addChild(this.topLabelContainer2);
                this.topLabelContainer2.alpha = 0.5;
            }
        }
    }

    onOut() {
        if (this.overState) this.overState.visible = false;
        if (this.upState) {
            this.upState.visible = true;
            this.addChild(this.upState);
        }
        if (this.topLabelContainer) {
            this.addChild(this.topLabelContainer);
            this.topLabelContainer.alpha = 1;
            if (this.topLabelContainer2) {
                this.addChild(this.topLabelContainer2);
                this.topLabelContainer2.alpha = 1;
            }
        }
    }

    onOver() {
        if (this.overState) {
            this.overState.visible = true;
            this.addChild(this.overState);
        }
        if (this.topLabelContainer) {
            this.addChild(this.topLabelContainer);
            this.topLabelContainer.alpha = 1;
            if (this.topLabelContainer2) {
                this.addChild(this.topLabelContainer2);
                this.topLabelContainer2.alpha = 1;
            }
        }
    }
}
