import NodeModules from "../NodeModules.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
/**
 * 列数
 */
const COLUMN_COUNT = 1;
const ITEM_COUNT = 50;
export default class DomLeftList extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        this.listChildren = new Array();
        this.listChildrenContainer = new Array();
    }
    render() {
        this.listChildren.length = 0;
        for (let i = 0; i < ITEM_COUNT; i += COLUMN_COUNT) {
            let containerProps = {
                style: {
                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX
                }
            };
            if (i != 0) {
                containerProps.style[MgrDomDefine.STYLE_MARGIN_TOP] = MgrDomDefine.CONFIG_TXT_SPACING;
            }
            ;
            this.listChildrenContainer.length = 0;
            for (let j = 0; j < COLUMN_COUNT; j++) {
                let idx = i + j;
                if (ITEM_COUNT <= idx) {
                    break;
                }
                ;
                let propsBtn = {
                    onClick: () => {
                    },
                    style: {
                        [MgrDomDefine.STYLE_WIDTH]: 0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1
                    }
                };
                if (j != 0) {
                    propsBtn.style[MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_HALF_SPACING;
                }
                ;
                this.listChildrenContainer.push(ReactComponentExtend.instantiateTag(NodeModules.antd.Button, propsBtn, `按钮 [${idx}]`));
            }
            ;
            this.listChildren.push(ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, containerProps, ...this.listChildrenContainer));
        }
        ;
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, 
        // 滚动视图的遮罩
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_HIDDEN,
                [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
            }
        }, 
        // 滚动的列表
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
                [MgrDomDefine.STYLE_MARGIN_RIGHT]: MgrDomDefine.CONFIG_TXT_SPACING
            }
        }, ...this.listChildren)));
    }
}
