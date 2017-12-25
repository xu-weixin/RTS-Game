const buildings = {
  // 所有建筑单位都放在list数组里
  list: {
    // 基地
    // 基地游戏开始便存在，花费相关资源可以建造，基地之间可以传送其他单位
    base: {
      name: 'base',
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
        { name: 'healthy', count: 4 },
        { name: 'damaged', count: 1 },
        { name: 'constructing', count: 3 }
      ]
    }
  },
  // default中放置所有建筑单位的默认设置，可在具体单位设置中覆盖这些属性或方法
  defaults: {
    type: 'buildings'
  },
  load: loadItem,
  add: addItem
};
