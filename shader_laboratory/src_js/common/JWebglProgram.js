import JWebglEnum from "./JWebglEnum.js";
import JWEbglProgramDefine from "./JWebglProgramDefine.js";
/**
 * 着色程序
 */
class JWebglProgram {
    constructor(jWebgl, name) {
        /**
         * 纹理索引
         */
        this.textureIdx = 0;
        /**
         * 宏定义的集合
         */
        this._listDefine = new Array();
        /**
         * 静态数据的集合
         */
        this._listUniform = new Array();
        /**
         * 顶点数据的集合
         */
        this._listAttribute = new Array();
        /**
         * 插值数据的集合
         */
        this._listVarying = new Array();
        /**
         * 顶点着色器头部定义
         */
        this._listVertexHead = new Array(`precision mediump float;`);
        /**
         * 片元着色器头部定义
         */
        this._listFragmentHead = new Array(`precision mediump float;`);
        /**
         * 顶点数据尺寸
         */
        this.vertexDataSize = 0;
        /**
         * 顶点数据
         */
        this._dataAttribute = new Float32Array(1);
        /**
         * 当前存储的索引
         */
        this._dataAttributeStorageIdx = 0;
        /**
         * 索引数据
         */
        this._dataIndex = new Uint8Array(1);
        /**
         * 当前存储的索引
         */
        this._dataIndexStorageIdx = 0;
        this.relWebgl = jWebgl;
        this.name = name;
    }
    /**
     * 初始化
     */
    init() {
        // 回填曾经缓存的属性
        let symbolCache = JWebglProgram.getCache(this);
        symbolCache.mapPropsNameToDefineClass.forEach((defineVal, propsName) => {
            let shaderDefine = new JWEbglProgramDefine(this, propsName, defineVal);
            this._listDefine.push(shaderDefine);
            let defineTxt = `#define ${shaderDefine} ${shaderDefine.val}`;
            this._listVertexHead.push(defineTxt);
            this._listFragmentHead.push(defineTxt);
            this[propsName] = shaderDefine;
        });
        symbolCache.mapPropsNameToUniformClass.forEach((uniformClass, propsName) => {
            let uniform = new uniformClass(this, propsName);
            this._listUniform.push(uniform);
            let shaderTxt = `uniform ${uniform.impGetShaderDefine()} ${uniform};`;
            this._listVertexHead.push(shaderTxt);
            this._listFragmentHead.push(shaderTxt);
            this[propsName] = uniform;
        });
        symbolCache.mapPropsNameToAttributeClass.forEach((attributeClass, propsName) => {
            let attribute = new attributeClass(this, propsName, this.vertexDataSize);
            this.vertexDataSize += attribute.impGetSize();
            this._listAttribute.push(attribute);
            let shaderTxt = `attribute ${attribute.impGetShaderDefine()} ${attribute};`;
            this._listVertexHead.push(shaderTxt);
            this[propsName] = attribute;
        });
        symbolCache.mapPropsNameToVaryingClass.forEach((varyingClass, propsName) => {
            let varying = new varyingClass(this, propsName);
            this._listVarying.push(varying);
            let shaderTxt = `varying ${varying.impGetShaderDefine()} ${varying};`;
            this._listVertexHead.push(shaderTxt);
            this._listFragmentHead.push(shaderTxt);
            this[propsName] = varying;
        });
        this._shaderVTxt = this._listVertexHead.join(`\n`) + this.impGetShaderVTxt();
        this._shaderFTxt = this._listFragmentHead.join(`\n`) + this.impGetnShaderFTxt();
        this.shaderV = this.createShader(JWebglEnum.CreateShaderType.VERTEX_SHADER, this._shaderVTxt);
        this.shaderF = this.createShader(JWebglEnum.CreateShaderType.FRAGMENT_SHADER, this._shaderFTxt);
        this.program = this.relWebgl.canvasWebglCtx.createProgram();
        if (this.program == null) {
            this.relWebgl.error(`着色程序创建失败`);
            return;
        }
        ;
        // 绑定着色器
        this.relWebgl.canvasWebglCtx.attachShader(this.program, this.shaderV);
        this.relWebgl.canvasWebglCtx.attachShader(this.program, this.shaderF);
        // 连接着色器
        this.relWebgl.canvasWebglCtx.linkProgram(this.program);
        // 获取连接状态
        let linked = this.relWebgl.canvasWebglCtx.getProgramParameter(this.program, JWebglEnum.GetProgramParameterPName.LINK_STATUS);
        if (linked == null) {
            let error = this.relWebgl.canvasWebglCtx.getProgramInfoLog(this.program);
            this.relWebgl.error(`着色器连接失败`, error);
            this.relWebgl.canvasWebglCtx.deleteProgram(this.program);
            return;
        }
        ;
        // 静态属性初始化
        for (let i = 0; i < this._listUniform.length; i++) {
            let uniformI = this._listUniform[i];
            uniformI._init();
        }
        ;
        // 顶点属性初始化
        for (let i = 0; i < this._listAttribute.length; i++) {
            let attI = this._listAttribute[i];
            attI._init();
        }
        ;
    }
    /**
     * 创建着色器
     * @param type
     * @param txt
     * @returns
     */
    createShader(type, txt) {
        let shader = this.relWebgl.canvasWebglCtx.createShader(type);
        if (shader == null) {
            this.relWebgl.error(`着色器创建失败`);
            return;
        }
        ;
        // 设置着色器代码
        this.relWebgl.canvasWebglCtx.shaderSource(shader, txt);
        // 编译着色器代码
        this.relWebgl.canvasWebglCtx.compileShader(shader);
        // 获取编译状态
        let compiled = this.relWebgl.canvasWebglCtx.getShaderParameter(shader, JWebglEnum.GetShaderParameterPName.COMPILE_STATUS);
        // 编译出了问题
        if (!compiled) {
            let error = this.relWebgl.canvasWebglCtx.getShaderInfoLog(shader);
            this.relWebgl.error(`着色器编译失败`, txt, error);
            this.relWebgl.canvasWebglCtx.deleteShader(shader);
            return;
        }
        ;
        return shader;
    }
    /**
     * 添加顶点数据
     * @param data
     */
    _addAttributeData(...data) {
        if (data.length % this.vertexDataSize != 0) {
            this.relWebgl.error(`每个顶点数据尺寸应当为 [${this.vertexDataSize}]，但是现在传入尺寸为 [${data.length}]`);
            return;
        }
        ;
        // 会越界，那么及时扩容
        if (this._dataAttribute.length < this._dataAttributeStorageIdx + data.length) {
            let size = this._dataAttribute.length;
            // 扩容按倍增长，避免频繁扩容
            while (size < this._dataAttributeStorageIdx + data.length) {
                size *= 2;
            }
            ;
            // 把原来的数据拷贝过去
            let dataAttribute = new Float32Array(size);
            for (let i = 0; i < this._dataAttributeStorageIdx; i++) {
                dataAttribute[i] = this._dataAttribute[i];
            }
            ;
            this._dataAttribute = dataAttribute;
        }
        ;
        // 正式把数据放入
        for (let i = 0; i < data.length; i++) {
            this._dataAttribute[this._dataAttributeStorageIdx + i] = data[i];
        }
        ;
        // 记住顶点索引位
        let idx = this._dataAttributeStorageIdx / this.vertexDataSize;
        // 更新存储的索引位置
        this._dataAttributeStorageIdx += data.length;
        return idx;
    }
    /**
     * 添加索引数据
     * @param data
     */
    _addIndexData(...data) {
        // 会越界，那么及时扩容
        if (this._dataIndex.length < this._dataIndexStorageIdx + data.length) {
            let size = this._dataIndex.length;
            // 扩容按倍增长，避免频繁扩容
            while (size < this._dataIndexStorageIdx + data.length) {
                size *= 2;
            }
            ;
            // 把原来的数据拷贝过去
            let dataIndex = new Uint8Array(size);
            for (let i = 0; i < this._dataIndexStorageIdx; i++) {
                dataIndex[i] = this._dataIndex[i];
            }
            ;
            this._dataIndex = dataIndex;
        }
        ;
        // 正式把数据放入
        for (let i = 0; i < data.length; i++) {
            this._dataIndex[this._dataIndexStorageIdx + i] = data[i];
        }
        ;
        this._dataIndexStorageIdx += data.length;
    }
    /**
     * 正式进行绘制
     */
    draw() {
        this.relWebgl.useProgram(this);
        // 填充顶点数据
        this.relWebgl.canvasWebglCtx.bindBuffer(JWebglEnum.BindBufferTarget.ARRAY_BUFFER, this.relWebgl._attributeBuffer);
        this.relWebgl.canvasWebglCtx.bufferData(JWebglEnum.BindBufferTarget.ARRAY_BUFFER, this._dataAttribute, JWebglEnum.BufferDataUsage.STATIC_DRAW);
        for (let i = 0; i < this._listAttribute.length; i++) {
            let att = this._listAttribute[i];
            this.relWebgl.canvasWebglCtx.vertexAttribPointer(att.location, att.impGetSize(), JWebglEnum.VertexAttriPointerType.FLOAT, false, this.vertexDataSize * this._dataAttribute.BYTES_PER_ELEMENT, att.idx * this._dataAttribute.BYTES_PER_ELEMENT);
            this.relWebgl.canvasWebglCtx.enableVertexAttribArray(att.location);
        }
        ;
        // 进行绘制
        this.relWebgl.canvasWebglCtx.bindBuffer(JWebglEnum.BindBufferTarget.ELEMENT_ARRAY_BUFFER, this.relWebgl._elementBuffer);
        this.relWebgl.canvasWebglCtx.bufferData(JWebglEnum.BindBufferTarget.ELEMENT_ARRAY_BUFFER, this._dataIndex, JWebglEnum.BufferDataUsage.STATIC_DRAW);
        this.relWebgl.canvasWebglCtx.drawElements(this.impGetMode(), this._dataIndexStorageIdx, JWebglEnum.VertexAttriPointerType.UNSIGNED_BYTE, 0);
        // 存储数据就是为了绘制，绘制完了，全部可覆盖
        this._dataAttributeStorageIdx = 0;
        this._dataIndexStorageIdx = 0;
    }
    /**
     * 获取顶点着色器的文本
     * @returns
     */
    impGetShaderVTxt() {
        return null;
    }
    /**
     * 获取片元着色器的文本
     * @returns
     */
    impGetnShaderFTxt() {
        return null;
    }
    /**
     * 绘制的用途
     * @returns
     */
    impGetMode() {
        return null;
    }
}
(function (JWebglProgram) {
    const SYMBOL_KEY = Symbol(`JWebglProgram.SYMBOL_KEY`);
    /**
     * 获取原型上的缓存
     * @param c
     * @returns
     */
    function getCache(c) {
        if (!c[SYMBOL_KEY]) {
            let cache = {
                mapPropsNameToDefineClass: new Map(),
                mapPropsNameToAttributeClass: new Map(),
                mapPropsNameToUniformClass: new Map(),
                mapPropsNameToVaryingClass: new Map()
            };
            c[SYMBOL_KEY] = cache;
        }
        ;
        return c[SYMBOL_KEY];
    }
    JWebglProgram.getCache = getCache;
    /**
     * 宏定义
     * @param t
     * @param val
     * @returns
     */
    function define(t, val) {
        return function decorator(inst, propsName) {
            let cache = getCache(inst);
            cache.mapPropsNameToDefineClass.set(propsName, val);
        };
    }
    JWebglProgram.define = define;
    /**
     * 静态数据
     * @param t
     * @returns
     */
    function uniform(t) {
        return function decorator(inst, propsName) {
            let cache = getCache(inst);
            cache.mapPropsNameToUniformClass.set(propsName, t);
        };
    }
    JWebglProgram.uniform = uniform;
    /**
     * 顶点数据
     * @param t
     * @returns
     */
    function attribute(t) {
        return function decorator(inst, propsName) {
            let cache = getCache(inst);
            cache.mapPropsNameToAttributeClass.set(propsName, t);
        };
    }
    JWebglProgram.attribute = attribute;
    /**
     * 插值数据
     * @param t
     * @returns
     */
    function varying(t) {
        return function decorator(inst, propsName) {
            let cache = getCache(inst);
            cache.mapPropsNameToVaryingClass.set(propsName, t);
        };
    }
    JWebglProgram.varying = varying;
})(JWebglProgram || (JWebglProgram = {}));
export default JWebglProgram;
