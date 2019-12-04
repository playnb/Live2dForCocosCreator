import Live2dComponent from "../components/live2d/Live2dComponent";
import Live2dDefine from "../components/live2d/src/LAppDefine";
import Live2dModel from "../components/live2d/src/LAppModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TheGirl extends cc.Component {

    // onLoad () {}

    start() {
        let self = this
        self.getComponentInChildren(Live2dComponent).node.on(Live2dComponent.EvtMotionFinish, (model: Live2dModel) => {
            cc.find("Canvas/UI/New Label").getComponent(cc.Label).string = "动作结束"
            cc.find("Canvas/UI/New Label").getComponent(cc.Label).node.color = cc.Color.YELLOW
        })
        self.getComponentInChildren(Live2dComponent).loopIdelMotion = false
    }

    update(dt: number) {
    }

    changeMotion1() {
        this.getComponentInChildren(Live2dComponent).live2d.getModel(0).startRandomMotion(Live2dDefine.MotionGroupIdle, Live2dDefine.PriorityIdle)
        cc.find("Canvas/UI/New Label").getComponent(cc.Label).string = "切换动作"
        cc.find("Canvas/UI/New Label").getComponent(cc.Label).node.color = cc.Color.GREEN
    }
    changeMotion2() {
        this.getComponentInChildren(Live2dComponent).live2d.getModel(0).startRandomMotion(Live2dDefine.MotionGroupTapBody, Live2dDefine.PriorityForce)
        cc.find("Canvas/UI/New Label").getComponent(cc.Label).string = "切换动作"
        cc.find("Canvas/UI/New Label").getComponent(cc.Label).node.color = cc.Color.GREEN
    }

    randomExpression() {
        this.getComponentInChildren(Live2dComponent).live2d.getModel(0).setRandomExpression()
    }

    changeModel(toggle: cc.Toggle, name: string) {
        this.getComponentInChildren(Live2dComponent).live2d.loadModel(name)
    }
}
