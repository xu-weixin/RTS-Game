var aircraft = {
  list: {
    chopper: {
      name: "chopper",
      cost: 900,
      canConstruct: true,
      pixelWidth: 40,
      pixelHeight: 40,
      pixelOffsetX: 20,
      pixelOffsetY: 20,
      weaponType: "heatseeker",
      radius: 18,
      sight: 6,
      canAttack: true,
      canAttackLand: true,
      canAttackAir: true,
      hitPoints: 50,
      speed: 25,
      turnSpeed: 4,
      pixelShadowHeight: 40,
      spriteImages: [{ name: "stand", count: 4, directions: 8 }]
    },
    wraith: {
      name: "wraith",
      cost: 600,
      canConstruct: true,
      pixelWidth: 30,
      pixelHeight: 30,
      canAttack: true,
      canAttackLand: false,
      canAttackAir: true,
      weaponType: "fireball",
      pixelOffsetX: 15,
      pixelOffsetY: 15,
      radius: 15,
      sight: 8,
      speed: 40,
      turnSpeed: 4,
      hitPoints: 50,
      pixelShadowHeight: 40,
      spriteImages: [{ name: "stand", count: 1, directions: 8 }]
    }
  },
  defaults: {
    type: "aircraft",
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
      // 纵向偏移量
      const colorOffset = colorIndex * this.pixelHeight;
      // 阴影偏移量，阴影总是在雪碧图的第三行，故偏移系数这里是2
      const shadowOffset = 2 * this.pixelHeight;

      // 在x和y出开始绘制
      game.foregroundContext.drawImage(
        this.spriteSheet,
        this.imageOffset * this.pixelWidth,
        colorOffset,
        this.pixelWidth,
        this.pixelHeight,
        x,
        y - this.pixelShadowHeight,
        this.pixelWidth,
        this.pixelHeight
      );
      // 绘制阴影
      game.foregroundContext.drawImage(
        this.spriteSheet,
        this.imageOffset * this.pixelWidth,
        shadowOffset,
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
