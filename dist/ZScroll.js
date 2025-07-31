import { Graphics } from "pixi.js";
import { ZContainer } from "./ZContainer";
export class ZScroll extends ZContainer {
    scrollBarHeight = 0;
    contentHeight = 0;
    init() {
        super.init();
        let beed = this.getChildByName("beed");
        let scrollBar = this.getChildByName("scrollBar");
        let scrollContent = this.getChildByName("scrollContent");
        if (!beed || !scrollBar || !scrollContent) {
            console.warn("ZScroll requires 'beed', 'scrollBar', and 'scrollContent' children.");
            return;
        }
        let scrollBarHeight = scrollBar.height;
        let contentHeight = scrollContent.height;
        if (contentHeight <= scrollBarHeight) {
            scrollBar.visible = false;
            scrollContent.y = 0;
            return;
        }
        else {
            scrollBar.visible = true;
            let w = scrollBar.x - scrollContent.x;
            let msk = new Graphics();
            msk.beginFill(0x000000, 0.5);
            msk.drawRect(0, 0, w, scrollBarHeight);
            msk.endFill();
            scrollContent.mask = msk;
            this.addChild(msk);
            let scrollArea = new Graphics();
            scrollArea.beginFill(0x000000, 0.5);
            scrollArea.drawRect(0, 0, w, scrollBarHeight);
            scrollArea.endFill();
            this.addChildAt(scrollArea, 0);
            scrollContent.y = 0;
            scrollBar.y = 0;
            let dragStartY = 0;
            let beedStartY = 0;
            let isDragging = false;
            let onPointerDown = (event) => {
                isDragging = true;
                dragStartY = event.data.global.y;
                beedStartY = beed.y;
            };
            let onPointerMove = (event) => {
                if (isDragging) {
                    const currentY = event.data.global.y;
                    const deltaY = dragStartY - currentY; // Invert direction
                    beed.y = beedStartY + deltaY;
                    // Clamp
                    if (beed.y < 0)
                        beed.y = 0;
                    if (beed.y > scrollBarHeight - beed.height)
                        beed.y = scrollBarHeight - beed.height;
                    // Update scrollContent.y
                    const per = beed.y / (scrollBarHeight - beed.height);
                    scrollContent.y = -per * (scrollContent.height - scrollBarHeight);
                    event.stopPropagation();
                }
            };
            let onPointerUp = () => {
                isDragging = false;
            };
            scrollArea.interactive = true;
            scrollArea.on('pointerdown', onPointerDown);
            scrollArea.on('ontouchstart', onPointerDown);
            scrollArea.on('pointermove', onPointerMove);
            scrollArea.on('ontouchmove', onPointerMove);
            scrollArea.on('pointerup', onPointerUp);
            scrollArea.on('ontouchend', onPointerUp);
            scrollArea.on('pointerupoutside', onPointerUp);
            scrollArea.on('ontouchendoutside', onPointerUp);
        }
    }
}
//# sourceMappingURL=ZScroll.js.map