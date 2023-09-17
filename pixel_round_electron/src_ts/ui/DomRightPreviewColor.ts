import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

class DomRightPreviewColor extends ReactComponentExtend <DomRightPreviewColor.Args> {

    render (): ReactComponentExtendInstance {
        let colorInst = IndexGlobal.inst.detailMachine.statusPreview.listColor [this.props.idx]
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
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
            },

            `${this.props.idx}`
        )
    }
}

namespace DomRightPreviewColor {
    export class Args {

        idx: number;

        static create (idx: number) {
            let inst = objectPool.pop (this.poolType);
            inst.idx = idx;
            return inst;
        }

        static poolType = new ObjectPoolType <Args> ({
            instantiate: () => new Args,
            onPop: null,
            onPush: null
        });
    }
}

export default DomRightPreviewColor;