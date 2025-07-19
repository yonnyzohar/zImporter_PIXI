import { ZContainer } from "./ZContainer";
/**
 * Represents a customizable button component extending ZContainer.
 * Handles different visual states (up, over, down, disabled) and user interactions.
 * Supports label display and animated feedback on click.
 */
export declare class ZButton extends ZContainer {
    labelContainer: ZContainer;
    overState: ZContainer;
    disabledState: ZContainer;
    downState: ZContainer;
    upState: ZContainer;
    onClickBinded: any;
    onOutBinded: any;
    onOverBinded: any;
    onDownBinded: any;
    callback: any;
    constructor(_labelStr?: string);
    setText(text: string): void;
    setCallback(func: () => void): void;
    removeCallback(): void;
    init(): void;
    enable(): void;
    disable(): void;
    onDown(): void;
    onOut(): void;
    onOver(): void;
    onClicked(): void;
}
//# sourceMappingURL=ZButton.d.ts.map