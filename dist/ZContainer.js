import * as PIXI from 'pixi.js';
export class ZContainer extends PIXI.Container {
    portrait;
    landscape;
    currentTransform;
    name = "";
    //anChorData: any;
    setState(stateName) {
    }
    setInstanceData(data, orientation) {
        this.portrait = data.portrait;
        this.landscape = data.landscape;
        this.currentTransform = orientation === "portrait" ? this.portrait : this.landscape;
        this.applyTransform();
        this.name = data.instanceName || "";
        //this.name = data.instanceName;
        //this.anChorData = data.portrait.isAnchored ? {anchorType: data.portrait.anchorType, anchorPercentage: data.portrait.anchorPercentage} : null;
        //this.applyAnchor();
    }
    applyTransform() {
        if (!this.currentTransform)
            return;
        if (this.parent) {
            let currentFrame = this.parent.currentFrame;
            if (currentFrame !== undefined && currentFrame > 0) {
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
    resize(width, height, orientation) {
        this.currentTransform = orientation === "portrait" ? this.portrait : this.landscape;
        this.applyTransform();
    }
    applyAnchor() {
        if (this.currentTransform && this.currentTransform.isAnchored && this.parent) {
            let xPer = this.currentTransform.anchorPercentage.x || 0;
            let yPer = this.currentTransform.anchorPercentage.y || 0;
            let x = xPer * window.innerWidth;
            let y = yPer * window.innerHeight;
            const globalPoint = new PIXI.Point(x, y);
            const localPoint = this.parent.toLocal(globalPoint);
            this.x = localPoint.x;
            this.y = localPoint.y;
        }
    }
    isAnchored() {
        return this.currentTransform && this.currentTransform.isAnchored || false;
    }
    set x(value) {
        super.x = value;
        if (this.currentTransform) {
            this.currentTransform.x = value;
        }
    }
    set y(value) {
        super.y = value;
        if (this.currentTransform) {
            this.currentTransform.y = value;
        }
    }
    set rotation(value) {
        super.rotation = value;
        if (this.currentTransform) {
            this.currentTransform.rotation = value;
        }
    }
    set scaleX(value) {
        super.scale.x = value;
        if (this.currentTransform) {
            this.currentTransform.scaleX = value;
        }
    }
    set scaleY(value) {
        super.scale.y = value;
        if (this.currentTransform) {
            this.currentTransform.scaleY = value;
        }
    }
    set pivotX(value) {
        super.pivot.x = value;
        if (this.currentTransform) {
            this.currentTransform.pivotX = value;
        }
    }
    set pivotY(value) {
        super.pivot.y = value;
        if (this.currentTransform) {
            this.currentTransform.pivotY = value;
        }
    }
}
//# sourceMappingURL=ZContainer.js.map