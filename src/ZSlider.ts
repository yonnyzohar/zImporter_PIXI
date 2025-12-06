import { ZContainer } from "./ZContainer";
import { FederatedPointerEvent, Point } from "pixi.js";

interface DragEvent extends FederatedPointerEvent {
    global: Point;
}

export class ZSlider extends ZContainer {
    // Slider specific properties and methods can be added here

    dragging = false;
    sliderWidth: number | undefined = 0;
    callback?: (t: number) => void;
    onDragStartBinded: any;
    onDragEndBinded: any;
    onDragBinded: any;

    init() {
        super.init();

        const handle: ZContainer = this.get('handle') as ZContainer;
        const track: ZContainer = this.get('track') as ZContainer;
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

    public getType(): string {
        return "ZSlider";
    }

    setHandlePosition(t: number) {
        let handle = (this as any).handle;
        handle.x = t * this.sliderWidth!;
        if (this.callback) {
            this.callback(t);
        }
    };

    setCallback(callback: (t: number) => void) {
        this.callback = callback;
    }

    removeCallback() {
        this.callback = undefined;
    }


    onDragStart(e: DragEvent) {
        this.dragging = true;
        let handle = (this as any).handle;
        handle.on("pointerup", this.onDragEndBinded);
        handle.on("pointerupoutside", this.onDragEndBinded);
        handle.on("touchend", this.onDragEndBinded);
        handle.on("touchendoutside", this.onDragEndBinded);
        window.addEventListener('pointerup', this.onDragEndBinded);
        window.addEventListener('touchend', this.onDragEndBinded);
        window.addEventListener('pointermove', this.onDragBinded);
        window.addEventListener('touchmove', this.onDragBinded);
    }

    onDragEnd(e: DragEvent) {
        this.dragging = false;
        let handle = (this as any).handle;
        handle.off("pointerup", this.onDragEndBinded);
        handle.off("pointerupoutside", this.onDragEndBinded);
        handle.off("touchend", this.onDragEndBinded);
        handle.off("touchendoutside", this.onDragEndBinded);
        window.removeEventListener('pointerup', this.onDragEndBinded);
        window.removeEventListener('touchend', this.onDragEndBinded);
        window.removeEventListener('pointermove', this.onDragBinded);
        window.removeEventListener('touchmove', this.onDragBinded);
    }

    onDrag(e: DragEvent | PointerEvent | TouchEvent): void {
        let clientX: number | undefined;
        let track = (this as any).track;
        if ('data' in e && e.data?.global) {
            // PIXI FederatedPointerEvent
            const local = this.toLocal(e.data.global);
            clientX = local.x;
        } else if ('clientX' in e) {
            // PointerEvent
            const rect = track.getBounds();
            clientX = (e as PointerEvent).clientX - rect.x;
        } else if ('touches' in e && (e as TouchEvent).touches.length > 0) {
            // TouchEvent
            const rect = track.getBounds();
            clientX = (e as TouchEvent).touches[0].clientX - rect.x;
        }
        if (typeof clientX !== 'number') return;

        let handle = (this as any).handle;
        // Clamp so that the handle's left edge stays within [0, sliderWidth]
        const minX = 0;
        const maxX = this.sliderWidth!;
        // The position where the mouse is, relative to the left edge of the slider
        // We want the left edge of the handle to be at clientX, so set handle.x = clientX + handle.pivot.x
        clientX = Math.max(minX, Math.min(clientX, maxX));
        handle.x = clientX;

        // For the callback, t should be (handle.x - handle.pivot.x) / sliderWidth
        const t = (handle.x - handle.pivot.x) / this.sliderWidth!;
        if (this.callback) {
            this.callback(t);
        }
        if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
    }


}