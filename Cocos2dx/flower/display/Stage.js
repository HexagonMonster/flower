class Stage extends Sprite {
    constructor() {
        super();
        this.__stage = this;
        Stage.stages.push(this);
    }

    get stageWidth() {
        return Platform.width;
    }

    get stageHeight() {
        return Platform.height;
    }

    static stages = [];

    static getInstance() {
        return Stage.stages[0];
    }
}

exports.Stage = Stage;