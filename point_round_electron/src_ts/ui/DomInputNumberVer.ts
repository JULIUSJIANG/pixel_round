import NodeModules from "../NodeModules.js";
import objectPool from "../common/ObjectPool.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";

class DomInputNumberVer extends ReactComponentExtend <DomInputNumberVer.Args> {

    render (): ReactComponentExtendInstance {
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
                    [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_CENTER,

                    [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR
                }
            },

            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_FONT_SIZE]: MgrDomDefine.STYLE_FONT_SIZE_14,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE
                    }
                },

                this.props.name,
            ),
            ReactComponentExtend.instantiateTag (
                NodeModules.antd.InputNumber,
                {
                    value: this.props.val,
                    onChange: (val) => {
                        if (this.props.min != null) {
                            val = Math.max (val, this.props.min);
                        };
                        if (this.props.max != null) {
                            val = Math.min (val, this.props.max);
                        };
                        this.props.onValChanged (val);
                    },
                    step: 1,
                    min: this.props.min,
                    max: this.props.max,
                    style: {
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                    }
                }
            )
        );
    }
}

namespace DomInputNumberVer {

    export class Args {

        name: string;

        val: number;

        min: number;

        max: number;

        onValChanged: (val: number) => void;
        
        static create (name: string, val: number, onValChanged: (val: number) => void, min: number, max: number) {
            let inst = objectPool.pop (Args.poolType);
            inst.name = name;
            inst.val = val;
            inst.min = min;
            inst.max = max;
            inst.onValChanged = onValChanged;
            return inst;
        }

        static poolType = new ObjectPoolType ({
            instantiate: () => {
                return new Args ();
            },
            onPop: null,
            onPush: null
        })
    }
}

export default DomInputNumberVer;