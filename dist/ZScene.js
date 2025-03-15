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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZScene = void 0;
const loaders_1 = require("@pixi/loaders");
const PIXI = __importStar(require("pixi.js"));
const ZButton_1 = require("./ZButton");
const ZContainer_1 = require("./ZContainer");
const ZTimeline_1 = require("./ZTimeline");
class ZScene {
    constructor() {
        this.scene = null;
        this.valsToSetArr = [];
        this.scenes = [];
        this.sceneName = null;
    }
    load(assetBasePath, _loadCompleteFnctn) {
        return __awaiter(this, void 0, void 0, function* () {
            let placementsUrl = assetBasePath + "placements.json?rnd=" + Math.random();
            fetch(placementsUrl)
                .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
                .then(placemenisObj => {
                this.loadAssets(assetBasePath, placemenisObj, _loadCompleteFnctn);
            })
                .catch(error => {
                //errorCallback(error);
            });
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const spritesheet = this.scene;
            if (spritesheet) {
                // Ensure spritesheet is fully parsed before attempting to destroy
                yield spritesheet.parse();
                // Destroy individual textures
                for (const textureName in spritesheet.textures) {
                    spritesheet.textures[textureName].destroy();
                }
                (_a = spritesheet.baseTexture) === null || _a === void 0 ? void 0 : _a.destroy();
            }
            // Now unload the asset from the asset manager
            yield PIXI.Assets.unload(this.sceneName);
        });
    }
    loadAssets(assetBasePath, placemenisObj, _loadCompleteFnctn) {
        return __awaiter(this, void 0, void 0, function* () {
            let _jsonPath = assetBasePath + "ta.json?rnd=" + Math.random();
            this.scene = (yield PIXI.Assets.load(_jsonPath));
            this.sceneName = _jsonPath;
            if (placemenisObj.fonts.length == 0) {
                this.initScene(placemenisObj);
                _loadCompleteFnctn();
                return;
            }
            for (let i = 0; i < placemenisObj.fonts.length; i++) {
                let path = placemenisObj.fonts[i];
                let url = assetBasePath + path + ".fnt";
                fetch(url).then(response => response.text())
                    .then(data => {
                    const fontData = new PIXI.BitmapFontData();
                    PIXI.BitmapFont.install(data, new PIXI.Texture(this.scene.baseTexture)); // Install the font data
                    console.log("Parsed font data:", fontData);
                    if (i === placemenisObj.fonts.length - 1) {
                        this.initScene(placemenisObj);
                        _loadCompleteFnctn();
                    }
                })
                    .catch(error => console.error("Error loading .fnt:", error));
            }
        });
    }
    createFrame(itemName) {
        //console.log(itemName);
        let img = new PIXI.Sprite(this.scene.textures[itemName]);
        if (img === null) {
            console.log("COULD NOT FIND " + itemName);
        }
        return img;
    }
    getNumOfFrames(_framePrefix) {
        let num = 0;
        var a = loaders_1.Loader.shared.resources["data"].data;
        for (const k in a) {
            if (k.indexOf(_framePrefix) !== -1) {
                num++;
            }
        }
        return num;
    }
    createMovieClip(_framePrefix) {
        const frames = [];
        const numFrames = this.getNumOfFrames(_framePrefix);
        //console.log(numFrames + " in " + _framePrefix);
        for (let i = 0; i < numFrames; i++) {
            const val = i < 10 ? '0' + i : i;
            const textureName = _framePrefix + '00' + val;
            frames.push(PIXI.Texture.from(textureName));
        }
        const mc = new PIXI.AnimatedSprite(frames);
        mc.animationSpeed = 1;
        mc.loop = false;
        mc.name = _framePrefix;
        return mc;
    }
    ////////////////////////////////---done loading scene--------//////////////
    initScene(_placementsObj) {
        this.valsToSetArr = [];
        this.scenes.push({
            stage: _placementsObj.stage,
            placementsObj: _placementsObj,
            templates: _placementsObj.templates,
            animTracks: _placementsObj.animTracks,
        });
    }
    //this gives the frames of all the children of a template
    //it combines the template name of the parent with the child name to get the frame
    getChildrenFrames(_templateName) {
        var frames = {};
        var templates = this.scenes[0].templates;
        var animTracks = this.scenes[0].animTracks;
        var baseNode = templates[_templateName];
        if (baseNode && baseNode.children) {
            for (var i = 0; i < baseNode.children.length; i++) {
                var childInstanceName = baseNode.children[i].instanceName;
                var combinedName = childInstanceName + "_" + _templateName;
                //anim tracks are saved on the scene file via child name + template name to make sure it is uniquie
                //however when passed to the ZTimeline it is just the child name - because the ZTimeline will look for the child by name to set its timeline
                if (animTracks[combinedName]) {
                    frames[childInstanceName] = animTracks[combinedName];
                }
            }
        }
        return frames;
    }
    spawn(tempName) {
        var templates = this.scenes[0].templates;
        var baseNode = templates[tempName];
        if (!baseNode) {
            return;
        }
        var mc;
        var frames = this.getChildrenFrames(tempName);
        if (Object.keys(frames).length > 0) {
            mc = new ZTimeline_1.ZTimeline();
            this.createAsset(mc, baseNode);
            mc.setFrames(this.fixRotation(frames));
        }
        else {
            mc = new ZContainer_1.ZContainer();
            this.createAsset(mc, baseNode);
        }
        mc.name = baseNode.instanceName;
        return mc;
    }
    getAllAssets(o, allAssets) {
        for (const k in o) {
            if (k === "type" && o[k] === "asset") {
                allAssets[o["name"]] = o;
            }
            if (o[k] instanceof Object) {
                this.getAllAssets(o[k], allAssets);
            }
        }
        return allAssets;
    }
    degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }
    createAsset(mc, baseNode) {
        // console.log(baseNode.name);
        for (var i = 0; i < baseNode.children.length; i++) {
            var child = baseNode.children[i];
            //console.log(child);
            var _name = child.name;
            var _x = parseFloat(child.x);
            var _y = parseFloat(child.y);
            var _w = parseFloat(child.width);
            var _h = parseFloat(child.height);
            var a = child.a;
            var b = child.b;
            var c = child.c;
            var d = child.d;
            var tx = child.tx;
            var ty = child.ty;
            var _alpha = 0;
            var type = child.type;
            var asset;
            if (type == "bmpTextField" || type == "textField") {
                if (PIXI.BitmapFont.available[child.uniqueFontName]) {
                    const tf = new PIXI.BitmapText(child.text || "", {
                        fontName: child.uniqueFontName, // This must match the "face" attribute in the .fnt file
                        fontSize: child.size // Adjust as needed
                    });
                    tf.name = _name;
                    mc[_name] = tf;
                    mc.addChild(tf);
                    tf.x = _x;
                    tf.y = _y;
                }
                else {
                    //if ()
                    const tf = new PIXI.Text(child.text + "", {
                        fontFamily: child.fontName,
                        fontSize: child.size,
                        fill: child.color,
                        align: "center",
                    });
                    tf.name = _name;
                    tf.x = _x;
                    tf.y = _y;
                    mc[_name] = tf;
                    mc.addChild(tf);
                }
            }
            if (type == "img") {
                var texName = _name;
                texName = texName.endsWith("_IMG") ? texName.slice(0, -4) : texName;
                var img = this.createFrame(texName);
                if (!img) {
                    return;
                }
                img.name = _name;
                mc[texName] = img;
                mc.addChild(img);
                img.x = _x;
                img.y = _y;
                img.width = _w;
                img.height = _h;
            }
            if (type == "btn") {
                asset = new ZButton_1.ZButton();
                asset.name = child.instanceName;
                if (!asset.name) {
                    return;
                }
                //asset.scale.x = _scaleX;
                //asset.scale.y = _scaleY;
                _alpha = child.alpha;
                asset.x = _x;
                asset.y = _y;
                asset.interactive = true;
                asset.interactiveChildren = true;
                //asset.rotation = this.degreesToRadians(child.rotation);
                asset.alpha = _alpha;
                //setting the child as a propery of the parent will allow it to alter it's transform in a  ZTimeline
                mc[asset.name] = asset;
                mc.addChild(asset);
                var m = new PIXI.Matrix();
                m.a = a;
                m.b = b;
                m.c = c;
                m.d = d;
                m.tx = tx;
                m.ty = ty;
                asset.transform.setFromMatrix(m);
                this.valsToSetArr.push({
                    mc: asset,
                    w: _w,
                    h: _h,
                });
            }
            if (type == "asset") {
                //this will tell me fi this asses template has children with frames
                var frames = this.getChildrenFrames(child.name);
                if (Object.keys(frames).length > 0) {
                    asset = new ZTimeline_1.ZTimeline();
                    asset.setFrames(this.fixRotation(frames));
                }
                else {
                    asset = new ZContainer_1.ZContainer();
                }
                console.log("creation", child.instanceName); // Should print "ZTimeline"
                console.log("constructor", asset.constructor.name); // Should print "ZTimeline"
                console.log("instanceof", asset instanceof ZTimeline_1.ZTimeline);
                asset.name = child.instanceName;
                if (!asset.name) {
                    return;
                }
                //asset.scale.x = _scaleX;
                //asset.scale.y = _scaleY;
                _alpha = child.alpha;
                asset.x = _x;
                asset.y = _y;
                //asset.rotation = this.degreesToRadians(child.rotation);
                //console.log(asset.name + " rot " + asset.rotation + " degrees " + child.rotation);
                asset.alpha = _alpha;
                mc[asset.name] = asset;
                var m = new PIXI.Matrix();
                m.a = a;
                m.b = b;
                m.c = c;
                m.d = d;
                m.tx = tx;
                m.ty = ty;
                asset.transform.setFromMatrix(m);
                mc.addChild(asset);
                console.log("after addition", child.instanceName); // Should print "ZTimeline"
                console.log("constructor", asset.constructor.name); // Should print "ZTimeline"
                console.log("instanceof", asset instanceof ZTimeline_1.ZTimeline);
                this.valsToSetArr.push({
                    mc: asset,
                    w: _w,
                    h: _h,
                });
            }
            var templates = this.scenes[0].templates;
            var childTempObj = templates[child.name];
            if (childTempObj && childTempObj.children) {
                if (asset) {
                    this.createAsset(asset, childTempObj);
                }
                else {
                    this.createAsset(mc, childTempObj);
                }
            }
        }
    }
    fixRotation(_frames) {
        for (var k in _frames) {
            for (var i = 0; i < _frames[k].length; i++) {
                if (_frames[k][i]) {
                    if (_frames[k][i].rotation != undefined) {
                        var rotation = _frames[k][i].rotation;
                        _frames[k][i].rotation = this.degreesToRadians(rotation);
                    }
                }
            }
        }
        return _frames;
    }
    createBitmapTextFromXML(xmlUrl, textToDisplay, fontName, fontSize, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load the texture atlas referenced in your XML
            const response = yield fetch(xmlUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch XML font data: ${response.statusText}`);
            }
            const xmlData = yield response.text();
            //grab the ta file name
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "text/xml");
            // Extract the page.file attribute from the XML
            const pageElement = xmlDoc.querySelector("page");
            if (!pageElement) {
                throw new Error("Page element not found in XML");
            }
            const fileAttribute = pageElement.getAttribute("file");
            if (!fileAttribute) {
                throw new Error("Page file attribute not found in XML");
            }
            var textureUrl = "./../assets/" + fileAttribute;
            this.loadTexture(textureUrl)
                .then((texture) => {
                PIXI.BitmapFont.install(xmlDoc, texture);
                if (PIXI.BitmapFont.available[fontName]) {
                    callback();
                }
            })
                .catch((error) => {
                console.error("Error loading texture:", error);
            });
            return null;
        });
    }
    loadTexture(textureUrl) {
        return new Promise((resolve, reject) => {
            const texture = PIXI.Texture.from(textureUrl);
            // Listen for the "update" event to check when the texture is fully loaded
            texture.on("update", () => {
                if (texture.valid) {
                    resolve(texture); // Resolve the promise when the texture is ready
                }
                else {
                    reject(new Error("Failed to load texture."));
                }
            });
        });
    }
}
exports.ZScene = ZScene;
;
//# sourceMappingURL=ZScene.js.map