/*
 * @Author: Odie Robin (odierobin@gmail.com) 
 * @Date: 2019-08-19 09:40:25 
 * @Last Modified by: Odie Robin
 * @Last Modified time: 2019-10-22 16:11:38
 */

// import AudioManager from '../center/AudioManager';
// import GameConstant from '../GameConstant';

export default class ExtBaseButton extends Laya.Script{

    /** @prop {name:widthValue,tips:"定义宽度",type:Int,default:0}*/
    public widthValue : number = 0
    /** @prop {name:heightValue,tips:"定义高度",type:Int,default:0}*/
    public heightValue : number = 0
    /** @prop {name:scaleDuration,tips:"定义缩放时长",type:Int,default:100}*/
    public scaleDuration : number = 100
    /** @prop {name:scaleSize,tips:"定义缩放比例",type:Number,default:0.8}*/
    public scaleSize : number = 0.8
    /** @prop {name:scaleOri,tips:"定义缩放基础比例",type:Number,default:1}*/
    public scaleOri : number = 1
    /** @prop {name:mainSkin,tips:"定义默认图片",type:string,accept:res}*/
    public mainSkin : string;
    /** @prop {name:checkSkin,tips:"定义选中图片",type:string,accept:res}*/
    public checkSkin : string;
    /** @prop {name:labelSetting,type:Vector,labels:"使用Label,使用粗体,字体尺寸,字体颜色,边框尺寸,边框颜色",types:"Boolean,Boolean,Number,String,Number,String",xCount:1,sType:Number}*/
    public labelSetting : any;
    /** @prop {name:coolDownSetting,type:Vector,labels:"使用Cooldown,显示时间,冷冻按钮",types:"Boolean,Boolean,Boolean",xCount:1,sType:Number}*/
    public coolDownSetting : any;
    /** @prop {name:purchasingSetting,type:Vector,labels:"使用Purchas,数量价格互斥",types:"Boolean,Boolean",xCount:1,sType:Number}*/
    public purchasingSetting : any;



    private onClicked : Function = null
    private onCooldownDone : Function = null
    private nowState : number = 0  // 0 nomal,1 hover, 2 down
    private isDisable : boolean = false
    public isChecked : boolean = false
    private isFrozen : boolean = false
    private isCheckBox : boolean = false
    private isCooldown : boolean = false
    private isPurchasing : boolean = false
    private isSilence : boolean = false
    private newLabel : Laya.Label = null
    private labelInited : boolean = false
    private labelText : string = null
    private labelFilters : Laya.GlowFilter[] = []
    private labelOffset : Laya.Point = null

    private valueZone : Laya.Image = null
    private valueLabel : Laya.Label = null
    private countLabel : Laya.Label = null

    private cooldownZone : Laya.Image = null
    private cooldownTimeLabel : Laya.Label = null

    


    private isOnCooldown : boolean = false
    private cover : Laya.Sprite
    private timeLeft : number
    private radius : number
    private nowAngle : number
    private strideDuration : number
    private coverColor : string = '#000000'
    private countValue : number
    private cooldownDuration : number
    

    private button : Laya.Button;

    public setCallback(callback : Function,cooldownDone :Function = null){
        this.onClicked = callback
        this.onCooldownDone = cooldownDone
    }

    public triggerClick(){
        this.onMouseUp()
    }

    public toggleChcek(checked : boolean = false){
        this.isChecked = checked;
        (this.owner as Laya.Button).skin = checked && this.checkSkin ? this.checkSkin : this.mainSkin

        if(this.valueZone) this.valueZone.visible = !checked
        
        if(this.isCooldown){
            this.toggleCooldown(checked)
        }
    }

    public toggleDiable(disabled : boolean = false){
        this.isDisable = disabled;
        (this.owner as Laya.Button).gray = this.isDisable
    } 

    public toggleFrozen(freeze : boolean){
        this.isFrozen = freeze
    }

    public toggleSilence(silence : boolean){
        this.isSilence = silence
    }

    public toggleCooldown(cooldown : boolean){
        this.isOnCooldown = cooldown

        if(cooldown){
            this.timeLeft = this.cooldownDuration * 1000
            this.nowAngle = -90
            this.strideDuration = this.cooldownDuration * 1000 / 360
            if(this.cooldownZone){
                this.cooldownZone.visible = true
                if(this.cooldownTimeLabel){
                    this.cooldownTimeLabel.changeText(this.countTime())
                }
            }
            if(this.valueZone){
                this.valueZone.visible = false
            }
            Laya.timer.loop(this.strideDuration,this,this.coverDown)
        }else{
            Laya.timer.clear(this,this.coverDown)
            if(this.cooldownZone){
                this.cooldownZone.visible = false
            }
            if(this.isPurchasing){
                this.setValueZone()
            }
            this.toggleFrozen(false)
            this.cover.graphics.clear()
        }
    }


    private scaleSmall():void{
        Laya.Tween.to((this.owner as Laya.Button), { scaleX: this.scaleSize, scaleY: this.scaleSize }, this.scaleDuration);
    }
    private scaleBig():void{
        Laya.Tween.to((this.owner as Laya.Button), { scaleX: this.scaleOri, scaleY:this.scaleOri }, this.scaleDuration);
    }

    public onMouseOver(){

    }

    public onMouseOut(){
        this.scaleBig()
    }

    public onMouseDown(){
        if(!this.isDisable && !this.isFrozen){
            this.scaleSmall()
        }
    }

    public onMouseUp(){
        this.scaleBig()
        //[AUDIO]=======[AUDIO]
        // AudioManager.instance.playSound(GameConstant.MUSICTYPE.TOUCH)
        if(!this.isDisable && !this.isFrozen && this.onClicked && !this.isSilence){
            this.onClicked()
        }
    }

    // public onClick(){
    //     this.onMouseDown()
    // }


    public onEnable(){
        this.button = this.owner as Laya.Button
        this.button.stateNum = 1
        this.button.skin = this.isChecked && this.checkSkin
            ? this.checkSkin
            : this.mainSkin
        this.button.width = this.widthValue
        this.button.height = this.heightValue
        this.button.anchorX = 0.5
        this.button.anchorY = 0.5

        if(this.labelSetting && this.labelSetting[0]){
            this.newLabel = new Laya.Label(`${this.labelText ? this.labelText: 'Label'}`)
            this.newLabel.bold = this.labelSetting[1] as boolean
            this.newLabel.fontSize = this.labelSetting[2] as number
            this.newLabel.color = this.labelSetting[3] as string
            this.newLabel.stroke = this.labelSetting[4] as number
            this.newLabel.strokeColor = this.labelSetting[5] as string
            this.newLabel.align = "center"
            this.newLabel.valign = "middle"
            this.newLabel.anchorX = 0.5
            this.newLabel.anchorY = 0.5
            this.labelFilters = this.labelFilters.length > 0 ? this.labelFilters : []
            const offset = this.labelOffset ? this.labelOffset : new Laya.Point(0,-5)
            this.owner.addChild(this.newLabel.size(this.button.width,this.labelSetting[2] + 10).pos(this.button.width / 2 + offset.x,this.button.height / 2 + offset.y))
            this.labelInited = true

        }

        if(this.coolDownSetting && this.coolDownSetting[0]){
            this.isCooldown = true
            this.cover = new Laya.Sprite()
            let image = new Laya.Image(this.button.skin)
            this.cover.mask = image
            this.cover.alpha = 0.5
            this.cover.pivot(image.width / 2,image.height / 2)
            this.button.addChild(this.cover.pos(image.width / 2,image.height / 2))
            this.radius = image.height > image.width ? image.height : image.width
            // this.cover.graphics.drawPie(this.cover.pivotX,this.cover.pivotY,this.radius,-90,150,this.coverColor)
        }

        if(this.purchasingSetting && this.purchasingSetting[0]){
            this.isPurchasing = true
        }
    }

    public setMainSkin(skin:string){
        (this.owner as Laya.Button).skin = skin
    }

    public setLabelText(text : string){

        if(this.labelInited){
            this.newLabel.text = text
        }else{
            this.labelText = text
        }
    }

    public setLabelFilter(filters:Laya.GlowFilter[]){
        if(this.labelInited){
            this.newLabel.filters = filters
        }else{
            this.labelFilters = filters
        }
    }

    public setLabelOffset(x:number,y:number){
        if(this.labelInited){
            this.newLabel.pos(this.newLabel.x + x,this.newLabel.y + y)
        }else{
            this.labelOffset = new Laya.Point(x,y)
        }
    }


    public setAddonItem(param:any){
        this.valueZone = param.valueZone || null
        this.valueLabel = param.valueLabel || null
        this.cooldownZone = param.cooldownZone || null
        this.cooldownTimeLabel = param.timeLabel || null
        this.countLabel = param.countLabel || null
        this.countValue = param.count || 0
        this.cooldownDuration = param.duration || 30
        
        if(this.cooldownZone) this.cooldownZone.visible = false
        if(this.countLabel) this.countLabel.text = `${this.countValue}`
        if(this.valueLabel) this.valueLabel.changeText(`${param.addonValue}`)
        this.setValueZone()
    }

    public setCount(count : number){
        this.countValue = count
        if(this.countLabel){
            this.countLabel.text = `${count}`
            this.setValueZone()
        }
    }

    public setValue(text : string){
        if(this.valueLabel){
            this.valueLabel.changeText(`${text}`)
        }
    }

    private setValueZone(){
        if(this.valueZone){
            this.valueZone.visible = !this.isChecked && !this.isOnCooldown && this.countValue == 0
        }
    }

    private coverDown(){
        this.nowAngle += 1
        
        if(this.coolDownSetting[2] && this.cooldownTimeLabel){
            this.timeLeft -= this.strideDuration
            this.cooldownTimeLabel.text = this.countTime()
        }
        this.cover.graphics.clear()
        this.cover.graphics.drawPie(this.cover.pivotX,this.cover.pivotY,this.radius,-90,this.nowAngle,this.coverColor)
        if(this.nowAngle >= 270){
            this.toggleChcek(false)
            if(this.onCooldownDone){
                this.onCooldownDone()
            }
        }
    }

    private countTime():string{
        let totalSeconds = this.timeLeft / 1000
        let hours = Math.floor(totalSeconds / 3600 )
        let minius = Math.floor((totalSeconds - hours * 3600) / 60)
        let second = Math.floor(totalSeconds - hours * 3600 - minius * 60)
        let hoursStr = hours > 0 
            ? hours >= 10
            ? hours
            : "0" + hours
            : ""
        let miniusStr = minius > 0 
            ? minius >= 10
            ? minius
            : "0" + minius
            : "00"
        let secondStr = second > 0 
            ? second >= 10
            ? second
            : "0" + second
            : "00"
        return hoursStr != "" 
            ? hoursStr + ":" + miniusStr + ":" + secondStr
            : miniusStr + ":" + secondStr
    }

}