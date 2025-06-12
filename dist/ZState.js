import { ZContainer } from "./ZContainer";
import { ZTimeline } from "./ZTimeline";
//in a state, all children are turned off at any given moment except one
export class ZState extends ZContainer {
    //this is called once all children of the container are loaded
    init() {
        this.setState("idle");
    }
    setState(str) {
        let chosenChild = this.getChildByName(str);
        if (!chosenChild) {
            chosenChild = this.getChildByName("idle");
            if (!chosenChild) {
                chosenChild = this.getChildAt(0);
            }
        }
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            child.visible = false;
            if (child instanceof ZTimeline) {
                let t = child;
                t.stop();
            }
        }
        if (chosenChild) {
            chosenChild.visible = true;
            if (chosenChild instanceof ZTimeline) {
                let t = chosenChild;
                t.play();
            }
        }
        return chosenChild;
    }
}
//# sourceMappingURL=ZState.js.map