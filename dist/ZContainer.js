import * as PIXI from 'pixi.js';
/**
 * A custom container class extending `PIXI.Container` that supports orientation-based transforms,
 * anchoring, and instance data management for responsive layouts.
 *
 * @remarks
 * - Handles portrait and landscape orientation transforms.
 * - Supports anchoring to screen percentage positions.
 * - Synchronizes transform properties with an internal `OrientationData` object.
 *
 * @property portrait - Transform data for portrait orientation.
 * @property landscape - Transform data for landscape orientation.
 * @property currentTransform - The currently active transform data.
 * @property name - The instance name of the container.
 *
 * @method setState
 * Sets the state of the container by name. (Implementation placeholder)
 * @param stateName - The name of the state to set.
 *
 * @method init
 * Called once all children of the container are loaded. (Implementation placeholder)
 *
 * @method setInstanceData
 * Sets the instance data and orientation for the container, applying the corresponding transform.
 * @param data - The instance data containing orientation transforms and name.
 * @param orientation - The orientation to use ("portrait" or "landscape").
 *
 * @method resize
 * Updates the container's transform based on new width, height, and orientation.
 * @param width - The new width of the container.
 * @param height - The new height of the container.
 * @param orientation - The new orientation ("portrait" or "landscape").
 *
 * @method applyAnchor
 * Applies anchoring based on the current transform's anchor settings, positioning the container
 * relative to the screen size.
 *
 * @method isAnchored
 * Checks if the current transform is anchored.
 * @returns `true` if anchored, otherwise `false`.
 *
 * @method set x
 * Sets the x position and updates the current transform.
 * @param value - The new x position.
 *
 * @method set y
 * Sets the y position and updates the current transform.
 * @param value - The new y position.
 *
 * @method set rotation
 * Sets the rotation and updates the current transform.
 * @param value - The new rotation value.
 *
 * @method set scaleX
 * Sets the x scale and updates the current transform.
 * @param value - The new x scale.
 *
 * @method set scaleY
 * Sets the y scale and updates the current transform.
 * @param value - The new y scale.
 *
 * @method set pivotX
 * Sets the x pivot and updates the current transform.
 * @param value - The new x pivot.
 *
 * @method set pivotY
 * Sets the y pivot and updates the current transform.
 * @param value - The new y pivot.
 */
export class ZContainer extends PIXI.Container {
    portrait;
    landscape;
    currentTransform;
    name = "";
    //anChorData: any;
    get(childName) {
        if (this.children && this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                const child = (this.children[i]);
                if (child.name === childName) {
                    return child;
                }
                else {
                    if (child && child instanceof ZContainer) {
                        let res = child.get(childName);
                        if (res) {
                            return res;
                        }
                    }
                }
            }
        }
        return null;
    }
    //this is called once all children of the container are loaded
    init() {
    }
    setText(text) {
        let textChild = null;
        if (this["label"]) {
            textChild = this["label"];
        }
        if (!textChild) {
            textChild = this.getChildByName("label");
        }
        if (!textChild) {
            let children = this.children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child instanceof PIXI.Text) {
                    textChild = child;
                    break;
                }
            }
        }
        if (textChild) {
            textChild.text = text;
        }
    }
    setInstanceData(data, orientation) {
        this.portrait = data.portrait;
        this.landscape = data.landscape;
        this.currentTransform = orientation === "portrait" ? this.portrait : this.landscape;
        this.applyTransform();
        this.name = data.instanceName || "";
        //this.name = data.instanceName;
        //this.anChorData = data.portrait.isAnchored ? {anchorType: data.portrait.anchorType, anchorPercentage: data.portrait.anchorPercentage} : null;
        //this.applyAnchor();
    }
    applyTransform() {
        if (!this.currentTransform)
            return;
        if (this.parent) {
            let currentFrame = this.parent.currentFrame;
            if (currentFrame !== undefined && currentFrame > 0) {
                return; // do not apply transform if parent timeline is playing
            }
        }
        this.x = this.currentTransform.x || 0;
        this.y = this.currentTransform.y || 0;
        this.rotation = this.currentTransform.rotation || 0;
        this.alpha = this.currentTransform.alpha;
        this.scale.x = this.currentTransform.scaleX || 1;
        this.scale.y = this.currentTransform.scaleY || 1;
        this.pivot.x = this.currentTransform.pivotX || 0;
        this.pivot.y = this.currentTransform.pivotY || 0;
        this.applyAnchor();
    }
    resize(width, height, orientation) {
        this.currentTransform = orientation === "portrait" ? this.portrait : this.landscape;
        this.applyTransform();
    }
    applyAnchor() {
        if (this.currentTransform && this.currentTransform.isAnchored && this.parent) {
            let xPer = this.currentTransform.anchorPercentage.x || 0;
            let yPer = this.currentTransform.anchorPercentage.y || 0;
            let x = xPer * window.innerWidth;
            let y = yPer * window.innerHeight;
            const globalPoint = new PIXI.Point(x, y);
            const localPoint = this.parent.toLocal(globalPoint);
            this.x = localPoint.x;
            this.y = localPoint.y;
        }
    }
    isAnchored() {
        return this.currentTransform && this.currentTransform.isAnchored || false;
    }
    set x(value) {
        super.x = value;
        if (this.currentTransform) {
            this.currentTransform.x = value;
        }
    }
    set width(value) {
        super.width = value;
        if (this.currentTransform) {
            this.currentTransform.width = value;
            this.currentTransform.scaleX = this.scale.x;
        }
    }
    get width() {
        return super.width;
    }
    get height() {
        return super.height;
    }
    set height(value) {
        super.height = value;
        if (this.currentTransform) {
            this.currentTransform.height = value;
            this.currentTransform.scaleY = this.scale.y;
        }
    }
    set y(value) {
        super.y = value;
        if (this.currentTransform) {
            this.currentTransform.y = value;
        }
    }
    set rotation(value) {
        super.rotation = value;
        if (this.currentTransform) {
            this.currentTransform.rotation = value;
        }
    }
    get x() {
        return super.x;
    }
    get y() {
        return super.y;
    }
    get rotation() {
        return super.rotation;
    }
    get scaleX() {
        return super.scale.x;
    }
    get scaleY() {
        return super.scale.y;
    }
    get pivotX() {
        return super.pivot.x;
    }
    get pivotY() {
        return super.pivot.y;
    }
    set scaleX(value) {
        super.scale.x = value;
        if (this.currentTransform) {
            this.currentTransform.scaleX = value;
        }
    }
    set scaleY(value) {
        super.scale.y = value;
        if (this.currentTransform) {
            this.currentTransform.scaleY = value;
        }
    }
    set pivotX(value) {
        super.pivot.x = value;
        if (this.currentTransform) {
            this.currentTransform.pivotX = value;
        }
    }
    set pivotY(value) {
        super.pivot.y = value;
        if (this.currentTransform) {
            this.currentTransform.pivotY = value;
        }
    }
}
//# sourceMappingURL=ZContainer.js.map