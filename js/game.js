// 游戏设置
const game = {
  init() {
    // 初始化加载过程
    loader.init();
    mouse.init();
    // 初始化游戏canvas画面，并保存canvas的引用
    this.initCanvas();
    // 显示菜单画面
    this.hideScreens();
    this.showScreen("gamestartscreen");
    // this.showScreen('gameinterfacescreen');
  },
  hideScreens() {
    const screens = document.querySelectorAll(".gamelayer");
    for (let i = screens.length - 1; i >= 0; i--) {
      let screen = screens[i];
      screen.style.display = "none";
    }
  },
  hideScreen(id) {
    const screen = document.getElementById(id);
    screen.style.display = "none";
  },
  showScreen(id) {
    const screen = document.getElementById(id);
    screen.style.display = "block";
  },
  scale: 1,
  resize() {
    let maxWidth = window.innerWidth;
    let maxHeight = window.innerHeight;

    const scale = Math.min(maxWidth / 800, maxHeight / 600);

    const gamecontainer = document.getElementById("gamecontainer");

    gamecontainer.style.transform = `translate(-50%, -50%) scale(${scale})`;

    this.scale = scale;

    // 根据缩放比例来重新设置游戏画面尺寸
    // 将宽度设置在800～1024

    const width = Math.max(800, Math.min(1024, maxWidth / scale));

    gamecontainer.style.width = width + "px";

    const canvasWidth = width - 160;
    if (this.canvasWidth !== canvasWidth) {
      this.canvasWidth = canvasWidth;
      // 这里设置一个flag来记录浏览器是否改变大小过，用于以后判断是否需要重绘部分canvas内容
      this.canvasResized = true;
    }
  },
  // 加载地图数据
  loadLevelData(level) {
    this.currentLevel = level;
    this.currentMap = maps[level.mapName];
    // 加载地图资源
    this.currentMapImage = loader.loadImage(
      `images/maps/${maps[level.mapName].mapImage}`
    );
    this.resetArrays();
    // 加载关卡定义的全部资源
    for (let type in level.requirements) {
      const requirementArray = level.requirements[type];

      requirementArray.forEach(name => {
        if (window[type] && typeof window[type].load === "function") {
          window[type].load(name);
        } else {
          console.log("无法加载的类型：" + type);
        }
      });
    }
    level.items.forEach(itemDetails => this.add(itemDetails));
  },
  resetArrays() {
    this.couter = 0;

    this.items = [];
    this.buildings = [];
    this.vehicles = [];
    this.aircraft = [];
    this.terrain = [];
    this.selectedItems = [];
  },
  add(itemDetails) {
    // 设置唯一ID
    if (!itemDetails.uid) {
      itemDetails.uid = ++this.counter;
    }
    const item = window[itemDetails.type].add(itemDetails);

    this.items.push(item);
    this[item.type].push(item);

    return item;
  },
  // 从各个相关数组中删除数据
  remove(item) {
    item.selected = false;
    for (let i = this.selectedItems.length - 1; i >= 0; i--) {
      if (this.selectedItems[i].uid === item.uid) {
        this.selectedItems.splice(i, 1);
        break;
      }
    }
    // 从items数组中剔除item
    this.items = this.items.filter(p => p.uid !== item.uid);

    this[item.type] = this[item.type].filter(p => p.uid !== item.uid);
  },
  // 设置canvas参数
  canvasWidth: 480,
  canvasHeight: 400,
  initCanvas() {
    this.backgroundCanvas = document.getElementById("gamebackgroundcanvas");
    this.backgroundContext = this.backgroundCanvas.getContext("2d");

    this.foregroundCanvas = document.getElementById("gameforegroundcanvas");
    this.foregroundContext = this.foregroundCanvas.getContext("2d");

    this.backgroundCanvas.width = this.canvasWidth;
    this.foregroundCanvas.width = this.canvasWidth;

    this.backgroundCanvas.height = this.canvasHeight;
    this.foregroundCanvas.height = this.canvasHeight;
  },
  // 游戏开始方法
  start() {
    this.hideScreens();
    this.showScreen("gameinterfacescreen");

    this.running = true;
    this.refreshBackground = true;
    this.canvasResized = true;

    this.drawingLoop();
  },
  // 用于绘制动画的循环方法
  drawingLoop() {
    // 当鼠标在屏幕边沿，自动平移地图
    this.handlePanning();
    // 绘制背景
    this.drawBackground();

    // 游戏在进行中，则重复绘制
    requestAnimationFrame(() => this.drawingLoop());
  },
  drawBackground() {
    // 只在改变屏幕大小和平移地图时重绘地图
    if (this.refreshBackground || this.canvasResized) {
      if (this.canvasResized) {
        this.backgroundCanvas.width = this.canvasWidth;
        this.foregroundCanvas.width = this.canvasWidth;
        // 确保改变屏幕大小不会让地图移到屏幕外
        if (this.offsetX + this.canvasWidth > this.currentMapImage.width) {
          this.offsetX = this.currentMapImage.width - this.canvasWidth;
        }
        if (this.offsetY + this.canvasHeight > this.currentMapImage.height) {
          this.offsetY = this.currentMapImage.height - this.canvasHeight;
        }

        this.canvasResized = false;
      }
      this.backgroundContext.drawImage(
        this.currentMapImage,
        this.offsetX,
        this.offsetY,
        this.canvasWidth,
        this.canvasHeight,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
      this.refreshBackground = false;
    }
  },
  // 每个格子大小为20px × 20px
  gridSize: 20,
  // 地图的初始偏移值
  offsetX: 0,
  offsetY: 0,
  // 动画持续时间
  animationTimeout: 100,
  animationLoop() {},

  // 平移地图相关属性和方法

  // 设置距离canvas边框多远才能进行平移,否则触发自动平移
  panningThreshold: 60,
  // 一次绘图中最大平移距离,即自动平移时的距离
  maximumPanDistance: 10,
  handlePanning() {
    // 如果鼠标不在canvas内，不平移
    if (!mouse.insideCanvas) return;

    if (mouse.x <= this.panningThreshold) {
      // 当前鼠标在屏幕左侧边界，触发自动向左平移
      const panDistanceLeft = this.offsetX;
      if (panDistanceLeft > 0) {
        this.offsetX -= Math.min(panDistanceLeft, this.maximumPanDistance);
        this.refreshBackground = true;
      }
    } else if (mouse.x >= this.canvasWidth - this.panningThreshold) {
      // 当前鼠标在屏幕右侧边界，触发自动向右平移
      const panDistanceRight =
        this.currentMapImage.width - this.canvasWidth - this.offsetX;
      if (panDistanceRight > 0) {
        this.offsetX += Math.min(panDistanceRight, this.maximumPanDistance);
        this.refreshBackground = true;
      }
    }

    if (mouse.y <= this.panningThreshold) {
      // 当前鼠标在屏幕上侧边界，触发自动向上平移
      const panDistanceTop = this.offsetY;
      if (panDistanceTop > 0) {
        this.offsetY -= Math.min(panDistanceTop, this.maximumPanDistance);
        this.refreshBackground = true;
      }
    } else if (mouse.y >= this.canvasHeight - this.panningThreshold) {
      // 当前鼠标在屏幕下侧边界，触发自动向下平移
      const panDistanceDown =
        this.currentMapImage.height - this.canvasHeight - this.offsetY;
      if (panDistanceDown > 0) {
        this.offsetY += Math.min(panDistanceDown, this.maximumPanDistance);
        this.refreshBackground = true;
      }
    }
    // offsetX和offsetY有改变，鼠标的相关坐标也要相应更新
    if (this.refreshBackground) {
      mouse.calculateGameCoordinates();
    }
  }
};

// 绑定初始化画面onload和onresize事件
window.addEventListener(
  "load",
  () => {
    game.resize();
    game.init();
  },
  false
);

window.addEventListener("resize", () => game.resize());
