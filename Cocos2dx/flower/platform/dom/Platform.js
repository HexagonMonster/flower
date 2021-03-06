class Platform {
    static type = "cocos2dx";
    static native;

    static stage;
    static width;
    static height;

    static start(engine, root, background) {
        RETINA = false;
        Platform.native = false;//cc.sys.isNative;
        var div = document.getElementById("FlowerMain");
        var mask = document.createElement("div");
        mask.style.position = "absolute";
        mask.style.left = "0px";
        mask.style.top = "0px";
        mask.style.width = document.documentElement.clientWidth + "px";
        mask.style.height = document.documentElement.clientHeight + "px";
        document.body.appendChild(mask);
        document.body.onkeydown = function (e) {
            engine.$onKeyDown(e.which);
        }
        document.body.onkeyup = function (e) {
            engine.$onKeyUp(e.which);
        }
        div.appendChild(engine.$background.$nativeShow.show);
        div.appendChild(root.show);
        requestAnimationFrame.call(window, Platform._run);
        var touchDown = false;
        mask.onmousedown = function (e) {
            if(e.button == 2) return;
            touchDown = true;
            engine.$addTouchEvent("begin", 0, Math.floor(e.clientX), Math.floor(e.clientY));
        }
        mask.onmouseup = function (e) {
            if(e.button == 2) return;
            touchDown = false;
            engine.$addTouchEvent("end", 0, Math.floor(e.clientX), Math.floor(e.clientY));
        }
        mask.onmousemove = function (e) {
            if(e.button == 2) return;
            engine.$addMouseMoveEvent(Math.floor(e.clientX), Math.floor(e.clientY));
            if (touchDown) {
                engine.$addTouchEvent("move", 0, Math.floor(e.clientX), Math.floor(e.clientY));
            }
        }
        document.body.oncontextmenu = function (e) {
            engine.$addRightClickEvent(Math.floor(e.clientX), Math.floor(e.clientY));
            return false;
        }
        Platform.width = document.documentElement.clientWidth;
        Platform.height = document.documentElement.clientHeight;
        engine.$resize(Platform.width, Platform.height);
    }


    static _runBack;
    static lastTime = (new Date()).getTime();
    static frame = 0;

    static _run() {
        Platform.frame++;
        var now = (new Date()).getTime();
        Platform._runBack(now - Platform.lastTime);
        Platform.lastTime = now;
        if (PlatformURLLoader.loadingList.length) {
            var item = PlatformURLLoader.loadingList.shift();
            item[0](item[1], item[2], item[3], item[4]);
        }
        requestAnimationFrame.call(window, Platform._run);
    }

    static pools = {};

    static create(name) {
        var pools = Platform.pools;
        if (name == "Sprite") {
            //if (pools.Sprite && pools.Sprite.length) {
            //    return pools.Sprite.pop();
            //}
            return new PlatformSprite();
        }
        if (name == "Bitmap") {
            //if (pools.Bitmap && pools.Bitmap.length) {
            //    return pools.Bitmap.pop();
            //}
            return new PlatformBitmap();
        }
        if (name == "TextField") {
            //if (pools.TextField && pools.TextField.length) {
            //    return pools.TextField.pop();
            //}
            return new PlatformTextField();
        }
        if (name == "TextInput") {
            //if (pools.TextInput && pools.TextInput.length) {
            //    return pools.TextInput.pop();
            //}
            return new PlatformTextInput();
        }
        if (name == "Shape") {
            //if (pools.Shape && pools.Shape.length) {
            //    return pools.Shape.pop();
            //}
            return new PlatformShape();
        }
        if (name == "Mask") {
            //if (pools.Mask && pools.Mask.length) {
            //    return pools.Mask.pop();
            //}
            return new PlatformMask();
        }
        return null;
    }

    static release(name, object) {
        object.release();
        var pools = Platform.pools;
        if (!pools[name]) {
            pools[name] = [];
        }
        pools[name].push(object);
    }


    static getShortcut() {
        var scene = cc.director.getRunningScene();
        var hasScale = cc.sys.os === cc.sys.OS_OSX && cc.sys.isNative ? true : false;
        var width = cc.director.getWinSize().width * (hasScale ? 2 : 1);
        var height = cc.director.getWinSize().height * (hasScale ? 2 : 1);
        var renderTexture = new cc.RenderTexture(width, height, 0, 0);
        renderTexture.begin();
        scene.visit();
        renderTexture.end();
        var w = width;
        var h = height;
        var pixels = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        var colors = [];
        var index;
        for (var y = 0; y < h; y++) {
            if (hasScale && y % 2 != 0) continue;
            for (var x = 0; x < w; x++) {
                if (hasScale && x % 2 != 0) continue;
                index = (x + (h - 1 - y) * w) * 4;
                colors.push(pixels[index]);
                colors.push(pixels[index + 1]);
                colors.push(pixels[index + 2]);
                colors.push(pixels[index + 3]);
            }
        }
        return {
            colors: colors,
            width: w * (hasScale ? 0.5 : 1),
            height: h * (hasScale ? 0.5 : 1)
        };
    }
}