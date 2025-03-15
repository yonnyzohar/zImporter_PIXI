import { Loader } from '@pixi/loaders';
import * as PIXI from 'pixi.js';
import { ZButton } from "./ZButton";
import { ZContainer } from "./ZContainer";
import { ZTimeline } from "./ZTimeline";

export class ZScene {
    private scene : PIXI.Spritesheet | null = null;
    private valsToSetArr: any[] = [];
    private scenes: { placementsObj: any; templates: any; animTracks: any, stage:any }[] = [];
    private sceneName: string | null = null;


    async load(assetBasePath:string,_loadCompleteFnctn:Function):Promise<void> 
    {
        let placementsUrl:string = assetBasePath + "placements.json?rnd=" + Math.random();
        fetch(placementsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(placemenisObj => {
            
            this.loadAssets(assetBasePath, placemenisObj,_loadCompleteFnctn);

        })
        .catch(error => {
            //errorCallback(error);
        });
 
    }

    async destroy():Promise<void> 
    {
      const spritesheet = this.scene as PIXI.Spritesheet;

      if (spritesheet) {
          // Ensure spritesheet is fully parsed before attempting to destroy
          await spritesheet.parse();

          // Destroy individual textures
          for (const textureName in spritesheet.textures) {
              spritesheet.textures[textureName].destroy();
          }
          spritesheet.baseTexture?.destroy();
      }

      // Now unload the asset from the asset manager
      await PIXI.Assets.unload(this.sceneName!);
        
    }

    async loadAssets(assetBasePath:string, placemenisObj:any,_loadCompleteFnctn:Function)
    {
        let _jsonPath:string = assetBasePath + "ta.json?rnd=" + Math.random();
        this.scene = (await PIXI.Assets.load(_jsonPath )) ;
        this.sceneName = _jsonPath;
        if(placemenisObj.fonts.length == 0)
        {
            this.initScene(placemenisObj);
            _loadCompleteFnctn();
            return;
        }
        for(let i = 0; i < placemenisObj.fonts.length; i++)
        {
            let path:string = placemenisObj.fonts[i];
            let url:string = assetBasePath + path + ".fnt";
            fetch(url).then(response => response.text())
            .then(data => {
                const fontData = new PIXI.BitmapFontData();
                PIXI.BitmapFont.install(data, new PIXI.Texture(this.scene!.baseTexture)); // Install the font data
                console.log("Parsed font data:", fontData);
                if(i === placemenisObj.fonts.length - 1)
                {
                    this.initScene(placemenisObj);
                    _loadCompleteFnctn();
                } 
                
                
            })
            .catch(error => console.error("Error loading .fnt:", error));
        }
    }


    createFrame(itemName: string):PIXI.Sprite | null {
        //console.log(itemName);
        let img: PIXI.Sprite | null = new PIXI.Sprite(this.scene!.textures[itemName]);

        if (img === null) {
            console.log("COULD NOT FIND " + itemName);
        }
    
        return img;
    }

    getNumOfFrames(_framePrefix: string):number {
        let num = 0;
        var a: any  = Loader.shared.resources["data"].data;
            for (const k in a) {
                if (k.indexOf(_framePrefix) !== -1) {
                    num++;
                }
            }
        
        return num;
    }

    createMovieClip(_framePrefix: string):PIXI.AnimatedSprite {
        const frames: PIXI.Texture[] = [];
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

    initScene(_placementsObj: any) {
        this.valsToSetArr = [];
    
          this.scenes.push({
            stage:_placementsObj.stage,
            placementsObj: _placementsObj,
            templates: _placementsObj.templates,
            animTracks: _placementsObj.animTracks,
          });
      }
    
    getFrames(_templateName: string) {
        var frames: any = {};
        var templates = this.scenes[0].templates;
        var animTracks = this.scenes[0].animTracks;
        var baseNode = templates[_templateName];
        var num = 0;
        if (baseNode && baseNode.children) {
          for (var i = 0; i < baseNode.children.length; i++) {
            var childInstanceName = baseNode.children[i].instanceName;
            if (animTracks[childInstanceName]) {
              num++;
              frames[childInstanceName] = animTracks[childInstanceName];
            }
          }
        }
    
        return frames;
      }
    
     spawn(tempName: string): any {
        var templates = this.scenes[0].templates;
        var animTracks = this.scenes[0].animTracks;
        var baseNode = templates[tempName];
        if (!baseNode) {
          return;
        }
        var mc;
        var frames = this.getFrames(tempName);
    
        if (Object.keys(frames).length > 0) {
          mc = new ZTimeline();
          this.createAsset(mc, baseNode);
          mc.setFrames(this.fixRotation(frames));
        } else {
          mc = new ZContainer();
          this.createAsset(mc, baseNode);
        }
    
        mc.name = baseNode.instanceName;
    
        return mc;
      }
    
      getAllAssets(o: any, allAssets: any): any {
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
    
      degreesToRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
      }
    
      createAsset(mc: any, baseNode: any): void {
        // console.log(baseNode.name);
        for (var i = 0; i < baseNode.children.length; i++) {
          var child = baseNode.children[i];
          //console.log(child);
    
          var _name = child.name;
          var _x:number = parseFloat(child.x);
          var _y:number = parseFloat(child.y);
          var _w:number = parseFloat(child.width);
          var _h:number = parseFloat(child.height);
          var a:number = child.a;
          var b:number = child.b;
          var c:number = child.c;
          var d:number = child.d;
          var tx:number = child.tx;
          var ty:number = child.ty;
          var _alpha:number = 0;
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
    
            } else {
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
    
            mc[texName] = img;
            mc.addChild(img);
            img.x = _x;
            img.y = _y;
            img.width = _w;
            img.height = _h;
          }
          if (type == "btn") {
            asset = new ZButton();
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
            mc[asset.name] = asset;
            mc.addChild(asset);
    
            var m = new PIXI.Matrix();
            m.a  = a;
            m.b  = b;
            m.c  = c;
            m.d  = d;
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
            var frames = this.getFrames(child.name);
    
            if (Object.keys(frames).length > 0) {
              asset = new ZTimeline();
              asset.setFrames(this.fixRotation(frames));
            } else {
              asset = new ZContainer();
            }
    
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
            m.a  = a;
            m.b  = b;
            m.c  = c;
            m.d  = d;
            m.tx = tx;
            m.ty = ty;
            asset.transform.setFromMatrix(m);
            mc.addChild(asset);
    
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
            } else {
              this.createAsset(mc, childTempObj);
            }
          }
        }
      }
    
      fixRotation(_frames: any): any {
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
    
    async createBitmapTextFromXML(
        xmlUrl: string,
        textToDisplay: string,
        fontName: string,
        fontSize: number,
        callback: Function
      ) {
        // Load the texture atlas referenced in your XML
    
        const response = await fetch(xmlUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch XML font data: ${response.statusText}`);
        }
        const xmlData = await response.text();
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
    
        var textureUrl: string = "./../assets/" + fileAttribute;
    
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
      }
    
     loadTexture(textureUrl: string): Promise<PIXI.Texture> {
        return new Promise((resolve, reject) => {
          const texture = PIXI.Texture.from(textureUrl);
          // Listen for the "update" event to check when the texture is fully loaded
          texture.on("update", () => {
            if (texture.valid) {
              resolve(texture); // Resolve the promise when the texture is ready
            } else {
              reject(new Error("Failed to load texture."));
            }
          });
        });
      }
};

