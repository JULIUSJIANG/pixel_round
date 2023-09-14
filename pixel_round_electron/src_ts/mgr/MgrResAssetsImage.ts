import MgrResAssets from "./MgrResAssets.js";

/**
 * 资源数据 - 图片
 */
export default class MgrResAssetsImage extends MgrResAssets {
    /**
     * 资源路径
     */
    src: string;

    /**
     * 用于加载资源的图片标签
     */
    image: HTMLImageElement;

    constructor (src: string) 
    {
        super ();
        this.src = src;
        
        this.image = new Image ();
        this.image.onload = () => {
            this.currStatus.onLoadFinish ();
        };
        this.image.src = this.src;
    }
}