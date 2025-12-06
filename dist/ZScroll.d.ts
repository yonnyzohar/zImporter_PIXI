import { Graphics, FederatedPointerEvent, Point } from "pixi.js";
import { ZContainer } from "./ZContainer";
interface DragEvent extends FederatedPointerEvent {
    global: Point;
}
export declare class ZScroll extends ZContainer {
    scrollBarHeight: number;
    contentHeight: number;
    dragStartY: number;
    beedStartY: number;
    isDragging: boolean;
    isBeedDragging: boolean;
    beed: ZContainer;
    scrollBar: ZContainer;
    scrollContent: ZContainer;
    msk: Graphics | null;
    scrollArea: Graphics | null;
    scrollingEnabled: boolean;
    private onPointerDownBinded;
    private onPointerMoveBinded;
    private onPointerUpBinded;
    private onBeedDownBinded;
    private onBeedUpBinded;
    private onWheelBinded;
    init(): void;
    getType(): string;
    private calculateScrollBar;
    private enableChildPassThrough;
    addEventListeners(): void;
    removeEventListeners(): void;
    removeListeners(): void;
    onPointerDown(event: DragEvent): void;
    onBeedDown(event: DragEvent): void;
    onPointerMove(event: DragEvent): void;
    onPointerUp(): void;
    onBeedUp(): void;
    onWheel(event: WheelEvent): void;
    applyTransform(): void;
}
export {};
//# sourceMappingURL=ZScroll.d.ts.map