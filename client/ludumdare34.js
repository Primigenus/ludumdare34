/*jshint esnext: true */

let Game = {

  init() {
    this.game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
      preload: Game.preload,
      create: Game.create,
      update: Game.update
    });
    this.game.state.add("Boot", Game.Boot);
    this.game.state.add("Preload", Game.Preload);
    this.game.state.add("Game", Game.Game);
    this.game.state.start("Boot");
  }

};

Game.Boot = function(){}
Game.Boot.prototype = {
  preload() {
    this.load.image("preloadbar", "assets/images/preloader-bar.png");
  },
  create() {
    this.game.stage.backgroundColor = "#fff";
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start("Preload");
  }
};

Game.Preload = function(){}
Game.Preload.prototype = {
  preload() {
    this.preloadBar = this.add.sprite(this.game.world.centerX,
      this.game.world.centerY + 128, "preloadbar");

    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap("level1", "assets/tilemaps/tiles.json", null,
      Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/simples_pimples.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('door', 'assets/images/door.png');
  },
  create() {
    this.state.start("Game");
  }
};

Game.Game = function(){}
Game.Game.prototype = {
  create() {
    this.map = this.game.add.tilemap("level1");
    this.map.addTilesetImage("tiles", "gameTiles");
    this.backgroundLayer = this.map.createLayer("backgroundLayer");
    this.blockedLayer = this.map.createLayer("blockedLayer");
    this.map.setCollisionBetween(1, 2000, true, "blockedLayer");
    this.backgroundLayer.resizeWorld();
  }
};

Template.game.onRendered(Game.init);
