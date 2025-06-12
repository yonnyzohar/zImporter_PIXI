import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import * as PIXI from "pixi.js";
import { ZButton } from "./ZButton";
import { ZContainer } from "./ZContainer";
import { ZTimeline } from "./ZTimeline";
import { InstanceData, SceneData, TemplateData ,AnimTrackData, TextData, BaseAssetData,SpriteData} from "./SceneData";
import { ZState } from "./ZState";

export class ZScene {
  private scene: PIXI.Spritesheet | null = null;
  private _sceneStage:PIXI.Container  = new PIXI.Container();
  private data: SceneData;
  private resizeMap: Map<ZContainer, boolean> = new Map();
  private static Map: Map<string, ZScene> = new Map();
  private sceneId: string;
  private orientation: "landscape" | "portrait" = "portrait";

  constructor(_sceneId:string) {
    this.sceneId = _sceneId;
    this.setOrientation();
    ZScene.Map.set(_sceneId, this);
  }

  public setOrientation(): void {
    this.orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  }

  public static getSceneById(sceneId: string): ZScene | undefined {
    return ZScene.Map.get(sceneId);
  }

  private sceneName: string | null = null;

  public get sceneStage() {
    return this._sceneStage;
  }

  loadStage(globalStage: PIXI.Container): void {
    this.resize(window.innerWidth, window.innerHeight);
    let stageAssets = this.data.stage;
    let children = stageAssets!.children;
    if(children)
    {
        for(let i = 0; i < children.length; i++)
        {
            let child = children[i] as InstanceData;
            let tempName = child.name;
            let mc:ZContainer | undefined = this.spawn(tempName);
            if(mc)
            {
                mc.setInstanceData(child, this.orientation);
                this.addToResizeMap(mc);
                this._sceneStage.addChild(mc);
                (this._sceneStage as any)[mc.name] = mc;
            }
        }
    }
    globalStage.addChild(this._sceneStage);
    this.resize(window.innerWidth, window.innerHeight);
  }

  public addToResizeMap(mc: ZContainer): void
  {
    this.resizeMap.set(mc, true);
  }

  public removeFromResizeMap(mc: ZContainer): void
  {
    this.resizeMap.delete(mc);
  }

  public resize(width: number, height: number): void 
  {
      if (this.data && this.data.resolution) {
        
        this.setOrientation();
        let baseWidth = this.data.resolution.x;
        let baseHeight = this.data.resolution.y;
        if(this.orientation === "portrait")
        {
          baseWidth = this.data.resolution.y;
          baseHeight = this.data.resolution.x;

        }

        const scaleX = width / baseWidth;
        const scaleY = height / baseHeight;
        const scale = Math.min(scaleX, scaleY); // uniform scale to fit
        console.log("resize", width, height, baseWidth, baseHeight, scaleX, scaleY, scale);

        this._sceneStage.scale.x = scale;
        this._sceneStage.scale.y = scale;

        // Center the stage
        this._sceneStage.x = (width - baseWidth * scale) / 2;
        this._sceneStage.y = (height - baseHeight * scale) / 2;

        for (const [mc, _] of this.resizeMap) {
          mc.resize(width, height, this.orientation);
        }
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

  initScene(_placementsObj: SceneData): void {
    this.data = _placementsObj;
  }

  //this gives the frames of all the children of a template
  //it combines the template name of the parent with the child name to get the frame
  getChildrenFrames(_templateName: string) {
    var frames: Record<string, AnimTrackData[]> = {};
    var templates = this.data.templates;
    var animTracks = this.data.animTracks!;
    var baseNode = templates[_templateName];
    if (baseNode && baseNode.children) {
      for (var i = 0; i < baseNode.children.length; i++) {
        let childNode = baseNode.children[i] as InstanceData;
        var childInstanceName = childNode.instanceName;
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

  spawn(tempName: string): ZContainer | undefined {
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
      if(baseNode.type == "btn")
      {
        mc = new ZButton();
      }
      else
      {
        if(baseNode.type == "state")
        {
          mc = new ZState();
        }
        else
        {
          mc = new ZContainer();
        }
        
      }
      
      this.createAsset(mc, baseNode);
      mc.init();
    }
    
    //mc.name = baseNode.instanceName;

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

  createAsset(mc: ZContainer, baseNode: TemplateData): void {
    // console.log(baseNode.name);
    for (var i = 0; i < baseNode.children.length; i++) {
      var childNode = baseNode.children[i] as BaseAssetData;
      //console.log(child);

      var _name = childNode.name;
      
      var type = childNode.type;
      var asset;

      if (type == "bmpTextField" || type == "textField") {
        let textInstanceNode = childNode as any as TextData;
        if (PIXI.BitmapFont.available[textInstanceNode.fontName as string]) {
          const tf = new PIXI.BitmapText(textInstanceNode.text || "", {
            fontName: textInstanceNode.fontName as string, // This must match the "face" attribute in the .fnt file
            fontSize: textInstanceNode.size as number,       // Adjust as needed,
            letterSpacing: textInstanceNode.letterSpacing || 0               // Adjust the letter spacing between characters
          });

          tf.name = _name;
          (mc as any)[_name] = tf;
          mc.addChild(tf);
          tf.x = textInstanceNode.x;
          tf.y = textInstanceNode.y;
          this.applyFilters(childNode, tf);
        } else {
          //if ()

          const tf = new PIXI.Text(textInstanceNode.text + "", {
            fontFamily: textInstanceNode.fontName,
            fontSize: textInstanceNode.size,
            fill: textInstanceNode.color,
            align: "center",
          });

          if(textInstanceNode.textAnchorX && textInstanceNode.textAnchorY){
            tf.anchor.set(textInstanceNode.textAnchorX,textInstanceNode.textAnchorY);
          }
          

          if (textInstanceNode.size) {
            tf.style.fontSize = textInstanceNode.size;
          }
          if (textInstanceNode.color) {
            tf.style.fill = textInstanceNode.color;
          }
          if (textInstanceNode.align) {
            tf.style.align = textInstanceNode.align as PIXI.TextStyleAlign;
          }
          if (textInstanceNode.stroke) {
            tf.style.stroke = textInstanceNode.stroke;
          }
          if (textInstanceNode.strokeThickness) {
            tf.style.strokeThickness = textInstanceNode.strokeThickness;
          }
          if (textInstanceNode.wordWrap) {
            tf.style.wordWrap = textInstanceNode.wordWrap;
          }
          if (textInstanceNode.wordWrapWidth) {
            tf.style.wordWrapWidth = textInstanceNode.wordWrapWidth;
          }
          if (textInstanceNode.breakWords) {
            tf.style.breakWords = textInstanceNode.breakWords;
          }
          if (textInstanceNode.leading) {
            tf.style.leading = textInstanceNode.leading;
          }
          if (textInstanceNode.letterSpacing) {
            tf.style.letterSpacing = textInstanceNode.letterSpacing;
          }
          if (textInstanceNode.padding) {
            tf.style.padding = textInstanceNode.padding as number;
          }

          if (textInstanceNode.fontWeight) {
            tf.style.fontWeight = textInstanceNode.fontWeight as PIXI.TextStyleFontWeight ;
          }

          tf.name = _name;
          tf.x = textInstanceNode.x;
          tf.y = textInstanceNode.y;
          (mc as any)[_name] = tf;
          mc.addChild(tf);
          this.applyFilters(childNode, tf);
        }
      }

      if (type == "img") {
        let spriteData = childNode as SpriteData;
        var _w: number = (spriteData.width);
        var _h: number = (spriteData.height);
        var _x: number = spriteData.x;
        var _y: number = spriteData.y;
        var texName = _name;

        texName = texName.endsWith("_IMG") ? texName.slice(0, -4) : texName;
        var img = this.createFrame(texName);
        if (!img) {
          return;
        }
        img.name = _name;
        (mc as any)[texName] = img;
        mc.addChild(img);
        img.x = _x;
        img.y = _y;
        img.width = _w;
        img.height = _h;
      }
      if (type == "btn") {
        var instanceData = childNode as InstanceData;

        asset = new ZButton();
        asset.name = instanceData.instanceName;
        
        if (!asset.name) {
          return;
        }

        //setting the child as a propery of the parent will allow it to alter it's transform in a  ZTimeline
        (mc as any)[asset.name] = asset;
        asset.setInstanceData(instanceData, this.orientation);
        mc.addChild(asset);
        this.addToResizeMap(asset);
        
      }
      
      if (type == "asset" || type == "state") {
        var instanceData = childNode as InstanceData;
        //this will tell me fi this asses template has children with frames
        var frames = this.getChildrenFrames(childNode.name);

        if (Object.keys(frames).length > 0) {
          asset = new ZTimeline();
          asset.setFrames(frames);
        } else {
          if (type == "state") {
            asset = new ZState();
          }
          else
          {
            asset = new ZContainer();
          }
          
        }
        console.log("creation", instanceData.instanceName); // Should print "ZTimeline"
        console.log("constructor", asset.constructor.name); // Should print "ZTimeline"
        console.log("instanceof", asset instanceof ZTimeline);

        asset.name = instanceData.instanceName;
        if (!asset.name) {
          return;
        }
        (mc as any)[asset.name] = asset;
        this.applyFilters(childNode, asset);
        asset.setInstanceData(instanceData, this.orientation);
        mc.addChild(asset);
        this.addToResizeMap(asset);

        
        console.log("after addition", instanceData.instanceName); // Should print "ZTimeline"
        console.log("constructor", asset.constructor.name); // Should print "ZTimeline"
        console.log("instanceof", asset instanceof ZTimeline);
        

      }
      var templates = this.data.templates;
      var childTempObj = templates[childNode.name];

      if (childTempObj && childTempObj.children) {
        if (asset) {
          this.createAsset(asset, childTempObj);
        } else {
          this.createAsset(mc, childTempObj);
        }
      }
      asset?.init();

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
