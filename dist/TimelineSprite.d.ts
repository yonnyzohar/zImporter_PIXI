import { GameContainer } from "./GameContainer";
export declare class TimelineSprite extends GameContainer {
    [key: string]: any;
    totalFrames: number | undefined;
    _frames: any;
    currentFrame: number;
    looping: boolean;
    func: ((self: TimelineSprite) => void) | undefined;
    constructor();
    getFrames(): any;
    setFrames(value: any): void;
    removeStateEndEventListener(): void;
    addStateEndEventListener(func: (self: TimelineSprite) => void): void;
    play(): void;
    stop(): void;
    gotoAndPlay(frameNum: number): void;
    update(): void;
    gotoAndStop(frameNum: number): void;
}
