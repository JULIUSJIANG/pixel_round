import IndexGlobal from "../IndexGlobal";
import NodeModules from "../NodeModules";
import JWebgl from "../common/JWebgl";
import JWebglColor from "../common/JWebglColor";
import JWebglEnum from "../common/JWebglEnum";
import JWebglFrameBuffer from "../common/JWebglFrameBuffer";
import JWebglMathVector4 from "../common/JWebglMathVector4";
import JWebglTexture from "../common/JWebglTexture";
import objectPool from "../common/ObjectPool";
import ReactComponentExtend from "../common/ReactComponentExtend";
import ReactComponentExtendInstance from "../common/ReactComponentExtendInstance";
import MgrData from "../mgr/MgrData";
import MgrDataItem from "../mgr/MgrDataItem";
import MgrDomDefine from "../mgr/MgrDomDefine";
import MgrSdk from "../mgr/MgrSdk";
import DomInputNumberApplicationHor from "./DomInputNumberApplicationHor";
import ViewRelativeRateRS from "./ViewRelativeRateRS";

/**
 * 尝试更为灵魂的平滑
 */
class DomDrawingBoardRightPaintCanvas extends ReactComponentExtend <number> {

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
     * 纯色帧缓冲区
     */
    fboPure: JWebglFrameBuffer;

    /**
     * 空的帧缓冲区
     */
    fboEmpty: JWebglFrameBuffer;

    /**
     * 当前已确定的内容
     */
    fboCache: JWebglFrameBuffer;

    /**
     * 作为屏幕的帧缓冲区
     */
    fboScreen: JWebglFrameBuffer;

    /**
     * 主要纹理
     */
    textureMain: JWebglTexture;

    reactComponentExtendOnInit (): void {
        this.jWebgl = new JWebgl (this.canvasWebglRef.current);
        this.jWebgl.init ();
        this.jWebgl.listenTouch (this.tagDivRef.current);
        this.jWebgl.canvasWebglCtx.disable (JWebglEnum.EnableCap.DEPTH_TEST);
        this.jWebgl.canvasWebglCtx.blendFunc (JWebglEnum.BlendFunc.ONE, JWebglEnum.BlendFunc.ZERO);
        this.textureMain = this.jWebgl.createTexture ();
        // 纯色缓冲区
        this.fboPure = this.jWebgl.getFbo (1, 1);
        // 空的帧缓冲区
        this.fboEmpty = this.jWebgl.getFbo (1, 1);

        this.jWebgl.evtTouchStart.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchPosStart.fill (this.jWebgl.touchStart.posCanvas [0], this.jWebgl.touchStart.posCanvas [1]);
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchPosStart;
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onStart (this);
            MgrData.inst.callDataChange ();
        });
        this.jWebgl.evtTouchMove.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onHoverEnter ();
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchPosMove.fill (this.jWebgl.touchMove.posCanvas [0], this.jWebgl.touchMove.posCanvas [1]);
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchPosMove;
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onMove (this);
            MgrData.inst.callDataChange ();
        });
        this.jWebgl.evtTouchEnd.on (() => {
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchPosEnd.fill (this.jWebgl.touchEnd.posCanvas [0], this.jWebgl.touchEnd.posCanvas [1]);
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchPosEnd;
            IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrStatus.onEnd (this);
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
        // 记录下来，后续要用
        IndexGlobal.inst.mcRoot.statusDrawingBoard.catchDom (this);

        // 获取当前要操作的目标
        let dataSrc = IndexGlobal.inst.dbCurrent ();

        // 画笔颜色
        this.colorMark.initByHex (MgrData.inst.get (MgrDataItem.DB_COLOR));

        // 确保缓冲区存在
        if (this.fboCache == null || this.fboCache.width != dataSrc.dbImgData.width || this.fboCache.height != dataSrc.dbImgData.height) {
            this.fboCache = this.jWebgl.getFbo (dataSrc.dbImgData.width, dataSrc.dbImgData.height);
        };
        let screenWidth = dataSrc.dbImgData.width * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA;
        let screenHeight = dataSrc.dbImgData.height * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA;
        if (this.fboScreen == null || this.fboScreen.width != screenWidth || this.fboScreen.height != screenHeight) {
            this.fboScreen = this.jWebgl.getFbo (screenWidth, screenHeight);
        };

        // 准备好颜色
        this.jWebgl.useFbo (this.fboPure);
        this.jWebgl.clear ();
        this.jWebgl.mat4V.setLookAt (
            0, 0, 1,
            0, 0, 0,
            0, 1, 0
        );
        this.jWebgl.mat4P.setOrtho (
            - 0.5, 0.5,
            - 0.5, 0.5,
            0, 2
        );
        this.jWebgl.refreshMat4Mvp ();
        this.jWebgl.programPoint.uMvp.fill (this.jWebgl.mat4Mvp);
        this.jWebgl.programPoint.uColor.fill (this.colorMark.data01);
        this.jWebgl.programPoint.uSize.fill (1);
        this.jWebgl.programPoint.add (JWebglMathVector4.centerO);
        this.jWebgl.programPoint.draw ();

        // 同步数据到缓冲区
        this.textureMain.fillByUint8Array (dataSrc.statusCurrent ().dataBin.bin, dataSrc.statusCurrent ().width, dataSrc.statusCurrent ().height, 0);
        this.jWebgl.fillFboByTex (this.fboCache, this.textureMain.texture);

        // 先绘制已确定的内容
        this.jWebgl.fillFboByFbo (this.fboScreen, this.fboCache);
        this.jWebgl.fillFboByFbo (null, this.fboScreen);

        // 绘制操作相关的东西
        IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onOpUpdate (this);

        // 网格
        this.jWebgl.useFbo (null);
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
        for (let i = 0; i <= cameraWidth; i++) {
            if (i != 0 && i != cameraWidth && !MgrData.inst.get (MgrDataItem.DB_DRAW_GRID)) {
                continue;
            };
            let colorGrid = i % 2 == 0 ? JWebglColor.COLOR_BLACK : JWebglColor.COLOR_GREY;
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
            if (i != 0 && i != cameraHeight && !MgrData.inst.get (MgrDataItem.DB_DRAW_GRID)) {
                continue;
            };
            let colorGrid = i % 2 == 0 ? JWebglColor.COLOR_BLACK : JWebglColor.COLOR_GREY;
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
        IndexGlobal.inst.mcRoot.statusDrawingBoard.hoverCurrStatus.onFocusDraw (this);
    }

    /**
     * 绘制交叉线
     */
    static drawCross (jWebgl: JWebgl, x: number, y: number, w: number, h: number, colorMark: JWebglColor) {
        this.doDrawCross (jWebgl, x, y, w, h, colorMark, -1);
        this.doDrawCross (jWebgl, x, y, w, h, colorMark, 0);
        this.doDrawCross (jWebgl, x, y, w, h, colorMark, 1);
    }

    /**
     * 绘制交叉线
     */
    private static doDrawCross (jWebgl: JWebgl, x: number, y: number, w: number, h: number, colorMark: JWebglColor, unitOffset: number) {
        let dataSrc = IndexGlobal.inst.dbCurrent ();;
        // 画布像素单位
        let canvasTextureUnit = 1 / (MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA);
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
        posFrom.elements [1] = y + h;
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
        posTo.elements [1] = y;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 横线 - 左
        posFrom.elements [0] = 0;
        posFrom.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        posTo.elements [0] = x;
        posTo.elements [1] = IndexGlobal.inst.mcRoot.statusDrawingBoard.touchCurrentPos.gridYFloat + offset;
        jWebgl.programLine.add (
            posFrom,
            colorMark,
            posTo,
            colorMark
        );
        // 横线 - 右
        posFrom.elements [0] = x + w;
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

    static drawMark (
        jWebgl: JWebgl, 
        
        x: number, 
        y: number, 
        
        w: number, 
        h: number, 
        
        colorMark: JWebglColor
    )
    {
        this.doDrawMark (jWebgl, x, y, w, h, colorMark, -1);
        this.doDrawMark (jWebgl, x, y, w, h, colorMark, 0);
        this.doDrawMark (jWebgl, x, y, w, h, colorMark, 1);
    }

    /**
     * 绘制方块
     */
    private static doDrawMark (
        jWebgl: JWebgl, 
        
        x: number, 
        y: number, 
        
        w: number, 
        h: number, 
        
        colorMark: JWebglColor, 
        unitOffset: number
    ) 
    {
        let dataSrc = IndexGlobal.inst.dbCurrent ();;
        // 画布像素单位
        let canvasTextureUnit = 1 / (MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA);
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
        let relativeRS = ViewRelativeRateRS.mapIdToInst.get (MgrData.inst.get (MgrDataItem.VIEW_RELATIVE_RATE));
        let dataSrc = IndexGlobal.inst.dbCurrent ();;
        let propsBtnGrid = {
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            },
            onClick: () => {
                MgrData.inst.set (MgrDataItem.DB_DRAW_GRID, !MgrData.inst.get (MgrDataItem.DB_DRAW_GRID));
                MgrData.inst.callDataChange ();
            }
        };
        if (MgrData.inst.get (MgrDataItem.DB_DRAW_GRID)) {
            propsBtnGrid [MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
        };
        return ReactComponentExtend.instantiateTag (
            MgrDomDefine.TAG_DIV,
            {
                style: {
                    [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_HEIGHT_PERCENTAGE_0,
                    [MgrDomDefine.STYLE_FLEX_GROW]: relativeRS.rateLeft,

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
                                [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.dbImgData.width * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}px`,
                                [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.dbImgData.height * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}px`,
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
                                    width: dataSrc.dbImgData.width * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA,
                                    height: dataSrc.dbImgData.height * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION) * IndexGlobal.ANTINA,
                                    style: {
                                        [MgrDomDefine.STYLE_WIDTH]: `${dataSrc.dbImgData.width * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}px`,
                                        [MgrDomDefine.STYLE_HEIGHT]: `${dataSrc.dbImgData.height * MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}px`,
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
                            `像素尺寸 1 : ${MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION)}`,
                            MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP),
                            null,
                            null,
                            (val) => {
                                MgrData.inst.set (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP, val);
                            },
                            () => {
                                if (MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP) < IndexGlobal.DB_PIXEL_TO_SCREEN_MIN || IndexGlobal.DB_PIXEL_TO_SCREEN_MAX < MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP)) {
                                    NodeModules.antd.message.error(`比值范围为 ${IndexGlobal.DB_PIXEL_TO_SCREEN_MIN} - ${IndexGlobal.DB_PIXEL_TO_SCREEN_MAX}，当前为 ${MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP)}`);
                                    return;
                                };
                                MgrData.inst.set (MgrDataItem.DB_PIXEL_TO_SCREEN_APPLICATION, MgrData.inst.get (MgrDataItem.DB_PIXEL_TO_SCREEN_TEMP));
                            }
                        ),
                    ),
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
                                MgrSdk.inst.core.saveFile (
                                    `image.png`,
                                    this.fboScreen.toBase64 ()
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

export default DomDrawingBoardRightPaintCanvas;