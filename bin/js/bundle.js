(function () {
  'use strict';

  class CameraMoveScript extends Laya.Script3D {
      constructor() {
          super();
          this.isMouseDown = false;
          this._tempVector3 = new Laya.Vector3();
          this.yawPitchRoll = new Laya.Vector3();
          this.resultRotation = new Laya.Quaternion();
          this.tempRotationZ = new Laya.Quaternion();
          this.tempRotationX = new Laya.Quaternion();
          this.tempRotationY = new Laya.Quaternion();
          this.rotaionSpeed = 0.0006;
      }
      onAwake() {
          Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
          Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
          this.camera = this.owner;
      }
      _onDestroy() {
          Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
          Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
      }
      onUpdate() {
          var elapsedTime = Laya.timer.delta;
          if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
              var scene = this.owner.scene;
              Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);
              Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);
              Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);
              Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);
              Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);
              Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);
              var offsetX = Laya.stage.mouseX - this.lastMouseX;
              var offsetY = Laya.stage.mouseY - this.lastMouseY;
              var yprElem = this.yawPitchRoll;
              yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
              yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
              this.updateRotation();
          }
          this.lastMouseX = Laya.stage.mouseX;
          this.lastMouseY = Laya.stage.mouseY;
      }
      mouseDown(e) {
          this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
          this.lastMouseX = Laya.stage.mouseX;
          this.lastMouseY = Laya.stage.mouseY;
          this.isMouseDown = true;
      }
      mouseUp(e) {
          this.isMouseDown = false;
      }
      moveForward(distance) {
          this._tempVector3.x = 0;
          this._tempVector3.y = 0;
          this._tempVector3.z = distance;
          this.camera.transform.translate(this._tempVector3);
      }
      moveRight(distance) {
          this._tempVector3.y = 0;
          this._tempVector3.z = 0;
          this._tempVector3.x = distance;
          this.camera.transform.translate(this._tempVector3);
      }
      moveVertical(distance) {
          this._tempVector3.x = this._tempVector3.z = 0;
          this._tempVector3.y = distance;
          this.camera.transform.translate(this._tempVector3, false);
      }
      updateRotation() {
          if (Math.abs(this.yawPitchRoll.y) < 1.50) {
              Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
              this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
              this.camera.transform.localRotation = this.camera.transform.localRotation;
          }
      }
  }

  class entryHomeUI extends Laya.Scene {
      constructor() {
          super();
      }
      onEnable() {
          super.onEnable();
          let scene = Laya.stage.addChild(Laya.loader.getRes("res/ruins3/laya_01.ls"));
          var camera = scene.getChildByName("Main Camera");
          camera.addComponent(CameraMoveScript);
      }
  }

  class ExtBaseButton extends Laya.Script {
      constructor() {
          super(...arguments);
          this.widthValue = 0;
          this.heightValue = 0;
          this.scaleDuration = 100;
          this.scaleSize = 0.8;
          this.scaleOri = 1;
          this.onClicked = null;
          this.onCooldownDone = null;
          this.nowState = 0;
          this.isDisable = false;
          this.isChecked = false;
          this.isFrozen = false;
          this.isCheckBox = false;
          this.isCooldown = false;
          this.isPurchasing = false;
          this.isSilence = false;
          this.newLabel = null;
          this.labelInited = false;
          this.labelText = null;
          this.labelFilters = [];
          this.labelOffset = null;
          this.valueZone = null;
          this.valueLabel = null;
          this.countLabel = null;
          this.cooldownZone = null;
          this.cooldownTimeLabel = null;
          this.isOnCooldown = false;
          this.coverColor = '#000000';
      }
      setCallback(callback, cooldownDone = null) {
          this.onClicked = callback;
          this.onCooldownDone = cooldownDone;
      }
      triggerClick() {
          this.onMouseUp();
      }
      toggleChcek(checked = false) {
          this.isChecked = checked;
          this.owner.skin = checked && this.checkSkin ? this.checkSkin : this.mainSkin;
          if (this.valueZone)
              this.valueZone.visible = !checked;
          if (this.isCooldown) {
              this.toggleCooldown(checked);
          }
      }
      toggleDiable(disabled = false) {
          this.isDisable = disabled;
          this.owner.gray = this.isDisable;
      }
      toggleFrozen(freeze) {
          this.isFrozen = freeze;
      }
      toggleSilence(silence) {
          this.isSilence = silence;
      }
      toggleCooldown(cooldown) {
          this.isOnCooldown = cooldown;
          if (cooldown) {
              this.timeLeft = this.cooldownDuration * 1000;
              this.nowAngle = -90;
              this.strideDuration = this.cooldownDuration * 1000 / 360;
              if (this.cooldownZone) {
                  this.cooldownZone.visible = true;
                  if (this.cooldownTimeLabel) {
                      this.cooldownTimeLabel.changeText(this.countTime());
                  }
              }
              if (this.valueZone) {
                  this.valueZone.visible = false;
              }
              Laya.timer.loop(this.strideDuration, this, this.coverDown);
          }
          else {
              Laya.timer.clear(this, this.coverDown);
              if (this.cooldownZone) {
                  this.cooldownZone.visible = false;
              }
              if (this.isPurchasing) {
                  this.setValueZone();
              }
              this.toggleFrozen(false);
              this.cover.graphics.clear();
          }
      }
      scaleSmall() {
          Laya.Tween.to(this.owner, { scaleX: this.scaleSize, scaleY: this.scaleSize }, this.scaleDuration);
      }
      scaleBig() {
          Laya.Tween.to(this.owner, { scaleX: this.scaleOri, scaleY: this.scaleOri }, this.scaleDuration);
      }
      onMouseOver() {
      }
      onMouseOut() {
          this.scaleBig();
      }
      onMouseDown() {
          if (!this.isDisable && !this.isFrozen) {
              this.scaleSmall();
          }
      }
      onMouseUp() {
          this.scaleBig();
          if (!this.isDisable && !this.isFrozen && this.onClicked && !this.isSilence) {
              this.onClicked();
          }
      }
      onEnable() {
          this.button = this.owner;
          this.button.stateNum = 1;
          this.button.skin = this.isChecked && this.checkSkin
              ? this.checkSkin
              : this.mainSkin;
          this.button.width = this.widthValue;
          this.button.height = this.heightValue;
          this.button.anchorX = 0.5;
          this.button.anchorY = 0.5;
          if (this.labelSetting && this.labelSetting[0]) {
              this.newLabel = new Laya.Label(`${this.labelText ? this.labelText : 'Label'}`);
              this.newLabel.bold = this.labelSetting[1];
              this.newLabel.fontSize = this.labelSetting[2];
              this.newLabel.color = this.labelSetting[3];
              this.newLabel.stroke = this.labelSetting[4];
              this.newLabel.strokeColor = this.labelSetting[5];
              this.newLabel.align = "center";
              this.newLabel.valign = "middle";
              this.newLabel.anchorX = 0.5;
              this.newLabel.anchorY = 0.5;
              this.labelFilters = this.labelFilters.length > 0 ? this.labelFilters : [];
              const offset = this.labelOffset ? this.labelOffset : new Laya.Point(0, -5);
              this.owner.addChild(this.newLabel.size(this.button.width, this.labelSetting[2] + 10).pos(this.button.width / 2 + offset.x, this.button.height / 2 + offset.y));
              this.labelInited = true;
          }
          if (this.coolDownSetting && this.coolDownSetting[0]) {
              this.isCooldown = true;
              this.cover = new Laya.Sprite();
              let image = new Laya.Image(this.button.skin);
              this.cover.mask = image;
              this.cover.alpha = 0.5;
              this.cover.pivot(image.width / 2, image.height / 2);
              this.button.addChild(this.cover.pos(image.width / 2, image.height / 2));
              this.radius = image.height > image.width ? image.height : image.width;
          }
          if (this.purchasingSetting && this.purchasingSetting[0]) {
              this.isPurchasing = true;
          }
      }
      setMainSkin(skin) {
          this.owner.skin = skin;
      }
      setLabelText(text) {
          if (this.labelInited) {
              this.newLabel.text = text;
          }
          else {
              this.labelText = text;
          }
      }
      setLabelFilter(filters) {
          if (this.labelInited) {
              this.newLabel.filters = filters;
          }
          else {
              this.labelFilters = filters;
          }
      }
      setLabelOffset(x, y) {
          if (this.labelInited) {
              this.newLabel.pos(this.newLabel.x + x, this.newLabel.y + y);
          }
          else {
              this.labelOffset = new Laya.Point(x, y);
          }
      }
      setAddonItem(param) {
          this.valueZone = param.valueZone || null;
          this.valueLabel = param.valueLabel || null;
          this.cooldownZone = param.cooldownZone || null;
          this.cooldownTimeLabel = param.timeLabel || null;
          this.countLabel = param.countLabel || null;
          this.countValue = param.count || 0;
          this.cooldownDuration = param.duration || 30;
          if (this.cooldownZone)
              this.cooldownZone.visible = false;
          if (this.countLabel)
              this.countLabel.text = `${this.countValue}`;
          if (this.valueLabel)
              this.valueLabel.changeText(`${param.addonValue}`);
          this.setValueZone();
      }
      setCount(count) {
          this.countValue = count;
          if (this.countLabel) {
              this.countLabel.text = `${count}`;
              this.setValueZone();
          }
      }
      setValue(text) {
          if (this.valueLabel) {
              this.valueLabel.changeText(`${text}`);
          }
      }
      setValueZone() {
          if (this.valueZone) {
              this.valueZone.visible = !this.isChecked && !this.isOnCooldown && this.countValue == 0;
          }
      }
      coverDown() {
          this.nowAngle += 1;
          if (this.coolDownSetting[2] && this.cooldownTimeLabel) {
              this.timeLeft -= this.strideDuration;
              this.cooldownTimeLabel.text = this.countTime();
          }
          this.cover.graphics.clear();
          this.cover.graphics.drawPie(this.cover.pivotX, this.cover.pivotY, this.radius, -90, this.nowAngle, this.coverColor);
          if (this.nowAngle >= 270) {
              this.toggleChcek(false);
              if (this.onCooldownDone) {
                  this.onCooldownDone();
              }
          }
      }
      countTime() {
          let totalSeconds = this.timeLeft / 1000;
          let hours = Math.floor(totalSeconds / 3600);
          let minius = Math.floor((totalSeconds - hours * 3600) / 60);
          let second = Math.floor(totalSeconds - hours * 3600 - minius * 60);
          let hoursStr = hours > 0
              ? hours >= 10
                  ? hours
                  : "0" + hours
              : "";
          let miniusStr = minius > 0
              ? minius >= 10
                  ? minius
                  : "0" + minius
              : "00";
          let secondStr = second > 0
              ? second >= 10
                  ? second
                  : "0" + second
              : "00";
          return hoursStr != ""
              ? hoursStr + ":" + miniusStr + ":" + secondStr
              : miniusStr + ":" + secondStr;
      }
  }

  class GameUI extends Laya.Scene {
      constructor() {
          super();
          this.isMouseDown = false;
          this.hybrantSpeed = 0.01;
          var scene = Laya.stage.addChild(new Laya.Scene3D());
          var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
          camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
          var directionLight = new Laya.DirectionLight();
          scene.addChild(directionLight);
          directionLight.color = new Laya.Vector3(1, 1, 1);
          directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
          Laya.loader.create("res/ruins/hydrant.lh", Laya.Handler.create(this, () => {
              this.hybrant = scene.addChild(Laya.Loader.getRes("res/ruins/hydrant.lh"));
              var scale = new Laya.Vector3(.3, .3, .3);
              this.hybrant.transform.localScale = scale;
              this.hybrant.transform.rotate(new Laya.Vector3(0, 3.14, 0));
              this.progressBar.visible = false;
          }), Laya.Handler.create(this, (p) => {
              if (this.progressBar) {
                  this.progressBar.value = p;
              }
          }, null, false));
      }
      onAwake() {
      }
      _onDestroy() {
          Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
          Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
          Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
      }
      mouseDown() {
          this.lastMouseX = Laya.stage.mouseX;
          this.lastMouseY = Laya.stage.mouseY;
          this.isMouseDown = true;
      }
      mouseUp() {
          this.isMouseDown = false;
      }
      mouseMove() {
          var elapsedTime = Laya.timer.delta;
          if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown && this.hybrant) {
              var offsetX = Laya.stage.mouseX - this.lastMouseX;
              var offsetY = Laya.stage.mouseY - this.lastMouseY;
              this.hybrant.transform.rotate(new Laya.Vector3(0, offsetX * this.hybrantSpeed, 0));
          }
          this.lastMouseX = Laya.stage.mouseX;
          this.lastMouseY = Laya.stage.mouseY;
      }
      onEnable() {
          super.onEnable();
          Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
          Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
          Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
          for (let index = 0; index < this.numChildren; index++) {
              const element = this.getChildAt(index);
              switch (element.name) {
                  case 'gotoBtn':
                      this.btnGoto = element.getComponent(ExtBaseButton);
                      this.btnGoto.setAddonItem({
                          cooldownZone: new Laya.Image('uipng/buttonempty_01.png'),
                          duration: 15
                      });
                      this.btnGoto.setLabelText("进入场景");
                      this.btnGoto.setCallback(() => {
                          this.progressBar.visible = true;
                          this.btnGoto.toggleCooldown(true);
                          Laya.loader.create("res/ruins3/laya_01.ls", Laya.Handler.create(this, () => {
                              this.progressBar.visible = false;
                              Laya.Scene.open('entry/homeScene.json');
                          }), Laya.Handler.create(this, (p) => {
                              if (this.progressBar) {
                                  this.progressBar.value = p;
                              }
                          }));
                      });
                      break;
                  case 'loadingBar':
                      this.progressBar = element;
                      this.progressBar.visible = true;
                      this.progressBar.value = 0;
                      break;
                      break;
                  default:
                      break;
              }
          }
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("script/entryHomeControl.ts", entryHomeUI);
          reg("script/GameUI.ts", GameUI);
          reg("lib/ExtBaseButton.ts", ExtBaseButton);
      }
  }
  GameConfig.width = 1080;
  GameConfig.height = 1920;
  GameConfig.scaleMode = "fixedwidth";
  GameConfig.screenMode = "vertical";
  GameConfig.alignV = "middle";
  GameConfig.alignH = "center";
  GameConfig.startScene = "test/TestScene.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
      }
  }
  new Main();

}());
