export default class ViewControl extends Laya.Script{
  public self : Laya.Sprite
  public handler : Laya.Handler 
  public view : Laya.View

  public onEnable(){
    this.self = this.owner as Laya.Sprite
    this.handler = null
    this.view = this.owner as Laya.View
  }
  

  public setShow(show:boolean){
    this.self.visible = show
  }

  public filterAllChildren(action:Function){
    for (let index = 0; index < this.self.numChildren; index++) {
      const element : Laya.Node = this.self.getChildAt(index)
      action(element)
    }
  }
}