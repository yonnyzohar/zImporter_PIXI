import { ZContainer } from "./ZContainer";
import { ZUpdatables } from "./ZUpdatables";
export class ZTimeline extends ZContainer {
    totalFrames;
    _frames;
    currentFrame = 0;
    looping = true;
    func;
    constructor() {
        super();
        this.totalFrames;
        this._frames;
        this.currentFrame = 0;
        this.looping = true;
    }
    getFrames() {
        return this._frames;
    }
    //these are all the frames of all the kids who have a timeline
    //the numframes is longest child timeline
    setFrames(value) {
        this._frames = value;
        let totalFrames = 0;
        if (this._frames != null) {
            for (const k in this._frames) {
                if (this._frames[k] instanceof Array) {
                    if (this._frames[k].length > totalFrames) {
                        totalFrames = this._frames[k].length;
                    }
                }
            }
            this.totalFrames = totalFrames;
        }
    }
    removeStateEndEventListener() {
        this.func = undefined;
    }
    addStateEndEventListener(func) {
        this.func = func;
    }
    play() {
        ZUpdatables.addUpdateAble(this);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof ZTimeline) {
                child.play();
            }
        }
    }
    stop() {
        ZUpdatables.removeUpdateAble(this);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof ZTimeline) {
                child.stop();
            }
        }
    }
    gotoAndPlay(frameNum) {
        this.currentFrame = frameNum;
        ZUpdatables.removeUpdateAble(this);
        this.play();
    }
    update() {
        this.gotoAndStop(this.currentFrame);
        this.currentFrame++;
        if (this.currentFrame > this.totalFrames) {
            if (this.looping) {
                this.currentFrame = 0;
            }
            else {
                ZUpdatables.removeUpdateAble(this);
            }
            if (this.func) {
                this.func.call(this, this);
            }
        }
    }
    //this code goes over all the child timlines and set the transform of the child at the current frame
    gotoAndStop(frameNum) {
        this.currentFrame = frameNum;
        if (this._frames != null) {
            for (const k in this._frames) {
                if (this._frames[k][this.currentFrame]) {
                    const frame = this._frames[k][this.currentFrame];
                    if (this[k]) {
                        if (frame.pivotX != undefined) {
                            this[k].pivot.x = frame.pivotX;
                        }
                        if (frame.pivotY != undefined) {
                            this[k].pivot.y = frame.pivotY;
                        }
                        if (frame.scaleX != undefined) {
                            this[k].scale.x = frame.scaleX;
                        }
                        if (frame.scaleY != undefined) {
                            this[k].scale.y = frame.scaleY;
                        }
                        if (frame.x != undefined) {
                            this[k].x = frame.x;
                        }
                        if (frame.y != undefined) {
                            this[k].y = frame.y;
                        }
                        if (frame.alpha != undefined) {
                            this[k].alpha = frame.alpha;
                        }
                        if (frame.rotation != undefined) {
                            this[k].rotation = frame.rotation;
                        }
                    }
                    /**/
                }
            }
        }
    }
}
//# sourceMappingURL=ZTimeline.js.map