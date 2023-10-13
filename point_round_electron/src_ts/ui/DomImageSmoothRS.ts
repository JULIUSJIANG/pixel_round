import JWebglFrameBuffer from "../common/JWebglFrameBuffer.js";
import JWebglMathVector4 from "../common/JWebglMathVector4.js";
import DomImageSmooth from "./DomImageSmooth.js";

/**
 * 图片平滑的策略
 */
class DomImageSmoothRS {
    /**
     * 把帧缓冲区绘制到画布某位置上
     */
    debugDrawFbo: (com: DomImageSmooth, fbo: JWebglFrameBuffer, x: number, y: number) => void;

    /**
     * 把经典平滑绘制到某位置
     */
    debugSmoothOrdinaryTo: (com: DomImageSmooth, x: number, y: number) => void;

    /**
     * 把圆角平滑绘制到某位置
     */
    debugSmoothCircleTo: (com: DomImageSmooth, x: number, y: number) => void;

    constructor (args: {
        debugDrawFbo: (com: DomImageSmooth, fbo: JWebglFrameBuffer, x: number, y: number) => void,
        debugSmoothOrdinaryTo: (com: DomImageSmooth, x: number, y: number) => void,
        debugSmoothCircleTo: (com: DomImageSmooth, x: number, y: number) => void,
    }) 
    {
        this.debugDrawFbo = args.debugDrawFbo;
        this.debugSmoothOrdinaryTo = args.debugSmoothOrdinaryTo;
        this.debugSmoothCircleTo = args.debugSmoothCircleTo;
    }
}

namespace DomImageSmoothRS {
    /**
     * 绘板模式
     */
    export const db = new DomImageSmoothRS ({
        debugDrawFbo: (com, fbo, x, y) => {

        },
        debugSmoothOrdinaryTo: (com, x, y) => {

        },
        debugSmoothCircleTo: (com, x, y) => {

        },
    });
    /**
     * 实验模式
     */
    export const exp = new DomImageSmoothRS ({
        debugDrawFbo: (com, fbo, x, y) => {
            com.jWebgl.useFbo (null);
            let cameraWidth = com.props.cacheTexWidth * DomImageSmooth.HORIZON_COUNT;
            let cameraHeight = com.props.cacheTexHeight * DomImageSmooth.VERTICAL_COUNT;
            com.jWebgl.mat4V.setLookAt (
                cameraWidth / 2, cameraHeight / 2, 1,
                cameraWidth / 2, cameraHeight / 2, 0,
                0, 1, 0
            );
            com.jWebgl.mat4P.setOrtho (
                - cameraWidth / 2, cameraWidth / 2,
                - cameraHeight / 2, cameraHeight / 2,
                0, 2
            );
            com.jWebgl.refreshMat4Mvp ();
            com.jWebgl.programImg.uMvp.fill (com.jWebgl.mat4Mvp);
            com.jWebgl.programImg.uTexture.fillByFbo (fbo);
            com.posImg.elements [0] = com.props.cacheTexWidth * (0.5 + x);
            com.posImg.elements [1] = com.props.cacheTexHeight * (DomImageSmooth.VERTICAL_COUNT - 1 + 0.5 - y);
            com.jWebgl.programImg.add (
                com.posImg,
                JWebglMathVector4.axisZStart,
                JWebglMathVector4.axisYEnd,
                com.props.cacheTexWidth,
                com.props.cacheTexHeight
            );
            com.jWebgl.programImg.draw ();
        },
        debugSmoothOrdinaryTo: (com, x, y) => {
            // 最终结果
            com.jWebgl.useFbo (com.fboDisplay);
            com.jWebgl.clear ();
            com.jWebgl.programSmoothDisplayOrdinary.uMvp.fill (com.mat4Mvp);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureMain.fillByFbo (com.fboTexture);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureSize.fill (com.props.cacheTexWidth, com.props.cacheTexHeight);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureCorner.fillByFbo (com.fboCornerData);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureEnum.fillByFbo (com.fboEnumData);
            com.jWebgl.programSmoothDisplayOrdinary.add (
                JWebglMathVector4.centerO,
                JWebglMathVector4.axisZStart,
                JWebglMathVector4.axisYEnd,
                2,
                2
            );
            com.jWebgl.programSmoothDisplayOrdinary.draw ();
            com.props.rs.debugDrawFbo (com, com.fboDisplay, x, y);
        },
        debugSmoothCircleTo: (com, x, y) => {
            // 最终结果
            com.jWebgl.useFbo (com.fboDisplay);
            com.jWebgl.clear ();
            com.jWebgl.programSmoothDisplayCircle.uMvp.fill (com.mat4Mvp);
            com.jWebgl.programSmoothDisplayCircle.uTextureMain.fillByFbo (com.fboTexture);
            com.jWebgl.programSmoothDisplayCircle.uTextureSize.fill (com.props.cacheTexWidth, com.props.cacheTexHeight);
            com.jWebgl.programSmoothDisplayCircle.uTextureCorner.fillByFbo (com.fboCornerData);
            com.jWebgl.programSmoothDisplayCircle.uTextureEnum.fillByFbo (com.fboEnumData);
            com.jWebgl.programSmoothDisplayCircle.uTextureAreaLeft.fillByFbo (com.fboAreaLeft);
            com.jWebgl.programSmoothDisplayCircle.uTextureAreaRight.fillByFbo (com.fboAreaRight);
            com.jWebgl.programSmoothDisplayCircle.uTextureAngleLeft.fillByFbo (com.fboAngleLeft);
            com.jWebgl.programSmoothDisplayCircle.uTextureAngleRight.fillByFbo (com.fboAngleRight);
            com.jWebgl.programSmoothDisplayCircle.add (
                JWebglMathVector4.centerO,
                JWebglMathVector4.axisZStart,
                JWebglMathVector4.axisYEnd,
                2,
                2
            );
            com.jWebgl.programSmoothDisplayCircle.draw ();
            com.props.rs.debugDrawFbo (com, com.fboDisplay, x, y);
        },
    });
}

export default DomImageSmoothRS;