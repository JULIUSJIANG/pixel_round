import IndexGlobal from "../IndexGlobal";
import NodeModules from "../NodeModules";
import JWebgl from "../common/JWebgl";
import JWebglColor from "../common/JWebglColor";
import JWebglEnum from "../common/JWebglEnum";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer";
import JWebglMathMatrix4 from "../common/JWebglMathMatrix4";
import JWebglMathVector4 from "../common/JWebglMathVector4";
import JWebglTexture from "../common/JWebglTexture";
import objectPool from "../common/ObjectPool";
import ObjectPoolType from "../common/ObjectPoolType";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrDomDefine from "../mgr/MgrDomDefine";
import MgrSdk from "../mgr/MgrSdk";
import DomImageSmoothRS from "./DomImageSmoothRS";
import DomInputNumberApplicationHor from "./DomInputNumberApplicationHor";
import ViewRelativeRateRS from "./ViewRelativeRateRS";

/**
 * 线的深度
 */
const Z_GRID = 0.1;

/**
 * 尝试更为灵魂的平滑
 */
class DomImageSmooth extends ReactComponentExtend <DomImageSmooth.Args> {
    /**
     * 模型
     */
    mat4M = new JWebglMathMatrix4 ();
    /**
     * 视图
     */
    mat4V = new JWebglMathMatrix4 ();
    /**
     * 投影
     */
    mat4P = new JWebglMathMatrix4 ();
    /**
     * 模型 - 视图 - 投影
     */
    mat4Mvp = new JWebglMathMatrix4 ();

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef<HTMLCanvasElement>();
    /**
     * 绘制用的辅助类
     */
    jWebgl: JWebgl;
    /**
     * 范围引用器
     */
    tagDivRef = NodeModules.react.createRef<HTMLDivElement> ();
    /**
     * 源图纹理
     */
    texSrc: JWebglTexture;

    reactComponentExtendOnInit (): void {
        this.jWebgl = new JWebgl (this.canvasWebglRef.current);
        this.jWebgl.init ();
        this.jWebgl.listenTouch (this.tagDivRef.current);
        this.texSrc = this.jWebgl.createTexture ();

        // 准备好图片的 mvp 矩阵
        this.mat4M.setIdentity ();
        this.mat4V.setLookAt (
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
        this.mat4P.setOrtho (
            - 1, 1,
            - 1, 1,
              0, 2
        );
        JWebglMathMatrix4.multiplayMat4List (
            this.mat4P,
            this.mat4V,
            this.mat4M,
            this.mat4Mvp
        );

        this.jWebgl.evtTouchStart.on (() => {
            let canvasWidth = this.props.cacheTexWidth * IndexGlobal.smoothRS ().commonHorCount * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION);
            let canvasHeight = this.props.cacheTexHeight * IndexGlobal.smoothRS ().commonVerCount * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION);
            if (
                   this.jWebgl.currentTouch.posCanvas [0] < 0
                || canvasWidth < this.jWebgl.currentTouch.posCanvas [0] 
                || this.jWebgl.currentTouch.posCanvas [1] < 0
                || canvasHeight < this.jWebgl.currentTouch.posCanvas [1]
            )
            {
                return;
            };

            let touchX = Math.floor (this.jWebgl.currentTouch.posCanvas [0]);
            let touchY = Math.floor (this.jWebgl.currentTouch.posCanvas [1]);
            let gridX = Math.floor (touchX / MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION));
            let gridY = Math.floor (touchY / MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION));
            this.loadGridX (gridX, gridY);
        });
    }

    reactComponentExtendOnRelease (): void {
        this.jWebgl.release ();
    }

    /**
     * 格子位置 x
     */
    gridX: number = 0;
    /**
     * 格子位置 y
     */
    gridY: number = 0;
    /**
     * 载入格子位置
     * @param x 
     * @param y 
     */
    loadGridX (x: number, y: number) {
        if (x == this.gridX && y == this.gridY) {
            return;
        };
        this.gridX = x;
        this.gridY = y;
        // 刷新画面
        MgrData.inst.callDataChange ();
    }

    /**
     * 缓存了图片信息的帧缓冲区
     */
    fboTexture: JWebglFrameBuffer;
    /**
     * 存储了平坦信息的帧缓冲区，可由此确定部分情况的平滑颜色
     */
    fboFlat: JWebglFrameBuffer;
    /**
     * 存储了角信息的帧缓冲区
     */
    fboCornerData: JWebglFrameBuffer;
    /**
     * 存储了角信息的帧缓冲区 - 备份
     */
    fboCornerDataCache: JWebglFrameBuffer;
    /**
     * 存储了平滑类型的帧缓冲区
     */
    fboEnumData: JWebglFrameBuffer;
    /**
     * 存储了平滑类型的帧缓冲区
     */
    fboEnumDataCache: JWebglFrameBuffer;

    /**
     * 缓存了
     */
    fboDisplay: JWebglFrameBuffer;
    /**
     * 导出专用缓冲区
     */
    fboExport: JWebglFrameBuffer;

    /**
     * 图片位置
     */
    posImg = new JWebglMathVector4 ();

    /**
     * 线的起始位置
     */
    posFrom = new JWebglMathVector4 (0, 0, Z_GRID);
    /**
     * 线的结束位置
     */
    posTo = new JWebglMathVector4 (0, 0, Z_GRID);

    /**
     * 准星颜色
     */
    colorFocus = new JWebglColor (1, 0, 0, 1);

    reactComponentExtendOnDraw (): void {
        // 图片没加载完毕，什么也别动
        if (this.props.imgBin == null) {
            this.jWebgl.useFbo (null);
            this.jWebgl.clear ();
            return;
        };

        // 绘制 fbo
        if (this.fboTexture == null || this.fboTexture.width != this.props.cacheTexWidth || this.fboTexture.height != this.props.cacheTexHeight) {
            this.jWebgl.destroyFbo (this.fboTexture);
            this.fboTexture = this.jWebgl.getFbo (this.props.cacheTexWidth, this.props.cacheTexHeight, JWebglEnum.TexParameteriParam.NEAREST);
            this.jWebgl.destroyFbo (this.fboFlat);
            this.fboFlat = this.jWebgl.getFbo (this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2, JWebglEnum.TexParameteriParam.NEAREST);

            this.jWebgl.destroyFbo (this.fboCornerData);
            this.fboCornerData = this.jWebgl.getFbo (this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2, JWebglEnum.TexParameteriParam.NEAREST);
            this.jWebgl.destroyFbo (this.fboCornerDataCache);
            this.fboCornerDataCache = this.jWebgl.getFbo (this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2, JWebglEnum.TexParameteriParam.NEAREST);
            
            this.jWebgl.destroyFbo (this.fboEnumData);
            this.fboEnumData = this.jWebgl.getFbo (this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2, JWebglEnum.TexParameteriParam.NEAREST);
            this.jWebgl.destroyFbo (this.fboEnumDataCache);
            this.fboEnumDataCache = this.jWebgl.getFbo (this.props.cacheTexWidth * 2, this.props.cacheTexHeight * 2, JWebglEnum.TexParameteriParam.NEAREST);
        };

        let fboDisplayWidth = this.props.cacheTexWidth * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA;
        let fboDisplayHeight = this.props.cacheTexHeight * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA;
        if (this.fboDisplay == null || this.fboDisplay.width != fboDisplayWidth || this.fboDisplay.height != fboDisplayHeight) {
            this.jWebgl.destroyFbo (this.fboDisplay);
            this.fboDisplay = this.jWebgl.getFbo (fboDisplayWidth, fboDisplayHeight, JWebglEnum.TexParameteriParam.LINEAR);
            this.fboExport = this.jWebgl.getFbo (
                this.props.cacheTexWidth * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION),
                this.props.cacheTexHeight * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION),
                JWebglEnum.TexParameteriParam.LINEAR
            );
        };

        // 清除所有
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();
        this.jWebgl.useFbo (this.fboEnumData);
        this.jWebgl.clear ();

        // 得到要处理的源纹理
        this.step0Texture ();
        // 对于每个像素点按照 4 个角分成 4 个像素，每个像素的 r、g 分别记录左、右边界是否平坦
        this.step0Flat ();

        // 根据平坦情况，确定哪些角需要进行平滑，且确定平滑的颜色取该角的哪一方
        this.step1CornerData (1, 0);
        // 剔除明显多余的平滑
        this.step2CornerRemA (2, 0);
        // 剔除交叉平滑
        this.step3CornerRemX (3, 0);
        // 剔除 3 向相邻平滑
        this.step4CornerRemT (4, 0);
        // 剔除 2 向相邻平滑
        this.step5CornerRemI (5, 0);
        // 扩大平滑距离，让更倾斜的线看起来也自然
        this.step6EnumSide (6, 0);

        IndexGlobal.smoothRS ().dbFinally (this);

        // 网格
        this.jWebgl.useFbo (null);
        let cameraWidth = this.props.cacheTexWidth * IndexGlobal.smoothRS ().commonHorCount;
        let cameraHeight = this.props.cacheTexHeight * IndexGlobal.smoothRS ().commonVerCount;
        this.jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        this.jWebgl.refreshMat4Mvp ();
        this.jWebgl.programLine.uMvp.fill (this.jWebgl.mat4Mvp);
        let colorGrid = JWebglColor.COLOR_BLACK;
        for (let i = 0; i <= cameraWidth; i++) {
            if (i != 0 && i != cameraWidth && !MgrData.inst.get (MgrDataItem.SMOOTH_DRAW_GRID)) {
                continue;
            };
            this.posFrom.elements [0] = i;
            this.posFrom.elements [1] = 0;
            this.posTo.elements [0] = i;
            this.posTo.elements [1] = cameraHeight;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        this.jWebgl.programLine.draw ();
        for (let i = 0; i <= cameraHeight; i++) {
            if (i != 0 && i != cameraHeight && !MgrData.inst.get (MgrDataItem.SMOOTH_DRAW_GRID)) {
                continue;
            };
            this.posFrom.elements [0] = 0;
            this.posFrom.elements [1] = i;
            this.posTo.elements [0] = cameraWidth;
            this.posTo.elements [1] = i;
            this.jWebgl.programLine.add (
                this.posFrom,
                colorGrid,
                this.posTo,
                colorGrid
            );
        };
        this.jWebgl.programLine.draw ();

        // 绘制准星
        IndexGlobal.smoothRS ().expDrawFocus (this);
    }

    /**
     * 准备好源纹理
     */
    step0Texture () {
        // 得到简略图
        DomImageSmooth.Args.drawImgPadding (this.props, this.jWebgl, this.fboTexture, this.texSrc);
        // 原图
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboTexture, 0, 0);
    }

    /**
     * 源纹理 -> 平坦纹理
     */
    step0Flat () {
        // 各个角的数据
        this.jWebgl.useFbo (this.fboFlat);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothFlat.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothFlat.uTexture.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothFlat.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothFlat.uRight.fill (1);
        this.jWebgl.programSmoothFlat.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothFlat.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboFlat, 0, 1);
    }

    /**
     * 源纹理 -> 角数据纹理
     */
    step1CornerData (posX: number, posY: number) {
        // 各个角的数据
        this.jWebgl.useFbo (this.fboCornerData);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerData.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerData.uTextureMain.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothCornerData.uTextureFlat.fillByFbo (this.fboFlat);
        this.jWebgl.programSmoothCornerData.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerData.uRight.fill (1);
        this.jWebgl.programSmoothCornerData.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerData.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboCornerData, posX, posY + 1);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }

    /**
     * 剔除 A 平滑
     */
    step2CornerRemA (posX: number, posY: number) {
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveA.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveA.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveA.uTextureMain.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveA.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveA.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveA.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveA.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo (this.fboCornerData, this.fboCornerDataCache);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }

    /**
     * 剔除 X 平滑
     */
    step3CornerRemX (posX: number, posY: number) {
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveX.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveX.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveX.uTextureMain.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveX.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveX.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveX.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveX.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo (this.fboCornerData, this.fboCornerDataCache);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }

    /**
     * 剔除 T 平滑
     */
    step4CornerRemT (posX: number, posY: number) {
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveT.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveT.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveT.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveT.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveT.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveT.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo (this.fboCornerData, this.fboCornerDataCache);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }

    /**
     * 剔除 I 平滑
     */
    step5CornerRemI (posX: number, posY: number) {
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveI.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveI.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveI.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveI.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveI.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveI.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo (this.fboCornerData, this.fboCornerDataCache);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }
    
    /**
     * 剔除尖锐平滑
     */
    step6CornerRemV (posX: number, posY: number) {
        this.jWebgl.useFbo (this.fboCornerDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothCornerRemoveV.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothCornerRemoveV.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothCornerRemoveV.uTextureMain.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothCornerRemoveV.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothCornerRemoveV.uRight.fill (1);
        this.jWebgl.programSmoothCornerRemoveV.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothCornerRemoveV.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboCornerDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo (this.fboCornerData, this.fboCornerDataCache);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }

    /**
     * 平滑数据纹理 -> 平滑数据纹理
     */
    step6EnumSide (posX: number, posY: number) {
        this.jWebgl.useFbo (this.fboEnumDataCache);
        this.jWebgl.clear ();
        this.jWebgl.programSmoothEnumSide.uMvp.fill (this.mat4Mvp);
        this.jWebgl.programSmoothEnumSide.uTextureSize.fill (this.props.cacheTexWidth, this.props.cacheTexHeight);
        this.jWebgl.programSmoothEnumSide.uTextureMain.fillByFbo (this.fboTexture);
        this.jWebgl.programSmoothEnumSide.uTextureCorner.fillByFbo (this.fboCornerData);
        this.jWebgl.programSmoothEnumSide.uTextureEnum.fillByFbo (this.fboEnumData);
        this.jWebgl.programSmoothEnumSide.uRight.fill (1);
        this.jWebgl.programSmoothEnumSide.add (
            JWebglMathVector4.centerO,
            JWebglMathVector4.axisZStart,
            JWebglMathVector4.axisYEnd,
            2,
            2
        );
        this.jWebgl.programSmoothEnumSide.draw ();
        IndexGlobal.smoothRS ().expDrawFbo (this, this.fboEnumDataCache, posX, posY + 1);
        this.jWebgl.fillFboByFbo (this.fboEnumData, this.fboEnumDataCache);
        IndexGlobal.smoothRS ().expSmoothOrdinaryTo (this, posX, posY + 0);
    }

    private listChildren = new Array <ReactComponentExtendInstance> ();

    render (): ReactComponentExtendInstance {
        let relativeRS = ViewRelativeRateRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.VIEW_RELATIVE_RATE));
        let propsBtnGrid = {
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            },
            onClick: () => {
                MgrData.inst.set (MgrDataItem.SMOOTH_DRAW_GRID, !MgrData.inst.get (MgrDataItem.SMOOTH_DRAW_GRID));
                MgrData.inst.callDataChange ();
            }
        };
        if (MgrData.inst.get (MgrDataItem.SMOOTH_DRAW_GRID)) {
            propsBtnGrid [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        };

        this.listChildren.length = 0;
        for (let i = 0; i < DomImageSmoothRS.listInst.length; i++) {
            let listInstI = DomImageSmoothRS.listInst [i];
            let propsBtn = {
                style: {
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                },
                onClick: () => {
                    if (MgrData.inst.get (MgrDataItem.SMOOTH_RS) == listInstI.id) {
                        return;
                    };
                    MgrData.inst.set (MgrDataItem.SMOOTH_RS, listInstI.id);
                    MgrData.inst.callDataChange ();
                },
            };
            if (listInstI.id == MgrData.inst.get (MgrDataItem.SMOOTH_RS)) {
                propsBtn [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
            };
            this.listChildren.push (ReactComponentExtend.instantiateTag (
                NodeModules.antd.Button,
                propsBtn,

                listInstI.name
            ));
        };
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: relativeRS.rateRight,

                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                    [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                }
            },

            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    ref: this.tagDivRef,
                    style: {
                        [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                        [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                        [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                        [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
    
                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN
                    }
                },
    
                // 滚动视图的遮罩
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_HEIGHT]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                            [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            [MgrDomDefine.STYLE_PADDING_RIGHT]: MgrDomDefine.CONFIG_TXT_SPACING,
                            [MgrDomDefine.STYLE_PADDING_BOTTOM]: MgrDomDefine.CONFIG_TXT_SPACING,
    
                            [MgrDomDefine.STYLE_OVERFLOW_X]: MgrDomDefine.STYLE_OVERFLOW_X_SCROLL,
                            [MgrDomDefine.STYLE_OVERFLOW_Y]: MgrDomDefine.STYLE_OVERFLOW_Y_SCROLL
                        }
                    },
    
                    // 滚动的列表
                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_WIDTH]: `${this.props.cacheTexWidth * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.smoothRS ().commonHorCount}px`,
                                [MgrDomDefine.STYLE_HEIGHT]: `${this.props.cacheTexHeight * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.smoothRS ().commonVerCount}px`,
                                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                            }
                        },
                    
                        ReactComponentExtend.instantiateTag (
                            MgrDomDefine.TAG_DIV,
                            {
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: 0,
                                    [MgrDomDefine.STYLE_HEIGHT]: 0,
                                    [MgrDomDefine.STYLE_POSITION]: MgrDomDefine.STYLE_POSITION_RELATIVE,
                                    [MgrDomDefine.STYLE_LEFT]: 0,
                                    [MgrDomDefine.STYLE_TOP]: 0,
                                }
                            },
                        
                            ReactComponentExtend.instantiateTag (
                                MgrDomDefine.TAG_CANVAS,
                                {
                                    ref: this.canvasWebglRef,
                                    width: this.props.cacheTexWidth * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.smoothRS ().commonHorCount * IndexGlobal.ANTINA,
                                    height: this.props.cacheTexHeight * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.smoothRS ().commonVerCount * IndexGlobal.ANTINA,
                                    style: {
                                        [MgrDomDefine.STYLE_WIDTH]: `${this.props.cacheTexWidth * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.smoothRS ().commonHorCount}px`,
                                        [MgrDomDefine.STYLE_HEIGHT]: `${this.props.cacheTexHeight * MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.smoothRS ().commonVerCount}px`,
                                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                    }
                                }
                            )
                        )
                    )
                ),
            ),

            // 控制栏
            ReactComponentExtend.instantiateTag (
                MgrDomDefine.TAG_DIV,
                {
                    style: {
                        [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                        [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW
                    }
                },

                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_FLEX_GROW]: 0,

                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                        }
                    },

                    ReactComponentExtend.instantiateComponent (
                        DomInputNumberApplicationHor,
                        DomInputNumberApplicationHor.Args.create (
                            `像素尺寸 1 : ${MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION)}`,
                            MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP),
                            null,
                            null,
                            (val) => {
                                MgrData.inst.set (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP, val);
                            },
                            () => {
                                if (MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP) < IndexGlobal.DB_PIXEL_TO_SCREEN_MIN || IndexGlobal.DB_PIXEL_TO_SCREEN_MAX < MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP)) {
                                    NodeModules.antd.message.error(`比值范围为 ${IndexGlobal.DB_PIXEL_TO_SCREEN_MIN} - ${IndexGlobal.DB_PIXEL_TO_SCREEN_MAX}，当前为 ${MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP)}`);
                                    return;
                                };
                                MgrData.inst.set (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_APPLICATION, MgrData.inst.get (MgrDataItem.SMOOTH_PIXEL_TO_SCREEN_TEMP));
                            }
                        ),
                    ),
                ),

                // 操作栏
                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_NUMBER_HALF_SPACING,
                            [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_NUMBER_HALF_SPACING,
                            [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                        },
                    },

                    ...this.listChildren,
                ),

                ReactComponentExtend.instantiateTag (
                    MgrDomDefine.TAG_DIV,
                    {
                        style: {
                            [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                            [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_NUMBER_HALF_SPACING,
                            [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_NUMBER_HALF_SPACING,
                            [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,

                            [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                            [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                        }
                    },
                    ReactComponentExtend.instantiateTag (
                        MgrDomDefine.TAG_DIV,
                        {
                            style: {
                                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                            }
                        },

                        ReactComponentExtend.instantiateTag (
                            NodeModules.antd.Button,
                            propsBtnGrid,
            
                            `显示网格`
                        ),
                    ),
                    ReactComponentExtend.instantiateTag (
                        NodeModules.antd.Button,
                        {
                            style: {
                                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                            },
                            onClick: () => {
                                this.jWebgl.fillFboByFbo (this.fboExport, this.fboDisplay);
                                MgrSdk.inst.core.saveFile (
                                    `image.png`,
                                    this.fboExport.toBase64 ()
                                );
                            }
                        },
        
                        `导出 png`
                    ),
                ),
            ),
        );
    }
}

namespace DomImageSmooth {

    export class Args {
        /**
         * 要平滑的图
         */
        imgBin: Uint8Array;

        /**
         * 预估的图片宽度
         */
        imgWidth: number;
        /**
         * 预估的图片高度
         */
        imgHeight: number;

        /**
         * 内边距 - 上
         */
        paddingTop: number;
        /**
         * 内边距 - 右
         */
        paddingRight: number;
        /**
         * 内边距 - 下
         */
        paddingBottom: number;
        /**
         * 内边距 - 左
         */
        paddingLeft: number;

        /**
         * 像素尺寸 - 宽
         */
        pixelSizeWidth: number;
        /**
         * 像素尺寸 - 高
         */
        pixelSizeHeight: number;

        /**
         * 附带内边距后的宽度
         */
        cachePaddingWidth: number;
        /**
         * 附带内边距后的高度
         */
        cachePaddingHeight: number;

        /**
         * 最终要处理的图片宽度
         */
        cacheTexWidth: number;
        /**
         * 最终要处理的图片高度
         */
        cacheTexHeight: number;

        /**
         * 构造实例
         * @param rs 
         * @param imgBin 
         * @param imgWidth 
         * @param imgHeight 
         * @param paddingTop 
         * @param paddingRight 
         * @param paddingBottom 
         * @param paddingLeft 
         * @param pixelSizeWidth 
         * @param pixelSizeHeight 
         * @returns 
         */
        static create (
            imgBin: Uint8Array,

            imgWidth: number,
            imgHeight: number,

            paddingTop: number,
            paddingRight: number,
            paddingBottom: number,
            paddingLeft: number,

            pixelSizeWidth: number,
            pixelSizeHeight: number
        ) 
        {
            let inst = objectPool.pop (this.poolType);
            inst.init (
                imgBin,

                imgWidth,
                imgHeight,

                paddingTop,
                paddingRight,
                paddingBottom,
                paddingLeft,

                pixelSizeWidth,
                pixelSizeHeight
            );
            return inst;
        }

        /**
         * 克隆
         * @returns 
         */
        clone () {
            return DomImageSmooth.Args.create (
                this.imgBin,

                this.imgWidth,
                this.imgHeight,

                this.paddingTop,
                this.paddingRight,
                this.paddingBottom,
                this.paddingLeft,

                this.pixelSizeWidth,
                this.pixelSizeHeight,
            );
        }

        /**
         * 构造实例
         * @param rs 
         * @param imgBin 
         * @param imgWidth 
         * @param imgHeight 
         * @param paddingTop 
         * @param paddingRight 
         * @param paddingBottom 
         * @param paddingLeft 
         * @param pixelSizeWidth 
         * @param pixelSizeHeight 
         * @returns 
         */
        init (
            imgBin: Uint8Array,

            imgWidth: number,
            imgHeight: number,

            paddingTop: number,
            paddingRight: number,
            paddingBottom: number,
            paddingLeft: number,

            pixelSizeWidth: number,
            pixelSizeHeight: number
        ) 
        {
            this.imgBin = imgBin;

            // 如果已经加载完毕，那当然采纳真实的数据
            this.imgWidth = imgWidth;
            this.imgHeight = imgHeight;

            this.paddingTop = paddingTop;
            this.paddingRight = paddingRight;
            this.paddingBottom = paddingBottom;
            this.paddingLeft = paddingLeft;

            this.pixelSizeWidth = pixelSizeWidth;
            this.pixelSizeHeight = pixelSizeHeight;

            this.cachePaddingWidth = this.paddingLeft + this.imgWidth + this.paddingRight;
            this.cachePaddingHeight = this.paddingTop + this.imgHeight + this.paddingBottom;

            this.cacheTexWidth = Math.ceil (this.cachePaddingWidth / this.pixelSizeWidth);
            this.cacheTexHeight = Math.ceil (this.cachePaddingHeight / this.pixelSizeHeight);
        }

        /**
         * 绘制出要处理的图片
         * @param jWebgl 
         * @param fbo 
         */
        static drawImgPadding (self: DomImageSmooth.Args, jWebgl: JWebgl, fbo: JWebglFrameBuffer, texSrc: JWebglTexture) {
            jWebgl.useFbo (fbo);
            jWebgl.clear ();
    
            jWebgl.mat4M.setIdentity ();
            jWebgl.mat4V.setLookAt(
                self.cachePaddingWidth / 2, self.cachePaddingHeight / 2, 1,
                self.cachePaddingWidth / 2, self.cachePaddingHeight / 2, 0,
                0, 1, 0
            );
            jWebgl.mat4P.setOrtho (
                -self.cachePaddingWidth / 2, self.cachePaddingWidth / 2,
                -self.cachePaddingHeight / 2, self.cachePaddingHeight / 2,
                0, 2
            );
            JWebglMathMatrix4.multiplayMat4List (
                jWebgl.mat4P,
                jWebgl.mat4V,
                jWebgl.mat4M,
                jWebgl.mat4Mvp
            );
    
            // 图片
            jWebgl.programImg.uMvp.fill (jWebgl.mat4Mvp);
            texSrc.fillByUint8Array (self.imgBin, self.imgWidth, self.imgHeight, 0);
            jWebgl.programImg.uTexture.fillByTexture (texSrc.texture);
            let posImg = JWebglMathVector4.create (self.imgWidth / 2 + self.paddingLeft, self.imgHeight / 2 + self.paddingBottom, 0);
            jWebgl.programImg.add (
                posImg,
                JWebglMathVector4.axisZStart,
                JWebglMathVector4.axisYEnd,
                self.imgWidth,
                self.imgHeight
            );
            objectPool.push (posImg);
            jWebgl.programImg.draw ();
        }

        /**
         * 对象池类型
         */
        static poolType = new ObjectPoolType ({
            instantiate: () => {
                return new Args ();
            },
            onPop: null,
            onPush: null
        });
    }
}

export default DomImageSmooth;