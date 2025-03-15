"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZTimeline = void 0;
const PIXI = __importStar(require("pixi.js"));
const ZContainer_1 = require("./ZContainer");
const ZUpdatables_1 = require("./ZUpdatables");
class ZTimeline extends ZContainer_1.ZContainer {
    constructor() {
        super();
        this.currentFrame = 0;
        this.looping = true;
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
        ZUpdatables_1.ZUpdatables.addUpdateAble(this);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof ZTimeline) {
                child.play();
            }
        }
    }
    stop() {
        ZUpdatables_1.ZUpdatables.removeUpdateAble(this);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof ZTimeline) {
                child.stop();
            }
        }
    }
    gotoAndPlay(frameNum) {
        this.currentFrame = frameNum;
        ZUpdatables_1.ZUpdatables.removeUpdateAble(this);
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
                ZUpdatables_1.ZUpdatables.removeUpdateAble(this);
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
                        m.a = this[k].a;
                        m.b = this[k].b;
                        m.c = this[k].c;
                        m.d = this[k].d;
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
exports.ZTimeline = ZTimeline;
