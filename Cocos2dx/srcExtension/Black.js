var black = {};
var $root = eval("this");
(function(){
//////////////////////////File:extension/black/core/Black.js///////////////////////////
var sys = {};
for (var key in flower.sys) {
    sys[key] = flower.sys[key];
}
//////////////////////////End File:extension/black/core/Black.js///////////////////////////



//////////////////////////File:extension/black/core/UIComponent.js///////////////////////////
class UIComponent {
    static register(clazz, isContainer = false) {
        var p = clazz.prototype;
        p.$initUIComponent = function () {
            this.$UIComponent = {
                0: null, //left
                1: null, //right
                2: null, //horizontalCenter
                3: null, //top
                4: null, //bottom
                5: null, //verticalCenter
                6: null, //percentWidth
                7: null, //percentHeight
                8: null, //uiWidth
                9: null, //uiHeight
                10: {}, //binds
                11: new StringValue(),//state
                12: false, //absoluteState
                13: this, //eventThis
                14: null, //layout
            };
            this.addUIComponentEvents();
        }

        if (isContainer) {
            Object.defineProperty(p, "layout", {
                get: function () {
                    return this.$UIComponent[14];
                },
                set: function (val) {
                    if (this.$UIComponent[14] == val) {
                        return;
                    }
                    if (this.$UIComponent[14]) {
                        this.$UIComponent[14].$clear();
                    }
                    this.$UIComponent[14] = val;
                    if (val) {
                        val.$setFlag();
                        var len = this.numChildren;
                        for (var i = 0; i < len; i++) {
                            val.addElementAt(this.getChildAt(i), i);
                        }
                    }
                    this.$addFlags(0x2000);
                },
                enumerable: true,
                configurable: true
            });
            p.addChildAt = function (child, index) {
                var flag = child.parent != this ? true : false;
                $root._get(Object.getPrototypeOf(p), "addChildAt", this).call(this, child, index);
                if (flag && child.parent == this) {
                    if (child.__UIComponent && !child.absoluteState) {
                        child["currentState"] = this.currentState;
                    }
                }
                if (child.parent == this && this.layout) {
                    this.layout.addElementAt(child, index);
                }
            }
            p.$removeChild = function (child) {
                $root._get(Object.getPrototypeOf(p), "$removeChild", this).call(this, child);
                if (child.parent != this && this.layout) {
                    this.layout.removeElement(child);
                }
            }
            p.removeChild = function (child) {
                $root._get(Object.getPrototypeOf(p), "removeChild", this).call(this, child);
                if (child.parent != this && this.layout) {
                    this.layout.removeElement(child);
                }
            }
            p.setChildIndex = function (child, index) {
                $root._get(Object.getPrototypeOf(p), "setChildIndex", this).call(this, child, index);
                if (child.parent == this && this.layout) {
                    this.layout.setElementIndex(child, index);
                }
            }
        }


        p.addUIComponentEvents = function () {
            this.addListener(flower.Event.ADDED_TO_STAGE, this.onEXEAdded, this);
        }

        p.bindProperty = function (property, content, checks = null) {
            var binds = this.$UIComponent[10];
            if (binds[property]) {
                binds[property].dispose();
            }
            binds[property] = new flower.Binding(this, checks, property, content);
        }

        p.removeBindProperty = function (property) {
            var binds = this.$UIComponent[10];
            if (binds[property]) {
                binds[property].dispose();
                delete binds[property];
            }
        }

        p.removeAllBindProperty = function () {
            var binds = this.$UIComponent[10];
            for (var key in binds) {
                binds[key].dispose();
                delete binds[key];
            }
        }

        p.setStatePropertyValue = function (property, state, val, checks = null) {
            if (!this._propertyValues) {
                this._propertyValues = {};
                if (!this._propertyValues[property]) {
                    this._propertyValues[property] = {};
                }
                this.bindProperty("currentState", "{this.changeState(this.state)}");
                this._propertyValues[property][state] = {"value": val, "checks": checks};
            }
            else {
                if (!this._propertyValues[property]) {
                    this._propertyValues[property] = {};
                }
                this._propertyValues[property][state] = {"value": val, "checks": checks};
            }
            if (state == this.currentState) {
                this.removeBindProperty(property);
                this.bindProperty(property, val);
            }
        }

        p.changeState = function (state) {
            if (!this._propertyValues) {
                return this.currentState;
            }
            for (var property in this._propertyValues) {
                if (this._propertyValues[property][state]) {
                    this.removeBindProperty(property);
                    this.bindProperty(property, this._propertyValues[property][state].value, this._propertyValues[property][state].checks);
                }
            }
            return this.currentState;
        }

        p.onEXEAdded = function (e) {
            if (this.onAddedEXE && e.target == this) {
                this.onAddedEXE.call(this);
            }
        }

        //p.$getWidth = function () {
        //    var p = this.$UIComponent;
        //    var d = this.$DisplayObject;
        //    return p[9] != null ? p[9] : (d[3] != null ? d[3] : this.$getContentBounds().width);
        //}
        //
        //p.$getHeight = function () {
        //    var p = this.$UIComponent;
        //    var d = this.$DisplayObject;
        //    return p[10] != null ? p[10] : (d[4] != null ? d[4] : this.$getContentBounds().height);
        //}

        p.$setLeft = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[0] == val) {
                return false;
            }
            p[0] = val;
            this.$invalidateContentBounds();
        }

        p.$setRight = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[1] == val) {
                return false;
            }
            p[1] = val;
            this.$invalidateContentBounds();
        }

        p.$setHorizontalCenter = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[2] == val) {
                return false;
            }
            p[2] = val;
            this.$invalidateContentBounds();
        }

        p.$setTop = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[3] == val) {
                return false;
            }
            p[3] = val;
            this.$invalidateContentBounds();
        }

        p.$setBottom = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[4] == val) {
                return false;
            }
            p[4] = val;
            this.$invalidateContentBounds();
        }

        p.$setVerticalCenter = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[5] == val) {
                return false;
            }
            p[5] = val;
            this.$invalidateContentBounds();
        }

        p.$setPercentWidth = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[6] == val) {
                return false;
            }
            p[6] = val;
            this.$invalidateContentBounds();
        }

        p.$setPercentHeight = function (val) {
            val = +val || 0;
            var p = this.$UIComponent;
            if (p[7] == val) {
                return false;
            }
            p[7] = val;
            this.$invalidateContentBounds();
        }

        //p.$setUIWidth = function (val) {
        //    var p = this.$UIComponent;
        //    if (p[8] == val) {
        //        return;
        //    }
        //    p[8] = val;
        //    this.$invalidatePosition();
        //}
        //
        //p.$setUIHeight = function (val) {
        //    var p = this.$UIComponent;
        //    if (p[9] == val) {
        //        return;
        //    }
        //    p[9] = val;
        //    this.$invalidatePosition();
        //}

        /**
         * 验证 UI 属性
         */
        p.$validateUIComponent = function (parent) {
            this.$removeFlags(0x1000);
            //开始验证属性
            //console.log("验证 ui 属性");
            var p = this.$UIComponent;
            if (this.$hasFlags(0x0001)) {
                this.$getContentBounds();
            }
            parent = parent || this.parent;
            //if (this instanceof Group) {
            //    console.log("验证 ui 属性",flower.EnterFrame.frame);
            //}
            if (p[0] != null && p[1] == null && p [2] != null) {
                this.width = (p[2] - p[0]) * 2;
                this.x = parent.$getBounds().x + p[0];
            }
            else if (p[0] == null && p[1] != null && p[2] != null) {
                this.width = (p[1] - p[2]) * 2;
                this.x = parent.$getBounds().x + 2 * p[2] - p[1];
            } else if (p[0] != null && p[1] != null) {
                this.width = parent.width - p[1] - p[0];
                this.x = parent.$getBounds().x + p[0];
            } else {
                if (p[0] != null) {
                    this.x = parent.$getBounds().x + p[0];
                }
                if (p[1] != null) {
                    this.x = parent.$getBounds().x + this.width - p[1] - this.width;
                }
                if (p[2] != null) {
                    this.x = parent.$getBounds().x + (parent.width - this.width) * 0.5;
                }
                if (p[6]) {
                    this.width = parent.width * p[6] / 100;
                }
            }
            if (p[3] != null && p[4] == null && p [5] != null) {
                this.height = (p[5] - p[3]) * 2;
                this.y = parent.$getBounds().y + p[3];
            } else if (p[3] == null && p[4] != null && p[5] != null) {
                this.height = (p[4] - p[5]) * 2;
                this.y = parent.$getBounds().y + 2 * p[5] - p[4];
            } else if (p[3] != null && p[4] != null) {
                this.height = parent.height - p[4] - p[3];
                this.y = parent.$getBounds().y + p[3];
            } else {
                if (p[3] != null) {
                    this.y = parent.$getBounds().y + p[0];
                }
                if (p[4] != null) {
                    this.y = parent.$getBounds().y + this.height - p[1] - this.height;
                }
                if (p[5] != null) {
                    this.y = parent.$getBounds().y + (parent.height - this.height) * 0.5;
                }
                if (p[7]) {
                    this.height = parent.height * p[7] / 100;
                }
            }
            if (this instanceof flower.Sprite) {
                this.$validateChildrenUIComponent();
            }
        }

        Object.defineProperty(p, "left", {
            get: function () {
                return this.$UIComponent[0];
            },
            set: function (val) {
                this.$setLeft(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "right", {
            get: function () {
                return this.$UIComponent[1];
            },
            set: function (val) {
                this.$setRight(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "horizontalCenter", {
            get: function () {
                return this.$UIComponent[2];
            },
            set: function (val) {
                this.$setHorizontalCenter(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "top", {
            get: function () {
                return this.$UIComponent[3];
            },
            set: function (val) {
                this.$setTop(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "bottom", {
            get: function () {
                return this.$UIComponent[4];
            },
            set: function (val) {
                this.$setBottom(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "verticalCenter", {
            get: function () {
                return this.$UIComponent[5];
            },
            set: function (val) {
                this.$setVerticalCenter(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "percentWidth", {
            get: function () {
                return this.$UIComponent[6];
            },
            set: function (val) {
                this.$setPercentWidth(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "percentHeight", {
            get: function () {
                return this.$UIComponent[7];
            },
            set: function (val) {
                this.$setPercentHeight(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "currentState", {
            get: function () {
                return this.state.value;
            },
            set: function (val) {
                if (this instanceof flower.Sprite) {
                    if (this.state.value == val) {
                        return;
                    }
                    this.state.value = val;
                    for (var i = 0; i < this.numChildren; i++) {
                        var child = this.getChildAt(i);
                        if (child.__UIComponent) {
                            if (!child.absoluteState) {
                                child.currentState = val;
                            }
                        }
                    }
                } else {
                    if (this.state.value == val) {
                        return;
                    }
                    this.state.value = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "state", {
            get: function () {
                return this.$UIComponent[11];
            },
            set: function (val) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "absoluteState", {
            get: function () {
                return this.$UIComponent[12];
            },
            set: function (val) {
                this.$UIComponent[12] = !!val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "eventThis", {
            get: function () {
                return this.$UIComponent[13];
            },
            set: function (val) {
                this.$UIComponent[13] = val || this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(p, "onAddedToStage", {
            get: function () {
                return this.onAddedEXE;
            },
            set: function (val) {
                if (typeof val == "string") {
                    var content = val;
                    val = function () {
                        eval(content);
                    }.bind(this.eventThis);
                }
                this.onAddedEXE = val;
            },
            enumerable: true,
            configurable: true
        });
    }
}
//////////////////////////End File:extension/black/core/UIComponent.js///////////////////////////



//////////////////////////File:extension/black/data/member/Value.js///////////////////////////
class Value extends flower.EventDispatcher {

    __old = null;
    __value = null;

    $setValue(val) {
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
    }

    get value() {
        return this.__value;
    }

    set value(val) {
        this.$setValue(val);
    }

    get old() {
        return this.__old;
    }
}

black.Value = Value;
//////////////////////////End File:extension/black/data/member/Value.js///////////////////////////



//////////////////////////File:extension/black/data/member/ArrayValue.js///////////////////////////
/**
 *
 * @Event
 * Event.ADDED item
 * Event.REMOVED item
 * Event.UPDATE ArrayValue 所有更新都会触发，包括排序
 */
class ArrayValue extends Value {

    _length;
    list;
    _key = "";
    _rangeMinKey = "";
    _rangeMaxKey = "";

    constructor(init = null) {
        super();
        this.list = init || [];
        this._length = this.list.length;
    }

    push(item) {
        this.list.push(item);
        this._length = this._length + 1;
        this.dispatchWidth(flower.Event.ADDED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    addItemAt(item, index) {
        index = +index & ~0;
        if (index < 0 || index > this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        this.list.splice(index, 0, item);
        this._length = this._length + 1;
        this.dispatchWidth(flower.Event.ADDED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    shift() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.shift();
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    splice(startIndex, delCount = 0, ...args) {
        var i;
        startIndex = +startIndex & ~0;
        delCount = +delCount & ~0;
        if (delCount <= 0) {
            for (i = 0; i < args.length; i++) {
                this.list.splice(startIndex, 0, args[i]);
            }
            this._length = this._length + 1;
            for (i = 0; i < args.length; i++) {
                this.dispatchWidth(flower.Event.ADDED, args[i]);
            }
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
        else {
            var list = this.list.splice(startIndex, delCount);
            this._length = this._length - delCount;
            for (i = 0; i < list.length; i++) {
                this.dispatchWidth(flower.Event.REMOVED, list[i]);
            }
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }

    slice(startIndex, end) {
        startIndex = +startIndex & ~0;
        end = +end & ~0;
        return new ArrayValue(this.list.slice(startIndex, end));
    }

    pop() {
        if (!this.list.length) {
            return;
        }
        var item = this.list.pop();
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    removeAll() {
        if (!this.list.length) {
            return;
        }
        while (this.list.length) {
            var item = this.list.pop();
            this._length = this._length - 1;
            this.dispatchWidth(flower.Event.REMOVED, item);
        }
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    removeItem(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item) {
                this.list.splice(i, 1);
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
                this.dispatchWidth(flower.Event.UPDATE, this);
                return item;
            }
        }
        return null;
    }

    removeItemAt(index) {
        index = +index & ~0;
        if (index < 0 || index >= this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        var item = this.list.splice(index, 1)[0];
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    removeItemWith(key, value, key2 = "", value2 = null) {
        var item;
        var i;
        if (key2 != "") {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value) {
                    item = this.list.splice(i, 1)[0];
                    break;
                }
            }
        }
        else {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value && this.list[i][key2] == value2) {
                    item = this.list.splice(i, 1)[0];
                    break;
                }
            }
        }
        if (!item) {
            return;
        }
        this._length = this._length - 1;
        this.dispatchWidth(flower.Event.REMOVED, item);
        this.dispatchWidth(flower.Event.UPDATE, this);
        return item;
    }

    getItemIndex(item) {
        for (var i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i] == item) {
                return i;
            }
        }
        return -1;
    }

    getItemWith(key, value, key2 = null, value2 = null) {
        var i;
        if (!key2) {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value) {
                    return this.list[i];
                }
            }
        }
        else {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value && this.list[i][key2] == value2) {
                    return this.list[i];
                }
            }
        }
        return null;
    }

    getItemFunction(func, thisObj, ...args) {
        for (var i = 0; i < this.list.length; i++) {
            args.push(this.list[i]);
            var r = func.apply(thisObj, args);
            args.pop();
            if (r == true) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemsWith(key, value, key2 = "", value2 = null) {
        var result = [];
        var i;
        if (key2 != "") {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value) {
                    result.push(this.list[i]);
                }
            }
        }
        else {
            for (i = 0; i < this.list.length; i++) {
                if (this.list[i][key] == value && this.list[i][key2] == value2) {
                    result.push(this.list[i]);
                }
            }
        }
        return result;
    }

    setItemsAttributeWith(findKey, findValue, setKey = "", setValue = null) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][findKey] == findValue) {
                this.list[i][setKey] = setValue;
            }
        }
    }

    getItemsFunction(func, thisObj = null) {
        var _arguments__ = [];
        for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
            _arguments__ = arguments[argumentsLength];
        }
        var result = [];
        var args = [];
        if (_arguments__.length && _arguments__.length > 2) {
            args = [];
            for (var a = 2; a < _arguments__.length; a++) {
                args.push(_arguments__[a]);
            }
        }
        for (var i = 0; i < this.list.length; i++) {
            args.push(this.list[i]);
            var r = func.apply(thisObj, args);
            args.pop();
            if (r == true) {
                result.push(this.list[i]);
            }
        }
        return result;
    }

    sort() {
        var _arguments__ = [];
        for (var argumentsLength = 0; argumentsLength < arguments.length; argumentsLength++) {
            _arguments__ = arguments[argumentsLength];
        }
        this.list.sort.apply(this.list.sort, _arguments__);
        this.dispatchWidth(flower.Event.UPDATE, this);
    }

    getItemAt(index) {
        index = +index & ~0;
        if (index < 0 || index >= this.list.length) {
            sys.$error(3101, index, this.list.length);
            return;
        }
        return this.list[index];
    }

    getItemByValue(value) {
        if (this.key == "") {
            return null;
        }
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][this.key] == value) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemByRange(value) {
        if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
            return null;
        }
        for (var i = 0; i < this.list.length; i++) {
            var min = this.list[i][this.rangeMinKey];
            var max = this.list[i][this.rangeMaxKey];
            if (value >= min && value <= max) {
                return this.list[i];
            }
        }
        return null;
    }

    getItemsByRange(value) {
        if (this.key == "" || this.rangeMinKey == "" || this.rangeMaxKey == "") {
            return null;
        }
        var list = [];
        for (var i = 0; i < this.list.length; i++) {
            var min = this.list[i][this.rangeMinKey];
            var max = this.list[i][this.rangeMaxKey];
            if (value >= min && value <= max) {
                list.push(this.list[i]);
            }
        }
        return list;
    }

    set key(val) {
        this._key = val;
    }

    get key() {
        return this._key;
    }

    set rangeMinKey(val) {
        this._rangeMinKey = val;
    }

    get rangeMinKey() {
        return this._rangeMinKey;
    }

    set rangeMaxKey(val) {
        this._rangeMaxKey = val;
    }

    get rangeMaxKey() {
        return this._rangeMaxKey;
    }

    get length() {
        return this._length;
    }

    set length(val) {
        val = +val & ~0;
        if (this._length == val) {
        } else {
            while (this.list.length > val) {
                var item = this.list.pop();
                this._length = this._length - 1;
                this.dispatchWidth(flower.Event.REMOVED, item);
            }
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }
}

black.ArrayValue = ArrayValue;
//////////////////////////End File:extension/black/data/member/ArrayValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/BooleanValue.js///////////////////////////
class BooleanValue extends Value {

    constructor(init = false) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = !!val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

black.BooleanValue = BooleanValue;
//////////////////////////End File:extension/black/data/member/BooleanValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/IntValue.js///////////////////////////
class IntValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

black.IntValue = IntValue;
//////////////////////////End File:extension/black/data/member/IntValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/NumberValue.js///////////////////////////
class NumberValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

black.NumberValue = NumberValue;
//////////////////////////End File:extension/black/data/member/NumberValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/ObjectValue.js///////////////////////////
class ObjectValue extends Value {

    constructor() {
        super();
        this.__old = this.__value = {};
    }

    update(...args) {
        var change = false;
        for (var i = 0; i < args.length;) {
            var name = args[i];
            if (i + 1 >= args.length) {
                break;
            }
            var value = args[i + 1];
            var obj = this[name];
            if (obj instanceof Value) {
                if (obj.value != value) {
                    obj.value = value;
                    change = true;
                }
            } else {
                if (obj != value) {
                    this[name] = value;
                    change = true;
                }
            }
            this[name] = value;
            i += 2;
        }
        if (change) {
            this.dispatchWidth(flower.Event.UPDATE, this);
        }
    }

    addMember(name, value) {
        this[name] = value;
    }

    deleteMember(name) {
        delete this[name];
    }
}

black.ObjectValue = ObjectValue;
//////////////////////////End File:extension/black/data/member/ObjectValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/StringValue.js///////////////////////////
class StringValue extends Value {

    constructor(init = "") {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = "" + val;
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

black.StringValue = StringValue;
//////////////////////////End File:extension/black/data/member/StringValue.js///////////////////////////



//////////////////////////File:extension/black/data/member/UIntValue.js///////////////////////////
class UIntValue extends Value {

    constructor(init = 0) {
        super();
        this.__old = this.__value = init;
    }

    $setValue(val) {
        val = +val & ~0;
        if (val < 0) {
            val = 0;
        }
        if (val == this.__value) {
            return;
        }
        this.__old = this.__value;
        this.__value = val;
        this.dispatchWidth(flower.Event.UPDATE, this);
    }
}

black.UIntValue = UIntValue;
//////////////////////////End File:extension/black/data/member/UIntValue.js///////////////////////////



//////////////////////////File:extension/black/data/DataManager.js///////////////////////////
class DataManager {
    _defines = {};
    _root = {};

    constructor() {
        if (DataManager.instance) {
            return;
        }
    }

    addRootData(name, className) {
        this[name] = this.createData(className);
        this._root[name] = this[name];
    }

    addDefine(config) {
        var className = config.name;
        if (!className) {
            sys.$error(3010, flower.ObjectDo.toString(config));
            return;
        }
        if (!this._defines[className]) {
            this._defines[className] = {
                id: 0,
                className: "",
                define: null
            };
        }
        var item = this._defines[className];
        var defineClass = "Data_" + className + (item.id != 0 ? item.id : "");
        item.className = defineClass;
        var extendClassName = "ObjectValue";
        if (config.extends) {
            var extendsItem = this.getClass(config.extends);
            if (!extendsItem) {
                sys.$error(3013, config.extends, flower.ObjectDo.toString(config));
                return;
            }
            extendClassName = "DataManager.getInstance().getClass(\"" + config.extends + "\")";
        }
        var content = "var " + defineClass + " = (function (_super) {\n" +
            "\t__extends(" + defineClass + ", _super);\n" +
            "\tfunction " + defineClass + "() {\n" +
            "\t\t_super.call(this);\n";
        var members = config.members;
        if (members) {
            var member;
            for (var key in members) {
                member = members[key];
                if (member.type == "int") {
                    content += "\t\tthis." + key + " = new IntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "uint") {
                    content += "\t\tthis." + key + " = new UIntValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "string") {
                    content += "\t\tthis." + key + " = new StringValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "boolean") {
                    content += "\t\tthis." + key + " = new BooleanValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "array") {
                    content += "\t\tthis." + key + " = new ArrayValue(" + (member.init != null ? member.init : "") + ");\n";
                } else if (member.type == "*") {
                    content += "\t\tthis." + key + " = " + (member.init != null ? member.init : "null") + ";\n";
                } else {
                    content += "\t\tthis." + key + " = DataManager.getInstance().createData(" + member.type + ");\n";
                }
            }
        }
        content += "\t}\n" +
            "\treturn " + defineClass + ";\n" +
            "})(" + extendClassName + ");\n";
        content += "DataManager.getInstance().$addClassDefine(" + defineClass + ", \"" + className + "\");\n";
        console.log("数据结构:\n" + content);
        if (sys.DEBUG) {
            try {
                eval(content);
            } catch (e) {
                sys.$error(3011, e, content);
            }
        } else {
            eval(className);
        }
        item.id++;
    }

    $addClassDefine(clazz, className) {
        var item = this._defines[className];
        item.define = clazz;
    }

    getClass(className) {
        var item = this._defines[className];
        if (!item) {
            return null;
        }
        return item.define;
    }

    createData(className) {
        var item = this._defines[className];
        if (!item) {
            sys.$error(3012, className);
            return;
        }
        return new item.define();
    }

    clear() {
        for (var key in this._root) {
            delete this._root[key];
            delete this[key];
        }
        this._defines = {};
    }

    static instance = new DataManager();

    static getInstance() {
        return DataManager.instance;
    }
}

black.DataManager = DataManager;
//////////////////////////End File:extension/black/data/DataManager.js///////////////////////////



//////////////////////////File:extension/black/language/zh_CN.js///////////////////////////
var locale_strings = flower.sys.$locale_strings["zh_CN"];


locale_strings[3001] = "UIParse 异步加载资源出错:{0}";
locale_strings[3002] = "找不到 UI 对应的路径， UI 类名:{0}";
locale_strings[3003] = "解析 UI 出错,:\n{0}\n{1}\n\n解析后内容为:\n{2}";
locale_strings[3004] = "解析 UI 出错:无法解析的命名空间 {0} :\n{1}";
locale_strings[3005] = "解析 UI 出错:无法解析的类名 {0} :\n{1}";
locale_strings[3006] = "解析 UI 出错,未设置命名空间 xmlns:f=\"flower\" :\n{0}";
locale_strings[3010] = "没有定义数据结构类名 :\n{0}";
locale_strings[3011] = "数据结构类定义解析出错 :{0}\n{1}";
locale_strings[3012] = "没有定义的数据结构 :{0}";
locale_strings[3013] = "没有找到要集成的数据结构类 :{0} ，数据结构定义为:\n{1}";
locale_strings[3100] = "没有定义的数据类型 :{0}";
locale_strings[3101] = "超出索引范围 :{0}，当前索引范围 0 ~ {1}";
//////////////////////////End File:extension/black/language/zh_CN.js///////////////////////////



//////////////////////////File:extension/black/layout/Layout.js///////////////////////////
class Layout {

    _fixElementSize = false;
    elements = [];
    flag = false;

    constructor() {
    }

    isElementsOutSize(startX, starY, width, height) {
        return false;
    }

    getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
        return 0;
    }


    getContentSize() {
        return null;
    }

    measureSize(elementWidth, elementHeight, elementCount) {
        return null;
    }

    addElementAt(element, index) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.elements.splice(index, 0, element);
        this.flag = true;
    }

    setElementIndex(element, index) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.elements.splice(index, 0, element);
        this.flag = true;
    }

    removeElement(element) {
        var len = this.elements.length;
        for (var i = 0; i < len; i++) {
            if (this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
        this.flag = true;
    }

    removeElementAt(index) {
        this.elements.splice(index, 1);
        this.flag = true;
    }

    $setFlag() {
        this.flag = true;
    }

    updateList(width, height, startIndex = 0) {
    }

    $clear() {
        this.elements = [];
        this.flag = false;
    }

    get fixElementSize() {
        return this._fixElementSize;
    }

    set fixElementSize(val) {
        this._fixElementSize = !!val;
    }

    static VerticalAlign = "vertical";
    static HorizontalAlign = "horizontal";
    static NoneAlign = "";
}

black.Layout = Layout;
//////////////////////////End File:extension/black/layout/Layout.js///////////////////////////



//////////////////////////File:extension/black/layout/LinearLayout.js///////////////////////////
class LinearLayout extends Layout {

    _gap = 0;
    _align = "";
    _maxX;
    _maxY;

    constructor() {
        super();
        this._fixElementSize = true;
    }

    isElementsOutSize(startX, starY, width, height) {
        if (this._align == flower.Layout.VerticalAlign) {
            if (starY + height <= this._maxY) {
                return true;
            }
        }
        if (this._align == flower.Layout.HorizontalAlign) {
            if (startX + width <= this._maxX) {
                return true;
            }
        }
        return false;
    }

    getFirstItemIndex(elementWidth, elementHeight, startX, startY) {
        if (this._align == flower.Layout.VerticalAlign) {
            return Math.floor(startY / (elementHeight + this._gap));
        } else if (this._align == flower.Layout.HorizontalAlign) {
            return Math.floor(startX / (elementWidth + this._gap));
        }
        return 0;
    }

    getContentSize() {
        var size = flower.Size.create(0, 0);
        if (!this.elements.length) {
            return size;
        }
        var minX = this.elements[0].x;
        var maxX = this.elements[0].x + this.elements[0].width;
        var minY = this.elements[0].y;
        var maxY = this.elements[0].y + this.elements[0].height;
        var element;
        for (var i = 1; i < this.elements.length; i++) {
            element = this.elements[i];
            minX = element.x < minX ? element.x : minX;
            maxX = element.x + element.width > maxX ? element.x + element.width : maxX;
            minY = element.y < minY ? element.y : minY;
            maxY = element.y + element.height > maxY ? element.y + element.height : maxY;
        }
        size.width = maxX - minX;
        size.height = maxY - minY;
        return size;
    }

    measureSize(elementWidth, elementHeight, elementCount) {
        var size = flower.Size.create(elementWidth, elementHeight);
        if (this.elements.length) {
            if (this._fixElementSize) {
                if (this._align == flower.Layout.VerticalAlign) {
                    size.height = elementCount * (elementHeight + this._gap);
                } else if (this._align == flower.Layout.HorizontalAlign) {
                    size.width = elementCount * (elementWidth + this._gap);
                }
            }
        }
        return size;
    }

    updateList(width, height, startIndex = 0) {
        //flower.trace("update layout",flower.EnterFrame.frame);
        if (!this.flag) {
            return;
        }
        var list = this.elements;
        var len = list.length;
        if (!len) {
            return;
        }
        this._maxX = 0;
        this._maxY = 0;
        var i;
        if (this._align == flower.Layout.VerticalAlign) {
            if (this._fixElementSize) {
                var eh = list[0].height;
                for (i = 0; i < len; i++) {
                    list[i].y = (i + startIndex) * (eh + this._gap);
                }
                this._maxY = (len + startIndex) * (eh + this._gap);
            }
            else {
                var y = 0;
                for (i = 0; i < len; i++) {
                    list[i].y = y;
                    y += list[i].height + this._gap;
                    this._maxY = y;
                }
            }
        }
        if (this._align == flower.Layout.HorizontalAlign) {
            if (this._fixElementSize) {
                var ew = list[0].width;
                for (i = 0; i < len; i++) {
                    list[i].x = (i + startIndex) * (ew + this._gap);
                }
                this._maxX = (len + startIndex) * (ew + this._gap);
            }
            else {
                var x = 0;
                for (i = 0; i < len; i++) {
                    list[i].x = x;
                    x += list[i].width + this._gap;
                    this._maxX = x;
                }
            }
        }
    }

    get gap() {
        return this._gap;
    }

    set gap(val) {
        val = +val || 0;
        this._gap = val;
    }

    get align() {
        return this._align;
    }

    set align(val) {
        this._align = val;
    }

}
//////////////////////////End File:extension/black/layout/LinearLayout.js///////////////////////////



//////////////////////////File:extension/black/layout/HorizontalLayout.js///////////////////////////
class HorizontalLayout extends LinearLayout{

    constructor() {
        super();
        this.align = flower.Layout.HorizontalAlign;
    }
}

black.HorizontalLayout = HorizontalLayout;
//////////////////////////End File:extension/black/layout/HorizontalLayout.js///////////////////////////



//////////////////////////File:extension/black/layout/VerticalLayout.js///////////////////////////
class VerticalLayout extends LinearLayout {

    constructor() {
        super();
        this.align = flower.Layout.VerticalAlign;
    }

}

black.VerticalLayout = VerticalLayout;
//////////////////////////End File:extension/black/layout/VerticalLayout.js///////////////////////////



//////////////////////////File:extension/black/Group.js///////////////////////////
class Group extends flower.Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        this.__flags |= flags;
    }

    $validateChildrenUIComponent() {
        var children = this.__children;
        if (children) {
            var child;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child.__UIComponent) {
                    child.$validateUIComponent();
                }
            }
        }
    }

    $resetLayout() {
        if(this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if(this.layout) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.$resetLayout();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}
UIComponent.register(Group,true);
Group.prototype.__UIComponent = true;
black.Group = Group;
//////////////////////////End File:extension/black/Group.js///////////////////////////



//////////////////////////File:extension/black/UIParser.js///////////////////////////
class UIParser extends Group {
    static classes = {
        f: {
            "Object": "Object",
            "Array": "Array",

            "Point": "flower.Point",
            "Size": "flower.Size",
            "Rectangle": "flower.Rectangle",

            "ColorFilter": "flower.ColorFilter",
            "TextField": "flower.TextField",
            "TextInput": "flower.TextInput",
            "Bitmap": "flower.Bitmap",
            "Shape": "flower.Shape",
            "Mask": "flower.Mask",

            "ArrayValue": "ArrayValue",
            "BooleanValue": "flower.BooleanValue",
            "IntValue": "flower.IntValue",
            "NumberValue": "flower.NumberValue",
            "ObjectValue": "flower.ObjectValue",
            "StringValue": "flower.StringValue",
            "UIntValue": "flower.UIntValue",

            "Label": "flower.Label",
            "Image": "flower.Image",
            "Group": "flower.Group",
            "Button": "flower.Button",
            "RectUI": "flower.RectUI",
            "MaskUI": "flower.MaskUI",
            "Scroller": "flower.Scroller",
            "DataGroup": "flower.DataGroup",
            "ItemRenderer": "flower.ItemRenderer",
            "ToggleButton": "flower.ToggleButton",
            "ToggleSwitch": "flower.ToggleSwitch",
            "CheckBox": "flower.CheckBox",
            "RadioButton": "flower.RadioButton",
            "RadioButtonGroup": "flower.RadioButtonGroup",
            "ListBase": "flower.ListBase",
            "List": "flower.List",
            "TabBar": "flower.TabBar",
            "ViewStack": "flower.ViewStack",
            "LinearLayoutBase": "flower.LinearLayoutBase",
            "HorizontalLayout": "flower.HorizontalLayout",
            "VerticalLayout": "flower.VerticalLayout"
        },
        local: {},
        localContent: {},
        localURL: {},
        addChild: {
            "Array": "push",
            "ArrayValue": "push"
        }
    };

    _className;
    classes;
    parseContent;
    parseUIAsyncFlag;
    loadContent;
    loadData;
    rootXML;
    hasInitFunction;

    constructor() {
        super();
        this.classes = flower.UIParser.classes;
    }

    parseUIAsync(url, data = null) {
        this.loadData = data;
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        this.parseUIAsyncFlag = true;
    }

    parseAsync(url) {
        var loader = new flower.URLLoader(url);
        loader.addListener(flower.Event.COMPLETE, this.loadContentComplete, this);
        loader.addListener(flower.Event.ERROR, this.loadContentError, this);
        this.parseUIAsyncFlag = false;
    }

    loadContentError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatchWidth(Event.ERROR, getLanguage(3001, e.currentTarget.url));
        } else {
            sys.$error(3001, e.currentTarget.url);
        }
    }

    loadContentComplete(e) {
        this.relationUI = [];
        var xml = flower.XMLElement.parse(e.data);
        this.loadContent = xml;
        var list = xml.getAllElements();
        for (var i = 0; i < list.length; i++) {
            var name = list[i].name;
            var nameSpace = name.split(":")[0];
            name = name.split(":")[1];
            if (nameSpace == "local") {
                if (!this.classes.local[name] && !this.classes.localContent[name]) {
                    if (!this.classes.localURL[name]) {
                        sys.$error(3002, name);
                        return;
                    }
                    var find = false;
                    for (var f = 0; f < this.relationUI.length; f++) {
                        if (this.relationUI[f] == this.classes.localURL[name]) {
                            find = true;
                            break;
                        }
                    }
                    if (!find) {
                        this.relationUI.push(this.classes.localURL[name]);
                    }
                }
            }
        }
        this.relationIndex = 0;
        this.loadNextRelationUI();
    }

    relationUI;
    relationIndex;

    loadNextRelationUI(e = null) {
        if (e) {
            this.relationIndex++;
        }
        if (this.relationIndex >= this.relationUI.length) {
            if (this.parseUIAsyncFlag) {
                this.dispatchWidth(Event.COMPLETE, this.parseUI(this.loadContent, this.loadData));
            } else {
                this.dispatchWidth(Event.COMPLETE, this.parse(this.loadContent));
            }
        } else {
            var parser = new UIParser();
            parser.parseAsync(this.relationUI[this.relationIndex]);
            parser.addListener(flower.Event.COMPLETE, this.loadNextRelationUI, this);
            parser.addListener(Event.ERROR, this.relationLoadError, this);
        }
    }

    relationLoadError(e) {
        if (this.hasListener(Event.ERROR)) {
            this.dispatchWidth(Event.ERROR, e.data);
        } else {
            $error(e.data);
        }
    }

    parseUI(content, data = null) {
        var className = this.parse(content);
        var UIClass = this.classes.local[className];
        if (data) {
            return new UIClass(data);
        }
        var ui = new UIClass();
        this.addChild(ui);
        return ui;
    }

    parse(content) {
        this.parseContent = content;
        var xml;
        if (typeof(content) == "string") {
            xml = flower.XMLElement.parse(content);
        }
        else {
            xml = content;
        }
        if (xml.getNameSapce("f") == null || xml.getNameSapce("f").value != "flower") {
            sys.$error(3006, content);
            return null;
        }
        this.rootXML = xml;
        var className = this.decodeRootComponent(xml, content);
        this.parseContent = "";
        this._className = className;
        this.rootXML = null;
        return className;
    }

    get className() {
        return this._className;
    }

    decodeRootComponent(xml, classContent) {
        var content = "";
        var hasLocalNS = xml.getNameSapce("local") ? true : false;
        var uiname = xml.name;
        var uinameNS = uiname.split(":")[0];
        var extendClass = "";
        uiname = uiname.split(":")[1];
        var className = "";
        var allClassName = "";
        var packages = [];
        if (uinameNS == "local") {
            extendClass = uiname;
        } else {
            extendClass = this.classes[uinameNS][uiname];
            if (!extendClass && this.classes.localContent[extendClass]) {
                this.parse(this.classes.localContent[extendClass]);
            }
        }
        var classAtr = xml.getAttribute("class");
        if (classAtr) {
            className = classAtr.value;
            allClassName = className
            packages = className.split(".");
            if (packages.length > 1) {
                className = packages[packages.length - 1];
                packages.pop();
            } else {
                packages = [];
            }
        } else {
            className = "$UI" + UIParser.id++;
            allClassName = className;
        }
        var changeAllClassName = allClassName;
        if (this.classes.local[allClassName]) {
            if (this.classes.localContent[allClassName] == classContent) {
                return allClassName;
            } else {
                changeAllClassName = changeAllClassName.slice(0, changeAllClassName.length - className.length);
                className = "$UI" + UIParser.id++;
                changeAllClassName += className;
            }
        }
        var before = "";
        for (var i = 0; i < packages.length; i++) {
            content += before + "var " + packages[i] + ";\n";
            content += before + "(function (" + packages[i] + ") {\n";
            before += "\t";
        }
        content += (packages.length ? before : "") + "var " + className + " = (function (_super) {\n";
        content += before + "\t__extends(" + className + ", _super);\n";
        content += before + "\tfunction " + className + "(_data) {\n";
        content += before + "\t\tif(_data) this._data = _data;\n";
        content += before + "\t\t _super.call(this);\n";
        content += before + "\t\tthis." + className + "_binds = [];\n";
        var scriptInfo = {
            content: ""
        };
        this.hasInitFunction = false;
        content += this.decodeScripts(before, className, xml.getElements("f:script"), scriptInfo);
        content += before + "\t\tthis." + className + "_initMain(this);\n";
        var propertyList = [];
        this.decodeObject(before + "\t", className, className + "_initMain", false, xml, hasLocalNS, propertyList, {});
        if (this.hasInitFunction) {
            content += before + "\t\tthis." + className + "_init();\n";
        }
        content += before + "\t\tthis." + className + "_setBindProperty" + "();\n";
        content += before + "\t}\n\n";
        content += propertyList[propertyList.length - 1];
        for (var i = 0; i < propertyList.length - 1; i++) {
            content += propertyList[i];
        }
        content += scriptInfo.content;
        content += before + "\t" + className + ".prototype." + className + "_setBindProperty = function() {\n";
        content += before + "\t\tfor(var i = 0; i < this." + className + "_binds.length; i++) this." + className + "_binds[i][0].bindProperty(this." + className + "_binds[i][1],this." + className + "_binds[i][2],[this]);\n";
        content += before + "\t}\n\n";
        content += before + "\treturn " + className + ";\n";
        if (uinameNS == "f") {
            content += before + "})(" + extendClass + ");\n";
        } else {
            content += before + "})(flower.UIParser.getLocalUIClass(\"" + extendClass + "\"));\n";
        }
        before = "";
        var classEnd = "";
        for (var i = 0; i < packages.length; i++) {
            if (i == 0) {
                classEnd = before + "})(" + packages[i] + " || (" + packages[i] + " = {}));\n" + classEnd;

            } else {
                classEnd = before + "})(" + packages[i] + " = " + packages[i - 1] + "." + packages[i] + " || (" + packages[i - 1] + "." + packages[i] + " = {}));\n" + classEnd;
            }
            before += "\t";
            if (i == packages.length - 1) {
                classEnd = before + packages[i] + "." + className + " = " + className + ";\n" + classEnd;
            }
        }
        content += classEnd;
        content += "\n\nUIParser.registerLocalUIClass(\"" + allClassName + "\", " + changeAllClassName + ");\n";
        //trace("解析后内容:\n", content);
        if (sys.DEBUG) {
            try {
                eval(content);
            } catch (e) {
                sys.$error(3003, e, this.parseContent, content);
            }
        } else {
            eval(content);
        }
        flower.UIParser.setLocalUIClassContent(allClassName, classContent);
        trace("解析类:\n", content);
        return allClassName;
    }

    decodeScripts(before, className, scripts, script) {
        var content = "";
        for (var i = 0; i < scripts.length; i++) {
            for (var s = 0; s < scripts[i].list.length; s++) {
                var item = scripts[i].list[s];
                var childName = item.name;
                childName = childName.split(":")[1];
                if (item.list.length && item.getElement("f:set") || item.getElement("f:get")) {
                    var setFunction = item.getElement("f:set");
                    var getFunction = item.getElement("f:get");
                    script.content += before + "\tObject.defineProperty(" + className + ".prototype, \"" + childName + "\", {\n";
                    if (getFunction) {
                        script.content += "\t\tget: function () {\n"
                        script.content += "\t\t\t" + getFunction.value + "\n";
                        script.content += "\t\t},\n";
                    }
                    if (setFunction) {
                        script.content += "\t\tset: function (val) {\n";
                        script.content += "\t\t\t" + setFunction.value + "\n";
                        script.content += "\t\t},\n";
                    }
                    script.content += "\t\tenumerable: true,\n"
                    script.content += "\t\tconfigurable: true\n";
                    script.content += "\t\t});\n\n";
                } else if (item.value == null || item.value == "") {
                    var initValue = item.getAttribute("init");
                    content += before + "\t\tthis." + childName + " = " + (initValue == null ? "null" : initValue.value) + ";\n";
                } else {
                    if (childName == "init") {
                        childName = className + "_" + childName;
                        this.hasInitFunction = true;
                    }
                    script.content += before + "\t" + className + ".prototype." + childName + " = function(";
                    var params = item.getAttribute("params");
                    if (params) {
                        script.content += params.value;
                    }
                    script.content += ") {\n";
                    script.content += "\t\t" + item.value;
                    script.content += "\t}\n\n";
                }
            }
        }
        return content;
    }

    decodeObject(before, className, funcName, createClass, xml, hasLocalNS, propertyFunc, nameIndex) {
        var setObject = before + className + ".prototype." + funcName + " = function(parentObject) {\n";
        var thisObj = "parentObject";
        var createClassName;
        if (createClass) {
            var createClassNameSpace = xml.name.split(":")[0];
            createClassName = xml.name.split(":")[1];
            if (createClassNameSpace == "local" && createClassName == "Object") {
                thisObj = "object";
                setObject += before + "\t" + thisObj + " = {};\n";
            } else {
                if (createClassNameSpace != "local") {
                    createClassName = this.classes[createClassNameSpace][createClassName];
                }
                thisObj = createClassName.split(".")[createClassName.split(".").length - 1];
                thisObj = thisObj.toLocaleLowerCase();
                if (createClassNameSpace == "local") {
                    setObject += before + "\tvar " + thisObj + " = new (flower.UIParser.getLocalUIClass(\"" + createClassName + "\"))();\n";
                } else {
                    setObject += before + "\tvar " + thisObj + " = new " + createClassName + "();\n";
                }
                setObject += before + "\tif(" + thisObj + ".__UIComponent) " + thisObj + ".eventThis = this;\n";
            }
        }
        var idAtr = xml.getAttribute("id");
        if (idAtr) {
            setObject += before + "\tthis." + idAtr.value + " = " + thisObj + ";\n";
            setObject += before + "\tthis." + idAtr.value + ".name = \"" + idAtr.value + "\";\n";
        }
        for (var i = 0; i < xml.attributes.length; i++) {
            var atrName = xml.attributes[i].name;
            var atrValue = xml.attributes[i].value;
            var atrArray = atrName.split(".");
            if (atrName == "class") {
            } else if (atrName == "id") {
            } else if (atrArray.length == 2) {
                var atrState = atrArray[1];
                atrName = atrArray[0];
                setObject += before + "\t" + thisObj + ".setStatePropertyValue(\"" + atrName + "\", \"" + atrState + "\", \"" + atrValue + "\", [this]);\n";
            } else if (atrArray.length == 1) {
                if (atrValue.indexOf("{") >= 0 && atrValue.indexOf("}") >= 0) {
                    setObject += before + "\tif(" + thisObj + ".__UIComponent) ";
                    setObject += "this." + className + "_binds.push([" + thisObj + ",\"" + atrName + "\", \"" + atrValue + "\"]);\n";
                    setObject += before + "\telse " + thisObj + "." + atrName + " = " + (this.isNumberOrBoolean(atrValue) ? atrValue : "\"" + atrValue + "\"") + ";\n";
                    //setObject += before + "\t" + thisObj + ".bindProperty(\"" + atrName + "\", \"" + atrValue + "\", [this]);\n";
                } else {
                    setObject += before + "\t" + thisObj + "." + atrName + " = " + (this.isNumberOrBoolean(atrValue) ? atrValue : "\"" + atrValue + "\"") + ";\n";
                }
            }
        }
        if (xml.list.length) {
            var itemClassName;
            for (i = 0; i < xml.list.length; i++) {
                var item = xml.list[i];
                var childName = item.name;
                var childNameNS = childName.split(":")[0];
                childName = childName.split(":")[1];
                var childClass = null;
                if (childNameNS == "f" && childName == "script") {
                    continue;
                } else if (item.value != null && item.value != "") { //属性
                    setObject += before + "\t" + thisObj + "." + childName + " = \"" + flower.StringDo.changeStringToInner(item.value) + "\";\n";
                    continue;
                } else if (childNameNS == "local") {
                    if (!hasLocalNS) {
                        $warn(3004, childNameNS, this.parseContent);
                    }
                    if (this.classes.local[childName]) {
                        childClass = childName;
                    } else {
                        if (this.classes.localContent[childName]) {
                            this.parse(this.classes.localContent[childName]);
                            childClass = this.classes.local[childName];
                        } else {
                            $warn(3005, childName, this.parseContent);
                        }
                    }
                } else {
                    if (this.classes[childNameNS]) {
                        childClass = this.classes[childNameNS][childName];
                    } else {
                        $warn(3004, childNameNS, this.parseContent);
                    }
                }
                if (childClass == null) {
                    item = item.list[0];
                }
                itemClassName = item.name.split(":")[1];
                if (!nameIndex[itemClassName]) {
                    nameIndex[itemClassName] = 1;
                } else {
                    nameIndex[itemClassName]++;
                    itemClassName += nameIndex[itemClassName];
                }
                if (childClass == null) {
                    if (childName == "itemRenderer") {
                        for (var n = 0; n < this.rootXML.namesapces.length; n++) {
                            item.addNameSpace(this.rootXML.namesapces[n]);
                        }
                        setObject += before + "\t" + thisObj + "." + childName + " = flower.UIParser.getLocalUIClass(\"" + (new UIParser()).parse(item) + "\");\n";
                    } else {
                        funcName = className + "_get" + itemClassName;
                        setObject += before + "\t" + thisObj + "." + childName + " = this." + funcName + "(" + thisObj + ");\n";
                        this.decodeObject(before, className, funcName, true, item, hasLocalNS, propertyFunc, nameIndex);
                    }
                } else {
                    funcName = className + "_get" + itemClassName;
                    setObject += before + "\t" + thisObj + "." + (UIParser.classes.addChild[createClassName] ? UIParser.classes.addChild[createClassName] : "addChild") + "(this." + funcName + "(" + thisObj + "));\n";
                    this.decodeObject(before, className, funcName, true, item, hasLocalNS, propertyFunc, nameIndex);
                }
            }
        }
        if (createClass) {
            setObject += before + "\treturn " + thisObj + ";\n";
        }
        setObject += before + "}\n\n";
        propertyFunc.push(setObject);
    }

    isNumberOrBoolean(str) {
        if (str == "true" || str == "false") {
            return true;
        }
        if (str.length > 3 && ( str.slice(0, 2) == "0x" || str.slice(0, 2) == "0X")) {
            for (var i = 2; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102) {
                }
                else {
                    return false;
                }
            }
        }
        else {
            for (var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code >= 48 && code <= 57) {
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    static registerLocalUIClass(name, cls) {
        flower.UIParser.classes.local[name] = cls;
    }

    static setLocalUIClassContent(name, content) {
        flower.UIParser.classes.localContent[name] = content;
    }

    static getLocalUIClassContent(name) {
        return flower.UIParser.classes.localContent[name];
    }

    static getLocalUIClass(name) {
        return this.classes.local[name];
    }

    static setLocalUIURL(name, url) {
        this.classes.localURL[name] = url;
    }
}

black.UIParser = UIParser;
//////////////////////////End File:extension/black/UIParser.js///////////////////////////



//////////////////////////File:extension/black/DataGroup.js///////////////////////////
class DataGroup extends Group {

    _data;
    _itemRenderer;
    _items;
    _viewer;
    _viewWidth;
    _viewHeight;
    _contentWidth;
    _contentHeight;
    _downItem;
    _selectedItem;
    _itemSelectedEnabled = false;
    _itemClickedEnabled = false;
    _requireSelection = false;

    constructor() {
        super();
        this._itemSelectedEnabled = true;
        this._itemClickedEnabled = true;
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouchItem, this);
    }

    onDataUpdate() {
        this.$addFlags(0x4000);
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout && (!this._viewer || !this.layout.fixElementSize)) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        if ((flags & 0x0004) == 0x0004) {
            this.__flags |= 0x4000;
        }
        this.__flags |= flags;
    }

    $onFrameEnd() {
        if (this._viewer) {
            if (this._viewWidth != this._viewer.width || this._viewHeight != this._viewer.height) {
                this._viewWidth = this._viewer.width;
                this._viewHeight = this._viewer.height;
                this.$addFlags(0x4000);
            }
        }
        if (this._data && this._data.length && this._itemRenderer && (this.$hasFlags(0x4000))) {
            if (!this._items) {
                this._items = [];
            }
            var list = this._data;
            var newItems = [];
            var item;
            var itemData;
            var measureSize = false;
            var findSelected = false;
            if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                for (var i = 0, len = list.length; i < len; i++) {
                    item = null;
                    itemData = list.getItemAt(i);
                    for (var f = 0; f < this._items.length; f++) {
                        if (this._items[f].data == itemData) {
                            item = this._items[f];
                            this._items.splice(f, 1);
                            break;
                        }
                    }
                    if (item == null) {
                        item = this.createItem(itemData, i);
                        item.data = itemData;
                    }
                    if (item.parent == this) {
                        this.setChildIndex(item, i);
                    } else {
                        this.addChild(item);
                    }
                    item.$setItemIndex(i);
                    newItems[i] = item;
                    if (item.data == this._selectedItem) {
                        findSelected = true;
                    }
                }
            } else {
                this.layout.$clear();
                var elementWidth;
                var elementHeight;
                if (!this._items.length) {
                    item = this.createItem(list.getItemAt(0), 0);
                    item.data = list.getItemAt(0);
                    this._items.push(item);
                }
                elementWidth = this._items[0].width;
                elementHeight = this._items[0].height;
                var firstItemIndex = this.layout.getFirstItemIndex(elementWidth, elementHeight, -this.x, -this.y);
                firstItemIndex = firstItemIndex < 0 ? 0 : firstItemIndex;
                for (var i = firstItemIndex; i < list.length; i++) {
                    item = null;
                    itemData = list.getItemAt(i);
                    for (var f = 0; f < this._items.length; f++) {
                        if (this._items[f].data == itemData) {
                            item = this._items[f];
                            this._items.splice(f, 1);
                            break;
                        }
                    }
                    if (!item) {
                        item = this.createItem(itemData, i);
                        item.data = itemData;
                    }
                    if (item.parent == this) {
                        this.setChildIndex(item, i - firstItemIndex);
                    } else {
                        this.addChild(item);
                    }
                    item.$setItemIndex(i);
                    newItems[i - firstItemIndex] = item;
                    if (item.data == this._selectedItem) {
                        findSelected = true;
                    }
                    this.layout.updateList(this._viewWidth, this._viewHeight, firstItemIndex);
                    if (this.layout.isElementsOutSize(-this.x, -this.y, this._viewWidth, this._viewHeight)) {
                        break;
                    }
                }
            }
            if (findSelected == false && this._selectedItem) {
                this._selectedItem = null;
            }
            measureSize = true;
            while (this._items.length) {
                this._items.pop().dispose();
            }
            this._items = newItems;
            this.$removeFlags(0x4000);
            if (!this._selectedItem) {
                this._canSelecteItem();
            }
        }
        if (measureSize) {
            if (!this._viewer || !this.layout || !this.layout.fixElementSize) {
                var size = this.layout.getContentSize();
                this._contentWidth = size.width;
                this._contentHeight = size.height;
                flower.Size.release(size);
            }
            else if (this._items.length) {
                var size = this.layout.measureSize(this._items[0].width, this._items[0].height, list.length);
                this._contentWidth = size.width;
                this._contentHeight = size.height;
                flower.Size.release(size);
            }
        }
        super.$onFrameEnd();
    }

    createItem(data, index) {
        var item = new this._itemRenderer(data);
        item.index = index;
        item.$setList(this._data);
        item.addListener(flower.TouchEvent.TOUCH_BEGIN, this._onTouchItem, this);
        item.addListener(flower.TouchEvent.TOUCH_END, this._onTouchItem, this);
        item.addListener(flower.TouchEvent.TOUCH_RELEASE, this._onTouchItem, this);
        if (item.data == this._downItem) {
            if (item.data == this._selectedItem && this._itemSelectedEnabled) {
                item.currentState = "selectedDown";
                item.selected = true;
            } else {
                item.currentState = "down";
            }
        } else {
            if (item.data == this._selectedItem && this._itemSelectedEnabled) {
                item.currentState = "selectedUp";
                item.selected = true;
            } else {
                item.currentState = "up";
            }
        }
        return item;
    }

    _onTouchItem(e) {
        var item = e.currentTarget;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (this._itemSelectedEnabled) {
                    if (item.data == this._selectedItem) {
                        item.currentState = "selectedDown";
                    } else {
                        item.currentState = "down";
                    }
                }
                this._downItem = item.data;
                break;
            case flower.TouchEvent.TOUCH_RELEASE:
                this.$releaseItem();
                break;
            case flower.TouchEvent.TOUCH_END:
                if (this._downItem == item.data) {
                    this._downItem = null;
                    this._setSelectedItem(item);
                    if (this._itemClickedEnabled) {
                        item.$onClick();
                        //var data = item.data;
                        //var find = false;
                        //for (var i = 0, len = this._data.length; i < len; i++) {
                        //    if (this._data.getItemAt(i) == data) {
                        //        find = true;
                        //    }
                        //}
                        //if (find && this.onClickItemEXE) {
                        //    this.onClickItemEXE.call(this, item.data);
                        //}
                    }
                }
                break;
        }
    }

    _setSelectedIndex(val) {

    }

    _canSelecteItem() {
        if (this._requireSelection && this._itemSelectedEnabled && !this._selectedItem && this._data.length) {
            this._selectedItem = this._data.getItemAt(0);
            var item = this.getItemByData(this._selectedItem);
            if (item) {
                item.currentState = "selectedUp";
                item.selected = true;
            }
        }
    }

    _setSelectedItem(item) {
        if (item == null || item.data != this._selectedItem) {
            if (this._selectedItem) {
                var itemRenderer = this.getItemByData(this._selectedItem);
                if (itemRenderer) {
                    itemRenderer.currentState = "up";
                    itemRenderer.selected = false;
                }
            }
        }
        if (item && this._itemSelectedEnabled) {
            item.currentState = "selectedUp";
            item.selected = true;
            this._selectedItem = item.data;
        } else {
            if (item) {
                item.currentState = "up";
            }
            this._selectedItem = null;
        }
    }

    $releaseItem() {
        var clickItem = this.getItemByData(this._downItem);
        if (clickItem) {
            if (this._downItem == this._selectedItem && this._itemSelectedEnabled) {
                clickItem.currentState = "selectedUp";
            } else {
                clickItem.currentState = "up";
            }
        }
        this._downItem = null;
    }

    onScroll() {
        this.$addFlag(0x400);
    }

    getItemByData(data) {
        for (var i = 0, len = this._items.length; i < len; i++) {
            if (this._items[i].data == data) {
                return this._items[i];
            }
        }
        return null;
    }

    //////////////////////////////////get&set//////////////////////////////////
    get dataProvider() {
        return this._data;
    }

    set dataProvider(val) {
        if (this._data == val) {
            return;
        }
        this.removeAll();
        this._items = null;
        this._data = val;
        this.$addFlags(0x4000);
        if (this._data) {
            this._data.addListener(flower.Event.UPDATE, this.onDataUpdate, this)
        }
    }

    get itemRenderer() {
        return this._itemRenderer;
    }

    set itemRenderer(val) {
        if (this._itemRenderer == val) {
            return;
        }
        this.removeAll();
        this._items = null;
        this._itemRenderer = val;
        this.$addFlags(0x4000);
    }

    get numElements() {
        return this._items.length;
    }

    set viewer(display) {
        this._viewer = display;
    }

    get contentWidth() {
        return this._contentWidth;
    }

    get contentHeight() {
        return this._contentHeight;
    }

    get scrollEnabled() {
        return true;
    }


    get selectedIndex() {
        return this._selectedItem ? this._selectedItem.itemIndex : -1;
    }

    set selectedIndex(val) {
        val = +val || 0;
        if (this._selectedItem && this._selectedItem.itemIndex == val) {
            return;
        }
        this._setSelectedIndex(val);
    }

    get selectedItem() {
        return this._selectedItem;
    }

    get itemSelectedEnabled() {
        return this._itemSelectedEnabled;
    }

    set itemSelectedEnabled(val) {
        this._itemSelectedEnabled = !!val;
    }

    get itemClickedEnabled() {
        return this._itemClickedEnabled;
    }

    set itemClickedEnabled(val) {
        val = !!val;
        if (this._itemClickedEnabled == val) {
            return;
        }
        this._itemClickedEnabled = val;
    }

    get requireSelection() {
        return this._requireSelection;
    }

    set requireSelection(val) {
        val = !!val;
        if (val == this._requireSelection) {
            return;
        }
        this._requireSelection = val;
    }

    //onClickItemEXE:Function;
    //
    //set onClickItem(val) {
    //    if (typeof val == "string") {
    //        var content:string = <any>val;
    //        val = function (item) {
    //            eval(content);
    //        }.bind(this.eventThis);
    //    }
    //    this.onClickItemEXE = val;
    //}
    //
    //get onClickItem() {
    //    return this.onClickItemEXE;
    //}
}

black.DataGroup = DataGroup;
//////////////////////////End File:extension/black/DataGroup.js///////////////////////////



//////////////////////////File:extension/black/ItemRenderer.js///////////////////////////
class ItemRenderer extends Group {

    _data;
    _itemIndex;
    _selected = false;

    constructor() {
        super();
        this.absoluteState = true;
    }

    get data() {
        return this._data;
    }

    set data(val) {
        this._data = val;
        this.setData(this._data);
    }

    setData(val) {
    }

    get itemIndex() {
        return this._itemIndex;
    }

    $setItemIndex(val) {
        this._itemIndex = val;
    }

    setSelected(val) {
        this._selected = val;
        if (this._selected) {
            if (this.onSelectedEXE) {
                this.onSelectedEXE.call(this);
            }
        }
    }

    get selected() {
        return this._selected;
    }

    set selected(val) {
        val = !!val;
        if (this._selected == val) {
            return;
        }
        this.setSelected(val);
    }

    $onClick() {
        if (this.onClickEXE) {
            this.onClickEXE.call(this);
        }
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onSelectedEXE;

    set onSelected(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onSelectedEXE = val;
    }

    get onSelected() {
        return this.onClickEXE;
    }

    _list;

    get list() {
        return this._list;
    }

    $setList(val) {
        this._list = val;
    }
}

black.ItemRenderer = ItemRenderer;
//////////////////////////End File:extension/black/ItemRenderer.js///////////////////////////



//////////////////////////File:extension/black/Label.js///////////////////////////
class Label extends flower.TextField {

    constructor(text = "") {
        super(text);
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}

UIComponent.register(Label);
Label.prototype.__UIComponent = true;
black.Label = Label;
//////////////////////////End File:extension/black/Label.js///////////////////////////



//////////////////////////File:extension/black/RectUI.js///////////////////////////
class RectUI extends flower.Shape {

    constructor() {
        super();
        this.$RectUI = {
            0: 0, //width
            1: 0, //height
        };
        this.drawRect = null;
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    $setFillColor(val) {
        if (super.$setFillColor(val)) {
            this.$resetRectUI();
        }
    }

    $setFillAlpha(val) {
        if (super.$setFillAlpha(val)) {
            this.$resetRectUI();
        }
    }

    $setLineWidth(val) {
        if (super.$setLineWidth(val)) {
            this.$resetRectUI();
        }
    }

    $setLineColor(val) {
        if (super.$setLineColor(val)) {
            this.$resetRectUI();
        }
    }

    $setLineAlpha(val) {
        if (super.$setLineAlpha(val)) {
            this.$resetRectUI();
        }
    }

    $setWidth(val) {
        val = +val || 0;
        var p = this.$RectUI;
        if (p[0] == val) {
            return;
        }
        p[0] = val;
        this.$resetRectUI();
    }

    $resetRectUI() {
        var p = this.$Shape;
        if (p[9].length == 0) {
            p[9].push({});
        }
        var width = this.$RectUI[0];
        var height = this.$RectUI[1];
        var x = 0;
        var y = 0;
        p[9][0] = {
            points: [{x: x, y: y},
                {x: x + width, y: y},
                {x: x + width, y: y + height},
                {x: x, y: y + height},
                {x: x, y: y}],
            fillColor: p[0],
            fillAlpha: p[1],
            lineWidth: p[2],
            lineColor: p[3],
            lineAlpha: p[4]
        };
        this.$addFlags(0x0400);
    }

    $setHeight(val) {
        val = +val || 0;
        var p = this.$RectUI;
        if (p[1] == val) {
            return;
        }
        p[1] = val;
        this.$resetRectUI();
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
    }

    dispose() {
        this.removeAllBindProperty();
        super.dispose();
    }
}

UIComponent.register(RectUI);
RectUI.prototype.__UIComponent = true;
black.RectUI = RectUI;
//////////////////////////End File:extension/black/RectUI.js///////////////////////////



//////////////////////////File:extension/black/Image.js///////////////////////////
class Image extends flower.Bitmap {

    $UIComponent;
    __source;
    __loader;

    constructor(source = null) {
        super();
        this.$initUIComponent();
        this.source = source;
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
        }
        this.__flags |= flags;
    }

    $setSource(val) {
        if (this.__source == val) {
            return;
        }
        this.__source = val;
        if (val == null) {
            this.texture = null;
        }
        else if (val instanceof flower.Texture) {
            this.texture = val;
        } else {
            if (this.__loader) {
                this.__loader.dispose();
            }
            this.__loader = new flower.URLLoader(val);
            this.__loader.load();
            this.__loader.addListener(flower.Event.COMPLETE, this.__onLoadComplete, this);
            this.__loader.addListener(flower.IOErrorEvent.ERROR, this.__onLoadError, this);
        }
    }

    __onLoadError(e) {
        this.__loader = null;
    }

    __onLoadComplete(e) {
        this.__loader = null;
        this.texture = e.data;
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
    }

    dispose() {
        if (this.__loader) {
            this.__loader.dispose();
        }
        this.removeAllBindProperty();
        super.dispose();
    }

    get source() {
        return this.__source;
    }

    set source(val) {
        this.$setSource(val);
    }
}

UIComponent.register(Image);
Image.prototype.__UIComponent = true;
black.Image = Image;
//////////////////////////End File:extension/black/Image.js///////////////////////////



//////////////////////////File:extension/black/TileImage.js///////////////////////////
class TileImage extends Group {

    constructor() {
        super();
    }

    $setSource() {
        
    }
}

black.TileImage = Group;
//////////////////////////End File:extension/black/TileImage.js///////////////////////////



//////////////////////////File:extension/black/MaskUI.js///////////////////////////
class MaskUI extends flower.Mask {

    constructor() {
        super();
        this.$initUIComponent();
    }

    $addFlags(flags) {
        if ((flags & 0x0001) == 0x0001 && (this.__flags & 0x1000) != 0x1000 && (!this.parent || !this.parent.__UIComponent)) {
            this.__flags |= 0x1000;
            if (this.layout) {
                this.__flags |= 0x2000;
            }
        }
        this.__flags |= flags;
    }

    $validateChildrenUIComponent() {
        if (this.shape.__UIComponent) {
            this.shape.$validateUIComponent(this);
        }
        var children = this.__children;
        if (children) {
            var child;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                if (child.__UIComponent) {
                    child.$validateUIComponent();
                }
            }
        }
    }

    $resetLayout() {
        if (this.$hasFlags(0x2000)) {
            this.$removeFlags(0x2000);
            if (this.layout) {
                this.layout.updateList(this.width, this.height);
            }
        }
    }

    $onFrameEnd() {
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.shape.$onFrameEnd();
        this.$resetLayout();
    }
}
UIComponent.register(MaskUI, true);
MaskUI.prototype.__UIComponent = true;
black.MaskUI = MaskUI;
//////////////////////////End File:extension/black/MaskUI.js///////////////////////////



//////////////////////////File:extension/black/Button.js///////////////////////////
class Button extends Group {

    _enabled = true;

    constructor() {
        super();
        this.absoluteState = true;
        this.currentState = "up";
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouch, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouch, this);
    }

    $getMouseTarget(touchX, touchY, multiply) {
        var target = super.$getMouseTarget(touchX, touchY, multiply);
        if (target) {
            target = this;
        }
        return target;
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                this.currentState = "down";
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                this.currentState = "up";
                break;
        }
    }

    __setEnabled(val) {
        val = !!val;
        if (this._enabled == val) {
            return false;
        }
        this._enabled = val;
        if (this._enabled) {
            this.currentState = "up";
        } else {
            this.currentState = "disabled";
        }
        return true;
    }

    set enabled(val) {
        this.__setEnabled(val);
    }

    get enabled() {
        return this._enabled;
    }

    addUIComponentEvents() {
        super.addUIComponentEvents();
        this.addListener(flower.TouchEvent.TOUCH_END, this.onEXEClick, this);
    }

    onClickEXE;

    set onClick(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onClickEXE = val;
    }

    get onClick() {
        return this.onClickEXE;
    }

    onEXEClick(e) {
        if (this.onClickEXE && e.target == this) {
            this.onClickEXE.call(this);
        }
    }
}

black.Button = Button;
//////////////////////////End File:extension/black/Button.js///////////////////////////



//////////////////////////File:extension/black/ToggleButton.js///////////////////////////
class ToggleButton extends Button {

    __selected = false;
    onChangeEXE;

    constructor() {
        super();
    }

    __onTouch(e) {
        if (!this.enabled) {
            e.stopPropagation();
            return;
        }
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN :
                if (this.__selected) {
                    this.currentState = "selectedDown";
                } else {
                    this.currentState = "down";
                }
                break;
            case flower.TouchEvent.TOUCH_END :
            case flower.TouchEvent.TOUCH_RELEASE :
                if (e.type == flower.TouchEvent.TOUCH_END) {
                    this.selected = !this.selected;
                }
                if (this.__selected) {
                    this.currentState = "selectedUp";
                } else {
                    this.currentState = "up";
                }
                break;
        }
    }

    __setEnabled(val) {
        super._setEnabled(val);
        if (val == false && this.__selected) {
            this.selected = false;
        }
    }

    __setSelected(val) {
        val = !!val;
        if (!this.enabled || val == this.__selected) {
            return;
        }
        this.__selected = val;
        if (val) {
            this.currentState = "selectedUp";
        } else {
            this.currentState = "up";
        }
        if (this.onChangeEXE) {
            this.onChangeEXE.call(this);
        }
    }

    get selected() {
        return this.__selected;
    }

    set selected(val) {
        this.__setSelected(val);
    }

    set onChange(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onChangeEXE = val;
    }

    get onChange() {
        return this.onChangeEXE;
    }
}

black.ToggleButton = ToggleButton;
//////////////////////////End File:extension/black/ToggleButton.js///////////////////////////



//////////////////////////File:extension/black/CheckBox.js///////////////////////////
class CheckBox extends ToggleButton {
    constructor() {
        super();
    }
}

black.CheckBox = CheckBox;
//////////////////////////End File:extension/black/CheckBox.js///////////////////////////



//////////////////////////File:extension/black/RadioButton.js///////////////////////////
class RadioButton extends ToggleButton {

    _groupName;
    _group;

    constructor() {
        super();
    }

    __setSelected(val) {
        if (val == false && this._group && this._group.selection == this) {
            return;
        }
        super.__setSelected(val);
        if (this._group) {
            this._group.$itemSelectedChange(this);
        }
    }

    __setGroupName(val) {
        if (val == this._groupName) {
            return;
        }
        if (this._group) {
            this._group.$removeButton(this);
            this._group = null;
        }
        this._groupName = val;
        this._group = RadioButtonGroup.$addButton(this);
    }

    get groupName() {
        return this._groupName;
    }

    set groupName(val) {
        this.__setGroupName(val);
    }

    get group() {
        return this._group;
    }
}

black.RadioButton = RadioButton;
//////////////////////////End File:extension/black/RadioButton.js///////////////////////////



//////////////////////////File:extension/black/RadioButtonGroup.js///////////////////////////
class RadioButtonGroup extends Group {

    _buttons = [];
    _groupName;
    _enabled = true;
    _selection;

    constructor(groupName) {
        super();
        if (groupName == null || groupName == "") {
            groupName = "group" + this.id;
        }
        this._groupName = groupName;
        RadioButtonGroup.groups.push(this);
    }

    addChildAt(child, index = 0) {
        super.addChildAt(child);
        if (child instanceof RadioButton && child.group != this) {
            child.groupName = this._groupName;
        }
    }

    $itemSelectedChange(button) {
        if (button.selected) {
            this.selection = button;
        }
    }

    $addButton(button) {
        for (var i = 0; i < this._buttons.length; i++) {
            if (this._buttons[i] == button) {
                return;
            }
        }
        this._buttons.push(button);
        if (this.enabled == false) {
            button.enabled = this.enabled;
        }
        if (button.selected) {
            if (!this._selection) {
                this.selection = button;
            } else {
                button.selected = false;
            }
        }
    }

    $removeButton(button) {
        for (var i = 0; i < this._buttons.length; i++) {
            if (this._buttons[i] == button) {
                this._buttons.splice(i, 1);
                if (button == this._selection) {
                    this.selection = null;
                }
                return button;
            }
        }
        return null;
    }

    __setSelection(val) {
        this._selection = val;
        if (this._selection) {
            this._selection.selected = true;
        }
        for (var i = 0; i < this._buttons.length; i++) {
            if (this._buttons[i] != this._selection) {
                this._buttons[i].selected = false;
            }
        }
        if (this.onChangeEXE) {
            this.onChangeEXE.call(this);
        }
    }

    get selection() {
        return this._selection;
    }

    set selection(val) {
        if (!this._enabled || this._selection == val) {
            return;
        }
        this.__setSelection(val);
    }

    get groupName() {
        return this._groupName;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(val) {
        val = !!val;
        if (this._enabled == val) {
            return;
        }
        this._enabled = val;
        for (var i = 0; i < this._buttons.length; i++) {
            this._buttons[i].enabled = this._enabled;
        }
    }

    /////////////////////////////////////Event///////////////////////////////////
    onChangeEXE;

    set onChange(val) {
        if (typeof val == "string") {
            var content = val;
            val = function () {
                eval(content);
            }.bind(this.eventThis);
        }
        this.onChangeEXE = val;
    }

    get onChange() {
        return this.onChangeEXE;
    }

    /////////////////////////////////////static///////////////////////////////////
    static groups = [];

    static $addButton(button) {
        if (button.groupName && button.groupName != "") {
            var group;
            var groupGroup;
            var list = RadioButtonGroup.groups;
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].groupName == button.groupName) {
                    group = list[i];
                    break;
                }
            }
            if (!group) {
                group = new RadioButtonGroup(button.groupName);
            }
            group.$addButton(button);
            return group;
        }
        return null;
    }
}

black.RadioButtonGroup = RadioButtonGroup;
//////////////////////////End File:extension/black/RadioButtonGroup.js///////////////////////////



//////////////////////////File:extension/black/ToggleSwitch.js///////////////////////////
class ToggleSwitch extends ToggleButton {
    constructor() {
        super();
    }
}

black.ToggleSwitch = ToggleSwitch;
//////////////////////////End File:extension/black/ToggleSwitch.js///////////////////////////



//////////////////////////File:extension/black/ListBase.js///////////////////////////
class ListBase extends DataGroup {

    constructor() {
        super();
        this.requireSelection = true;
        this.itemClickedEnabled = true;
        this.itemSelectedEnabled = true;
    }
}

black.ListBase = ListBase;
//////////////////////////End File:extension/black/ListBase.js///////////////////////////



//////////////////////////File:extension/black/List.js///////////////////////////
class List extends ListBase {
    constructor() {
        super();
        this.layout = new VerticalLayout();
    }
}

black.List = List;
//////////////////////////End File:extension/black/List.js///////////////////////////



//////////////////////////File:extension/black/TabBar.js///////////////////////////
class TabBar extends ListBase {

    constructor() {
        super();
        this.layout = new HorizontalLayout();
        this.layout.fixElementSize = false;
    }

    _setSelectedItem(item) {
        super._setSelectedItem(item);
        (this.dataProvider).selectedItem = item.data;
    }
}

black.TabBar = TabBar;
//////////////////////////End File:extension/black/TabBar.js///////////////////////////



//////////////////////////File:extension/black/ViewStack.js///////////////////////////
class ViewStack extends Group {

    _items = [];
    _selectedIndex = -1;
    _selectedItem;

    constructor() {
        super();
    }

    addChild(display) {
        var find = false;
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                find = true;
                break;
            }
        }
        this._items.push(display);
        this.dispatchWidth(flower.Event.UPDATE);
        if (this._selectedIndex < 0) {
            this._setSelectedIndex(0);
        }
        if (!find) {
            this.dispatchWidth(flower.Event.ADDED, display);
        }
    }

    addChildAt(display, index) {
        var find = false;
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                find = true;
                break;
            }
        }
        this._items.splice(i, 0, display);
        this.dispatchWidth(flower.Event.UPDATE);
        if (this._selectedIndex < 0) {
            this._setSelectedIndex(0);
        }
        if (!find) {
            this.dispatchWidth(flower.Event.ADDED, display);
        }
    }

    removeChild(display) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                if (display == this._selectedItem) {
                    this._setSelectedIndex(0);
                    this.dispatchWidth(flower.Event.UPDATE);
                    this.dispatchWidth(flower.Event.REMOVED, display);
                }
                return display;
            }
        }
        return null;
    }

    removeChildAt(index) {
        var display = this._items.splice(index, 1)[0];
        if (display == this._selectedItem) {
            this._selectedItem = this._items[0];
            this._selectedIndex = 0;
            super.removeChild(display);
            this.dispatchWidth(flower.Event.UPDATE);
            this.dispatchWidth(flower.Event.REMOVED, display);
        } else {
            flower.DebugInfo.debug("ViewStack 设置 removeChildAt 超出索引范围:" + index, DebugInfo.ERROR);
        }
        return display;
    }

    getChildIndex(display) {
        if (display) {
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] == display) {
                    return i;
                }
            }
        }
        return -1;
    }

    setChildIndex(display, index) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == display) {
                this._items.splice(i, 1);
                this._items.splice(index, 0, display);
                this.dispatchWidth(flower.Event.UPDATE);
                return display;
            }
        }
        return null;
    }

    sortChild(key, opt = 0) {
        super.sortChild(key, opt);
        this.dispatchWidth(flower.Event.UPDATE);
    }

    _setSelectedIndex(val) {
        if (this._selectedItem) {
            super.removeChild(this._selectedItem);
        }
        this._selectedItem = null;
        this._selectedIndex = -1;
        var item = this._items[val];
        if (item) {
            this._selectedItem = item;
            this._selectedIndex = val;
            super.addChildAt(this._selectedItem,this.numChildren);
        }
    }

    get length() {
        return this._items.length;
    }

    getItemAt(index) {
        return this._items[index];
    }

    getItemIndex(item) {
        return this.getChildIndex(item);
    }

    set selectedIndex(val) {
        val = +val || 0;
        if (val == this._selectedIndex) {
            return;
        }
        if (val < 0 || val >= this._items.length) {
            val = -1;
        }
        this._setSelectedIndex(val);
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedItem(val) {
        var index = this.getChildIndex(val);
        this._setSelectedIndex(index);
    }
}

black.ViewStack = ViewStack;
//////////////////////////End File:extension/black/ViewStack.js///////////////////////////



//////////////////////////File:extension/black/Scroller.js///////////////////////////
class Scroller extends MaskUI {

    _viewport;
    _viewSize = flower.Size.create(0, 0);
    _startX;
    _startY;
    _scrollDisX = [];
    _scrollDisY = [];
    _scrollTime = [];
    _lastTouchTime;
    _throw;
    _upGap = 18;

    constructor() {
        super();
        this.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
        this.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        this.width = this.height = 100;
        //var bg = new RectUI();
        //bg.fillColor = 0x555555;
        //bg.percentWidth = 100;
        //bg.percentHeight = 100;
        //this.addChild(bg);
    }

    $createShape() {
        var shape = new RectUI();
        shape.percentWidth = 100;
        shape.percentHeight = 100;
        return shape;
    }

    __onTouchScroller(e) {
        if (!this._viewport) {
            return;
        }
        var x = this.lastTouchX;
        var y = this.lastTouchY;
        switch (e.type) {
            case flower.TouchEvent.TOUCH_BEGIN:
                if (this._throw) {
                    this._throw.dispose();
                    this._throw = null;
                }
                this._startX = x - this._viewport.x;
                this._startY = y - this._viewport.y;
                this._scrollDisX.length = this._scrollDisY.length = this._scrollTime.length = 0;
                break;
            case flower.TouchEvent.TOUCH_MOVE:
                if (Math.abs(x - this._startX) > this._upGap || Math.abs(y - this._startY) > this._upGap) {
                    this._viewport.$releaseItem();
                }
                var _x = this._viewport.x;
                var _y = this._viewport.y;
                if (this._viewport.contentWidth > this.width) {
                    this._viewport.x = x - this._startX;
                }
                if (this._viewport.contentHeight > this.height) {
                    this._viewport.y = y - this._startY;
                }
                if (this._viewport.y > this.height) {
                    this._viewport.y = this.height;
                }
                if (this._viewport.y < -this._viewport.contentHeight) {
                    this._viewport.y = -this._viewport.contentHeight;
                }
                if (this._viewport.x > this.width) {
                    this._viewport.x = this.width;
                }
                if (this._viewport.x < -this._viewport.contentWidth) {
                    this._viewport.x = -this._viewport.contentWidth;
                }
                this._scrollDisX.push(this._viewport.x - _x);
                this._scrollDisY.push(this._viewport.y - _y);
                this._scrollTime.push(flower.CoreTime.currentTime);
                if (this._scrollDisX.length > 4) {
                    this._scrollDisX.shift();
                    this._scrollDisY.shift();
                    this._scrollTime.shift();
                }
                this._lastTouchTime = flower.CoreTime.currentTime;
                break;
            case flower.TouchEvent.TOUCH_END:
            case flower.TouchEvent.TOUCH_RELEASE:
                var timeGap = 0.5;
                if (this._scrollTime.length) {
                    timeGap = flower.CoreTime.currentTime - this._scrollTime[0];
                }
                var disX = 0;
                var disY = 0;
                for (var i = 0; i < this._scrollDisX.length; i++) {
                    disX += this._scrollDisX[i];
                    disY += this._scrollDisY[i];
                }
                disX = disX * 100 / timeGap;
                disY = disY * 100 / timeGap;
                if (disX < -600) {
                    disX = -600;
                }
                if (disX > 600) {
                    disX = 600;
                }
                if (disY < -600) {
                    disY = -600;
                }
                if (disY > 600) {
                    disY = 600;
                }
                var toX = this._viewport.x + disX * 5;
                var toY = this._viewport.y + disY * 5;
                var flag = true;
                if (-toX + this.width > this._viewport.contentWidth) {
                    toX = this.width - this._viewport.contentWidth;
                    flag = false;
                }
                if (toX > 0) {
                    toX = 0;
                    flag = false;
                }
                if (-toY + this.height > this._viewport.contentHeight) {
                    toY = this.height - this._viewport.contentHeight;
                    flag = false;
                }
                if (toY > 0) {
                    toY = 0;
                    flag = false;
                }
                if (flag && disX == 0 && disY == 0 && timeGap > 250) {
                    //trace("quit", timeGap);
                    break;
                }
                var timeX = Math.abs(toX - this._viewport.x) / 350;
                var timeY = Math.abs(toY - this._viewport.y) / 350;
                var time = timeX > timeY ? timeX : timeY;
                if (time < 0.5) {
                    time = 0.5;
                }
                if (time > 5) {
                    time = 5;
                }
                this._throw = flower.Tween.to(this._viewport, time, {
                    x: toX,
                    y: toY
                }, flower.Ease.CUBIC_EASE_OUT);
                break;
        }
    }

    $onFrameEnd() {
        if (this._viewport) {
            this._viewport.width = this.width;
            this._viewport.height = this.height;
        }
        if (this.$hasFlags(0x1000) && !this.parent.__UIComponent) {
            this.$validateUIComponent();
        }
        super.$onFrameEnd();
        this.$resetLayout();
    }

    dispose() {
        flower.Size.release(this._viewSize);
        super.dispose();
    }

    $setViewport(val) {
        if (this._viewport == val) {
            return;
        }
        //if (this._viewport) {
        //    this._viewport.removeListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
        //    this._viewport.removeListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
        //    this._viewport.removeListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
        //    this._viewport.removeListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        //}
        this._viewport = val;
        this._viewport.viewer = this;
        //this._viewport.addListener(flower.TouchEvent.TOUCH_BEGIN, this.__onTouchScroller, this);
        //this._viewport.addListener(flower.TouchEvent.TOUCH_MOVE, this.__onTouchScroller, this);
        //this._viewport.addListener(flower.TouchEvent.TOUCH_END, this.__onTouchScroller, this);
        //this._viewport.addListener(flower.TouchEvent.TOUCH_RELEASE, this.__onTouchScroller, this);
        if (this._viewport.parent != this) {
            this.addChild(this._viewport);
        }
    }

    $setWidth(val) {
        this._viewSize.width = val;
    }

    $setHeight(val) {
        this._viewSize.height = val;
    }

    $getWidth() {
        return this._viewSize.width;
    }

    $getHeight() {
        return this._viewSize.height;
    }

    //////////////////////////////////get&set//////////////////////////////////
    set viewport(val) {
        this.$setViewport(val);
    }

    get viewport() {
        return this._viewport;
    }

    get releaseItemDistance() {
        return this._upGap;
    }

    set releaseItemDistance(val) {
        this._upGap = +val || 0;
    }
}

black.Scroller = Scroller;
//////////////////////////End File:extension/black/Scroller.js///////////////////////////



})();
for(var key in black) {
	flower[key] = black[key];
}
