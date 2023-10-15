class ExpImgMaskStatus {
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
     * 事件派发 - 开启面具
     * @param expImg
     */
    onMaskEnable(expImg) {
    }
    /**
     * 事件派发 - 关闭面具
     */
    onMaskDisable() {
    }
    /**
     * 获取数据地址
     * @returns
     */
    onGetData() {
        return this.relImg;
    }
}
export default ExpImgMaskStatus;
