import * as PIXI from 'pixi.js';
import { GameScene } from "zImporter_PIXI/GameScene";
import { GameSceneStack } from "zImporter_PIXI/GameSceneStack";
import { TimelineSprite } from "zImporter_PIXI/TimelineSprite";
export class Game{
    
    stage: PIXI.Container;
    constructor(stage: PIXI.Container){
        this.stage = stage;
        let scene:GameScene = new GameScene();
        scene.load("./assets/robo/",()=>{
            GameSceneStack.push(scene);
            let mc = GameSceneStack.spawn("RobotWalker") as TimelineSprite;
            mc.play();
            stage.addChild(mc);
            mc.x = 100;
            mc.y = 200;
            
        })
    }

    update(deltaMS: number) {
        
    }
    
}