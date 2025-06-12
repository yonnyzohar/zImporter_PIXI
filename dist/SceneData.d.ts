import * as PIXI from "pixi.js";
export declare enum AnchorConsts {
    NONE = "none",
    TOP_LEFT = "topLeft",
    TOP_RIGHT = "topRight",
    BOTTOM_LEFT = "btmLeft",
    BOTTOM_RIGHT = "btmRight",
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "btm",
    CENTER = "center"
}
export interface ResolutionData {
    x: number;
    y: number;
}
export interface OrientationData {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    pivotX: number;
    pivotY: number;
    visible: boolean;
    isAnchored: boolean;
    anchorType?: AnchorConsts;
    anchorPercentage?: {
        x: number;
        y: number;
    };
}
export interface BaseAssetData {
    type: string;
    name: string;
    filters: any;
}
export interface InstanceData extends BaseAssetData {
    template: boolean;
    instanceName: string;
    portrait: OrientationData;
    landscape: OrientationData;
}
export interface SpriteData extends BaseAssetData {
    name: string;
    type: string;
    width: number;
    height: number;
    filePath: string;
    x: number;
    y: number;
}
export interface TextData extends BaseAssetData {
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
    alpha: number;
    size: number | string;
    color: PIXI.TextStyleFill;
    align: string;
    text: string;
    fontName: string | string[];
    z: number;
    stroke?: string | number;
    strokeThickness?: number;
    wordWrap?: boolean;
    wordWrapWidth?: number;
    breakWords?: boolean;
    leading?: number;
    letterSpacing?: number;
    padding?: number | number[];
}
export interface TemplateData {
    type: string;
    name: string;
    children: BaseAssetData[];
}
export interface AnimTrackData {
    chilName?: string;
    parentTemplate?: string;
    x?: number;
    y?: number;
    alpha?: number;
    keyFrame?: boolean;
    currentFrame?: number;
    endFrame?: number;
    pivotX?: number;
    pivotY?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    easing?: string;
}
export interface SceneData {
    resolution: ResolutionData;
    animTracks?: Record<string, AnimTrackData[]>;
    stage: TemplateData | undefined;
    templates: Record<string, TemplateData>;
    fonts: string[];
}
//# sourceMappingURL=SceneData.d.ts.map