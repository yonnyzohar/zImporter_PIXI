import * as PIXI from 'pixi.js';
export declare class GameBitmapTextField extends PIXI.BitmapText {
    setName(_name: string, placement?: string): void;
    setText(str: string): void;
    killMe(): void;
}
