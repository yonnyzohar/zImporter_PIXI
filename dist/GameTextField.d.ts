import * as PIXI from 'pixi.js';
export declare class GameTextField extends PIXI.Text {
    innerVal: any;
    z: any;
    bgTF: GameTextField | null;
    name: string;
    constructor(_width: number, _height: number, _text: string, _fontName?: string, _fontSize?: number, _color?: number, _bold?: boolean);
    setName(_name: string, placement?: string): void;
    setText(str: string): void;
    killMe(): void;
}
