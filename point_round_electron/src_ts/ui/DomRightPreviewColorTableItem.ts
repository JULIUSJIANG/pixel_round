import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightPreviewColorTableItemCheckbox from "./DomRightPreviewColorTableItemCheckbox.js";

class DomRightPreviewColorTableItem extends ReactComponentExtend <DomRightPreviewColorTableItem.Args> {

    listChildrenControl = new Array <ReactComponentExtendInstance> ();

    render (): ReactComponentExtendInstance {
        let colorInst = IndexGlobal.inst.detailMachine.statusPreview.listColor [this.props.idx];
        this.listChildrenControl.length = 0;
        this.listChildrenControl.push (ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                    [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_SPACE_BETWEEN,
                    [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
                }
            },
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_PADDING]: `${MgrDomDefine.CONFIG_NUMBER_SPACING}px`,
                        [MgrDomDefine.STYLE_COLOR]: colorInst.colorRel.str16,
                        [MgrDomDefine.STYLE_BACKGROUND_COLOR]: colorInst.colorMain.str16,
                        [MgrDomDefine.STYLE_TEXT_ALIGN]: MgrDomDefine.STYLE_TEXT_ALIGN_CENTER,
                        [`border`]: `1px solid ${colorInst.colorRel.str16}`
                    }
                },
                `${this.props.idx}`
            )
        ));
        for (let i = this.props.idx + 1; i < IndexGlobal.inst.detailMachine.statusPreview.listColor.length; i++) {
            let args = DomRightPreviewColorTableItemCheckbox.Args.create (this.props.idx, i);
            this.listChildrenControl.push (ReactComponentExtend.instantiateComponent (DomRightPreviewColorTableItemCheckbox, args));
        };

        let props = {
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
            }
        };
        if (this.props.idx != 0) {
            props.style [MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        };
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            props,

            ...this.listChildrenControl
        );
    }
}

namespace DomRightPreviewColorTableItem {
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

export default DomRightPreviewColorTableItem;