class Group extends flower.Sprite {

    $UIComponent;

    constructor() {
        super();
        this.$initUIComponent();
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
exports.Group = Group;