import IndexGlobal from "../IndexGlobal.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomLeftListAdd from "./DomLeftListAdd.js";
import DomLeftListImg from "./DomLeftListImg.js";
export default class DomLeftList extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        this.listChildren = new Array();
        this.listChildrenContainer = new Array();
    }
    render() {
        this.listChildren.length = 0;
        let listImgData = MgrData.inst.get(MgrDataItem.LIST_IMG_DATA);
        for (let i = 0; i < listImgData.length; i += IndexGlobal.IMG_LIST_COLUMN_COUNT) {
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
            for (let j = 0; j < IndexGlobal.IMG_LIST_COLUMN_COUNT; j++) {
                let idx = i + j;
                if (listImgData.length <= idx) {
                    this.listChildrenContainer.push(ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
                        style: {
                            [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 4}px`,
                            [MgrDomDefine.STYLE_MARGIN_LEFT]: MgrDomDefine.CONFIG_TXT_SPACING
                        }
                    }));
                    continue;
                }
                ;
                let imgData = listImgData[i + j];
                let args = objectPool.pop(DomLeftListImg.Args.poolType);
                args.init(imgData, i, j);
                this.listChildrenContainer.push(ReactComponentExtend.instantiateComponent(DomLeftListImg, args));
            }
            ;
            this.listChildren.push(ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, containerProps, ...this.listChildrenContainer));
        }
        ;
        let propsAdd = objectPool.pop(DomLeftListAdd.Args.poolType);
        propsAdd.init(this.listChildren.length);
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
        }, ...this.listChildren, ReactComponentExtend.instantiateComponent(DomLeftListAdd, propsAdd))));
    }
}
