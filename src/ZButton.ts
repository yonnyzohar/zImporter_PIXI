import { gsap } from 'gsap';
import { ZContainer } from "./ZContainer";

export class ZButton extends ZContainer {
    textBox: any;
    labelStr: string;
    origScaleX: number;
    origScaleY: number;
    canTouch: boolean;

    constructor(_labelStr: string = "") {
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

    onClicked(): void {
        if (this.canTouch) {
            this.canTouch = false;

            gsap.to(this.scale,{
                x: this.origScaleX * 0.95,
                y: this.origScaleY * 0.95,
                duration : 0.1,
                onComplete: this.tweenBack.bind(this)
            });
        }
    }

    tweenBack(): void {
        gsap.to(this.scale, {
            x: this.origScaleX,
            y: this.origScaleY,
            duration : 0.15,
            onComplete: this.animDone.bind(this)
        });
    }

    animDone(): void {
        this.canTouch = true;
    }
}

