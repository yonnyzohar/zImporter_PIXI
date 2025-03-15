import * as PIXI from 'pixi.js';
import { ZContainer } from "./ZContainer";
import { ZUpdatables } from "./ZUpdatables";

export class ZTimeline extends ZContainer {
    [key: string]: any;
    totalFrames: number | undefined;
    _frames: any;
    currentFrame: number = 0;
    looping: boolean = true;
    func: ((self: ZTimeline) => void) | undefined;

    constructor() {
        super();
        this.totalFrames;
        this._frames;
        this.currentFrame = 0;
        this.looping = true;
    }

    getFrames(): any {
        return this._frames;
    }

    //these are all the frames of all the kids who have a timeline
    //the numframes is longest child timeline
    setFrames(value: any): void {
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

    removeStateEndEventListener(): void {
        this.func = undefined;
    }

    addStateEndEventListener(func: (self: ZTimeline) => void): void {
        this.func = func;
    }

    play(): void {
        ZUpdatables.addUpdateAble(this);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof ZTimeline) {
                child.play();
            }
        }
    }

    stop(): void {
        ZUpdatables.removeUpdateAble(this);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof ZTimeline) {
                child.stop();
            }
        }
    }

    gotoAndPlay(frameNum: number): void {
        this.currentFrame = frameNum;
        ZUpdatables.removeUpdateAble(this);
        this.play();
    }

    update(): void {
        this.gotoAndStop(this.currentFrame);
        this.currentFrame++;

        if (this.currentFrame > this.totalFrames!) {
            if (this.looping) {
                this.currentFrame = 0;
            } else {
                ZUpdatables.removeUpdateAble(this);
            }

            if (this.func) {
                this.func.call(this, this);
            }
        }
    }

    //this code goes over all the child timlines and set the transform of the child at the current frame
    gotoAndStop(frameNum: number): void {
        this.currentFrame = frameNum;
        if (this._frames != null) {
            for (const k in this._frames) {
                if (this._frames[k][this.currentFrame]) {
                    const frame = this._frames[k][this.currentFrame];
                    
                    if (this[k]) {
                        

                        if (frame.x != undefined) {
                            this[k].x = frame.x;
                        }
                        if (frame.y != undefined) {
                            this[k].y = frame.y;
                        }
                        if (frame.alpha != undefined) {
                            this[k].alpha = frame.alpha;
                        }
                        if (frame.a != undefined) {
                            this[k].a = frame.a;
                        }
                        if (frame.b != undefined) {
                            this[k].b = frame.b;
                        }
                        if (frame.c != undefined) {
                            this[k].c = frame.c;
                        }
                        if (frame.d != undefined) {
                            this[k].d = frame.d;
                        }
                        if (frame.tx != undefined) {
                            this[k].tx = frame.tx;
                        }
                        if (frame.ty != undefined) {
                            this[k].ty = frame.ty;
                        }

                        const m = new PIXI.Matrix();
                        m.a  = this[k].a;
                        m.b  = this[k].b;
                        m.c  = this[k].c;
                        m.d  = this[k].d;
                        m.tx = this[k].tx;
                        m.ty = this[k].ty;

                        this[k].transform.setFromMatrix(m);
                    }
                    /**/
                }
            }
        }
    }
}

