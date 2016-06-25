class PlatformTextInput extends PlatformDisplayObject {

    static $mesureTxt;

    show;

    __changeBack = null;
    __changeBackThis = null;


    constructor() {
        super();
        this.show = new cc.TextFieldTTF();
        if (Platform.native) {
            this.show.setSystemFontSize(12);
        } else {
            this.show.setFontSize(12);
        }
        this.show.setAnchorPoint(0, 1);
        this.show.retain();
        if (Platform.native) {
        } else {
            this.show.setDelegate(this);
        }
    }

    setChangeBack(changeBack, thisObj) {
        this.__changeBack = changeBack;
        this.__changeBackThis = thisObj;
    }

    onTextFieldAttachWithIME(sender) {
        console.log("start input");
    }

    onTextFieldDetachWithIME(sender) {
        console.log("stop input");
    }

    onTextFieldInsertText(sender, text, len) {
        //console.log(text + " : " + len);
        if (this.__changeBack) {
            this.__changeBack.call(this.__changeBackThis);
        }
    }

    onTextFieldDeleteBackward() {

    }

    setFontColor(color) {
        this.show.setTextColor({r: color >> 16, g: color >> 8 & 0xFF, b: color & 0xFF, a: 255});
    }

    getNativeText() {
        return this.show.getString();
    }

    changeText(text, width, height, size, wordWrap, multiline, autoSize) {
        var $mesureTxt = PlatformTextInput.$mesureTxt;
        if (Platform.native) {
            $mesureTxt.setFontSize(size);
            this.show.setSystemFontSize(size);
        } else {
            $mesureTxt.setFontSize(size);
            this.show.setFontSize(size);
        }
        var txt = this.show;
        txt.text = "";
        var txtText = "";
        var start = 0;
        for (var i = 0; i < text.length; i++) {
            //取一行文字进行处理
            if (text.charAt(i) == "\n" || text.charAt(i) == "\r" || i == text.length - 1) {
                var str = text.slice(start, i);
                $mesureTxt.setString(str);
                var lineWidth = $mesureTxt.getContentSize().width;
                var findEnd = i;
                var changeLine = false;
                //如果这一行的文字宽大于设定宽
                while (!autoSize && width && lineWidth > width) {
                    changeLine = true;
                    findEnd--;
                    $mesureTxt.setString(text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                    lineWidth = $mesureTxt.getContentSize().width;
                }
                if (wordWrap && changeLine) {
                    i = findEnd;
                    txt.setString(txtText + "\n" + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                } else {
                    txt.setString(txtText + text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0)));
                }
                //如果文字的高度已经大于设定的高，回退一次
                if (!autoSize && height && txt.getContentSize().height > height) {
                    txt.setString(txtText);
                    break;
                } else {
                    txtText += text.slice(start, findEnd + (i == text.length - 1 ? 1 : 0));
                    if (wordWrap && changeLine) {
                        txtText += "\n";
                    }
                }
                start = i;
                if (multiline == false) {
                    break;
                }
            }
        }
        return txt.getContentSize();
    }

    setFilters(filters) {

    }

    startInput() {
        this.show.attachWithIME();
    }

    stopInput() {
        this.show.detachWithIME();
    }

    release() {
        this.__changeBack = null;
        this.__changeBackThis = null;
        var show = this.show;
        show.setString("");
        if (Platform.native) {
            this.show.setSystemFontSize(12);
        } else {
            this.show.setFontSize(12);
        }
        show.setTextColor({r: 0, g: 0, b: 0, a: 255});
        super.release();
    }
}

PlatformTextInput.$mesureTxt = new cc.LabelTTF("", "Times Roman", 12);
PlatformTextInput.$mesureTxt.retain();