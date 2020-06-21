
import ExtBaseButton from "../lib/ExtBaseButton"

export default class GameUI extends Laya.Scene{

    private btnGoto: ExtBaseButton
    // private loadingLabel : Laya.Label
    private progressBar: Laya.ProgressBar
    private coolDownZone : Laya.Image


    private hybrant: Laya.Sprite3D
    private isMouseDown : boolean  = false
    private lastMouseX: number
    private lastMouseY: number
    private hybrantSpeed : number = 0.01
    
    constructor() {
        super();
		
        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;

        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
		// camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);

        //添加方向光
        var directionLight = new Laya.DirectionLight();
		scene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(1, 1, 1);
		directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
        //添加自定义模型
        // var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
        // box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        // var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		// Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function(tex:Laya.Texture2D) {
		// 		material.albedoTexture = tex;
		// }));
        // box.meshRenderer.material = material;

        // Laya.Sprite3D.load("res/ruins/hydrant.lh", Laya.Handler.create(null, (hybrant: Laya.Sprite3D) => { 
        //     scene.addChild(hybrant)
        // }))
        
        Laya.loader.create("res/ruins/hydrant.lh", Laya.Handler.create(this, () => { 
            this.hybrant = scene.addChild(Laya.Loader.getRes("res/ruins/hydrant.lh")) as Laya.Sprite3D
            var scale = new Laya.Vector3(.3, .3, .3);
            this.hybrant.transform.localScale = scale;
            this.hybrant.transform.rotate(new Laya.Vector3(0, 3.14, 0))
            this.progressBar.visible = false
        }), Laya.Handler.create(this, (p) => { 
            if (this.progressBar) {
                this.progressBar.value = p
            }
        },null,false));
        
    }

    onAwake(){
        
    }
    
    _onDestroy() {
        //关闭监听函数
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    private mouseDown() {
        //获得鼠标的xy值
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        //设置bool值
        this.isMouseDown = true;
    }
    private mouseUp() {
        this.isMouseDown = false
    }

    mouseMove() {
        var elapsedTime = Laya.timer.delta;
        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown && this.hybrant) {
            var offsetX = Laya.stage.mouseX - this.lastMouseX;
            var offsetY = Laya.stage.mouseY - this.lastMouseY;
            this.hybrant.transform.rotate(new Laya.Vector3(0, offsetX * this.hybrantSpeed, 0))
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        
        
    }

    public onEnable() {
        super.onEnable()
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.mouseMove)
        for (let index = 0; index < this.numChildren; index++) {
            const element = this.getChildAt(index);
            switch (element.name) {
                case 'gotoBtn':
                    this.btnGoto = element.getComponent(ExtBaseButton) as ExtBaseButton
                    this.btnGoto.setAddonItem({
                        cooldownZone: new Laya.Image('uipng/buttonempty_01.png'),
                        duration:15
                    })
                    this.btnGoto.setLabelText("进入场景")
                    this.btnGoto.setCallback(() => { 
                        // Laya.Scene.open('entry/homeScene.json')
                        this.progressBar.visible = true
                        this.btnGoto.toggleCooldown(true)
                        Laya.loader.create("res/ruins/laya_01.ls", Laya.Handler.create(this, () => {
                            this.progressBar.visible = false
                            Laya.Scene.open('entry/homeScene.json')
                        }), Laya.Handler.create(this, (p) => {
                            if (this.progressBar) {
                                this.progressBar.value = p
                            }
                        }))
                    })
                    break;
                case 'loadingBar':
                    this.progressBar = element as Laya.ProgressBar
                    this.progressBar.visible = true
                    this.progressBar.value = 0
                    break
                // case 'CoolZone':
                //     this.coolDownZone = element as Laya.Image
                    break
                default:
                    break;
            }
        }
    }
}