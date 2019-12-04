
import { Live2DCubismFramework as cubismMatrix44 } from "../CubismSdkForWeb/Framework/math/cubismmatrix44";
import { Live2DCubismFramework as csmVector } from "../CubismSdkForWeb/Framework/type/csmvector";
import Live2dModel from "./LAppModel";
import Live2dDelegate from "./LAppDelegate";
import Live2dDefine from "./LAppDefine";
import Live2dPlatform from "./LAppPlatform";

export default class Live2dModelManager {
    private static _instance: Live2dModelManager = null
    public static getInstance(): Live2dModelManager {
        if (Live2dModelManager._instance == null) {
            Live2dModelManager._instance = new Live2dModelManager()
        }
        return Live2dModelManager._instance
    }
    public static releaseInstance(): void {
        if (Live2dModelManager._instance != null) {
            Live2dModelManager._instance = void 0
        }
        Live2dModelManager._instance = null
    }

    constructor() {
        this._viewMatrix = new cubismMatrix44.CubismMatrix44();
        this._models = new csmVector.csmVector<Live2dModel>();
        this._sceneIndex = 0;
        //this.changeScene(this._sceneIndex);
    }

    public setApp(app: Live2dDelegate) {
        this._app = app
    }

    private _viewMatrix: cubismMatrix44.CubismMatrix44;    // モデル描画に用いるview行列
    private _models: csmVector.csmVector<Live2dModel>;  // モデルインスタンスのコンテナ
    private _sceneIndex: number;                // 表示するシーンのインデックス値
    private _app: Live2dDelegate

    public getModel(no: number): Live2dModel {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }

        return null;
    }
    public releaseAllModel(): void {
        for (let i: number = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }

        this._models.clear();
    }
    public onDrag(x: number, y: number): void {
        for (let i: number = 0; i < this._models.getSize(); i++) {
            let model: Live2dModel = this.getModel(i);

            if (model) {
                model.setDragging(x, y);
            }
        }
    }

    public onTap(x: number, y: number): void {
        if (Live2dDefine.DebugLogEnable) {
            Live2dPlatform.printLog("[APP]tap point: {x: {0} y: {1}}", x.toFixed(2), y.toFixed(2));
        }

        for (let i: number = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(Live2dDefine.HitAreaNameHead, x, y)) {
                if (Live2dDefine.DebugLogEnable) {
                    Live2dPlatform.printLog("[APP]hit area: [{0}]", Live2dDefine.HitAreaNameHead);
                }
                this._models.at(i).setRandomExpression();
            }
            else if (this._models.at(i).hitTest(Live2dDefine.HitAreaNameBody, x, y)) {
                if (Live2dDefine.DebugLogEnable) {
                    Live2dPlatform.printLog("[APP]hit area: [{0}]", Live2dDefine.HitAreaNameBody);
                }
                this._models.at(i).startRandomMotion(Live2dDefine.MotionGroupTapBody, Live2dDefine.PriorityNormal);
            }
        }
    }

    public onUpdate(): void {
        let projection: cubismMatrix44.CubismMatrix44 = new cubismMatrix44.CubismMatrix44();

        let width: number, height: number;
        width = this._app.width;
        height = this._app.height;
        projection.scale(1.0, width / height);

        if (this._viewMatrix != null) {
            projection.multiplyByMatrix(this._viewMatrix);
        }

        const saveProjection: cubismMatrix44.CubismMatrix44 = projection.clone();
        let modelCount: number = this._models.getSize();

        for (let i: number = 0; i < modelCount; ++i) {
            let model: Live2dModel = this.getModel(i);
            projection = saveProjection.clone();

            model.update();
            model.draw(projection); // 参照渡しなのでprojectionは変質する。
        }
    }

    public nextScene(): void {
        let no: number = (this._sceneIndex + 1) % 1;
        this.changeScene(no);
    }

    public changeScene(index: number): void {
        this._sceneIndex = index % Live2dDefine.ModelDirSize;
        if (Live2dDefine.DebugLogEnable) {
            Live2dPlatform.printLog("[APP]model index: {0}", this._sceneIndex);
        }

        // ModelDir[]に保持したディレクトリ名から
        // model3.jsonのパスを決定する。
        // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
        let model: string = Live2dDefine.ModelDir[index];
        let modelPath: string = Live2dDefine.ResourcesPath + model + "/";
        let modelJsonName: string = Live2dDefine.ModelDir[index];
        modelJsonName += ".model3.json";

        this.releaseAllModel();
        this._models.pushBack(new Live2dModel(this._app));
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    }


    public loadModel(model: string): void {
        if (Live2dDefine.DebugLogEnable) {
            Live2dPlatform.printLog("[APP]model index: {0}", model);
        }

        // ModelDir[]に保持したディレクトリ名から
        // model3.jsonのパスを決定する。
        // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
        let modelPath: string = Live2dDefine.ResourcesPath + model + "/";
        let modelJsonName: string = model;
        modelJsonName += ".model3.json";

        this.releaseAllModel();
        this._models.pushBack(new Live2dModel(this._app));
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    }
}