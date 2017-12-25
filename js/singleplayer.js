const singleplayer = {
  // 单人模式
  start() {
    // 隐藏菜单画面
    game.hideScreens();
    // 设置当前关卡为第0关卡
    this.currentLevel = 0;
    // 初始化关卡
    this.initLevel();
  },
  currentLevel: 0,
  initLevel() {
    game.type = 'singleplayer';
    game.team = 'blue';
    // 先将开始战斗按钮置灰，等资源加载完后再将按钮恢复
    const enterMissionButton = document.getElementById('entermission');
    enterMissionButton.disabled = true;
    // 加载当前关卡的资源（地图信息等）
    const level = levels.singleplayer[this.currentLevel];
    game.loadLevelData(level);
    // 用地图的offset值设置开始时地图的偏移量
    game.offsetX = level.startX * game.gridSize;
    game.offsetY = level.startY * game.gridSize;
    // 加载完毕，按钮恢复
    loader.onload = () => (enterMissionButton.disabled = false);
    // 更新关卡简介
    this.showMissionBriefing(level.briefing);
  },
  showMissionBriefing(briefing) {
    const missionBriefingText = document.getElementById('missionbriefing');
    // 把代表换行的\n替换成<br>
    missionBriefingText.innerHTML = briefing.replace(/\n/, '<br>');
    // 现实关卡简介
    game.showScreen('missionbriefingscreen');
  },
  exit() {
    game.hideScreens();
    game.showScreen('gamestartscreen');
  },
  play() {
    game.animationLoop();
    game.animationInterval = setInterval(
      game.animationLoop,
      game.animationTimeout
    );
    game.start();
  }
};
