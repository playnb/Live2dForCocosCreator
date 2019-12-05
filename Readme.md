# Live2d for CocosCreator

### 根据[Lived2d的官方WebGL示例](https://github.com/Live2D/CubismWebSamples)修改,适配 CocosCreator

#### [在线示例(手机模式打开)](http://ltp.gitee.io/gym/cocos-creator/ShaderSample/live2d/web-mobile/index.html)
  ![image](https://github.com/playnb/Live2dForCocosCreator/blob/master/res/show.gif)
---

# 使用方法

- 将 assest/components 目录中的"live2d"文件夹拷贝到项目中

  ![image](https://github.com/playnb/Live2dForCocosCreator/blob/master/res/拷贝live2d.png)

- 场景中新建节点并附加组件"Live2dComponent"

  ![image](https://github.com/playnb/Live2dForCocosCreator/blob/master/res/设置组件信息.png)

  - 设置节点 Size 作为显示 Live2d 模型的画布尺寸,设置 ScaleY 为-1(不知道为什么我设置了 RenderTexture 的 setFlipY(true)也没有用,只能用 Scale 把节点倒置过来)
  - Render Texture: 可以不填,组件会自动创建 cc.RenderTexture 和 cc.Sprite 组件
  - Scale: 显示 Live2d 模型大小(暂时没有找到 live2d 设置缩放的地方,这里直接修改 Viewport 尺寸达到缩放的目的,感觉 3 左右挺好的)
  - Fps: Live2d 的刷新率(游戏 Live2d 在 update 的时候有相当的计算量,所以这里的 fps 可以比游戏的低一些,感觉 30fps 足够了,即使 20fps 也不觉得卡)
  - Loop Idel Motion: 是否自动循环Idel动作
  - Model Name: 加载live2d模型的名字
  
- 常用函数
  - this.getComponent(Live2dComponent.live2d //获取Live2d代理对象
  - this.getComponent(Live2dComponent).live2d.getModel(0) //获取Live2d模型
  - this.getComponent(Live2dComponent).live2d.getModel(0).startMotion(动作组名, 动作编号, 切换优先级(大数值打断小数值)) //执行动作
  - 动作结束会在Live2dComponent的节点emit事件Live2dComponent.EvtMotionFinish
  - this.getComponent(Live2dComponent).live2d.getModel(0).setExpression(表情名) //做表情
  - this.getComponent(Live2dComponent).live2d.loadModel(模型名)  //加载模型,现在一次只有一个模型

# 注意事项
- 资源默认放置在 resources\live2d 文件夹中
- 由于CocosCreator的资源加载策略,自动识别资源类型与扩展名所以需要将live2d导出的资源重命名
  - XXX.moc3 => XXX_moc3.bin
  - XXX.model3.json => XXX_model3.bin
  - XXX.physics3.json => XXX_physics3.bin
  - XXX.pose3.json => XXX_pose3.bin
  - XXX.userdata3.json => XXX_userdata3.bin
  - XXX.motion3.json => XXX_motion3.bin
  - 使用脚本resource/rename_live2d.py可自动转换resource/live2d目录下的文件名


