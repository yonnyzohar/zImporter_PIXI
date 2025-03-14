import { GameContainer } from "./GameContainer";
export declare class GameButton extends GameContainer {
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
