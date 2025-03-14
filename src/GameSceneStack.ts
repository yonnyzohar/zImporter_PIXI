import { GameContainer } from "./GameContainer";
import { GameScene } from "./GameScene";

export class GameSceneStack{
    
    //the following is a stack of resources of tyoe T
    private static stack:GameScene[] = [];
    private static stackSize:number = 0;
    private static top:number = 0;


    public static push(resource:GameScene):void{
        this.stack[this.top] = resource;
        this.top++;
        this.stackSize++;
        
    }

    public static pop():GameScene | null{
        if(this.stackSize > 0){
            this.top--;
            this.stackSize--;
            return this.stack[this.top];
        }
        return null;
    }

    public static peek():GameScene | null{
        if(this.stackSize > 0){
            return this.stack[this.top - 1];
        }
        return null;
    }

    public static getStackSize():number{
        return this.stackSize;
    }

    public static clear():void{
        this.stack = [];
        this.stackSize = 0;
        this.top = 0;
    }


    //////

    static spawn(templateName: string):GameContainer | undefined {
        for(let i = this.stack.length-1; i >=0 ; i-- )
        {
            let gameScene:GameScene = this.stack[i];
            let ent:GameContainer = gameScene.spawn(templateName);
            if(ent)
            {
                return ent;
            }
        }
    }
}