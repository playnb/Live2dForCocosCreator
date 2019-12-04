import { Live2DCubismFramework as csmvector } from "../CubismSdkForWeb/Framework/type/csmvector";
import Live2dDelegate from "./Live2dDelegate";


export class TextureInfo {
    img: cc.Texture2D;      // 画像
    id: WebGLTexture = null;    // テクスチャ
    width: number = 0;          // 横幅
    height: number = 0;         // 高さ
    usePremultply: boolean;     // Premult処理を有効にするか
    fileName: string;           // ファイル名
}


export default class Live2dTextureManager {
    private _textures: csmvector.csmVector<TextureInfo> = null
    private _app: Live2dDelegate = null

    constructor(app: Live2dDelegate) {
        this._app = app
        this._textures = new csmvector.csmVector<TextureInfo>()
    }

    public release(): void {
        for (let ite: csmvector.iterator<TextureInfo> = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            this._app.gl.deleteTexture(ite.ptr().id);
        }
        this._textures = null;
    }

    public createTextureFromPngFile(fileName: string, usePremultiply: boolean, callback: any): void {
        let gl = this._app.gl

        //TODO: 可能是为了缓存,这里交给cc.Texture2D的缓存机制
        /*
        // search loaded texture already
        for (let ite: csmvector.iterator<TextureInfo> = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            if (ite.ptr().fileName == fileName && ite.ptr().usePremultply == usePremultiply) {
                // 2回目以降はキャッシュが使用される(待ち時間なし)
                // WebKitでは同じImageのonloadを再度呼ぶには再インスタンスが必要
                // 詳細：https://stackoverflow.com/a/5024181
                ite.ptr().img = new Image();
                ite.ptr().img.onload = () => {
                    callback(ite.ptr());
                }
                ite.ptr().img.src = fileName;
                return;
            }
        }
        */

        let path = fileName.substr(0, fileName.lastIndexOf(".png"))
        cc.loader.loadRes(path, cc.Texture2D, (err: Error, res: cc.Texture2D) => {
            cc.log(path, fileName, res)

            if (false) {
                let tex: WebGLTexture = res["_texture"]._glID

                //TODO: 这里处理掉就能用了
                // Premult処理を行わせる
                //if (usePremultiply) {
                //    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                //}

                let textureInfo: TextureInfo = new TextureInfo();
                if (textureInfo != null) {
                    textureInfo.fileName = fileName;
                    textureInfo.width = res.width;
                    textureInfo.height = res.height;
                    textureInfo.id = tex;
                    textureInfo.img = res;
                    textureInfo.usePremultply = usePremultiply;
                    this._textures.pushBack(textureInfo);
                }
                callback(textureInfo);
            } else {
                //TODO: 这里双份WebGLTexture了
                let img = res["_image"]
                let tex: WebGLTexture = gl.createTexture();

                // テクスチャを選択
                gl.bindTexture(gl.TEXTURE_2D, tex);

                // テクスチャにピクセルを書き込む
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                // Premult処理を行わせる
                if (usePremultiply) {
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                }

                // テクスチャにピクセルを書き込む
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

                // ミップマップを生成
                gl.generateMipmap(gl.TEXTURE_2D);

                // テクスチャをバインド
                gl.bindTexture(gl.TEXTURE_2D, null);

                let textureInfo: TextureInfo = new TextureInfo();
                if (textureInfo != null) {
                    textureInfo.fileName = fileName;
                    textureInfo.width = img.width;
                    textureInfo.height = img.height;
                    textureInfo.id = tex;
                    textureInfo.img = img;
                    textureInfo.usePremultply = usePremultiply;
                    this._textures.pushBack(textureInfo);
                }

                callback(textureInfo);
            }
        })

        /*
        // データのオンロードをトリガーにする
        let img = new Image();
        img.onload = () => {
            // テクスチャオブジェクトの作成
            let tex: WebGLTexture = gl.createTexture();

            // テクスチャを選択
            gl.bindTexture(gl.TEXTURE_2D, tex);

            // テクスチャにピクセルを書き込む
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Premult処理を行わせる
            if (usePremultiply) {
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }

            // テクスチャにピクセルを書き込む
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            // ミップマップを生成
            gl.generateMipmap(gl.TEXTURE_2D);

            // テクスチャをバインド
            gl.bindTexture(gl.TEXTURE_2D, null);

            let textureInfo: TextureInfo = new TextureInfo();
            if (textureInfo != null) {
                textureInfo.fileName = fileName;
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                textureInfo.id = tex;
                textureInfo.img = img;
                textureInfo.usePremultply = usePremultiply;
                this._textures.pushBack(textureInfo);
            }

            callback(textureInfo);
        }
        img.src = fileName;
        */
    }

    public releaseTextures(): void {
        for (let i: number = 0; i < this._textures.getSize(); i++) {
            this._textures.set(i, null);
        }

        this._textures.clear();
    }
    public releaseTextureByTexture(texture: WebGLTexture) {
        for (let i: number = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).id != texture) {
                continue;
            }

            this._textures.set(i, null);
            this._textures.remove(i);
            break;
        }
    }

    public releaseTextureByFilePath(fileName: string): void {
        for (let i: number = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).fileName == fileName) {
                this._textures.set(i, null);
                this._textures.remove(i);
                break;
            }
        }
    }
}