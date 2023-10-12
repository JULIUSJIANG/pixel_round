import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebgl from "../common/JWebgl.js";
import JWebglColor from "../common/JWebglColor.js";
import JWebglEnum from "../common/JWebglEnum.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";


/**
 * 尝试更为灵魂的平滑
 */
class DomDrawingBoardRightPaintCanvasSource extends ReactComponentExtend <number> {

    /**
     * 3d canvas 引用器
     */
    canvasWebglRef = NodeModules.react.createRef();
    /**
     * 绘制用的辅助类
     */
    jWebgl: JWebgl;

    reactComponentExtendOnInit (): void {
        this.jWebgl = new JWebgl (this.canvasWebglRef.current);
        this.jWebgl.init ();
        this.jWebgl.canvasWebglCtx.disable (JWebglEnum.EnableCap.DEPTH_TEST);
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.ONE, JWebglEnum.BlendFunc.ZERO);

        this.jWebgl.evtTouchStart.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onStart (
                this.jWebgl.currentTouch.posCanvas [0],
                this.jWebgl.currentTouch.posCanvas [1]
            );
            MgrData.inst.callDataChange ();
        });
        this.jWebgl.evtTouchMove.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onMove (
                this.jWebgl.currentTouch.posCanvas [0],
                this.jWebgl.currentTouch.posCanvas [1]
            );
            MgrData.inst.callDataChange ();
        });
        this.jWebgl.evtTouchEnd.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onEnd (
                this.jWebgl.currentTouch.posCanvas [0],
                this.jWebgl.currentTouch.posCanvas [1]
            );
            MgrData.inst.callDataChange ();
        });
        this.jWebgl.evtEnter.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onHoverEnter ();
            MgrData.inst.callDataChange ();
        });
        this.jWebgl.evtLeave.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onHoverExit ();
            MgrData.inst.callDataChange ();
        });
    }

    reactComponentExtendOnRelease (): void {
        this.jWebgl.release ();
    }

    /**
     * 线的起始位置
     */
    posFrom = new JWebglMathVector4 (0, 0, 0);
    /**
     * 线的结束位置
     */
    posTo = new JWebglMathVector4 (0, 0, 0);
    
    /**
     * 准星颜色
     */
    colorMark = new JWebglColor ();

    reactComponentExtendOnDraw (): void {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache ();
        this.jWebgl.useFbo (null);
        this.jWebgl.clear ();

        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);

        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;
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
        this.colorMark.initByHex (MgrData.inst.get (MgrDataItem.DB_COLOR));
        IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onFocusDraw (this.jWebgl, this.colorMark);
    }

    /**
     * 绘制交叉线
     */
    static drawCross (jWebgl: JWebgl, colorMark: JWebglColor, unitOffset: number) {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache ();
        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;

        jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        jWebgl.refreshMat4Mvp ();
        jWebgl.programLine.uMvp.fill (jWebgl.mat4Mvp);

        let offset = canvasTextureUnit * unitOffset;
        let posFrom = objectPool.pop (JWebglMathVector4.poolType);
        let posTo = objectPool.pop (JWebglMathVector4.poolType);
        // 竖线 - 上
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + 1;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        posTo.elements [1] = cameraHeight;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 竖线 - 下
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        posFrom.elements [1] = 0;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXFloat + offset;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 横线 - 左
        posFrom.elements [0] = 0;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 横线 - 右
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + 1;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        posTo.elements [0] = cameraWidth;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        objectPool.push (posFrom, posTo);
    }

    /**
     * 绘制方块
     */
    static drawMark (jWebgl: JWebgl, colorMark: JWebglColor, unitOffset: number) {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache ();
        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;

        jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        jWebgl.refreshMat4Mvp ();
        jWebgl.programLine.uMvp.fill (jWebgl.mat4Mvp);

        // 【准星 - 方块】
        let offset = canvasTextureUnit * unitOffset;
        let posFrom = objectPool.pop (JWebglMathVector4.poolType);
        let posTo = objectPool.pop (JWebglMathVector4.poolType);
        // 线 - 左
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 线 - 上
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 线 - 右
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt - offset + 1;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 线 - 下
        posFrom.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt - offset + 1;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        posTo.elements [0] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridXInt + offset;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYInt + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        jWebgl.programLine.draw ();
    }

    /**
     * 绘制方块
     */
    static drawMark2 (
        jWebgl: JWebgl, 
        
        x: number, 
        y: number, 
        
        w: number, 
        h: number, 
        
        colorMark: JWebglColor, 
        unitOffset: number
    ) 
    {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache ();
        // 画布像素单位
        let canvasTextureUnit = 1 / (IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA);
        // 网格
        let cameraWidth = dataSrc.dbImgData.width;
        let cameraHeight = dataSrc.dbImgData.height;

        jWebgl.mat4V.setLookAt (
            cameraWidth / 2, cameraHeight / 2, 1,
            cameraWidth / 2, cameraHeight / 2, 0,
            0, 1, 0
        );
        jWebgl.mat4P.setOrtho (
            - cameraWidth / 2, cameraWidth / 2,
            - cameraHeight / 2, cameraHeight / 2,
            0, 2
        );
        jWebgl.refreshMat4Mvp ();
        jWebgl.programLine.uMvp.fill (jWebgl.mat4Mvp);

        // 【准星 - 方块】
        let offset = canvasTextureUnit * unitOffset;
        let posFrom = objectPool.pop (JWebglMathVector4.poolType);
        let posTo = objectPool.pop (JWebglMathVector4.poolType);
        // 线 - 左
        posFrom.elements [0] = x + offset;
        posFrom.elements [1] = y + offset;
        posTo.elements [0] = x + offset;
        posTo.elements [1] = y - offset + h;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 线 - 上
        posFrom.elements [0] = x + offset;
        posFrom.elements [1] = y - offset + h;
        posTo.elements [0] = x - offset + w;
        posTo.elements [1] = y - offset + h;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 线 - 右
        posFrom.elements [0] = x - offset + w;
        posFrom.elements [1] = y - offset + h;
        posTo.elements [0] = x - offset + w;
        posTo.elements [1] = y + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 线 - 下
        posFrom.elements [0] = x - offset + w;
        posFrom.elements [1] = y + offset;
        posTo.elements [0] = x + offset;
        posTo.elements [1] = y + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        jWebgl.programLine.draw ();
    }

    render (): ReactComponentExtendInstance {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard.getCurrentCache ();
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
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
                            [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.dbImgData.width * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                            [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.dbImgData.height * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
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
                                width: dataSrc.dbImgData.width * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                height: dataSrc.dbImgData.height * IndexGlobal.PIXEL_TEX_TO_SCREEN * IndexGlobal.ANTINA,
                                style: {
                                    [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.dbImgData.width * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.dbImgData.height * IndexGlobal.PIXEL_TEX_TO_SCREEN}px`,
                                    [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_BLOCK
                                }
                            }
                        )
                    )
                )
            ),
        );
    }
}

export default DomDrawingBoardRightPaintCanvasSource;