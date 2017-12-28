// 这里使用var声明，将buildings变成顶层对象，便于全局访问
var buildings = {
  // 所有建筑单位都放在list数组里
  list: {
    // 基地
    // 基地游戏开始便存在，花费相关资源可以建造，基地之间可以传送其他单位
    base: {
      name: "base",
      // 下面是绘制基地的一些属性

      // 雪碧图上基地的大小
      pixelWidth: 60,
      pixelHeight: 60,
      // 绘制在地图上的基地大小
      baseWidth: 40,
      baseHeight: 40,
      // 雪碧图上基地开始绘制的坐标
      pixelOffsetX: 0,
      pixelOffsetY: 20,
      // 地图上基地占据的格子坐标
      buildableGrid: [[1, 1], [1, 1]],
      // 可通过的格子坐标
      passableGrid: [[1, 1], [1, 1]],
      // 可见距离
      sight: 3,
      // 生命值
      hitPoints: 500,
      // 造价
      cost: 5000,
      // 雪碧图上从左往右对应各个状态的动画帧数
      spriteImages: [
        { name: "healthy", count: 4 },
        { name: "damaged", count: 1 },
        { name: "constructing", count: 3 }
      ]
    },
    starport: {
      name: "starport",
      pixelWidth: 40,
      pixelHeight: 60,
      baseWidth: 40,
      baseHeight: 55,
      pixelOffsetX: 1,
      pixelOffsetY: 5,
      buildableGrid: [[1, 1], [1, 1], [1, 1]],
      passableGrid: [[1, 1], [0, 0], [0, 0]],
      sight: 3,
      cost: 2000,
      canConstruct: true,
      hitPoints: 300,
      spriteImages: [
        { name: "teleport", count: 9 },
        { name: "closing", count: 18 },
        { name: "healthy", count: 4 },
        { name: "damaged", count: 1 }
      ]
    },
    harvester: {
      name: "harvester",
      pixelWidth: 40,
      pixelHeight: 60,
      baseWidth: 40,
      baseHeight: 20,
      pixelOffsetX: -2,
      pixelOffsetY: 40,
      buildableGrid: [[1, 1]],
      passableGrid: [[1, 1]],
      sight: 3,
      cost: 5000,
      hitPoints: 300,
      spriteImages: [
        { name: "deploy", count: 17 },
        { name: "healthy", count: 3 },
        { name: "damaged", count: 1 }
      ]
    },
    "ground-turret": {
      name: "ground-turret",
      canAttack: true,
      canAttackLand: true,
      canAttackAir: false,
      weaponType: "cannon-ball",
      action: "stand",
      direction: 0, // 初始炮口方向向上
      directions: 8, // 总共8个方向
      orders: { type: "guard" },
      pixelWidth: 38,
      pixelHeight: 32,
      baseWidth: 20,
      baseHeight: 18,
      pixelOffsetX: 9,
      pixelOffsetY: 12,
      cost: 1500,
      canConstruct: true,
      buildableGrid: [[1]],
      passableGrid: [[1]],
      sight: 5,
      hitPoints: 200,
      spriteImages: [
        { name: "teleport", count: 9 }, // 1-9帧是teleport状态
        { name: "healthy", count: 1, directions: 8 }, // 接下来healthy状态只有1帧，但是有8个方向，所以总共有8帧
        { name: "damaged", count: 1 } // damaged状态只有1帧
      ]
    }
  },
  // default中放置所有建筑单位的默认设置，可在具体单位设置中覆盖这些属性或方法
  defaults: {
    type: "buildings",
    // 定义每种指令（action）的动画操作过程
    processActions() {
      switch (this.action) {
        case "stand":
          if (this.name === "ground-turret" && this.lifeCode === "healthy") {
            const direction = Math.round(this.direction) % this.directions;
            this.imageList = this.spriteArray[`${this.lifeCode}-${direction}`];
          } else {
            this.imageList = this.spriteArray[this.lifeCode];
          }
          this.imageOffset = this.imageList.offset + this.animationIndex;
          this.animationIndex++;

          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
          }
          break;
        case "construct":
          this.imageList = this.spriteArray["constructing"];
          this.imageOffset = this.imageList.offset + this.animationIndex;
          this.animationIndex++;
          // 建造结束，变回静止态
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
            this.action = "stand";
          }
          break;
        case "teleport":
          this.imageList = this.spriteArray["teleport"];
          this.imageOffset = this.imageList.offset + this.animationIndex;
          this.animationIndex++;
          // 传送动画结束，回到静止
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
            this.action = "stand";
          }
          break;
        case "close":
          this.imageList = this.spriteArray["closing"];
          this.imageOffset = this.imageList.offset + this.animationIndex;
          this.animationIndex++;
          // 关闭动画结束，回到静止
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
            this.action = "stand";
          }
          break;
        case "open":
          this.imageList = this.spriteArray["closing"];
          // 开启动画是关闭动画的倒放
          this.imageOffset =
            this.imageList.offset + this.imageList.count - this.animationIndex;
          this.animationIndex++;
          // 开启动画结束，接着开始关闭动画
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
            this.action = "close";
          }
          break;
        case "deploy":
          this.imageList = this.spriteArray["deploy"];
          this.imageOffset = this.imageList.offset + this.animationIndex;
          this.animationIndex++;
          // 关闭动画结束，回到静止
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
            this.action = "stand";
          }
          break;
      }
    },
    drawSprite() {
      const x = this.drawingX;
      const y = this.drawingY;
      // 雪碧图上第一行是蓝队的图，第二行是绿队的图
      const colorIndex = this.team === "blue" ? 0 : 1;
      // 纵向是否偏移
      const colorOffset = colorIndex * this.pixelHeight;

      // 在x和y出开始绘制
      game.foregroundContext.drawImage(
        this.spriteSheet,
        this.imageOffset * this.pixelWidth,
        colorOffset,
        this.pixelWidth,
        this.pixelHeight,
        x,
        y,
        this.pixelWidth,
        this.pixelHeight
      );
    }
  },
  load(name) {
    return loader.loadItem.call(this, name);
  },
  add(item) {
    return loader.addItem.call(this, item);
  }
};
