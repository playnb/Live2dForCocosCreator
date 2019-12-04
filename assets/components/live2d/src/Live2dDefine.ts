
import { LogLevel } from "../CubismSdkForWeb/Framework/live2dcubismframework";

export default class Live2dDefine {

    static get ModelDir(): string[] { return ["Haru", "Hiyori", "Mark", "Natori", "Rice"] }
    static get ModelDirSize(): number { return Live2dDefine.ModelDir.length }
    static get ViewLogicalLeft(): number { return -1.0 }
    static get ViewLogicalRight(): number { return 1.0 }

    static get ViewMaxScale(): number { return 2.0 }
    static get ViewMinScale(): number { return 0.8 }

    static get ResourcesPath(): string { return "./live2d/" }
    static get BackImageName(): string { return "back_class_normal.png" }

    static get DebugLogEnable(): boolean { return true }

    static get HitAreaNameHead(): string { return "Head" }
    static get HitAreaNameBody(): string { return "Body" }

    static get MotionGroupIdle(): string { return "Idle"; }
    static get MotionGroupTapBody(): string { return "TapBody"; }

    static get PriorityNone(): number { return 0 }
    static get PriorityIdle(): number { return 1 }
    static get PriorityNormal(): number { return 2 }
    static get PriorityForce(): number { return 3 }

    static get CubismLoggingLevel(): LogLevel { return LogLevel.LogLevel_Verbose }
}