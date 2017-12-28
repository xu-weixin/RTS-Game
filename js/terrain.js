var terrain = {
  list: {
    oilfield: {
      name: "oilfield",
      pixelWidth: 40,
      pixelHeight: 60,
      baseWidth: 40,
      baseHeight: 20,
      pixelOffsetX: 0,
      pixelOffsetY: 40,
      buildableGrid: [[1, 1]],
      passableGrid: [[0, 0]],
      spriteImages: [{ name: "hint", count: 1 }, { name: "stand", count: 1 }]
    },
    bigrocks: {
      name: "bigrocks",
      pixelWidth: 40,
      pixelHeight: 70,
      baseWidth: 40,
      baseHeight: 40,
      pixelOffsetX: 0,
      pixelOffsetY: 30,
      buildableGrid: [[1, 1], [0, 1]],
      passableGrid: [[1, 1], [0, 1]],
      spriteImages: [{ name: "stand", count: 1 }]
    },
    smallrocks: {
      name: "smallrocks",
      pixelWidth: 20,
      pixelHeight: 35,
      baseWidth: 20,
      baseHeight: 20,
      pixelOffsetX: 0,
      pixelOffsetY: 15,
      buildableGrid: [[1]],
      passableGrid: [[1]],
      spriteImages: [{ name: "stand", count: 1 }]
    }
  },
  defaults: {
    type: "terrain",
    selectable: false,
    animate() {
      // 地形不用检查血量，直接跳到processActions
      this.processActions();
    },
    processActions() {
      // 地形无涉及动画
      this.imageList = this.spriteArray[this.action];
      this.imageOffset = this.imageList.offset;
    },
    drawSprite() {
      const x = this.drawingX;
      const y = this.drawingY;

      const colorOffset = 0;

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
