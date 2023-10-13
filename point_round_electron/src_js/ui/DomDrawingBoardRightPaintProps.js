import IndexGlobal from "../IndexGlobal.js";
import NodeModules from "../NodeModules.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import objectPool from "../common/ObjectPool.js";
import ReactComponentExtend from "../common/ReactComponentExtend.js";
import MgrData from "../mgr/MgrData.js";
import MgrDataItem from "../mgr/MgrDataItem.js";
import MgrDomDefine from "../mgr/MgrDomDefine.js";
import DomInputNumberApplicationHor from "./DomInputNumberApplicationHor.js";
/**
 * 重置尺寸
 * @param w
 * @param h
 * @param dataSrc
 * @param imgCurr
 */
function offset(dataSrc, imgCurr, offsetX, offsetY) {
    // 新的尺寸
    let cameraWidth = imgCurr.dbImgData.width;
    let cameraHeight = imgCurr.dbImgData.height;
    let fboResize = dataSrc.dom.jWebgl.getFbo(cameraWidth, cameraHeight);
    dataSrc.dom.jWebgl.useFbo(fboResize);
    dataSrc.dom.jWebgl.clear();
    dataSrc.dom.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
    dataSrc.dom.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
    dataSrc.dom.jWebgl.refreshMat4Mvp();
    dataSrc.dom.jWebgl.programImg.uMvp.fill(dataSrc.dom.jWebgl.mat4Mvp);
    dataSrc.dom.jWebgl.programImg.uTexture.fillByFbo(dataSrc.dom.fboCache);
    let posImg = objectPool.pop(JWebglMathVector4.poolType);
    posImg.elements[0] = imgCurr.dbImgData.width / 2 + offsetX;
    posImg.elements[1] = imgCurr.dbImgData.height / 2 + offsetY,
        dataSrc.dom.jWebgl.programImg.add(posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, imgCurr.dbImgData.width, imgCurr.dbImgData.height);
    dataSrc.dom.jWebgl.programImg.draw();
    objectPool.push(posImg);
    let fboRev = dataSrc.dom.jWebgl.getFbo(cameraWidth, cameraHeight);
    dataSrc.dom.jWebgl.fillFboByTexRev(fboRev, fboResize.renderTexture);
    dataSrc.dom.jWebgl.destroyFbo(fboResize);
    imgCurr.dbImgData.width = cameraWidth;
    imgCurr.dbImgData.height = cameraHeight;
    let dataBase64 = fboRev.toBase64();
    dataSrc.dom.jWebgl.destroyFbo(fboRev);
    imgCurr.loadUrl(dataBase64);
    MgrData.inst.callDataChange();
}
/**
 * 重置尺寸
 * @param w
 * @param h
 * @param dataSrc
 * @param imgCurr
 */
function resizeTo(dataSrc, imgCurr, w, h) {
    // 新的尺寸
    let cameraWidth = w;
    let cameraHeight = h;
    let fboResize = dataSrc.dom.jWebgl.getFbo(cameraWidth, cameraHeight);
    dataSrc.dom.jWebgl.useFbo(fboResize);
    dataSrc.dom.jWebgl.clear();
    dataSrc.dom.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
    dataSrc.dom.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
    dataSrc.dom.jWebgl.refreshMat4Mvp();
    dataSrc.dom.jWebgl.programImg.uMvp.fill(dataSrc.dom.jWebgl.mat4Mvp);
    dataSrc.dom.jWebgl.programImg.uTexture.fillByFbo(dataSrc.dom.fboCache);
    let posImg = objectPool.pop(JWebglMathVector4.poolType);
    posImg.elements[0] = imgCurr.dbImgData.width / 2;
    posImg.elements[1] = cameraHeight - imgCurr.dbImgData.height / 2,
        dataSrc.dom.jWebgl.programImg.add(posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, imgCurr.dbImgData.width, imgCurr.dbImgData.height);
    dataSrc.dom.jWebgl.programImg.draw();
    objectPool.push(posImg);
    // 重新等待初始化完毕
    imgCurr.initEnter(imgCurr.initStatusIdle);
    let fboRev = dataSrc.dom.jWebgl.getFbo(cameraWidth, cameraHeight);
    dataSrc.dom.jWebgl.fillFboByTexRev(fboRev, fboResize.renderTexture);
    dataSrc.dom.jWebgl.destroyFbo(fboResize);
    imgCurr.dbImgData.width = cameraWidth;
    imgCurr.dbImgData.height = cameraHeight;
    let dataBase64 = fboRev.toBase64();
    dataSrc.dom.jWebgl.destroyFbo(fboRev);
    imgCurr.loadUrl(dataBase64);
    MgrData.inst.callDataChange();
}
export default class DomDrawingBoardRightPaintProps extends ReactComponentExtend {
    constructor() {
        super(...arguments);
        this.listChildren = new Array();
    }
    render() {
        let dataSrc = IndexGlobal.inst.mcRoot.statusDrawingBoard;
        let imgCurr = dataSrc.getCurrentCache();
        this.listChildren.length = 0;
        for (let i = 0; i < IndexGlobal.inst.mcRoot.statusDrawingBoard.opListStatus.length; i++) {
            let opListStatusI = IndexGlobal.inst.mcRoot.statusDrawingBoard.opListStatus[i];
            let propsBtn = {
                style: {
                    [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                },
                onClick: () => {
                    if (opListStatusI == IndexGlobal.inst.mcRoot.statusDrawingBoard.opCurrStatus) {
                        return;
                    }
                    ;
                    IndexGlobal.inst.mcRoot.statusDrawingBoard.opEnter(opListStatusI);
                    MgrData.inst.callDataChange();
                }
            };
            if (opListStatusI == IndexGlobal.inst.mcRoot.statusDrawingBoard.opCurrStatus) {
                propsBtn[MgrDomDefine.PROPS_TYPE] = MgrDomDefine.PROPS_TYPE_PRIMARY;
            }
            ;
            this.listChildren.push(ReactComponentExtend.instantiateTag(NodeModules.antd.Button, propsBtn, opListStatusI.name));
        }
        ;
        let argsWidth = DomInputNumberApplicationHor.Args.create(`宽 ${imgCurr.dbImgData.width}`, MgrData.inst.get(MgrDataItem.DB_WIDTH), 1, IndexGlobal.DB_SIZE_MAX, (val) => {
            MgrData.inst.set(MgrDataItem.DB_WIDTH, val);
        }, () => {
            resizeTo(dataSrc, imgCurr, MgrData.inst.get(MgrDataItem.DB_WIDTH), imgCurr.dbImgData.height);
        });
        let argsHeight = DomInputNumberApplicationHor.Args.create(`高 ${imgCurr.dbImgData.height}`, MgrData.inst.get(MgrDataItem.DB_HEIGHT), 1, IndexGlobal.DB_SIZE_MAX, (val) => {
            MgrData.inst.set(MgrDataItem.DB_HEIGHT, val);
        }, () => {
            resizeTo(dataSrc, imgCurr, imgCurr.dbImgData.width, MgrData.inst.get(MgrDataItem.DB_HEIGHT));
        });
        let argsOffsetX = DomInputNumberApplicationHor.Args.create(`水平移动`, MgrData.inst.get(MgrDataItem.DB_OFFSET_X), -IndexGlobal.DB_SIZE_MAX, IndexGlobal.DB_SIZE_MAX, (val) => {
            MgrData.inst.set(MgrDataItem.DB_OFFSET_X, val);
        }, () => {
            offset(dataSrc, imgCurr, MgrData.inst.get(MgrDataItem.DB_OFFSET_X), 0);
        });
        let argsOffsetY = DomInputNumberApplicationHor.Args.create(`垂直移动`, MgrData.inst.get(MgrDataItem.DB_OFFSET_Y), -IndexGlobal.DB_SIZE_MAX, IndexGlobal.DB_SIZE_MAX, (val) => {
            MgrData.inst.set(MgrDataItem.DB_OFFSET_Y, val);
        }, () => {
            offset(dataSrc, imgCurr, 0, MgrData.inst.get(MgrDataItem.DB_OFFSET_Y));
        });
        return ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_COLUMN,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            },
        }, 
        // 板块 - 操作
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
                [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_CENTER,
            }
        }, ...this.listChildren), 
        // 板块 - 颜色
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
                [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
                [MgrDomDefine.STYLE_JUSTIFY_CONTENT]: MgrDomDefine.STYLE_JUSTIFY_CONTENT_CENTER,
            }
        }, ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_COLOR]: MgrDomDefine.STYLE_COLOR_WHITE,
                [MgrDomDefine.STYLE_FONT_SIZE]: MgrDomDefine.STYLE_FONT_SIZE_14,
            }
        }, `画笔颜色`), ReactComponentExtend.instantiateTag(NodeModules.antd.ColorPicker, {
            showText: true,
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            },
            [MgrDomDefine.PROPS_VALUE]: `${MgrData.inst.get(MgrDataItem.DB_COLOR)}`,
            onChangeComplete: (val) => {
                val = val.toHex();
                MgrData.inst.set(MgrDataItem.DB_COLOR, val);
                MgrData.inst.callDataChange();
            }
        })), 
        // 颜色 - 宽
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `280px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            }
        }, ReactComponentExtend.instantiateComponent(DomInputNumberApplicationHor, argsWidth)), 
        // 颜色 - 高
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `280px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            }
        }, ReactComponentExtend.instantiateComponent(DomInputNumberApplicationHor, argsHeight)), 
        // 水平移动
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `280px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            }
        }, ReactComponentExtend.instantiateComponent(DomInputNumberApplicationHor, argsOffsetX)), 
        // 垂直移动
        ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_WIDTH]: `280px`,
                [MgrDomDefine.STYLE_FLEX_GROW]: 0,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW,
            }
        }, ReactComponentExtend.instantiateComponent(DomInputNumberApplicationHor, argsOffsetY)), ReactComponentExtend.instantiateTag(MgrDomDefine.TAG_DIV, {
            style: {
                [MgrDomDefine.STYLE_PADDING]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
                [MgrDomDefine.STYLE_BACKGROUND_COLOR]: MgrDomDefine.CONFIG_TXT_BG_COLOR,
                [MgrDomDefine.STYLE_WIDTH]: MgrDomDefine.STYLE_WIDTH_PERCENTAGE_0,
                [MgrDomDefine.STYLE_FLEX_GROW]: 1,
                [MgrDomDefine.STYLE_DISPLAY]: MgrDomDefine.STYLE_DISPLAY_FLEX,
                [MgrDomDefine.STYLE_FLEX_DIRECTION]: MgrDomDefine.STYLE_FLEX_DIRECTION_ROW_REVERSE,
                [MgrDomDefine.STYLE_ALIGN_ITEMS]: MgrDomDefine.STYLE_ALIGN_ITEMS_CENTER,
            }
        }, 
        // 板块 - 删除
        ReactComponentExtend.instantiateTag(NodeModules.antd.Button, {
            onClick: () => {
                let listImgData = MgrData.inst.get(MgrDataItem.DB_LIST_IMG_DATA);
                let targetIdx;
                for (let i = 0; i < listImgData.length; i++) {
                    let imgData = listImgData[i];
                    if (imgData.id == MgrData.inst.get(MgrDataItem.DB_CURRENT_IMG)) {
                        targetIdx = i;
                        break;
                    }
                    ;
                }
                ;
                // 删除该索引上的单位
                IndexGlobal.inst.dbDelete(targetIdx);
                // 尽量维持选择状态
                targetIdx = Math.min(targetIdx, listImgData.length - 1);
                if (0 <= targetIdx) {
                    MgrData.inst.set(MgrDataItem.DB_CURRENT_IMG, listImgData[targetIdx].id);
                }
                ;
                MgrData.inst.callDataChange();
            },
            style: {
                [MgrDomDefine.STYLE_MARGIN]: MgrDomDefine.CONFIG_TXT_HALF_SPACING,
            }
        }, `删除当前文档`))));
    }
}
