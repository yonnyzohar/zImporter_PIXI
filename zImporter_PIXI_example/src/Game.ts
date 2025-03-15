import * as PIXI from 'pixi.js';
import { ZScene } from "zImporter_PIXI/ZScene";
import { ZSceneStack } from "zImporter_PIXI/ZSceneStack";
import { ZTimeline } from "zImporter_PIXI/ZTimeline";
export class Game{
    
    stage: PIXI.Container;
    constructor(stage: PIXI.Container){
        this.stage = stage;
        let scene:ZScene = new ZScene();
        scene.load("./assets/robo/",()=>{
            ZSceneStack.push(scene);
            let mc = ZSceneStack.spawn("RobotWalker") as ZTimeline;
            mc.play();
            stage.addChild(mc);
            mc.x = 100;
            mc.y = 200;
            
        })
    }

    update(deltaMS: number) {
        
    }
    
}