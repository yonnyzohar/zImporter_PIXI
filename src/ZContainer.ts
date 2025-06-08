
import * as PIXI from 'pixi.js';
import { InstanceData } from './SceneData';
import { OrientationData } from './SceneData';
import { ZScene } from './ZScene';
import { ZTimeline } from './ZTimeline';

export interface AnchorData{
    anchorType: string;
    anchorPercentage: {
        x: number;
        y: number;
    };
}

export class ZContainer extends PIXI.Container{

    portrait: OrientationData;
    landscape: OrientationData;
    currentTransform: OrientationData;
    name: string = "";
    //anChorData: any;
    public setState(stateName:string):void
    {

    }

    public setInstanceData(data:InstanceData, orientation:string):void
    {
        this.portrait = data.portrait;
        this.landscape = data.landscape;
        this.currentTransform = orientation === "portrait" ? this.portrait : this.landscape;
        this.applyTransform();
        this.name = data.instanceName || "";
        
        //this.name = data.instanceName;
        //this.anChorData = data.portrait.isAnchored ? {anchorType: data.portrait.anchorType, anchorPercentage: data.portrait.anchorPercentage} : null;
        //this.applyAnchor();
    }

    private applyTransform() {
        if (!this.currentTransform) return;
        if(this.parent )
        {
            let currentFrame = (this.parent as any).currentFrame;
            if(currentFrame !== undefined && currentFrame > 0)
            {
                return; // do not apply transform if parent timeline is playing
            }
        }

        this.x = this.currentTransform.x || 0;
        this.y = this.currentTransform.y || 0;
        this.rotation = this.currentTransform.rotation || 0;
        this.alpha = this.currentTransform.alpha || 1;
        this.scale.x = this.currentTransform.scaleX || 1;
        this.scale.y = this.currentTransform.scaleY || 1;
        this.pivot.x = this.currentTransform.pivotX || 0;
        this.pivot.y = this.currentTransform.pivotY || 0;
        this.applyAnchor();
    }


    public resize(width: number, height: number, orientation: "portrait" | "landscape") {
        this.currentTransform = orientation === "portrait" ? this.portrait : this.landscape;
        this.applyTransform();
    }

    public applyAnchor() {
        if(this.currentTransform && this.currentTransform.isAnchored && this.parent)
        {
            let xPer = this.currentTransform!.anchorPercentage!.x || 0;
            let yPer = this.currentTransform!.anchorPercentage!.y || 0;
            let x = xPer * window.innerWidth;
            let y = yPer * window.innerHeight;
            const globalPoint = new PIXI.Point(x, y);
            const localPoint = this.parent.toLocal(globalPoint);
            this.x = localPoint.x;
            this.y = localPoint.y;
        }
    }

    public isAnchored(): boolean {
        return this.currentTransform && this.currentTransform.isAnchored || false;
    }
}