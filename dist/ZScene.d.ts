import * as PIXI from "pixi.js";
export declare class ZScene {
    private scene;
    private valsToSetArr;
    private scenes;
    private sceneName;
    load(assetBasePath: string, _loadCompleteFnctn: Function): Promise<void>;
    destroy(): Promise<void>;
    loadAssets(assetBasePath: string, placemenisObj: any, _loadCompleteFnctn: Function): Promise<void>;
    createFrame(itemName: string): PIXI.Sprite | null;
    getNumOfFrames(_framePrefix: string): number;
    createMovieClip(_framePrefix: string): PIXI.AnimatedSprite;
    initScene(_placementsObj: any): void;
    getChildrenFrames(_templateName: string): any;
    spawn(tempName: string): any;
    getAllAssets(o: any, allAssets: any): any;
    degreesToRadians(degrees: number): number;
    createAsset(mc: any, baseNode: any): void;
    applyFilters(obj: any, tf: PIXI.Container): void;
    createBitmapTextFromXML(xmlUrl: string, textToDisplay: string, fontName: string, fontSize: number, callback: Function): Promise<null>;
    loadTexture(textureUrl: string): Promise<PIXI.Texture>;
}
//# sourceMappingURL=ZScene.d.ts.map