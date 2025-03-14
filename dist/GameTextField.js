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
exports.GameTextField = void 0;
const PIXI = __importStar(require("pixi.js"));
class GameTextField extends PIXI.Text {
    constructor(_width, _height, _text, _fontName = "Verdana", _fontSize = 12, _color = 0, _bold = false) {
        super(_text, { fontFamily: _fontName, fontSize: _fontSize, fill: _color, align: 'center' });
        this.name = "";
        this.innerVal;
        this.z;
        this.bgTF = null;
        this.width = _width;
        this.height = _height;
    }
    setName(_name, placement = "") {
        this.name = _name;
        if (placement === "middle") {
            this.pivot.x = this.width * 0.5;
            this.pivot.y = this.height * 0.5;
        }
    }
    setText(str) {
        this.text = str;
        if (this.bgTF !== null) {
            this.bgTF.text = str;
        }
    }
    killMe() {
        var _a;
        if (this.bgTF) {
            this.bgTF.destroy();
            this.bgTF.parent.removeChild(this.bgTF);
            this.bgTF = null;
        }
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.removeChild(this);
    }
}
exports.GameTextField = GameTextField;
//# sourceMappingURL=GameTextField.js.map