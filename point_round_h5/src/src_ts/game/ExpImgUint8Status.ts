import ExpImg from "./ExpImg";

class ExpImgUint8Status {

    /**
     * 归属的照图片
     */
    relImg: ExpImg;

    constructor (relImg: ExpImg) {
        this.relImg = relImg;
    }

    /**
     * 事件派发 - 进入状态
     */
    onEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    onExit () {

    }

    /**
     * 事件派发 - 被选上
     */
    onSelected () {

    }

    /**
     * 事件派发 - 销毁
     */
    onDestroy () {

    }
}

export default ExpImgUint8Status;