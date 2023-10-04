namespace JWebglMath {
    /**
     * 弧度转角度
     * @param val 
     * @returns 
     */
    export function degreesToRadians (val: number) {
        return val / 180 * Math.PI;
    }
    /**
     * 弧度转角度
     * @param val 
     * @returns 
     */
    export function radiansToDegrees (val: number) {
        return val / Math.PI * 180;
    }
}

export default JWebglMath;