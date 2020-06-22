
import CameraMoveScript from "../lib/CameraMove"

export default class entryHomeUI extends Laya.Scene {

    private loadingLabel : Laya.Label

    constructor() {
        super();

        

        
    }

    public onEnable() {
        super.onEnable()
        let scene = Laya.stage.addChild(Laya.loader.getRes("res/ruins3/laya_01.ls")) as Laya.Scene3D;
        var camera: Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
        camera.addComponent(CameraMoveScript);
        // for (let index = 0; index < this.numChildren; index++) {
        //     const element = this.getChildAt(index);
        //     switch (element.name) {
        //         // case 'gotoBtn':
        //         //     this.btnGoto = element.getComponent(ExtBaseButton) as ExtBaseButton
        //         //     this.btnGoto.setCallback(() => { 
        //         //         Laya.Scene.open('entry/homeScene.json')
        //         //     })
        //         //     break;
        //         case 'progress':
        //             this.loadingLabel = element as Laya.Label
        //             this.loadingLabel.visible = true
        //         default:
        //             break;
        //     }
        // }

        // Laya.View.open('utilt/header.json', false, null,Laya.Handler.create(this, (s:Laya.Node) => {
            
        //   }))

        // Laya.loader.create("res/ruins/laya_01.ls", Laya.Handler.create(this, () => {
        //     let scene = Laya.stage.addChild(Laya.loader.getRes("res/ruins/laya_01.ls")) as Laya.Scene3D;
        //     var camera: Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
        //     camera.addComponent(CameraMoveScript);
        // }), Laya.Handler.create(this, (p) => {
        //     if (this.loadingLabel) {
        //         this.loadingLabel.text = "Now Progress : " + p
        //     }
        // }))
    }

    //添加3D场景
    // var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;

    // //添加照相机
    // var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
    // camera.transform.translate(new Laya.Vector3(0, 3, 3));
    // camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

    // //添加方向光
    // var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
    // directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
    // directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));

    // //添加自定义模型
    // var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
    // box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
    // var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
    // Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function(tex:Laya.Texture2D) {
    //     material.albedoTexture = tex;
    // }));
    //     box.meshRenderer.material = material;
    // }

}