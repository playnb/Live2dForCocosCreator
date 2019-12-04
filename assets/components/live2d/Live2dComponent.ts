import Live2dDelegate from "./src/Live2dDelegate";
import Live2dDefine from "./src/Live2dDefine";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Live2dComponent extends cc.Component {

    @property({ type: cc.RenderTexture })
    renderTexture: cc.RenderTexture = null

    @property()
    _scale: number = 3.3
    @property()
    get scale(): number { return this._scale }
    set scale(s: number) { this._scale = s; if (this._live2d) { this._live2d.scale = this.scale } }

    @property()
    fps: number = 30

    @property()
    modelName: string = "Hiyori"

    private _sprite: cc.Sprite = null
    private _live2d: Live2dDelegate = null
    private _frameBuffer: WebGLFramebuffer = null

    public get width(): number { return this.node.width }
    public get height(): number { return this.node.height }
    public get gl(): WebGLRenderingContext { return this.renderTexture["_texture"]._device._gl }
    public get frameBuffer(): WebGLFramebuffer { return this._frameBuffer }
    public get live2d(): Live2dDelegate { return this._live2d }
    public get stepTime(): number { return 1 / this.fps }

    onLoad() {
        if (this.renderTexture == null) {
            //this.renderTarget = this.getComponent(cc.RenderComponent)
            this.renderTexture = new cc.RenderTexture()
            this.renderTexture.initWithSize(this.node.width, this.node.height)

            this._sprite = this.node.addComponent(cc.Sprite)
            this._sprite.spriteFrame = new cc.SpriteFrame(this.renderTexture)
        }

        let gl = this.gl

        this._frameBuffer = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer)
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.renderTexture["_texture"]._glID, 0)
        //this._frameBuffer = this.renderTexture["_framebuffer"]._glID

        this._live2d = new Live2dDelegate(this.gl, this.width, this.height, this.frameBuffer)
        this.live2d.loadModel(this.modelName)
        this.live2d.scale = this.scale
    }

    start() {
    }

    private _deltaTime: number = 0
    update(dt: number) {
        this._deltaTime += dt
        let draw = false
        while (this._deltaTime > this.stepTime) {
            draw = true
            this._deltaTime -= this.stepTime
            this.live2d.loop()
        }
        if (this._deltaTime < 0) { this._deltaTime = 0 }
        if (draw) {
            //TODO: 这里需要重置渲染状态,不知道怎么避免(估计要参考相机的render)
            let device = this.renderTexture["_texture"]._device
            device._current.reset()
            device._gl.viewport(device._vx, device._vy, device._vw, device._vh)
        }
    }

    onDestroy() {
        if (this._live2d) {
            this._live2d.release()
        }
    }
}