declare namespace cc {
    declare let gfx: any;
    export class RenderData {
        vDatas: Float32Array[]
        uintVDatas: Uint32Array[]
        iDatas: Uint16Array[]

        init(assembler: Assembler)
        createQuadData(index: number, verticesFloats: number, indicesCount: number)
    }
    export class Assembler {
        init(comp: RenderComponent): void;
        updateRenderData(comp: RenderComponent): void;
    }

    export class Assembler2D extends Assembler {
        _local: Array;
        _renderData: RenderData;
        uvOffset: number;
        floatsPerVert: number;
        updateWorldVerts(comp: RenderComponent): void
    }

    export class Effect {
        getProperty(name: string): any
        _properties: any
    }

    export class BufferAsset extends Asset {
        _buffer: ArrayBuffer
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 材质资源类
    export class Material extends Asset {
        static getInstantiatedMaterial(mat: Material, renderComponent: RenderComponent): Material;
        setProperty(name: string, property: any, force: boolean);
        getProperty(name: string): any
        get effect(): Effect

    }
    // 所有支持渲染的组件的基类
    export class RenderComponent extends Component {
		/** !#en The materials used by this render component.
		!#zh 渲染组件使用的材质。 */
        sharedMaterials: Material[];
		/**
		!#en Get the material by index.
		!#zh 根据指定索引获取材质
		@param index index 
		*/
        getMaterial(index: number): Material;
		/**
		!#en Set the material by index.
		!#zh 根据指定索引设置材质
		@param index index
		@param material material 
		*/
        setMaterial(index: number, material: Material): void;

        _assembler: Assembler;
        setVertsDirty();
        disableRender();
        markForRender(enable: boolean);
    }
    // 提供基础渲染接口的渲染器对象，渲染层的基础接口将逐步开放给用户 
    export class renderer {
		/** !#en The render engine is available only after cc.game.EVENT_ENGINE_INITED event.<br/>
		Normally it will be inited as the webgl render engine, but in wechat open context domain,
		it will be inited as the canvas render engine. Canvas render engine is no longer available for other use case since v2.0.
		!#zh 基础渲染引擎对象只在 cc.game.EVENT_ENGINE_INITED 事件触发后才可获取。<br/>
		大多数情况下，它都会是 WebGL 渲染引擎实例，但是在微信开放数据域当中，它会是 Canvas 渲染引擎实例。请注意，从 2.0 开始，我们在其他平台和环境下都废弃了 Canvas 渲染器。 */
        static renderEngine: any;
		/** !#en The total draw call count in last rendered frame.
		!#zh 上一次渲染帧所提交的渲染批次总数。 */
        static drawCalls: number;

        static _handle: any;
    }
}