var vehicles = {
  list: {
    transport: {
      name: "transport",
      pixelWidth: 31,
      pixelHeight: 30,
      pixelOffsetX: 15,
      pixelOffsetY: 15,
      radius: 15,
      speed: 15,
      sight: 3,
      cost: 400,
      hitPoints: 100,
      turnSpeed: 3,
      spriteImages: [{ name: "stand", count: 1, directions: 8 }]
    },
    harvester: {
      name: "harvester",
      pixelWidth: 21,
      pixelHeight: 20,
      pixelOffsetX: 10,
      pixelOffsetY: 10,
      radius: 10,
      speed: 10,
      sight: 3,
      cost: 1600,
      canConstruct: true,
      hitPoints: 50,
      turnSpeed: 3,
      spriteImages: [{ name: "stand", count: 1, directions: 8 }]
    },
    "scout-tank": {
      name: "scout-tank",
      canAttack: true,
      canAttackLand: true,
      canAttackAir: false,
      weaponType: "bullet",
      pixelWidth: 21,
      pixelHeight: 21,
      pixelOffsetX: 10,
      pixelOffsetY: 10,
      radius: 11,
      speed: 20,
      sight: 4,
      cost: 500,
      canConstruct: true,
      hitPoints: 50,
      turnSpeed: 5,
      spriteImages: [{ name: "stand", count: 1, directions: 8 }]
    },
    "heavy-tank": {
      name: "heavy-tank",
      canAttack: true,
      canAttackLand: true,
      canAttackAir: false,
      weaponType: "cannon-ball",
      pixelWidth: 30,
      pixelHeight: 30,
      pixelOffsetX: 15,
      pixelOffsetY: 15,
      radius: 13,
      speed: 15,
      sight: 5,
      cost: 1200,
      canConstruct: true,
      hitPoints: 50,
      turnSpeed: 4,
      spriteImages: [{ name: "stand", count: 1, directions: 8 }]
    }
  },
  defaults: {
    type: "vehicles",
    directions: 8,
    canMove: true,
    processActions() {
      const direction = Math.round(this.direction) % this.directions;

      switch (this.action) {
        case "stand":
          this.imageList = this.spriteArray[`stand-${direction}`];
          this.imageOffset = this.imageList.offset + this.animationIndex;
          this.animationIndex++;

          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0;
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
