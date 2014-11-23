$(document).ready(function(){

  var scanDevices = function() {
    chrome.serial.getDevices(function(devices){
      $(".device-list").remove();
      $(".no-device-error").remove();

      if (devices.length > 0) {
        var $select = $("<select></select>").addClass('device-list');

        for(var i=0; i < devices.length; i++)
          $select.append($("<option>" + devices[i].path + "</option>"));

        $(".setup").prepend($select);
      } else {
        $(".setup").prepend("<h2 class='no-device-error'>No serial devices found ~!</h2>");
      }
    });
  };


  var startGame = function() {
    console.log("Starting game...");

    var device_path = $(".device-list").val(),
        serial = chrome.serial,
        lineBuffer = "",
        serialConnId = -1,
        onSerialConnect = new chrome.Event(),
        onSerialReadLine = new chrome.Event(),
        onSerialError = new chrome.Event();

    var onConnect = function(conn) {
      if(conn) {
        serialConnId = conn.connectionId;

      }
      else
        alert("Something went wrong when connecting to serial device");
    };


    var onReceive = function(info) {
      if (info.connectionId == serialConnId && info.data) {
        console.log("ping");
      }
    };

    var flushSerialBuffer = function() {
      chrome.serial.flush(serialConnId, function() {});
    };


    var gameWidth = 800;
        gameHeight = 600,
        game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-div');

    var mainState = {
      preload: function() {
        game.stage.backgroundColor = '#F1FCFF';
        game.load.image('ship', 'assets/spaceship.png');
        game.load.image('brick', 'assets/brick.png');
      },


      create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#444" });

        this.bricks = game.add.group();
        this.bricks.enableBody = true;
        this.bricks.createMultiple(20, 'brick');

        this.ship = this.game.add.sprite(0, 450, 'ship');
        this.scale.x = 0.5;
        this.scale.y = 0.5;
        game.physics.arcade.enable(this.ship);
        this.ship.body.gravity.y = 1000;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(1500, this.addBricks, this);
      },


      update: function() {
        if (this.ship.inWorld == false)
          this.restartGame();

        game.physics.arcade.overlap(this.ship, this.bricks, this.restartGame, null, this);
      },


      jump: function() {
        this.ship.body.velocity.y = -350;
      },


      addOneBrick: function(x, y) {
        var bricks = this.bricks.getFirstDead();
        bricks.reset(x, y);
        bricks.body.velocity.x = -200;

        bricks.checkWorldBounds = true;
        bricks.outOfBoundsKill = true;
      },


      addBricks: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        this.addOneBrick(gameWidth, hole);
        // for (var i = 0; i < 8; i++)
        //   if (i != hole && i != hole + 1)
        //     this.addOneBrick(gameWidth, hole);

        this.score += 1;
        this.labelScore.text = this.score;
      },

      restartGame: function() {
        game.state.start('main');
      }
    };


    game.state.add('main', mainState);
    game.state.start('main');


    serial.onReceive.addListener(onReceive);
    serial.connect(device_path, {bitrate: 115200}, onConnect);
  };


  $(".scan-devices").click(scanDevices);
  $(".start-btn").click(startGame);
  scanDevices();
});
