export default class DBImgSrcStatus {
    constructor(relMachine) {
        this.relImg = relMachine;
    }
    /**
     * 事件派发 - 进入状态
     */
    onEnter() {
    }
    /**
     * 事件派发 - 离开状态
     */
    onExit() {
    }
    /**
     * 事件派发 - 源数据发生变化
     */
    onSrcChanged(url, width, height) {
    }
}
