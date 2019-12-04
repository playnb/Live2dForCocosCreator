import Live2dDelegate from "./LAppDelegate";


export class Rect {
    public left: number;   // 左辺
    public right: number;  // 右辺
    public up: number;     // 上辺
    public down: number;   // 下辺
}

export default class Live2dSprite {
    private _texture: WebGLTexture;   // テクスチャ
    private _vertexBuffer: WebGLBuffer;    // 頂点バッファ
    private _uvBuffer: WebGLBuffer;    // uv頂点バッファ
    private _indexBuffer: WebGLBuffer;    // 頂点インデックスバッファ
    private _rect: Rect;           // 矩形

    private _positionLocation: number;
    private _uvLocation: number;
    private _textureLocation: WebGLUniformLocation;

    private _positionArray: Float32Array;
    private _uvArray: Float32Array;
    private _indexArray: Uint16Array;

    private _firstDraw: boolean;

    private _app: Live2dDelegate

    constructor(app: Live2dDelegate, x: number, y: number, width: number, height: number, textureId: WebGLTexture) {
        this._app = app
        this._rect = new Rect();
        this._rect.left = (x - width * 0.5);
        this._rect.right = (x + width * 0.5);
        this._rect.up = (y + height * 0.5);
        this._rect.down = (y - height * 0.5);
        this._texture = textureId;

        this._vertexBuffer = null;
        this._uvBuffer = null;
        this._indexBuffer = null;

        this._positionLocation = null;
        this._uvLocation = null;
        this._textureLocation = null;

        this._positionArray = null;
        this._uvArray = null;
        this._indexArray = null;

        this._firstDraw = true;
    }

    public isHit(pointX: number, pointY: number): boolean {
        // 画面サイズを取得する。
        let maxWidth, maxHeight;
        maxWidth = this._app.width;
        maxHeight = this._app.height;

        // Y座標は変換する必要あり
        let y = maxHeight - pointY;

        return (pointX >= this._rect.left && pointX <= this._rect.right && y <= this._rect.up && y >= this._rect.down);
    }

    public release(): void {
        let gl = this._app.gl
        this._rect = null;

        gl.deleteTexture(this._texture);
        this._texture = null;

        gl.deleteBuffer(this._uvBuffer);
        this._uvBuffer = null;

        gl.deleteBuffer(this._vertexBuffer);
        this._vertexBuffer = null;

        gl.deleteBuffer(this._indexBuffer);
        this._indexBuffer = null;
    }

    public getTexture(): WebGLTexture {
        return this._texture;
    }

    public render(programId: WebGLProgram): void {
        let gl = this._app.gl

        if (this._texture == null) {
            // ロードが完了していない
            return;
        }

        // 初回描画時
        if (this._firstDraw) {
            // 何番目のattribute変数か取得
            this._positionLocation = gl.getAttribLocation(programId, "position");
            gl.enableVertexAttribArray(this._positionLocation);

            this._uvLocation = gl.getAttribLocation(programId, "uv");
            gl.enableVertexAttribArray(this._uvLocation);

            // 何番目のuniform変数か取得
            this._textureLocation = gl.getUniformLocation(programId, "texture");

            // uniform属性の登録
            gl.uniform1i(this._textureLocation, 0);

            // uvバッファ、座標初期化
            {
                this._uvArray = new Float32Array([
                    1.0, 0.0,
                    0.0, 0.0,
                    0.0, 1.0,
                    1.0, 1.0
                ]);

                // uvバッファを作成
                this._uvBuffer = gl.createBuffer();
            }

            // 頂点バッファ、座標初期化
            {
                let maxWidth = this._app.width;
                let maxHeight = this._app.height;

                // 頂点データ
                this._positionArray = new Float32Array([
                    (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5), (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5), (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5), (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5), (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5)
                ]);

                // 頂点バッファを作成
                this._vertexBuffer = gl.createBuffer();
            }

            // 頂点インデックスバッファ、初期化
            {
                // インデックスデータ
                this._indexArray = new Uint16Array([
                    0, 1, 2,
                    3, 2, 0
                ]);

                // インデックスバッファを作成
                this._indexBuffer = gl.createBuffer();
            }

            this._firstDraw = false;
        }

        // UV座標登録
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._uvArray, gl.STATIC_DRAW);

        // attribute属性を登録
        gl.vertexAttribPointer(this._uvLocation, 2, gl.FLOAT, false, 0, 0);

        // 頂点座標を登録
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._positionArray, gl.STATIC_DRAW);

        // attribute属性を登録
        gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);

        // 頂点インデックスを作成
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indexArray, gl.DYNAMIC_DRAW);

        // モデルの描画
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.drawElements(gl.TRIANGLES, this._indexArray.length, gl.UNSIGNED_SHORT, 0);
    }

}