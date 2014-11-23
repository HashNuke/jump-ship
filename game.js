var playerJump = false,
    jumpTimeDelta = 350;
    time1 = null, // new time
    time2 = null; // old time


$(document).ready(function(){

  var scanDevices = function() {
    chrome.serial.getDevices(function(deviceList){
      $(".device-list").remove();
      $(".no-device-error").remove();

      if (deviceList.length > 0) {
        var $select = $("<select></select>").addClass('device-list');

        var devices = deviceList.reverse();
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
        serialConnId = -1;

    var onConnect = function(conn) {
      if(conn)
        serialConnId = conn.connectionId;
      else
        console.log("Something went wrong when connecting to serial device", conn);
    };


    var onReceive = function(info) {
      if (info.connectionId == serialConnId && info.data) {
        console.log("ping");
        playerJump = true;

        if (!time1)
          time1 = new Date();

        if (!time2)
          time2 = time1;

        time2 = time1;
        time1 = new Date();
      }
    };

    var flushSerialBuffer = function() {
      chrome.serial.flush(serialConnId, function() {});
    };


    var gameWidth  = 800,
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

        this.ship = this.game.add.sprite(200, 450, 'ship');
        this.ship.scale.x = 0.5;
        this.ship.scale.y = 0.5;
        game.physics.arcade.enable(this.ship);
        this.ship.body.gravity.y = 1000;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(2000, this.addBricks, this);
      },


      update: function() {
        this.setTimeDefaults();
        var timeDiff = time1.getTime() - time2.getTime();

        if (this.ship.inWorld == false || timeDiff > 2000)
          this.restartGame();

        if (playerJump && timeDiff > jumpTimeDelta) {
          this.jump();
          playerJump = false;
        }

        game.physics.arcade.overlap(this.ship, this.bricks, this.restartGame, null, this);
      },


      setTimeDefaults: function() {
        if (!time1)
          time1 = new Date();
        if (!time2)
          time2 = time1;
      },

      jump: function() {
        this.ship.body.velocity.y = -550;
      },


      addOneBrick: function(x, y) {
        var bricks = this.bricks.getFirstDead();
        bricks.reset(x, y);
        bricks.body.velocity.x = -200;

        bricks.checkWorldBounds = true;
        bricks.outOfBoundsKill = true;
      },


      addBricks: function() {
        var brickPos = Math.floor(Math.random() * 3) + 1;
        this.addOneBrick(gameWidth - 133, brickPos * 133); // 133 being the height of the brick asset

        this.score += 1;
        this.labelScore.text = this.score;
      },

      restartGame: function() {
        game.state.start('main');
      }
    };


    game.state.add('main', mainState);
    game.state.start('main');


    chrome.serial.onReceive.addListener(onReceive);
    chrome.serial.connect(device_path, {bitrate: 115200}, onConnect);
  };


  $(".scan-devices").click(scanDevices);
  $(".start-btn").click(startGame);
  scanDevices();
});
