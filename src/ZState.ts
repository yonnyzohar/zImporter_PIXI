import { ZContainer } from "./ZContainer";
import { ZTextField } from "./ZTextField";
import { ZTimeline } from "./ZTimeline";

//in a state, all children are turned off at any given moment except one
export class ZState extends ZContainer{
    private currentState:ZContainer | null = null;
    //this is called once all children of the container are loaded
    public init():void{
        this.currentState = this.setState("idle");
    }

    public getCurrentState():ZContainer | null
    {
        return this.currentState;
    }

    public hasState(str:string):boolean
    {
        return this.getChildByName(str) !== null;
    }

    public setState(str:string):ZContainer | null
    {
        let chosenChild:ZContainer = this.getChildByName(str) as ZContainer;
        if(!chosenChild)
        {
            chosenChild = this.getChildByName("idle") as ZContainer;
            if(!chosenChild)
            {
                chosenChild = this.getChildAt(0) as ZContainer;
            }
        }
        for(let i = 0; i < this.children.length; i++)
        {
            let child = this.children[i];
            child.visible = false;
            if(child instanceof ZTimeline)
            {
                let t = child as ZTimeline;
                t.stop();
            }
        }
        if(chosenChild)
        {
            chosenChild.visible = true;
            if(chosenChild instanceof ZTimeline)
            {
                let t = chosenChild as ZTimeline;
                t.play();
            }
        }
        return chosenChild;
    }
}