$(document).ready(function(){
  console.log("doc loaded");


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
        // we got ping
        console.log("we got a ping");
      }
    };


    var flushSerialBuffer = function() {
      chrome.serial.flush(serialConnId, function() {});
    };


    serial.onReceive.addListener(onReceive);
    serial.connect(device_path, {bitrate: 115200}, onConnect);
  };

  //   SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
  //     if (!connectionInfo) {
  //       log("Connection failed.");
  //       return;
  //     }
  //
  //     this.connectionId = connectionInfo.connectionId;
  //     chrome.serial.onReceive.addListener(this.boundOnReceive);
  //     chrome.serial.onReceiveError.addListener(this.boundOnReceiveError);
  //     this.onConnect.dispatch();
  //   };
  //
  //   SerialConnection.prototype.onReceive = function(receiveInfo) {
  //     if (receiveInfo.connectionId !== this.connectionId) {
  //       return;
  //     }
  //
  //     this.lineBuffer += ab2str(receiveInfo.data);
  //
  //     var index;
  //     while ((index = this.lineBuffer.indexOf('\n')) >= 0) {
  //       var line = this.lineBuffer.substr(0, index + 1);
  //       this.onReadLine.dispatch(line);
  //       this.lineBuffer = this.lineBuffer.substr(index + 1);
  //     }
  //
  //   };
  //
  //   SerialConnection.prototype.onReceiveError = function(errorInfo) {
  //     if (errorInfo.connectionId === this.connectionId) {
  //       this.onError.dispatch(errorInfo.error);
  //     }
  //   };
  //
  //   SerialConnection.prototype.connect = function(path) {
  //     serial.connect(path, this.onConnectComplete.bind(this))
  //   };
  //
  //   SerialConnection.prototype.send = function(msg) {
  //     if (this.connectionId < 0) {
  //       throw 'Invalid connection';
  //     }
  //     serial.send(this.connectionId, str2ab(msg), function() {});
  //   };
  //
  //   SerialConnection.prototype.disconnect = function() {
  //     if (this.connectionId < 0) {
  //       throw 'Invalid connection';
  //     }
  //     serial.disconnect(this.connectionId, function() {});
  //   };
  //
  //   ////////////////////////////////////////////////////////
  //   ////////////////////////////////////////////////////////
  //
  //   var connection = new SerialConnection();
  //
  //   connection.onConnect.addListener(function() {
  //     console.log('connected to: ' + DEVICE_PATH);
  //     connection.send("hello arduino");
  //   });
  //
  //   connection.onReadLine.addListener(function(line) {
  //     console.log(line);
  //   });
  //
  //   connection.connect(DEVICE_PATH);
  // }


  $(".scan-devices").click(scanDevices);
  $(".start-btn").click(startGame);
  scanDevices();
});
