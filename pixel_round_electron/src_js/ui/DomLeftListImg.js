import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import ObjectPoolType from "../common/ObjectPoolType.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
class DomLeftListImg extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        /**
         * 3d canvas 引用器
         */
        this.canvasWebglRef = NodeModules.react.createRef();
        this.mat4M = new JWebglMathMatrix4();
        this.mat4V = new JWebglMathMatrix4();
        this.mat4P = new JWebglMathMatrix4();
    }
    reactComponentExtendOnInit() {
        this.jWebgl = new JWebgl(this.canvasWebglRef.current);
        this.jWebgl.init();
        this.mat4M.setIdentity();
        this.mat4V.setLookAt(0, 0, 1, 0, 0, 0, 0, 1, 0);
    }
    reactComponentExtendOnDraw() {
        let img = this.jWebgl.getImg(this.props.imgData.dataOrigin);
        // 没加载完，不画
        if (img.currStatus != img.statusFinished) {
            return;
        }
        ;
        // 清除画面
        this.jWebgl.clear();
        this.mat4P.setOrtho(-IndexGlobal.IMG_MINI_SIZE / 2, IndexGlobal.IMG_MINI_SIZE / 2, -IndexGlobal.IMG_MINI_SIZE / 2, IndexGlobal.IMG_MINI_SIZE / 2, 0, 2);
        JWebglMathMatrix4.multiplayMat4List(this.mat4P, this.mat4V, this.mat4M, this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uMvp.fill(this.jWebgl.mat4Mvp);
        this.jWebgl.programImg.uSampler.fill(this.jWebgl.getImg(this.props.imgData.dataOrigin));
        let imgWidth = IndexGlobal.IMG_MINI_SIZE;
        let imgHeight = IndexGlobal.IMG_MINI_SIZE;
        // 高瘦型，适应高度
        if (img.assetsImg.image.width < img.assetsImg.image.height) {
            imgWidth = imgHeight * img.assetsImg.image.width / img.assetsImg.image.height;
        }
        ;
        // 矮胖型，适应宽度
        if (img.assetsImg.image.height < img.assetsImg.image.width) {
            imgHeight = imgWidth * img.assetsImg.image.height / img.assetsImg.image.width;
        }
        ;
        this.jWebgl.programImg.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, imgWidth, imgHeight);
        this.jWebgl.programImg.draw();
    }
    render() {
        let eleWidth = IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2;
        if (this.props.j == 0 && MgrData.inst.get(MgrDataItem.LIST_IMG_DATA).length == this.props.i + 1) {
            eleWidth *= 2;
            eleWidth += MgrDomDefine.CONFIG_NUMBER_SPACING * 3;
        }
        ;
        let props = {
            onClick: () => {
            },
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 4}px`
            }
        };
        if (this.props.j != 0) {
            props.style[MgrDomDefine.STYLE_MARGIN_LEFT] = MgrDomDefine.CONFIG_TXT_SPACING;
        }
        ;
        return ReactComponentExtend.instantiateTag(NodeModules.antd.Button, props, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: 0,
                [MgrDomDefine.STYLE_HEIGHT]: 0,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.STYLE_MARGIN_AUTO,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.IMG_MINI_SIZE + MgrDomDefine.CONFIG_NUMBER_SPACING * 2}px`,
                [MgrDomDefine.STYLE_WIDTH]: `${eleWidth}px`,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                [MgrDomDefine.STYLE_LEFT]: `${-eleWidth / 2}px`,
                [MgrDomDefine.STYLE_TOP]: `${-(IndexGlobal.IMG_MINI_SIZE / 2 + MgrDomDefine.CONFIG_NUMBER_SPACING)}px`,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_CANVAS, {
            ref: this.canvasWebglRef,
            width: IndexGlobal.IMG_MINI_SIZE,
            height: IndexGlobal.IMG_MINI_SIZE,
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `${IndexGlobal.IMG_MINI_SIZE}px`,
                [MgrDomDefine.STYLE_HEIGHT]: `${IndexGlobal.IMG_MINI_SIZE}px`,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_SPACING
            }
        }))));
    }
}
(function (DomLeftListImg) {
    class Args {
        init(imgData, i, j) {
            this.imgData = imgData;
            this.i = i;
            this.j = j;
        }
    }
    Args.poolType = new ObjectPoolType({
        instantiate: () => new Args,
        onPop: null,
        onPush: null
    });
    DomLeftListImg.Args = Args;
})(DomLeftListImg || (DomLeftListImg = {}));
export default DomLeftListImg;
