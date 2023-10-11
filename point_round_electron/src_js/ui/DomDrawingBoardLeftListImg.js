import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
class DomDrawingBoardLeftListImg extends ReactComponentExtend {
    render() {
        let imgInst;
        // 加载完成再说
        if (this.props.dbImg.initCurrStatus == this.props.dbImg.initStatusFinished) {
            let image = this.props.dbImg.imgLoaded;
            let imgWidth = IndexGlobal.IMG_MINI_SIZE;
            let imgHeight = IndexGlobal.IMG_MINI_SIZE;
            if (image.width < image.height) {
                imgWidth = image.width / image.height * imgHeight;
            }
            ;
            if (image.height < image.width) {
                imgHeight = image.height / image.width * imgWidth;
            }
            ;
            let marginX = (IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2 - imgWidth) / 2;
            let marginY = (IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2 - imgHeight) / 2;
            imgInst = ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_IMG, {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: `${imgWidth}px`,
                    [MgrDomDefine.STYLE_HEIGHT]: `${imgHeight}px`,
                    [MgrDomDefine.STYLE_MARGIN_TOP]: `${marginY}px`,
                    [MgrDomDefine.STYLE_MARGIN_RIGHT]: `${marginX}px`,
                    [MgrDomDefine.STYLE_MARGIN_BOTTOM]: `${marginY}px`,
                    [MgrDomDefine.STYLE_MARGIN_LEFT]: `${marginX}px`,
                    "imageRendering": `pixelated`,
                },
                src: image.src
            });
        }
        ;
        let eleSize = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        let props = {
            onClick: () => {
            },
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`,
            }
        };
        if (this.props.j != 0) {
            props.style[MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        }
        ;
        props.style[MgrDomDefine.STYLE_BACKGROUND_COLOR] = MgrDomDefine.CONFIG_TXT_BG_COLOR;
        return ReactComponentExtend.instantiateTag(NodeModules.antd.Button, props, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_HEIGHT]: 0,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.STYLE_MARGIN_AUTO,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: `${eleSize}px`,
                [MgrDomDefine.STYLE_WIDTH]: `${eleSize}px`,
                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                [MgrDomDefine.STYLE_LEFT]: `${-eleSize / 2}px`,
                [MgrDomDefine.STYLE_TOP]: `${-(IndexGlobal.IMG_MINI_SIZE / 2 + MgrDomDefine.CONFIG_NUMBER_SPACING)}px`,
            }
        }, imgInst)));
    }
}
(function (DomDrawingBoardLeftListImg) {
    class Args {
        init(dbImg, i, j) {
            this.dbImg = dbImg;
            this.i = i;
            this.j = j;
        }
    }
    Args.poolType = new ObjectPoolType({
        instantiate: () => new Args,
        onPop: null,
        onPush: null
    });
    DomDrawingBoardLeftListImg.Args = Args;
})(DomDrawingBoardLeftListImg || (DomDrawingBoardLeftListImg = {}));
export default DomDrawingBoardLeftListImg;
