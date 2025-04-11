import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import * as PIXI from "pixi.js";
import { ZButton } from "./ZButton";
import { ZContainer } from "./ZContainer";
import { ZTimeline } from "./ZTimeline";

export class ZScene {
  private scene: PIXI.Spritesheet | null = null;
  private _stage:PIXI.Container  = new PIXI.Container();
  private valsToSetArr: any[] = [];
  private data: {
    placementsObj: any;
    templates: any;
    animTracks: any;
    stage: any;
    resolution: {x:number, y:number};
  };
  private static Map: Map<string, ZScene> = new Map();
  private sceneId: string;

  constructor(_sceneId:string) {
    this.sceneId = _sceneId;
    ZScene.Map.set(_sceneId, this);
  }

  public static getSceneById(sceneId: string): ZScene | undefined {
    return ZScene.Map.get(sceneId);
  }

  private sceneName: string | null = null;

  public get stage() {
    return this._stage;
  }

  public resize(width: number, height: number): void {
   // this._stage.width = width;
   // this._stage.height = height;
   if(this.data && this.data.resolution)
   {
    this._stage.scale.x = width / this.data.resolution.x;
    this._stage.scale.y = height / this.data.resolution.y;
   }
  }

  async load(
    assetBasePath: string,
    _loadCompleteFnctn: Function
  ): Promise<void> {
    let placementsUrl: string =
      assetBasePath + "placements.json?rnd=" + Math.random();
    fetch(placementsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((placemenisObj) => {
        this.loadAssets(assetBasePath, placemenisObj, _loadCompleteFnctn);
      })
      .catch((error) => {
        //errorCallback(error);
      });
  }

  loadStage(stage: PIXI.Container): void {
    let stageAssets = this.data.stage;
    let children = stageAssets.children;
    if(children)
    {
        for(let i = 0; i < children.length; i++)
        {
            let child = children[i];
            let tempName = child.name;
            let mc = this.spawn(tempName);
            if(mc)
            {
                stage.addChild(mc);
                mc.name = child.instanceName || "";
                mc.x = child.x || 0;
                mc.y = child.y || 0;
                mc.rotation = child.rotation || 0;
                mc.alpha = child.alpha || 1;
                mc.scale.x = child.scaleX || 1;
                mc.scale.y = child.scaleY || 1;
                mc.pivot.x = child.pivotX || 0;
                mc.pivot.y = child.pivotY || 0;
                (stage as any)[mc.name] = mc;
            }
        }
    }
}

  async destroy(): Promise<void> {
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

  async loadAssets(
    assetBasePath: string,
    placemenisObj: any,
    _loadCompleteFnctn: Function
  ) {
    let _jsonPath: string = assetBasePath + "ta.json?rnd=" + Math.random();
    this.scene = await PIXI.Assets.load(_jsonPath);
    this.sceneName = _jsonPath;
    if (placemenisObj.fonts.length == 0) {
      this.initScene(placemenisObj);
      _loadCompleteFnctn();
      return;
    }
    for (let i = 0; i < placemenisObj.fonts.length; i++) {
      let path: string = placemenisObj.fonts[i];
      let url: string = assetBasePath + path + ".fnt";
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const fontData = new PIXI.BitmapFontData();
          PIXI.BitmapFont.install(
            data,
            new PIXI.Texture(this.scene!.baseTexture)
          ); // Install the font data
          console.log("Parsed font data:", fontData);
          if (i === placemenisObj.fonts.length - 1) {
            this.initScene(placemenisObj);
            _loadCompleteFnctn();
          }
        })
        .catch((error) => console.error("Error loading .fnt:", error));
    }
  }

  createFrame(itemName: string): PIXI.Sprite | null {
    //console.log(itemName);
    let img: PIXI.Sprite | null = new PIXI.Sprite(
      this.scene!.textures[itemName]
    );

    if (img === null) {
      console.log("COULD NOT FIND " + itemName);
    }

    return img;
  }

  getNumOfFrames(_framePrefix: string): number {
    let num = 0;
    var a: any = this.scene!.data;
    for (const k in a) {
      if (k.indexOf(_framePrefix) !== -1) {
        num++;
      }
    }

    return num;
  }

  createMovieClip(_framePrefix: string): PIXI.AnimatedSprite {
    const frames: PIXI.Texture[] = [];
    const numFrames = this.getNumOfFrames(_framePrefix);
    //console.log(numFrames + " in " + _framePrefix);
    for (let i = 0; i < numFrames; i++) {
      const val = i < 10 ? "0" + i : i;
      const textureName = _framePrefix + "00" + val;
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
    this.data = _placementsObj;
  }

  //this gives the frames of all the children of a template
  //it combines the template name of the parent with the child name to get the frame
  getChildrenFrames(_templateName: string) {
    var frames: any = {};
    var templates = this.data.templates;
    var animTracks = this.data.animTracks;
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

  spawn(tempName: string): any {
    var templates = this.data.templates;
    var baseNode = templates[tempName];
    if (!baseNode) {
      return;
    }
    var mc;
    var frames = this.getChildrenFrames(tempName);

    if (Object.keys(frames).length > 0) {
      mc = new ZTimeline();
      this.createAsset(mc, baseNode);
      mc.setFrames(frames);
      mc.gotoAndStop(0);
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
      var _x: number = parseFloat(child.x);
      var _y: number = parseFloat(child.y);
      var _w: number = parseFloat(child.width);
      var _h: number = parseFloat(child.height);
      var a: number = child.a;
      var b: number = child.b;
      var c: number = child.c;
      var d: number = child.d;
      var tx: number = child.tx;
      var ty: number = child.ty;
      var pivotX: number = child.pivotX || 0;
      var pivotY: number = child.pivotY || 0;
      var scaleX: number = child.scaleX || 1;
      var scaleY: number = child.scaleY || 1;
      var rotation:number = child.rotation || 0;
      var _alpha: number = 0;
      var type = child.type;
      var asset;

      if (type == "bmpTextField" || type == "textField") {
        if (PIXI.BitmapFont.available[child.uniqueFontName]) {
          const tf = new PIXI.BitmapText(child.text || "", {
            fontName: child.uniqueFontName, // This must match the "face" attribute in the .fnt file
            fontSize: child.size,       // Adjust as needed,
            letterSpacing: child.letterSpacing || 0               // Adjust the letter spacing between characters
          });

          tf.name = _name;
          mc[_name] = tf;
          mc.addChild(tf);
          tf.x = _x;
          tf.y = _y;
          this.applyFilters(child, tf);
        } else {
          //if ()

          const tf = new PIXI.Text(child.text + "", {
            fontFamily: child.fontName,
            fontSize: child.size,
            fill: child.color,
            align: "center",
          });

          if (child.size) {
            tf.style.fontSize = child.size;
          }
          if (child.color) {
            tf.style.fill = child.color;
          }
          if (child.align) {
            tf.style.align = child.align;
          }
          if (child.stroke) {
            tf.style.stroke = child.stroke;
          }
          if (child.strokeThickness) {
            tf.style.strokeThickness = child.strokeThickness;
          }
          if (child.wordWrap) {
            tf.style.wordWrap = child.wordWrap;
          }
          if (child.wordWrapWidth) {
            tf.style.wordWrapWidth = child.wordWrapWidth;
          }
          if (child.breakWords) {
            tf.style.breakWords = child.breakWords;
          }
          if (child.leading) {
            tf.style.leading = child.leading;
          }
          if (child.letterSpacing) {
            tf.style.letterSpacing = child.letterSpacing;
          }
          if (child.padding) {
            tf.style.padding = child.padding;
          }

          tf.name = _name;
          tf.x = _x;
          tf.y = _y;
          mc[_name] = tf;
          mc.addChild(tf);
          this.applyFilters(child, tf);
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
        asset = new ZButton();
        asset.name = child.instanceName;

        if (!asset.name) {
          return;
        }
        //asset.scale.x = _scaleX;
        //asset.scale.y = _scaleY;
        _alpha = child.alpha;
        asset.pivot.x = pivotX;
        asset.pivot.y = pivotY;
        asset.scale.x = scaleX;
        asset.scale.y = scaleY;
        asset.x = _x;
        asset.y = _y;
        asset.interactive = true;
        asset.interactiveChildren = true;
        asset.rotation = rotation;
        asset.alpha = _alpha;
        //setting the child as a propery of the parent will allow it to alter it's transform in a  ZTimeline
        mc[asset.name] = asset;
        mc.addChild(asset);

       
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
          asset = new ZTimeline();
          asset.setFrames(frames);
        } else {
          asset = new ZContainer();
        }
        console.log("creation", child.instanceName); // Should print "ZTimeline"
        console.log("constructor", asset.constructor.name); // Should print "ZTimeline"
        console.log("instanceof", asset instanceof ZTimeline);

        asset.name = child.instanceName;
        if (!asset.name) {
          return;
        }

        _alpha = child.alpha;

        asset.x = _x;
        asset.y = _y;

        asset.rotation = rotation;

        //console.log(asset.name + " rot " + asset.rotation + " degrees " + child.rotation);
        asset.alpha = _alpha;
        mc[asset.name] = asset;
        asset.pivot.x = pivotX;
        asset.pivot.y = pivotY;
        asset.scale.x = scaleX;
        asset.scale.y = scaleY;
        this.applyFilters(child, asset);


        mc.addChild(asset);
        console.log("after addition", child.instanceName); // Should print "ZTimeline"
        console.log("constructor", asset.constructor.name); // Should print "ZTimeline"
        console.log("instanceof", asset instanceof ZTimeline);

        this.valsToSetArr.push({
          mc: asset,
          w: _w,
          h: _h,
        });
      }
      var templates = this.data.templates;
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

  applyFilters(obj: any, tf: PIXI.Container) {
    if(obj.filters)
      {
        for(var k in obj.filters)
        {
          let filter = obj.filters[k];
          if(filter.type == "dropShadow")
          {
            let dropShadowFilter = new DropShadowFilter();
            dropShadowFilter.alpha = filter.alpha;
            dropShadowFilter.blur = filter.blur;
            dropShadowFilter.color = filter.color;
            dropShadowFilter.distance = filter.distance;
            dropShadowFilter.resolution = filter.resolution;
            dropShadowFilter.rotation = filter.rotation;
            if(!tf.filters)
            {
              tf.filters = [];
            }
            tf.filters.push(dropShadowFilter);
          }
        }
      }
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
}
