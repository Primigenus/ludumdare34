/*jshint esnext: true */

Game = {

  init() {
    this.game = new Phaser.Game(640, 480, Phaser.AUTO, '');
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
  findObjectsByType(type, map, layer) {
    var result = [];
    map.objects[layer].forEach((element) => {
      if (element.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },

  create() {
    this.map = this.game.add.tilemap("level1");
    this.map.addTilesetImage("tiles", "gameTiles");
    this.backgroundLayer = this.map.createLayer("backgroundLayer");
    this.blockedLayer = this.map.createLayer("blockedLayer");
    this.map.setCollisionBetween(1, 2000, true, "blockedLayer");
    this.backgroundLayer.resizeWorld();

    const result = this.findObjectsByType("playerStart", this.map, "objectsLayer");
    this.player = this.game.add.sprite(result[0].x, result[0].y, "player");
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  update() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y -= 64;
    }
    else if (this.cursors.down.isDown) {
      this.player.body.velocity.y += 64;
    }
    else if (this.cursors.left.isDown) {
      this.player.body.velocity.x -= 64;
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x += 64;
    }



    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    // this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    // this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null);
  }
};

Template.game.onRendered(Game.init);
