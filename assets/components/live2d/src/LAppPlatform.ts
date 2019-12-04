
function string2buffer(str) {
    // 首先将字符串转为16进制
    let val = ""
    for (let i = 0; i < str.length; i++) {
        if (val === '') {
            val = str.charCodeAt(i).toString(16)
        } else {
            val += ',' + str.charCodeAt(i).toString(16)
        }
    }
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    })).buffer
}

function stringToUint8Array(str: string): Uint8Array {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array
}

export default class Live2dPlatform {
    static lastUpdate = Date.now();

    static s_currentFrame = 0.0;
    static s_lastFrame = 0.0;
    static s_deltaTime = 0.0;

    public static loadJson(filePath: string, callback: any): void {
        let path: string = ""
        let jsonIndex = filePath.lastIndexOf(".json")
        if (jsonIndex > 0) {
            path = filePath.substr(0, jsonIndex)
            cc.loader.loadRes(path, cc.JsonAsset, (err: Error, res: cc.JsonAsset) => {
                cc.log(res.toString())
                let arrayBuffer = string2buffer(JSON.stringify(res.json))
                callback(arrayBuffer)
            })
        } else {
            cc.error("Not Json Path", filePath)
        }
        cc.log("--------------->LOAD:", path)
    }


    public static async loadArrayBuffer(filePath: string): Promise<ArrayBuffer> {
        return new Promise(function (resolve, reject) {
            /*
            let jsonIndex = filePath.lastIndexOf(".json")
            let url = "http://127.0.0.1:8080/Sample/TypeScript/Demo/"
            cc.loader.load(url + filePath, function (err, data) {
                if (jsonIndex > 0) {
                    let arrayBuffer = string2buffer(JSON.stringify(data))
                    resolve(arrayBuffer)
                } else {
                    //let arrayBuffer = string2buffer(data)
                    let buf = stringToUint8Array(data)
                    resolve(buf.buffer)
                }
            })*/

            let path = filePath.replace(".exp3.json", "_exp3")
            path = path.replace(".model3.json", "_model3")
            path = path.replace(".pose3.json", "_pose3")
            path = path.replace(".userdata3.json", "_userdata3")
            path = path.replace(".motion3.json", "_motion3")
            path = path.replace(".cdi3.json", "_cdi3")
            path = path.replace(".physics3.json", "_physics3")

            path = path.replace(".moc3", "_moc3")
            path = path.replace(".mtn", "_mtn")

            cc.loader.loadRes(path, cc.BufferAsset, (err: Error, res: cc.BufferAsset) => {
                resolve(res._buffer)
            })
        })
    }

    public static async loadFileAsBytes(filePath: string, callback: any) {
        cc.error("loadFileAsBytes 这个函数废弃了")
        //filePath;//
        let path = filePath
        let size = 0;
        fetch(path).then(
            (response) => {
                return response.arrayBuffer();
            }
        ).then(
            (arrayBuffer) => {
                size = arrayBuffer.byteLength;
                callback(arrayBuffer, size);
            }
        );
    }

    public static releaseBytes(byteData: ArrayBuffer): void {
        byteData = void 0;
    }
    public static getDeltaTime(): number {
        return this.s_deltaTime;
    }

    public static updateTime(): void {
        this.s_currentFrame = Date.now();
        this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
        this.s_lastFrame = this.s_currentFrame;
    }

    public static printMessage(message: string): void {
        console.log(message);
    }
    public static printLog(format: string, ...args: any[]): void {
        console.log(
            format.replace(
                /\{(\d+)\}/g,
                (m, k) => {
                    return args[k];
                }
            )
        );
    }
}