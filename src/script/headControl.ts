import ViewControl from "../lib/viewComponment";

import GameSetting from "./gameSetting"
import ExtBaseButton from '../lib/ExtBaseButton'
export default class headControl extends ViewControl { 

  private extBackBtn: ExtBaseButton
  public onEnable() {
    super.onEnable()
    this.filterAllChildren((element:Laya.Node) => {
      switch (element.name) {
        case 'btnBack':
          this.extBackBtn = element.getComponent(ExtBaseButton)
          this.extBackBtn.setCallback(() => {
            Laya.Scene.open(GameSetting.homeScene)
          })
          break;
      
        default:
          break;
      }
    })
  }
}