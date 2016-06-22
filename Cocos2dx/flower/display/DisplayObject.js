class DisplayObject extends EventDispatcher {

    __x = 0;
    __y = 0;

    $DisplayObject;

    /**
     * 脏标识
     * 0x0001 size 显示尺寸失效，自身显示区域失效，或者容器的子对象位置大小发生改变
     * 0x0002 alpha 最终 alpha，即 alpha 值从根节点开始连乘到此对象
     * 0x0100 重排子对象顺序
     */
    __flags = 0;

    /**
     * 父对象
     */
    __parent;

    /**
     * 舞台类
     */
    __stage;

    __alpha = 1;
    __concatAlpha = 1;

    /**
     * native 显示，比如 cocos2dx 的显示对象或者 egret 的显示对象等...
     */
    $nativeShow;

    constructor() {
        super();
        this.$DisplayObject = {
            0: 1, //scaleX
            1: 1, //scaleY
            2: 0, //rotation
            3: null, //settingWidth
            4: null, //settingHeight
            5: "", //name
            6: new Size(), //size 自身尺寸
            7: true, //touchEnabeld
            8: true, //multiplyTouchEnabled
            10: 0, //lastTouchX
            11: 0 //lastTouchY
        }
    }

    /**
     * 是否有此标识位
     * @param flags
     * @returns {boolean}
     */
    $hasFlags(flags) {
        return this.__flags & flags == flags ? true : false;
    }

    $addFlags(flags) {
        this.__flags |= flags;
    }

    $addFlagsUp(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
        if (this.__parent) {
            this.__parent.$addFlags(flags);
        }
    }

    $addFlagsDown(flags) {
        if (this.$hasFlags(flags)) {
            return;
        }
        this.$addFlags(flags);
    }

    $removeFlags(flags) {
        this.__flags &= ~flags;
    }

    $removeFlagsUp(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
        if (this.__parent) {
            this.__parent.$removeFlags(flags);
        }
    }

    $removeFlagsDown(flags) {
        if (!this.$hasFlags(flags)) {
            return;
        }
        this.$removeFlags(flags);
    }

    $setX(val) {
        val = +val || 0;
        if (val == this.__x) {
            return;
        }
        this.__x = val;
        this.$nativeShow.x = val;
        this.$invalidPositionScale();
    }

    $setY(val) {
        val = +val || 0;
        if (val == this.__y) {
            return;
        }
        this.__y = val;
        this.$nativeShow.y = val;
        this.$invalidPositionScale();
    }

    $setScaleX(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$nativeShow.scaleX = val;
        this.$invalidPositionScale();
    }

    $getScaleX() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getSize();
        }
        return p[0];
    }

    $setScaleY(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$nativeShow.scaleY = val;
        this.$invalidPositionScale();
    }

    $getScaleY() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getSize();
        }
        return p[1];
    }

    $setRotation(val) {
        val = +val || 0;
        var p = this.$DisplayObject;
        if (p[2] == val) {
            return;
        }
        p[2] = val;
        this.$nativeShow.rotation = val;
        this.$invalidPositionScale();
    }

    $setAlpha(val) {
        val = +val || 0;
        if (val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }
        if (val == this.__alpha) {
            return;
        }
        this.__alpha = val;
        this.$addFlagsDown(0x0002);
    }

    $getConcatAlpha() {
        if (this.$hasFlags(0x0002)) {
            this.__concatAlpha = this.__alpha;
            if (this.__parent) {
                this.__concatAlpha *= this.__parent.$getConcatAlpha();
            }
            this.$removeFlags(0x0002);
        }
        return this.__concatAlpha;
    }

    $setWidth(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.$DisplayObject;
        if (p[3] == val) {
            return;
        }
        p[3] = val;
        this.invalidSize();
    }

    $getWidth() {
        var p = this.$DisplayObject;
        return p[3] != null ? p[3] : this.$getSize().width;
    }

    $setHeight(val) {
        val = +val || 0;
        val = val < 0 ? 0 : val;
        var p = this.$DisplayObject;
        if (p[4] == val) {
            return;
        }
        p[4] = val;
        this.invalidSize();
    }

    $getHeight() {
        var p = this.$DisplayObject;
        return p[4] != null ? p[4] : this.$getSize().height;
    }

    $getSize() {
        var size = this.$DisplayObject[6];
        if (this.$hasFlags(0x0001)) {
            this.calculateSize(size);
            this.__checkSettingSize(size);
            this.$removeFlags(0x0001);
        }
        return size;
    }

    $setTouchEnabled(val) {
        var p = this.$DisplayObject;
        if (p[7] == val) {
            return false;
        }
        p[7] = val;
        return true;
    }

    $setMultiplyTouchEnabled(val) {
        varp = this.$DisplayObject;
        if (p[8] == val) {
            return false;
        }
        p[8] = val;
        return true;
    }

    __checkSettingSize(size) {
        var p = this.$DisplayObject;
        /**
         * 尺寸失效， 并且约定过 宽 或者 高
         */
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            if (p[3] != null) {
                if (size.width == 0) {
                    if (p[3] == 0) {
                        this.scaleX = 0;
                    } else {
                        this.scaleX = Infinity;
                    }
                } else {
                    this.scaleX = p[3] / size.width;
                }
            }
            if (p[4]) {
                if (size.height == 0) {
                    if (p[4] == 0) {
                        this.scaleY = 0;
                    } else {
                        this.scaleY = Infinity;
                    }
                } else {
                    this.scaleY = p[4] / size.height;
                }
            }
        }
    }

    $setParent(parent, stage) {
        this.__parent = parent;
        this.__stage = stage;
        this.$addFlagsDown(0x0002);
        if (this.__parent) {
            this.dispatchWidth(Event.ADDED);
        } else {
            this.dispatchWidth(Event.REMOVED);
        }
    }

    $dispatchAddedToStageEvent() {
        if (this.__stage) {
            this.dispatchWidth(Event.ADDED_TO_STAGE);
        }
    }

    $dispatchRemovedFromStageEvent() {
        if (!this.__stage) {
            this.dispatchWidth(Event.REMOVED_FROM_STAGE);
        }
    }

    dispatch(e) {
        super.dispatch(e);
        if (e.bubbles && this.__parent) {
            this.__parent.dispatch(e);
        }
    }

    get x() {
        return this.__x;
    }

    set x(val) {
        this.$setX(val);
    }

    get y() {
        return this.__y;
    }

    set y(val) {
        this.$setY(val);
    }

    get scaleX() {
        var p = this.$DisplayObject;
        return p[0];
    }

    set scaleX(val) {
        this.$setScaleX(val);
    }

    get scaleY() {
        var p = this.$DisplayObject;
        return p[1];
    }

    set scaleY(val) {
        this.$setScaleY(val);
    }

    get rotation() {
        var p = this.$DisplayObject;
        return p[2];
    }

    set rotation(val) {
        this.$setRotation(val);
    }

    get radian() {
        return this.rotation * Math.PI / 180;
    }

    get alpha() {
        return this.__alpha;
    }

    set alpha(val) {
        this.$setAlpha(val);
    }

    get width() {
        return this.$getWidth();
    }

    set width(val) {
        this.$setWidth(val);
    }

    get height() {
        return this.$getHeight();
    }

    set height(val) {
        this.$setHeight(val);
    }

    get parent() {
        return this.__parent;
    }

    get touchEnabled() {
        var p = this.$DisplayObject;
        return p[7];
    }

    set touchEnabled(val) {
        this.$setTouchEnabeld(val);
    }

    get multiplyTouchEnabled() {
        var p = this.$DisplayObject;
        return p[8];
    }

    set multiplyTouchEnabled(val) {
        this.$setMultiplyTouchEnabled(val);
    }

    get lastTouchX() {
        var p = this.$DisplayObject;
        return p[10];
    }

    get lastTouchY() {
        var p = this.$DisplayObject;
        return p[11];
    }

    /**
     * 计算尺寸
     * 子类实现
     * @param size
     */
    calculateSize(size) {

    }

    /**
     * 本身尺寸失效
     */
    invalidSize() {
        this.$addFlagsUp(0x0001);
    }

    $invalidPositionScale() {
        if (this.__parent) {
            this.__parent.$addFlagsUp(0x0001);
        }
    }

    $getMouseTarget(matrix, multiply) {
        if (this.touchEnabled == false || this._visible == false)
            return null;
        matrix.save();
        matrix.translate(-this.x, -this.y);
        if (this.rotation)
            matrix.rotate(-this.radian);
        if (this.scaleX != 1 || this.scaleY != 1)
            matrix.scale(1 / this.scaleX, 1 / this.scaleY);
        var touchX = Math.floor(matrix.tx);
        var touchY = Math.floor(matrix.ty);
        var p = this.$DisplayObject;
        p[10] = touchX;
        p[11] = touchY;
        if (touchX >= 0 && touchY >= 0 && touchX < this.width && touchY < this.height) {
            return this;
        }
        matrix.restore();
        return null;
    }

    $onFrameEnd() {
        var p = this.$DisplayObject;
        if (this.$hasFlags(0x0002)) {
            this.$nativeShow.alpha = this.$getConcatAlpha();
        }
        if (this.$hasFlags(0x0001) && (p[3] != null || p[4] != null)) {
            this.$getSize();
        }
    }

    dispose() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.dispose();
    }
}