import * as PIXI from "pixi.js";
import { ZContainer } from "./ZContainer";
import { SceneData, TemplateData, AnimTrackData } from "./SceneData";
export declare class ZScene {
    private scene;
    private _sceneStage;
    private data;
    private resizeMap;
    private static Map;
    private sceneId;
    private orientation;
    constructor(_sceneId: string);
    setOrientation(): void;
    static getSceneById(sceneId: string): ZScene | undefined;
    private sceneName;
    get sceneStage(): PIXI.Container<PIXI.DisplayObject>;
    loadStage(globalStage: PIXI.Container): void;
    addToResizeMap(mc: ZContainer): void;
    removeFromResizeMap(mc: ZContainer): void;
    resize(width: number, height: number): void;
    load(assetBasePath: string, _loadCompleteFnctn: Function): Promise<void>;
    destroy(): Promise<void>;
    loadAssets(assetBasePath: string, placemenisObj: any, _loadCompleteFnctn: Function): Promise<void>;
    createFrame(itemName: string): PIXI.Sprite | null;
    getNumOfFrames(_framePrefix: string): number;
    createMovieClip(_framePrefix: string): PIXI.AnimatedSprite;
    initScene(_placementsObj: SceneData): void;
    getChildrenFrames(_templateName: string): Record<string, AnimTrackData[]>;
    spawn(tempName: string): ZContainer | undefined;
    getAllAssets(o: any, allAssets: any): any;
    degreesToRadians(degrees: number): number;
    createAsset(mc: ZContainer, baseNode: TemplateData): void;
    applyFilters(obj: any, tf: PIXI.Container): void;
    createBitmapTextFromXML(xmlUrl: string, textToDisplay: string, fontName: string, fontSize: number, callback: Function): Promise<null>;
    loadTexture(textureUrl: string): Promise<PIXI.Texture>;
}
//# sourceMappingURL=ZScene.d.ts.map