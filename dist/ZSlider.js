import { ZContainer } from "./ZContainer";
export class ZSlider extends ZContainer {
    // Slider specific properties and methods can be added here
    dragging = false;
    sliderWidth = 0;
    callback;
    onDragStartBinded;
    onDragEndBinded;
    onDragBinded;
    init() {
        super.init();
        const handle = this.get('handle');
        const track = this.get('track');
        if (!handle || !track) {
            console.error("ZSlider is missing handle or track");
            return;
        }
        this.sliderWidth = track.width;
        this.onDragStartBinded = this.onDragStart.bind(this);
        this.onDragEndBinded = this.onDragEnd.bind(this);
        this.onDragBinded = this.onDrag.bind(this);
        handle
            .on('pointerdown', this.onDragStartBinded).on('touchstart', this.onDragStartBinded)
            .cursor = 'pointer';
    }
    getType() {
        return "ZSlider";
    }
    setHandlePosition(t) {
        let handle = this.handle;
        handle.x = t * this.sliderWidth;
        if (this.callback) {
            this.callback(t);
        }
    }
    ;
    setCallback(callback) {
        this.callback = callback;
    }
    removeCallback() {
        this.callback = undefined;
    }
    onDragStart(e) {
        this.dragging = true;
        let handle = this.handle;
        handle.on("pointerup", this.onDragEndBinded);
        handle.on("pointerupoutside", this.onDragEndBinded);
        handle.on("touchend", this.onDragEndBinded);
        handle.on("touchendoutside", this.onDragEndBinded);
        window.addEventListener('pointerup', this.onDragEndBinded);
        window.addEventListener('touchend', this.onDragEndBinded);
        window.addEventListener('pointermove', this.onDragBinded);
        window.addEventListener('touchmove', this.onDragBinded);
    }
    onDragEnd(e) {
        this.dragging = false;
        let handle = this.handle;
        handle.off("pointerup", this.onDragEndBinded);
        handle.off("pointerupoutside", this.onDragEndBinded);
        handle.off("touchend", this.onDragEndBinded);
        handle.off("touchendoutside", this.onDragEndBinded);
        window.removeEventListener('pointerup', this.onDragEndBinded);
        window.removeEventListener('touchend', this.onDragEndBinded);
        window.removeEventListener('pointermove', this.onDragBinded);
        window.removeEventListener('touchmove', this.onDragBinded);
    }
    onDrag(e) {
        let clientX;
        if ('data' in e && e.data?.global) {
            // PIXI FederatedPointerEvent
            const local = this.toLocal(e.data.global);
            clientX = local.x;
        }
        else if ('clientX' in e) {
            // PointerEvent
            const rect = this.getBounds();
            clientX = e.clientX - rect.x;
        }
        else if ('touches' in e && e.touches.length > 0) {
            // TouchEvent
            const rect = this.getBounds();
            clientX = e.touches[0].clientX - rect.x;
        }
        if (typeof clientX !== 'number')
            return;
        let handle = this.handle;
        handle.x = clientX;
        if (handle.x < 0)
            handle.x = 0;
        if (handle.x > this.sliderWidth)
            handle.x = this.sliderWidth;
        const t = handle.x / this.sliderWidth;
        if (this.callback) {
            this.callback(t);
        }
        if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
    }
}
//# sourceMappingURL=ZSlider.js.map