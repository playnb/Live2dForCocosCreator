import Live2dComponent from "../components/live2d/Live2dComponent";
import Live2dDefine from "../components/live2d/src/Live2dDefine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class TheGirl extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private callRender: boolean = false
    start() {
        let self = this
        this.node.on(cc.Node.EventType.TOUCH_START, (evt: cc.Event.EventTouch) => {
            let model = self.getComponent(Live2dComponent).live2d.getModel(0)
            model.startRandomMotion("TapBody", Live2dDefine.PriorityNormal)
            cc.log("Tap")
        })

        let tex = new cc.RenderTexture()
        tex.initWithSize(100, 100)
        let c = cc.find("Canvas/New Camera").getComponent(cc.Camera)
        if (c.enabled) {
            c.enabled = false
            c.targetTexture = tex
            c.render(this.node)
        }
    }

    update(dt: number) {
        //cc.find("Canvas/New Camera").getComponent(cc.Camera).render(this.node)
        if (this.callRender) {
            let c = cc.find("Canvas/New Camera").getComponent(cc.Camera)
            c.render(this.node)
        }
        //c["beforeDraw"]()
    }
}
