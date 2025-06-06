import { ZContainer } from "./ZContainer";
import { ZScene } from "./ZScene";

export class ZSceneStack{
    
    //the following is a stack of resources of tyoe T
    private static stack:ZScene[] = [];
    private static stackSize:number = 0;
    private static top:number = 0;


    public static push(resource:ZScene):void{
        this.stack[this.top] = resource;
        this.top++;
        this.stackSize++;
        
    }

    public static pop():ZScene | null{
        if(this.stackSize > 0){
            this.top--;
            this.stackSize--;
            return this.stack[this.top];
        }
        return null;
    }

    public static peek():ZScene | null{
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

    static spawn(templateName: string):ZContainer | undefined {
        for(let i = this.stack.length-1; i >=0 ; i-- )
        {
            let gameScene:ZScene = this.stack[i];
            let ent:ZContainer = gameScene.spawn(templateName);
            if(ent)
            {
                return ent;
            }
        }
    }

    static resize(width: number, height: number): void {
        for(let i = this.stack.length-1; i >=0 ; i-- )
        {
            let gameScene:ZScene = this.stack[i];
            gameScene.resize(width, height);
        }
    }
}