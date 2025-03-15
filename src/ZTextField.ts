import * as PIXI from 'pixi.js';

export class ZTextField extends PIXI.Text {
    innerVal: any;
    z: any;
    bgTF: ZTextField | null;
    name: string = "";

    constructor(_width: number, _height: number, _text: string, _fontName = "Verdana", _fontSize = 12, _color = 0, _bold = false) {
        super(_text, { fontFamily: _fontName, fontSize: _fontSize, fill: _color, align: 'center' });

        this.innerVal;
        this.z;
        this.bgTF = null;

        this.width = _width;
        this.height = _height;
    }

    setName(_name: string, placement = ""): void {
        this.name = _name;

        if (placement === "middle") {
            this.pivot.x = this.width * 0.5;
            this.pivot.y = this.height * 0.5;
        }
    }

    setText(str: string): void {
        this.text = str;

        if (this.bgTF !== null) {
            this.bgTF.text = str;
        }
    }

    killMe(): void {
        if (this.bgTF) {
            this.bgTF.destroy();
            this.bgTF.parent.removeChild(this.bgTF);
            this.bgTF = null;
        }

        this.parent?.removeChild(this);
    }
}

