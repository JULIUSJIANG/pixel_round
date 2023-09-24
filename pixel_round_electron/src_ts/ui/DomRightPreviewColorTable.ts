import IndexGlobal from "../IndexGlobal.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomRightPreviewColorTableItem from "./DomRightPreviewColorTableItem.js";

class DomRightPreviewColorTable extends ReactComponentExtend <number> {

    listChildren = new Array <ReactComponentExtendInstance> ();

    render (): ReactComponentExtendInstance {
        this.listChildren.length = 0;
        for (let i = 0; i < IndexGlobal.inst.detailMachine.statusPreview.listColor.length - 1; i++) {
            this.listChildren.push (ReactComponentExtend.instantiateComponent (
                DomRightPreviewColorTableItem,
                DomRightPreviewColorTableItem.Args.create (i)
            ));
        };

        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE,
                }
            },
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_PADDING_BOTTOM]: MgrDomDefine.CONFIG_TXT_SPACING,

                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                        [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL
                    }
                },

                ...this.listChildren
            ),
        );
    }
}

export default DomRightPreviewColorTable;