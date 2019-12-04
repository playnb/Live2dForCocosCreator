
import { Live2DCubismFramework as cubismMatrix44 } from "../CubismSdkForWeb/Framework/math/cubismmatrix44";
import { Live2DCubismFramework as cubismViewMatrix } from "../CubismSdkForWeb/Framework/math/cubismviewmatrix";
import Live2dDelegate from "./Live2dDelegate";
import Live2dDefine from "./Live2dDefine";
import { TextureInfo } from "./Live2dTextureManager";
import Live2dSprite from "./Live2dSprite";
import Live2dModelManager from "./Live2dModelManager";

export default class Live2dView {

    private _deviceToScreen: cubismMatrix44.CubismMatrix44 = new cubismMatrix44.CubismMatrix44()
    private _viewMatrix: cubismViewMatrix.CubismViewMatrix = new cubismViewMatrix.CubismViewMatrix()
    private _app: Live2dDelegate = null
    private _back: Live2dSprite = null
    private _programId: WebGLProgram = null

    constructor(app: Live2dDelegate) {
        this._app = app
    }

    public initialize() {
        let width = this._app.width;
        let height = this._app.height;
        let ratio: number = height / width;
        let left: number = Live2dDefine.ViewLogicalLeft;
        let right: number = Live2dDefine.ViewLogicalRight;
        let bottom: number = -ratio;
        let top: number = ratio;

        this._viewMatrix.setScreenRect(left, right, bottom, top);

        let screenW: number = Math.abs(left - right);
        this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
        this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);

        this._viewMatrix.setMaxScale(Live2dDefine.ViewMaxScale); // 限界拡張率
        this._viewMatrix.setMinScale(Live2dDefine.ViewMinScale); // 限界縮小率
    }

    public release(): void {
        this._viewMatrix = null;
        //this._touchManager = null;
        this._deviceToScreen = null;

        if (this._back) {
            this._back.release();
            this._back = null;
        }

        if (this._programId) {
            this._app.gl.deleteProgram(this._programId);
            this._programId = null;
        }
    }

    public render(): void {
        let gl = this._app.gl

        gl.useProgram(this._programId);

        if (this._back) {
            this._back.render(this._programId);
        }

        gl.flush();

        Live2dModelManager.getInstance().onUpdate()
    }

    public initializeSprite(): void {
        //背景图就不初始化了
        /*
        let width = this._app.width;
        let height = this._app.height;
        let textureManager = this._app.textureManager;
        const resourcesPath = Live2dDefine.ResourcesPath;
        let imageName: string = "";
        imageName = Live2dDefine.BackImageName;
        let initBackGroundTexture = (textureInfo: TextureInfo): void => {
            let x: number = width * 0.5;
            let y: number = height * 0.5;

            let fwidth = textureInfo.width * 2.0;
            let fheight = height * 0.95;
            this._back = new Live2dSprite(this._app, x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initBackGroundTexture);
        if (this._programId == null) {
            this._programId = this._app.createShader();
        }
        */
    }
}