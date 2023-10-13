import JWebglMathVector4 from "../common/JWebglMathVector4.js";
/**
 * 图片平滑的策略
 */
class DomImageSmoothRS {
    constructor(args) {
        this.dbFinally = args.dbFinally;
        this.expDrawFbo = args.expDrawFbo;
        this.expSmoothOrdinaryTo = args.expSmoothOrdinaryTo;
        this.expSmoothCircleTo = args.expSmoothCircleTo;
        this.expDrawFocus = args.expDrawFocus;
        this.commonHorCount = args.commonHorCount;
        this.commonVerCount = args.commonVerCount;
    }
}
(function (DomImageSmoothRS) {
    /**
     * 绘板模式
     */
    DomImageSmoothRS.db = new DomImageSmoothRS({
        dbFinally: (com) => {
            // 最终结果
            com.jWebgl.useFbo(com.fboDisplay);
            com.jWebgl.clear();
            com.jWebgl.programSmoothDisplayCircle.uMvp.fill(com.mat4Mvp);
            com.jWebgl.programSmoothDisplayCircle.uTextureMain.fillByFbo(com.fboTexture);
            com.jWebgl.programSmoothDisplayCircle.uTextureSize.fill(com.props.cacheTexWidth, com.props.cacheTexHeight);
            com.jWebgl.programSmoothDisplayCircle.uTextureCorner.fillByFbo(com.fboCornerData);
            com.jWebgl.programSmoothDisplayCircle.uTextureEnum.fillByFbo(com.fboEnumData);
            com.jWebgl.programSmoothDisplayCircle.uTextureAreaLeft.fillByFbo(com.fboAreaLeft);
            com.jWebgl.programSmoothDisplayCircle.uTextureAreaRight.fillByFbo(com.fboAreaRight);
            com.jWebgl.programSmoothDisplayCircle.uTextureAngleLeft.fillByFbo(com.fboAngleLeft);
            com.jWebgl.programSmoothDisplayCircle.uTextureAngleRight.fillByFbo(com.fboAngleRight);
            com.jWebgl.programSmoothDisplayCircle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
            com.jWebgl.programSmoothDisplayCircle.draw();
            com.jWebgl.fillFboByFbo(null, com.fboDisplay);
        },
        expDrawFbo: (com, fbo, x, y) => {
        },
        expSmoothOrdinaryTo: (com, x, y) => {
        },
        expSmoothCircleTo: (com, x, y) => {
        },
        expDrawFocus: (com) => {
        },
        commonHorCount: 1,
        commonVerCount: 1,
    });
    /**
     * 实验模式
     */
    DomImageSmoothRS.exp = new DomImageSmoothRS({
        dbFinally: (com) => {
        },
        expDrawFbo: (com, fbo, x, y) => {
            com.jWebgl.useFbo(null);
            let cameraWidth = com.props.cacheTexWidth * DomImageSmoothRS.exp.commonHorCount;
            let cameraHeight = com.props.cacheTexHeight * DomImageSmoothRS.exp.commonVerCount;
            com.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
            com.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
            com.jWebgl.refreshMat4Mvp();
            com.jWebgl.programImg.uMvp.fill(com.jWebgl.mat4Mvp);
            com.jWebgl.programImg.uTexture.fillByFbo(fbo);
            com.posImg.elements[0] = com.props.cacheTexWidth * (0.5 + x);
            com.posImg.elements[1] = com.props.cacheTexHeight * (DomImageSmoothRS.exp.commonVerCount - 1 + 0.5 - y);
            com.jWebgl.programImg.add(com.posImg, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, com.props.cacheTexWidth, com.props.cacheTexHeight);
            com.jWebgl.programImg.draw();
        },
        expSmoothOrdinaryTo: (com, x, y) => {
            // 最终结果
            com.jWebgl.useFbo(com.fboDisplay);
            com.jWebgl.clear();
            com.jWebgl.programSmoothDisplayOrdinary.uMvp.fill(com.mat4Mvp);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureMain.fillByFbo(com.fboTexture);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureSize.fill(com.props.cacheTexWidth, com.props.cacheTexHeight);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureCorner.fillByFbo(com.fboCornerData);
            com.jWebgl.programSmoothDisplayOrdinary.uTextureEnum.fillByFbo(com.fboEnumData);
            com.jWebgl.programSmoothDisplayOrdinary.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
            com.jWebgl.programSmoothDisplayOrdinary.draw();
            com.props.rs.expDrawFbo(com, com.fboDisplay, x, y);
        },
        expSmoothCircleTo: (com, x, y) => {
            // 最终结果
            com.jWebgl.useFbo(com.fboDisplay);
            com.jWebgl.clear();
            com.jWebgl.programSmoothDisplayCircle.uMvp.fill(com.mat4Mvp);
            com.jWebgl.programSmoothDisplayCircle.uTextureMain.fillByFbo(com.fboTexture);
            com.jWebgl.programSmoothDisplayCircle.uTextureSize.fill(com.props.cacheTexWidth, com.props.cacheTexHeight);
            com.jWebgl.programSmoothDisplayCircle.uTextureCorner.fillByFbo(com.fboCornerData);
            com.jWebgl.programSmoothDisplayCircle.uTextureEnum.fillByFbo(com.fboEnumData);
            com.jWebgl.programSmoothDisplayCircle.uTextureAreaLeft.fillByFbo(com.fboAreaLeft);
            com.jWebgl.programSmoothDisplayCircle.uTextureAreaRight.fillByFbo(com.fboAreaRight);
            com.jWebgl.programSmoothDisplayCircle.uTextureAngleLeft.fillByFbo(com.fboAngleLeft);
            com.jWebgl.programSmoothDisplayCircle.uTextureAngleRight.fillByFbo(com.fboAngleRight);
            com.jWebgl.programSmoothDisplayCircle.add(JWebglMathVector4.centerO, JWebglMathVector4.axisZStart, JWebglMathVector4.axisYEnd, 2, 2);
            com.jWebgl.programSmoothDisplayCircle.draw();
            com.props.rs.expDrawFbo(com, com.fboDisplay, x, y);
        },
        expDrawFocus: (com) => {
            com.jWebgl.useFbo(null);
            let cameraWidth = com.props.cacheTexWidth * com.props.rs.commonHorCount;
            let cameraHeight = com.props.cacheTexHeight * com.props.rs.commonVerCount;
            com.jWebgl.mat4V.setLookAt(cameraWidth / 2, cameraHeight / 2, 1, cameraWidth / 2, cameraHeight / 2, 0, 0, 1, 0);
            com.jWebgl.mat4P.setOrtho(-cameraWidth / 2, cameraWidth / 2, -cameraHeight / 2, cameraHeight / 2, 0, 2);
            com.jWebgl.refreshMat4Mvp();
            com.jWebgl.programLine.uMvp.fill(com.jWebgl.mat4Mvp);
            // 准星
            let gridXMod = com.gridX % com.props.cacheTexWidth + 0.5;
            let gridYMod = com.gridY % com.props.cacheTexHeight + 0.5;
            // 竖线
            for (let i = 0; i < com.props.rs.commonHorCount; i++) {
                com.posFrom.elements[0] = i * com.props.cacheTexWidth + gridXMod;
                com.posFrom.elements[1] = 0;
                com.posTo.elements[0] = i * com.props.cacheTexWidth + gridXMod;
                com.posTo.elements[1] = cameraHeight;
                com.jWebgl.programLine.add(com.posFrom, com.colorFocus, com.posTo, com.colorFocus);
            }
            ;
            // 横线
            for (let i = 0; i < com.props.rs.commonVerCount; i++) {
                com.posFrom.elements[0] = 0;
                com.posFrom.elements[1] = i * com.props.cacheTexHeight + gridYMod;
                com.posTo.elements[0] = cameraWidth;
                com.posTo.elements[1] = i * com.props.cacheTexHeight + gridYMod;
                com.jWebgl.programLine.add(com.posFrom, com.colorFocus, com.posTo, com.colorFocus);
            }
            ;
            com.jWebgl.programLine.draw();
        },
        commonHorCount: 7,
        commonVerCount: 4,
    });
})(DomImageSmoothRS || (DomImageSmoothRS = {}));
export default DomImageSmoothRS;
