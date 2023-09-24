import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightPreviewColorControl from "./DomRightPreviewColorControl.js";
class DomRightPreviewColor extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        this.listChildrenControl = new Array();
    }
    render() {
        let colorInst = IndexGlobal.inst.detailMachine.statusPreview.listColor[this.props.idx];
        this.listChildrenControl.length = 0;
        this.listChildrenControl.push(ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_SPACE_BETWEEN,
                [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_CENTER,
                [MgrDomDefine.STYLE_VERTICAL_ALIGN]: MgrDomDefine.STYLE_VERTICAL_ALIGN_MIDDLE
            }
        }, `平滑优先`), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_MARGIN_TOP]: MgrDomDefine.CONFIG_TXT_SPACING,
                [MgrDomDefine.STYLE_PADDING_TOP]: MgrDomDefine.CONFIG_TXT_SPACING,
                [MgrDomDefine.STYLE_PADDING_BOTTOM]: MgrDomDefine.CONFIG_TXT_SPACING,
                [MgrDomDefine.STYLE_PADDING_LEFT]: MgrDomDefine.CONFIG_TXT_DOUBLE_SPACING,
                [MgrDomDefine.STYLE_PADDING_RIGHT]: MgrDomDefine.CONFIG_TXT_DOUBLE_SPACING,
                [MgrDomDefine.STYLE_COLOR]: colorInst.colorRel.str16,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: colorInst.colorMain.str16,
                [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_CENTER,
                [`border`]: `1px solid ${colorInst.colorRel.str16}`
            }
        }, `${this.props.idx}`)));
        for (let i = this.props.idx + 1; i < IndexGlobal.inst.detailMachine.statusPreview.listColor.length; i++) {
            let args = DomRightPreviewColorControl.Args.create(i);
            this.listChildrenControl.push(ReactComponentExtend.instantiateComponent(DomRightPreviewColorControl, args));
        }
        ;
        let props = {
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_BACKGROUND_COLOR_WHITE,
            }
        };
        if (this.props.idx != 0) {
            props.style[MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, props, ...this.listChildrenControl);
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
