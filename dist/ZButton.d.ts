import { ZContainer } from "./ZContainer";
export declare class ZButton extends ZContainer {
    origScaleX: number;
    origScaleY: number;
    canTouch: boolean;
    labelContainer: ZContainer;
    overState: ZContainer;
    disabledState: ZContainer;
    downState: ZContainer;
    upState: ZContainer;
    onClickBinded: any;
    onOutBinded: any;
    onOverBinded: any;
    onDownBinded: any;
    constructor(_labelStr?: string);
    init(): void;
    enable(): void;
    disable(): void;
    onDown(): void;
    onOut(): void;
    onOver(): void;
    onClicked(): void;
    tweenBack(): void;
    animDone(): void;
}
//# sourceMappingURL=ZButton.d.ts.map