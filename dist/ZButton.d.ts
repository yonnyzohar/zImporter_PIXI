import { ZContainer } from "./ZContainer";
export declare class ZButton extends ZContainer {
    textBox: any;
    labelStr: string;
    origScaleX: number;
    origScaleY: number;
    canTouch: boolean;
    constructor(_labelStr?: string);
    onClicked(): void;
    tweenBack(): void;
    animDone(): void;
}
