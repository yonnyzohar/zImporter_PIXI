import * as PIXI from 'pixi.js';
import { InstanceData } from './SceneData';
import { OrientationData } from './SceneData';
export interface AnchorData {
    anchorType: string;
    anchorPercentage: {
        x: number;
        y: number;
    };
}
export declare class ZContainer extends PIXI.Container {
    portrait: OrientationData;
    landscape: OrientationData;
    currentTransform: OrientationData;
    name: string;
    setState(stateName: string): void;
    setInstanceData(data: InstanceData, orientation: string): void;
    private applyTransform;
    resize(width: number, height: number, orientation: "portrait" | "landscape"): void;
    applyAnchor(): void;
    isAnchored(): boolean;
    set x(value: number);
    set y(value: number);
    set rotation(value: number);
    set scaleX(value: number);
    set scaleY(value: number);
    set pivotX(value: number);
    set pivotY(value: number);
}
//# sourceMappingURL=ZContainer.d.ts.map