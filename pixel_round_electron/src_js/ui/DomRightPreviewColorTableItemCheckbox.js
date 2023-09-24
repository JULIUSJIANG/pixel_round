import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
class DomRightPreviewColorTableItemCheckbox extends ReactComponentExtend {
    render() {
        let colorInst = IndexGlobal.inst.detailMachine.statusPreview.listColor[this.props.idx];
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_SPACE_BETWEEN,
                [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_SPACING,
                [MgrDomDefine.STYLE_COLOR]: colorInst.colorRel.str16,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: colorInst.colorMain.str16,
                [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_CENTER,
                [`border`]: `1px solid ${colorInst.colorRel.str16}`
            }
        }, `${this.props.idx}`), ReactComponentExtend.instantiateTag(NodeModules.antd.Checkbox, {
            style: {}
        }));
    }
}
(function (DomRightPreviewColorTableItemCheckbox) {
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
    DomRightPreviewColorTableItemCheckbox.Args = Args;
})(DomRightPreviewColorTableItemCheckbox || (DomRightPreviewColorTableItemCheckbox = {}));
export default DomRightPreviewColorTableItemCheckbox;
