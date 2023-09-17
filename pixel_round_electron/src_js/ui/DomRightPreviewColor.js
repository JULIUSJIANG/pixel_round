import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
class DomRightPreviewColor extends ReactComponentExtend {
    render() {
        let colorInst = IndexGlobal.inst.detailMachine.statusPreview.listColor[this.props.idx];
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                // [MgrDomDefine.STYLE_HEIGHT]: `${MgrDomDefine.CONFIG_NUMBER_SPACING * 4}px`,
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_COLOR]: colorInst.colorRel.str16,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: colorInst.colorMain.str16,
                [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_CENTER
            }
        }, `${this.props.idx}`);
    }
}
(function (DomRightPreviewColor) {
    class Args {
        static create(idx) {
            let inst = objectPool.pop(this.poolType);
            inst.idx = idx;
            return inst;
        }
    }
    Args.poolType = new ObjectPoolType({
        instantiate: () => new Args,
        onPop: null,
        onPush: null
    });
    DomRightPreviewColor.Args = Args;
})(DomRightPreviewColor || (DomRightPreviewColor = {}));
export default DomRightPreviewColor;
