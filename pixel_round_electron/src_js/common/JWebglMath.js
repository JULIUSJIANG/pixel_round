var JWebglMath;
(function (JWebglMath) {
    /**
     * 弧度转角度
     * @param val
     * @returns
     */
    function degreesToRadians(val) {
        return val / 180 * Math.PI;
    }
    JWebglMath.degreesToRadians = degreesToRadians;
    /**
     * 弧度转角度
     * @param val
     * @returns
     */
    function radiansToDegrees(val) {
        return val / Math.PI * 180;
    }
    JWebglMath.radiansToDegrees = radiansToDegrees;
})(JWebglMath || (JWebglMath = {}));
export default JWebglMath;
