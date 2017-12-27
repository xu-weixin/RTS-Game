// 加载设置(音频加载，图片加载)
const loader = {
  loaded: true,
  loadedCount: 0, // 当前加载资源数
  totalCount: 0, // 总共资源数

  init() {
    // 浏览器音频检测，是否支持mp3或ogg
    let mp3Support, oggSupport;
    const audio = document.createElement("audio");
    if (audio.canPlayType) {
      // 不返回空值就表示浏览器支持
      mp3Support = "" !== audio.canPlayType("audio/mpeg");
      oggSupport = "" !== audio.canPlayType("audio/ogg");
    } else {
      // 浏览器不支持audio标签
      mp3Support = false;
      oggSupport = false;
    }
    this.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
  },

  loadImage(url) {
    this.loaded = false;
    this.totalCount = this.totalCount + 1;

    game.showScreen("loadingscreen");

    const image = new Image();

    image.addEventListener("load", e => this.itemLoaded(e), false);
    image.src = url;

    return image;
  },

  soundFileExtn: ".ogg",
  loadSound(url) {
    this.loaded = false;
    this.totalCount = this.totalCount + 1;

    game.showScreen("loadingscreen");

    const audio = new Audio();

    audio.addEventListener("canplaythrough", e => this.itemLoaded(e), false);
    audio.src = url + this.soundFileExtn;

    return audio;
  },

  itemLoaded(e) {
    // 移除事件绑定
    e.target.removeEventListener(e.type, this.itemLoaded, false);
    this.loadedCount = this.loadedCount + 1;
    document.getElementById("loadingmessage").innerHTML = `正在加载资源（${this
      .loadedCount}/${this.totalCount}）`;

    // 资源加载完毕
    if (this.loadedCount === this.totalCount) {
      // 重置变量
      this.loaded = true;
      this.loadedCount = 0;
      this.totalCount = 0;
      // 隐藏加载画面
      game.hideScreen("loadingscreen");

      // 如果存在回调，调用回调
      if (this.onload) {
        this.onload();
        this.onload = undefined;
      }
    }
  },
  // 加载游戏单位的通用方法
  loadItem(name) {
    const item = this.list[name];
    // 如果已经加载，则不用重复加载
    if (item.spriteArray) {
      return;
    }
    item.spriteSheet = loader.loadImage(
      `images/${this.defaults.type}/${name}.png`
    );
    item.spriteArray = {};
    item.spriteCount = 0;
    // 每种雪碧图状态下的信息
    item.spriteImages.forEach(spriteImage => {
      const {
        count: constructImageCount,
        name,
        directions: constructDirectionCount
      } = spriteImage;

      // 如果定义了动画方向，则按顺序存入数组
      if (constructDirectionCount) {
        for (let i = 0; i < constructDirectionCount; i++) {
          let constructImageName = `${name}-${i}`;
          item.spriteArray[constructImageName] = {
            name: constructImageName,
            count: constructImageCount,
            offset: item.spriteCount
          };
          item.spriteCount += constructImageCount;
        }
      } else {
        let constructImageName = name;

        item.spriteArray[constructImageName] = {
          name: constructImageName,
          count: constructImageCount,
          offset: item.spriteCount
        };

        item.spriteCount += constructImageCount;
      }
    });
  },

  // 将属性添加到游戏单位
  addItem(details) {
    // const defaults = this.defaults;
    const name = details.name;
    // const entity = this.list[name];
    const item = Object.assign({}, baseItem);
    Object.assign(item, this.defaults);
    Object.assign(item, this.list[name]);
    // const item = { ...baseItem, ...defaults, ...entity };
    item.life = item.hitPoints;
    Object.assign(item, details);
    return item;
    // return { ...item, ...details };
  }
};

const baseItem = {
  animationIndex: 0,
  direction: 0,
  selected: false,
  selectable: true,
  orders: { type: "stand" },
  action: "stand",
  // 默认的动画渲染方法
  animate() {
    if (this.life > this.hitPoints * 0.4) {
      // 血量大于40%，保持正常态
      this.lifeCode = "healthy";
    } else if (this.life > 0) {
      // 0~40%，为受损态
      this.lifeCode = "damaged";
    } else {
      this.lifeCode = "dead";
      game.remove(this);
      return;
    }
    // 处理指令过程
    this.processActions();
  },
  // 绘制物体方法
  draw() {
    // 绘制坐标
    this.drawingX = this.x * game.gridSize - game.offsetX - this.pixelOffsetX;
    this.drawingY = this.y * game.gridSize - game.offsetY - this.pixelOffsetY;
    this.drawSprite();
  }
};

// Polyfill for a few browsers that still do not support Object.assign
if (typeof Object.assign !== "function") {
  // .length of function is 2
  Object.assign = function(target, varArgs) {
    "use strict";
    // TypeError if undefined or null
    if (target === null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];
      // Skip over if undefined or null
      if (nextSource != null) {
        // Avoid bugs when hasOwnProperty is shadowed
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}
