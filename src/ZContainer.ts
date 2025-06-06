
import * as PIXI from 'pixi.js';

export interface AnchorData{
    anchorType: string;
    anchorPercentage: {
        x: number;
        y: number;
    };
}

export class ZContainer extends PIXI.Container{


    name: string = "";
    anChorData: any;
    public setState(stateName:string):void
    {

    }


    public setAnchor(childNode: any) {
        if(childNode.anchorType)
        {
            this.anChorData = {anchorType : childNode.anchorType, anchorPercentage: childNode.anchorPercentage};
            this.applyAnchor();
        }
    }

    public resize(width: number, height: number) {
        if(this.anChorData)
        {
            this.applyAnchor();
        }
    }

    public applyAnchor() {
        if(this.anChorData)
        {
            let xPer = this.anChorData.anchorPercentage.x || 0;
            let yPer = this.anChorData.anchorPercentage.y || 0;
            let x = xPer * window.innerWidth;
            let y = yPer * window.innerHeight;
            const globalPoint = new PIXI.Point(x, y);
            const localPoint = this.parent.toLocal(globalPoint);
            //give me the global point x,y in local space


            this.x = localPoint.x;
            this.y = localPoint.y;
            return;

            switch (this.anChorData.anchorType) {
                case "top":
                    this.y = y;
                    break;
                case "btm":
                    this.y = window.innerHeight - y;
                    break;
                case "left":
                    this.x = x;
                    break;
                case "right":
                    this.x = window.innerWidth - x;
                    break;
                case "topLeft":
                    this.x = x;
                    this.y = y;
                    break;
                case "topRight":
                    this.x = window.innerWidth - x;
                    this.y = y;
                    break;
                case "btmLeft":
                    this.x = x;
                    this.y = window.innerHeight - y;
                    break;
                case "btmRight":
                    this.x = window.innerWidth - x;
                    this.y = window.innerHeight - y;
                    break;
                case "center":
                    this.x = (window.innerWidth - this.width) / 2 + x;
                    this.y = (window.innerHeight - this.height) / 2 + y;
                    break;
                default:
                    break;  
            }
        }
      }
}