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
      // 雪碧图上对应各个状态的动画帧数
      spriteImages: [
        { name: "healthy", count: 4 },
        { name: "damaged", count: 1 },
        { name: "constructing", count: 3 }
      ]
    }
  },
  // default中放置所有建筑单位的默认设置，可在具体单位设置中覆盖这些属性或方法
  defaults: {
    type: "buildings",
    processActions() {
      switch (this.action) {
        case "stand":
          this.imageList = this.spriteArray[this.lifeCode];
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
