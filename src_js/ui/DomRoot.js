import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
/**
 * 根
 */
export default class DomRoot extends ReactComponentExtend {
    render() {
        // 根容器
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_100,
                [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_100,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
            }
        }, 
        // 根外边距
        `Hello World`);
    }
}
