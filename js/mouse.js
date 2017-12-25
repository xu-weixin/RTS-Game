const mouse = {
  init() {
    // 在前景画面上监听鼠标事件
    const canvas = document.getElementById('gameforegroundcanvas');
    canvas.addEventListener('mousemove', e => this.mousemovehandler(e), false);
    canvas.addEventListener(
      'mouseenter',
      e => this.mouseenterhandler(e),
      false
    );
    canvas.addEventListener('mouseout', e => this.mouseouthandler(e), false);
    this.canvas = canvas;
  },
  // 坐标（相对canvas左侧）
  x: 0,
  y: 0,
  // 坐标（相对地图左侧）
  gameX: 0,
  gameY: 0,
  // 相对格子坐标
  gridX: 0,
  gridY: 0,
  // clientX,clientY为相对屏幕坐标
  setCoordinates(clientX, clientY) {
    const offset = this.canvas.getBoundingClientRect();
    this.x = (clientX - offset.left) / game.scale;
    this.y = (clientY - offset.top) / game.scale;
    this.calculateGameCoordinates();
  },
  calculateGameCoordinates() {
    this.gameX = mouse.x + game.offsetX;
    this.gameY = mouse.y + game.offsetY;

    this.gridX = Math.floor(this.gameX / game.gridSize);
    this.gridY = Math.floor(this.gameY / game.gridSize);
  },
  insideCanvas: false,
  mousemovehandler(e) {
    this.insideCanvas = true;
    this.setCoordinates(e.clientX, e.clientY);
  },
  mouseenterhandler(e) {
    this.insideCanvas = true;
  },
  mouseouthandler(e) {
    this.insideCanvas = false;
  }
};
