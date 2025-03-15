import { ZContainer } from "./ZContainer";
export declare class ZTimeline extends ZContainer {
    [key: string]: any;
    totalFrames: number | undefined;
    _frames: any;
    currentFrame: number;
    looping: boolean;
    func: ((self: ZTimeline) => void) | undefined;
    constructor();
    getFrames(): any;
    setFrames(value: any): void;
    removeStateEndEventListener(): void;
    addStateEndEventListener(func: (self: ZTimeline) => void): void;
    play(): void;
    stop(): void;
    gotoAndPlay(frameNum: number): void;
    update(): void;
    gotoAndStop(frameNum: number): void;
}
