import IndexGlobal from "./IndexGlobal.js";
import MgrData from "./mgr/MgrData.js";
import MgrDom from "./mgr/MgrDom.js";
import MgrRes from "./mgr/MgrRes.js";
import MgrSdk from "./mgr/MgrSdk.js";
Promise.resolve()
    // 等待文档加载成功
    .then(() => {
    return new Promise((resolve) => {
        window.addEventListener(`DOMContentLoaded`, resolve);
    });
})
    // 初始化 sdk
    .then(() => {
    return MgrSdk.inst.init();
})
    // 初始化数据
    .then(() => {
    return MgrData.inst.init();
})
    // 初始化资源
    .then(() => {
    return MgrRes.inst.init();
})
    // 初始化渲染器
    .then(() => {
    return MgrDom.inst.init();
})
    // 告知服务端已就绪
    .then(() => {
    IndexGlobal.inst.init();
    // 跟服务端说，我已经就绪了
    return MgrSdk.inst.core.logToMain(`客户端就绪...`);
})
    // 自动 update
    .then(() => {
    // 关闭窗口时候自动存档一次
    window.addEventListener(`beforeunload`, () => {
        MgrSdk.inst.core.logToMain(`客户端关闭...`);
        MgrData.inst.save();
    });
    let updatedDataVersion;
    let start = Date.now();
    let called = 0;
    // 自循环装置
    let go = () => {
        // 派发时间间隔
        let current = Date.now();
        let calling = current - start - called;
        called += calling;
        // 数据版本发生变化，刷新所有内容
        if (updatedDataVersion != MgrData.inst.dataVersion) {
            updatedDataVersion = MgrData.inst.dataVersion;
            MgrData.inst.save();
            MgrDom.inst.refresh();
        }
        ;
        requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
});
class IndexWindow {
}
;
export default IndexWindow;
