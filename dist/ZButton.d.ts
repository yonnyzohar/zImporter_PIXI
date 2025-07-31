import { ZContainer } from "./ZContainer";
/**
 * Represents a customizable button component extending ZContainer.
 * Handles different visual states (up, over, down, disabled) and user interactions.
 * Supports label display and animated feedback on click.
 */
export declare const RemoveClickListener: (container: ZContainer) => void;
export declare const AttachClickListener: (container: ZContainer, callback: () => void) => void;
export declare class ZButton extends ZContainer {
    labelContainer: ZContainer;
    overState: ZContainer;
    disabledState: ZContainer;
    downState: ZContainer;
    upState: ZContainer;
    onPointerDownBinded: any;
    onPointerUpBinded: any;
    onOutBinded: any;
    onOverBinded: any;
    onDownBinded: any;
    callback?: () => void;
    longPressCallback?: () => void;
    longPressTimer: any;
    LONG_PRESS_DURATION: number;
    longPressFired: boolean;
    init(_labelStr?: string): void;
    onPointerDown(): void;
    onPointerUp(): void;
    setLabel(name: string): void;
    setCallback(func: () => void): void;
    removeCallback(): void;
    setLongPressCallback(func: () => void): void;
    removeLongPressCallback(): void;
    onClicked(): void;
    enable(): void;
    disable(): void;
    onDown(): void;
    onOut(): void;
    onOver(): void;
}
//# sourceMappingURL=ZButton.d.ts.map