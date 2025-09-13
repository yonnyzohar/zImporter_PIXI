import { ZContainer } from "./ZContainer";
export declare const RemoveClickListener: (container: ZContainer) => void;
export declare const AttachClickListener: (container: ZContainer, pressCallback?: () => void, longPressCallback?: () => void) => void;
export declare class ZButton extends ZContainer {
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
    private labelState;
    getType(): string;
    init(_labelStr?: string): void;
    setLabel(name: string): void;
    setLabel2(name: string): void;
    setFixedTextSize(fixed: boolean): void;
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