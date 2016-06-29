class Bitmap extends DisplayObject {

    __texture;
    $Bitmap;

    constructor(texture) {
        super();
        this.$nativeShow = Platform.create("Bitmap");
        this.texture = texture;
        this.$Bitmap = {
            0: null,    //scale9Grid
        }
    }

    $setTexture(val) {
        if (val == this.__texture) {
            return false;
        }
        if (this.__texture) {
            this.__texture.$delCount();
        }
        this.__texture = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        if (val) {
            this.__texture.$useTexture();
            this.$nativeShow.setWidth(this.__texture.width);
            this.$nativeShow.setHeight(this.__texture.height);
            this.$nativeShow.setTexture(this.__texture);
        }
        else {
            this.$nativeShow.setTexture(Texture.$blank);
        }
        this.$invalidateContentBounds();
        return true;
    }

    $setWidth(val) {
        if (super.$setWidth(val) == false) {
            return false;
        }
        var p = this.$DisplayObject;
        this.$nativeShow.setSettingWidth(p[3]);
        this.$invalidateContentBounds();
        return true;
    }

    $setHeight(val) {
        if (super.$setHeight(val) == false) {
            return false;
        }
        var p = this.$DisplayObject;
        this.$nativeShow.setSettingHeight(p[4]);
        this.$invalidateContentBounds();
        return true;
    }

    $measureContentBounds(rect) {
        if (this.__texture) {
            rect.x = this.__texture.offX;
            rect.y = this.__texture.offY;
            var p = this.$DisplayObject;
            rect.width = p[3] || this.__texture.width;
            rect.height = p[4] || this.__texture.height;
        } else {
            rect.x = rect.y = rect.width = rect.height = 0;
        }
    }

    $setScale9Grid(val) {
        var p = this.$Bitmap;
        if (p[0] == val) {
            return false;
        }
        p[0] = val;
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.$nativeShow.setScale9Grid(val);
        return true;
    }

    get texture() {
        return this.__texture;
    }

    set texture(val) {
        this.$setTexture(val);
    }

    get scale9Grid() {
        var p = this.$Bitmap;
        return p[0];
    }

    set scale9Grid(val) {
        this.$setScale9Grid(val);
    }

    dispose() {
        if (!this.$nativeShow) {
            $warn(1002, this.name);
            return;
        }
        this.texture = null;
        super.dispose();
        Platform.release("Bitmap", this.$nativeShow);
        this.$nativeShow = null;
    }
}

exports.Bitmap = Bitmap;