import { Graphics, FederatedPointerEvent, Point, Container } from "pixi.js";
import { ZContainer } from "./ZContainer";

interface DragEvent extends FederatedPointerEvent {
    global: Point;
}

export class ZScroll extends ZContainer {
    scrollBarHeight: number = 0;
    contentHeight: number = 0;
    dragStartY = 0;
    beedStartY = 0;
    isDragging = false;
    isBeedDragging = false;
    beed: ZContainer;
    scrollBar: ZContainer;
    scrollContent: ZContainer;
    msk: Graphics | null = null;
    scrollArea: Graphics | null = null;

    private onPointerDownBinded: any;
    private onPointerMoveBinded: any;
    private onPointerUpBinded: any;
    private onBeedDownBinded: any;
    private onBeedUpBinded: any;
    private onWheelBinded: any;

    init() {
        super.init();

        this.onPointerDownBinded = this.onPointerDown.bind(this);
        this.onPointerMoveBinded = this.onPointerMove.bind(this);
        this.onPointerUpBinded = this.onPointerUp.bind(this);
        this.onBeedDownBinded = this.onBeedDown.bind(this);
        this.onBeedUpBinded = this.onBeedUp.bind(this);
        this.onWheelBinded = this.onWheel.bind(this);

        this.beed = this.getChildByName("beed") as ZContainer;
        this.scrollBar = this.getChildByName("scrollBar") as ZContainer;
        this.scrollContent = this.getChildByName("scrollContent") as ZContainer;
        if (!this.beed || !this.scrollBar || !this.scrollContent) {
            console.warn("ZScroll requires 'beed', 'scrollBar', and 'scrollContent' children.");
            return;
        }

        this.calculateScrollBar();

    }

    getType(): string {
        return "ZScroll";
    };

    private calculateScrollBar(): void {
        if (!this.scrollBar || !this.scrollContent) {
            return;
        }

        let scrollBarHeight = this.scrollBar.height;
        let contentHeight = this.scrollContent.height;

        // Clean up old mask & scroll area before rebuilding
        if (this.msk) {
            this.msk.removeAllListeners();
            this.msk.removeFromParent();
            this.msk.destroy({ children: true });
            this.msk = null;
        }
        if (this.scrollArea) {
            this.scrollArea.removeAllListeners();
            this.scrollArea.removeFromParent();
            this.scrollArea.destroy({ children: true });
            this.scrollArea = null;
        }

        if (contentHeight <= scrollBarHeight) {
            console.log("Content fits, no scroll needed.");
            this.scrollBar.visible = false;
            this.scrollContent.y = 0;
            return;
        }

        this.scrollBar.visible = true;
        let w = this.scrollBar.x - this.scrollContent.x;
        console.log("Calculated scroll width:", w);
        this.msk = new Graphics();
        this.msk.name = "mask";
        this.msk.beginFill(0x000000, 0.5); // match MadHatScrollComponent alpha
        this.msk.drawRect(0, 0, w, scrollBarHeight);
        this.msk.endFill();

        this.scrollContent.mask = this.msk;
        this.addChild(this.msk);
        console.log("Mask dimensions:", w, scrollBarHeight);

        this.scrollArea = new Graphics();
        this.scrollArea.name = "scrollArea";
        this.scrollArea.beginFill(0x000000, 0.5); // match MadHatScrollComponent alpha
        this.scrollArea.drawRect(0, 0, w, scrollBarHeight);
        this.scrollArea.endFill();
        this.addChildAt(this.scrollArea, 0);
        this.scrollArea.interactive = true;

        this.scrollContent.y = 0;
        this.scrollBar.y = 0;

        this.addEventListeners();
        this.enableChildPassThrough();
    }

    private enableChildPassThrough(): void {
        // Allow buttons/toggles inside scrollContent to propagate events to scrollArea
        //now we need to go over all child components of the scroll contents and make sure they pass the events to the scroll area
        //this is needed for example for buttons to work inside the scroll area
        //without this the button will capture the event and the scroll area won't get it
        let scrollContent = this.scrollContent;
        let scrollArea = this.scrollArea;
        let types: string[] = ["ZToggle", "ZButton"];
        for (let type of types) {
            let allButtons = scrollContent.getAllOfType(type) as ZContainer[];

            for (let i = 0; i < allButtons.length; i++) {
                let child = allButtons[i];
                child.on("pointerdown", (event) => {
                    scrollArea!.emit("pointerdown", event);
                });
                child.on("ontouchstart", (event) => {
                    scrollArea!.emit("ontouchstart", event);
                });
                child.on("pointerup", (event) => {
                    scrollArea!.emit("pointerup", event);
                });
                child.on("ontouchend", (event) => {
                    scrollArea!.emit("ontouchend", event);
                });
                child.on("pointerupoutside", (event) => {
                    scrollArea!.emit("pointerupoutside", event);
                });
                child.on("ontouchendoutside", (event) => {
                    scrollArea!.emit("ontouchendoutside", event);
                });
                child.on("pointermove", (event) => {
                    scrollArea!.emit("pointermove", event);
                });
                child.on("ontouchmove", (event) => {
                    scrollArea!.emit("ontouchmove", event);
                });
            }
        }
    }

    addEventListeners(): void {
        this.removeEventListeners();
        if (this.scrollArea) {
            this.scrollArea.on('pointerdown', this.onPointerDownBinded);
            this.scrollArea.on('pointermove', this.onPointerMoveBinded);
            this.scrollArea.on('pointerup', this.onPointerUpBinded);
            this.scrollArea.on('pointerupoutside', this.onPointerUpBinded);
            this.scrollArea.on('touchstart', this.onPointerDownBinded);
            this.scrollArea.on('touchmove', this.onPointerMoveBinded);
            this.scrollArea.on('touchend', this.onPointerUpBinded);
            this.scrollArea.on('touchendoutside', this.onPointerUpBinded);
        }

        // Enable dragging beed directly
        this.beed.interactive = true;
        this.beed.on('pointerdown', this.onBeedDownBinded);
        this.beed.on('pointermove', this.onPointerMoveBinded);
        this.beed.on('pointerup', this.onBeedUpBinded);
        this.beed.on('pointerupoutside', this.onBeedUpBinded);
        this.beed.on('touchstart', this.onBeedDownBinded);
        this.beed.on('touchmove', this.onPointerMoveBinded);
        this.beed.on('touchend', this.onBeedUpBinded);
        this.beed.on('touchendoutside', this.onBeedUpBinded);

        document.body.addEventListener('wheel', this.onWheelBinded);
    }


    removeEventListeners(): void {
        this.scrollArea?.removeAllListeners();
        this.beed?.removeAllListeners();
        document.body.removeEventListener('wheel', this.onWheelBinded);
    }

    public removeListeners(): void {
        this.removeEventListeners();
    }

    onPointerDown(event: DragEvent) {
        this.isDragging = true;
        this.scrollBarHeight = this.scrollBar.height;
        this.dragStartY = event.data.global.y;
        this.beedStartY = this.beed.y;
    }

    onBeedDown(event: DragEvent) {
        this.isBeedDragging = true;
        this.scrollBarHeight = this.scrollBar.height;
        this.dragStartY = event.data.global.y;
        this.beedStartY = this.beed.y;
    }

    onPointerMove(event: DragEvent) {
        if (this.isDragging || this.isBeedDragging) {
            const currentY = event.data.global.y;
            let deltaY = this.isDragging
                ? this.dragStartY - currentY // scroll area inverts direction
                : currentY - this.dragStartY; // beed is direct drag

            this.beed.y = this.beedStartY + deltaY;

            if (this.beed.y < 0) this.beed.y = 0;
            if (this.beed.y > this.scrollBarHeight - this.beed.height)
                this.beed.y = this.scrollBarHeight - this.beed.height;

            const per = this.beed.y / (this.scrollBarHeight - this.beed.height);
            this.scrollContent.y = -per * (this.scrollContent.height - this.scrollBarHeight);

            event.stopPropagation();
        }
    }

    onPointerUp() {
        this.isDragging = false;
    }

    onBeedUp() {
        this.isBeedDragging = false;
    }

    onWheel(event: WheelEvent) {
        let delta = -event.deltaY * 0.5;
        this.scrollBarHeight = this.scrollBar.height;
        this.beed.y -= delta;
        if (this.beed.y < 0) this.beed.y = 0;
        if (this.beed.y > this.scrollBarHeight - this.beed.height)
            this.beed.y = this.scrollBarHeight - this.beed.height;

        const per = this.beed.y / (this.scrollBarHeight - this.beed.height);
        this.scrollContent.y = -per * (this.scrollContent.height - this.scrollBarHeight);

        event.stopPropagation();
    }

    applyTransform() {
        super.applyTransform();
        this.calculateScrollBar();
    }
}
