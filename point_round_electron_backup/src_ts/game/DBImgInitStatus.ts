import DBImg from "./DBImg.js";

export default class DBImgInitStatus {

    /**
     * 归属的图片
     */
    relImg: DBImg;

    constructor (relMachine: DBImg) {
        this.relImg = relMachine;
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
     * 事件派发 - 源数据发生变化
     */
    onLoaded () {

    }
}