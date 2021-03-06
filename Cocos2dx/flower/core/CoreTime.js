class CoreTime {

    static currentTime = 0;
    static lastTimeGap;

    static $run(gap) {
        CoreTime.lastTimeGap = gap;
        CoreTime.currentTime += gap;
        EnterFrame.$update(CoreTime.currentTime, gap);
        Stage.$onFrameEnd();
        TextureManager.getInstance().$check();
    }

    static getTime() {
        return CoreTime.currentTime;
    }
}

exports.CoreTime = CoreTime;