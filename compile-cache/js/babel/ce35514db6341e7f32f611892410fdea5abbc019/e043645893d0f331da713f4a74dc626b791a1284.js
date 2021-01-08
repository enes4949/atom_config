Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jmp = require("jmp");

var _uuid = require("uuid");

var _spawnteract = require("spawnteract");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _kernelTransport = require("./kernel-transport");

var _kernelTransport2 = _interopRequireDefault(_kernelTransport);

var _utils = require("./utils");

var ZMQKernel = (function (_KernelTransport) {
  _inherits(ZMQKernel, _KernelTransport);

  function ZMQKernel(kernelSpec, grammar, options, onStarted) {
    var _this = this;

    _classCallCheck(this, ZMQKernel);

    _get(Object.getPrototypeOf(ZMQKernel.prototype), "constructor", this).call(this, kernelSpec, grammar);
    this.executionCallbacks = {};
    this.options = options || {};
    // Otherwise spawnteract deletes the file and hydrogen's restart kernel fails
    options.cleanupConnectionFile = false;

    (0, _spawnteract.launchSpec)(kernelSpec, options).then(function (_ref) {
      var config = _ref.config;
      var connectionFile = _ref.connectionFile;
      var spawn = _ref.spawn;

      _this.connection = config;
      _this.connectionFile = connectionFile;
      _this.kernelProcess = spawn;

      _this.monitorNotifications(spawn);

      _this.connect(function () {
        _this._executeStartupCode();

        if (onStarted) onStarted(_this);
      });
    });
  }

  _createClass(ZMQKernel, [{
    key: "connect",
    value: function connect(done) {
      var scheme = this.connection.signature_scheme.slice("hmac-".length);
      var key = this.connection.key;

      this.shellSocket = new _jmp.Socket("dealer", scheme, key);
      this.stdinSocket = new _jmp.Socket("dealer", scheme, key);
      this.ioSocket = new _jmp.Socket("sub", scheme, key);

      var id = (0, _uuid.v4)();
      this.shellSocket.identity = "dealer" + id;
      this.stdinSocket.identity = "dealer" + id;
      this.ioSocket.identity = "sub" + id;

      var address = this.connection.transport + "://" + this.connection.ip + ":";
      this.shellSocket.connect(address + this.connection.shell_port);
      this.ioSocket.connect(address + this.connection.iopub_port);
      this.ioSocket.subscribe("");
      this.stdinSocket.connect(address + this.connection.stdin_port);

      this.shellSocket.on("message", this.onShellMessage.bind(this));
      this.ioSocket.on("message", this.onIOMessage.bind(this));
      this.stdinSocket.on("message", this.onStdinMessage.bind(this));

      this.monitor(done);
    }
  }, {
    key: "monitorNotifications",
    value: function monitorNotifications(childProcess) {
      var _this2 = this;

      childProcess.stdout.on("data", function (data) {
        data = data.toString();

        if (atom.config.get("Hydrogen.kernelNotifications")) {
          atom.notifications.addInfo(_this2.kernelSpec.display_name, {
            description: data,
            dismissable: true
          });
        } else {
          (0, _utils.log)("ZMQKernel: stdout:", data);
        }
      });

      childProcess.stderr.on("data", function (data) {
        atom.notifications.addError(_this2.kernelSpec.display_name, {
          description: data.toString(),
          dismissable: true
        });
      });
    }
  }, {
    key: "monitor",
    value: function monitor(done) {
      var _this3 = this;

      try {
        (function () {
          var socketNames = ["shellSocket", "ioSocket"];

          var waitGroup = socketNames.length;

          var onConnect = function onConnect(_ref2) {
            var socketName = _ref2.socketName;
            var socket = _ref2.socket;

            (0, _utils.log)("ZMQKernel: " + socketName + " connected");
            socket.unmonitor();

            waitGroup--;
            if (waitGroup === 0) {
              (0, _utils.log)("ZMQKernel: all main sockets connected");
              _this3.setExecutionState("idle");
              if (done) done();
            }
          };

          var monitor = function monitor(socketName, socket) {
            (0, _utils.log)("ZMQKernel: monitor " + socketName);
            socket.on("connect", onConnect.bind(_this3, { socketName: socketName, socket: socket }));
            socket.monitor();
          };

          monitor("shellSocket", _this3.shellSocket);
          monitor("ioSocket", _this3.ioSocket);
        })();
      } catch (err) {
        (0, _utils.log)("ZMQKernel:", err);
      }
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      if (process.platform === "win32") {
        atom.notifications.addWarning("Cannot interrupt this kernel", {
          detail: "Kernel interruption is currently not supported in Windows."
        });
      } else {
        (0, _utils.log)("ZMQKernel: sending SIGINT");
        this.kernelProcess.kill("SIGINT");
      }
    }
  }, {
    key: "_kill",
    value: function _kill() {
      (0, _utils.log)("ZMQKernel: sending SIGKILL");
      this.kernelProcess.kill("SIGKILL");
    }
  }, {
    key: "_executeStartupCode",
    value: function _executeStartupCode() {
      var displayName = this.kernelSpec.display_name;
      var startupCode = _config2["default"].getJson("startupCode")[displayName];
      if (startupCode) {
        (0, _utils.log)("KernelManager: Executing startup code:", startupCode);
        startupCode += "\n";
        this.execute(startupCode, function (message, channel) {});
      }
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this._socketShutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      this._socketRestart(onRestarted);
    }
  }, {
    key: "_socketShutdown",
    value: function _socketShutdown() {
      var restart = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var requestId = "shutdown_" + (0, _uuid.v4)();
      var message = this._createMessage("shutdown_request", requestId);

      message.content = { restart: restart };

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "_socketRestart",
    value: function _socketRestart(onRestarted) {
      var _this4 = this;

      if (this.executionState === "restarting") {
        return;
      }
      this.setExecutionState("restarting");
      this._socketShutdown(true);
      this._kill();

      var _launchSpecFromConnectionInfo = (0, _spawnteract.launchSpecFromConnectionInfo)(this.kernelSpec, this.connection, this.connectionFile, this.options);

      var spawn = _launchSpecFromConnectionInfo.spawn;

      this.kernelProcess = spawn;
      this.monitor(function () {
        _this4._executeStartupCode();
        if (onRestarted) onRestarted();
      });
    }

    // onResults is a callback that may be called multiple times
    // as results come in from the kernel
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      (0, _utils.log)("ZMQKernel.execute:", code);
      var requestId = "execute_" + (0, _uuid.v4)();

      var message = this._createMessage("execute_request", requestId);

      message.content = {
        code: code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: true
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      (0, _utils.log)("ZMQKernel.complete:", code);

      var requestId = "complete_" + (0, _uuid.v4)();

      var message = this._createMessage("complete_request", requestId);

      message.content = {
        code: code,
        text: code,
        line: code,
        cursor_pos: (0, _utils.js_idx_to_char_idx)(code.length, code)
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      (0, _utils.log)("ZMQKernel.inspect:", code, cursorPos);

      var requestId = "inspect_" + (0, _uuid.v4)();

      var message = this._createMessage("inspect_request", requestId);

      message.content = {
        code: code,
        cursor_pos: cursorPos,
        detail_level: 0
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      var requestId = "input_reply_" + (0, _uuid.v4)();

      var message = this._createMessage("input_reply", requestId);

      message.content = { value: input };

      this.stdinSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "onShellMessage",
    value: function onShellMessage(message) {
      (0, _utils.log)("shell message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (callback) {
        callback(message, "shell");
      }
    }
  }, {
    key: "onStdinMessage",
    value: function onStdinMessage(message) {
      (0, _utils.log)("stdin message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      // input_request messages are attributable to particular execution requests,
      // and should pass through the middleware stack to allow plugins to see them
      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (callback) {
        callback(message, "stdin");
      }
    }
  }, {
    key: "onIOMessage",
    value: function onIOMessage(message) {
      (0, _utils.log)("IO message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_type = message.header.msg_type;

      if (msg_type === "status") {
        var _status = message.content.execution_state;
        this.setExecutionState(_status);
      }

      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (callback) {
        callback(message, "iopub");
      }
    }
  }, {
    key: "_isValidMessage",
    value: function _isValidMessage(message) {
      if (!message) {
        (0, _utils.log)("Invalid message: null");
        return false;
      }

      if (!message.content) {
        (0, _utils.log)("Invalid message: Missing content");
        return false;
      }

      if (message.content.execution_state === "starting") {
        // Kernels send a starting status message with an empty parent_header
        (0, _utils.log)("Dropped starting status IO message");
        return false;
      }

      if (!message.parent_header) {
        (0, _utils.log)("Invalid message: Missing parent_header");
        return false;
      }

      if (!message.parent_header.msg_id) {
        (0, _utils.log)("Invalid message: Missing parent_header.msg_id");
        return false;
      }

      if (!message.parent_header.msg_type) {
        (0, _utils.log)("Invalid message: Missing parent_header.msg_type");
        return false;
      }

      if (!message.header) {
        (0, _utils.log)("Invalid message: Missing header");
        return false;
      }

      if (!message.header.msg_id) {
        (0, _utils.log)("Invalid message: Missing header.msg_id");
        return false;
      }

      if (!message.header.msg_type) {
        (0, _utils.log)("Invalid message: Missing header.msg_type");
        return false;
      }

      return true;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("ZMQKernel: destroy:", this);

      this.shutdown();

      this._kill();
      _fs2["default"].unlinkSync(this.connectionFile);

      this.shellSocket.close();
      this.ioSocket.close();
      this.stdinSocket.close();

      _get(Object.getPrototypeOf(ZMQKernel.prototype), "destroy", this).call(this);
    }
  }, {
    key: "_getUsername",
    value: function _getUsername() {
      return process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
    }
  }, {
    key: "_createMessage",
    value: function _createMessage(msgType) {
      var msgId = arguments.length <= 1 || arguments[1] === undefined ? (0, _uuid.v4)() : arguments[1];

      var message = {
        header: {
          username: this._getUsername(),
          session: "00000000-0000-0000-0000-000000000000",
          msg_type: msgType,
          msg_id: msgId,
          date: new Date(),
          version: "5.0"
        },
        metadata: {},
        parent_header: {},
        content: {}
      };

      return message;
    }
  }]);

  return ZMQKernel;
})(_kernelTransport2["default"]);

exports["default"] = ZMQKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvem1xLWtlcm5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O21CQUNhLEtBQUs7O29CQUNsQixNQUFNOzsyQkFDZ0MsYUFBYTs7c0JBRW5ELFVBQVU7Ozs7K0JBQ0Qsb0JBQW9COzs7O3FCQUVSLFNBQVM7O0lBZTVCLFNBQVM7WUFBVCxTQUFTOztBQVdqQixXQVhRLFNBQVMsQ0FZMUIsVUFBc0IsRUFDdEIsT0FBcUIsRUFDckIsT0FBZSxFQUNmLFNBQW9CLEVBQ3BCOzs7MEJBaEJpQixTQUFTOztBQWlCMUIsK0JBakJpQixTQUFTLDZDQWlCcEIsVUFBVSxFQUFFLE9BQU8sRUFBRTtTQWhCN0Isa0JBQWtCLEdBQVcsRUFBRTtBQWlCN0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDOztBQUU3QixXQUFPLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDOztBQUV0QyxpQ0FBVyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUNsQyxVQUFDLElBQWlDLEVBQUs7VUFBcEMsTUFBTSxHQUFSLElBQWlDLENBQS9CLE1BQU07VUFBRSxjQUFjLEdBQXhCLElBQWlDLENBQXZCLGNBQWM7VUFBRSxLQUFLLEdBQS9CLElBQWlDLENBQVAsS0FBSzs7QUFDOUIsWUFBSyxVQUFVLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFlBQUssY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUNyQyxZQUFLLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFlBQUssb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWpDLFlBQUssT0FBTyxDQUFDLFlBQU07QUFDakIsY0FBSyxtQkFBbUIsRUFBRSxDQUFDOztBQUUzQixZQUFJLFNBQVMsRUFBRSxTQUFTLE9BQU0sQ0FBQztPQUNoQyxDQUFDLENBQUM7S0FDSixDQUNGLENBQUM7R0FD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QUFFaEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2Isc0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRXpCLGlDQXJYaUIsU0FBUyx5Q0FxWFY7S0FDakI7OztXQUVXLHdCQUFHO0FBQ2IsYUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FDcEI7S0FDSDs7O1dBRWEsd0JBQUMsT0FBZSxFQUF3QjtVQUF0QixLQUFhLHlEQUFHLGVBQUk7O0FBQ2xELFVBQU0sT0FBTyxHQUFHO0FBQ2QsY0FBTSxFQUFFO0FBQ04sa0JBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzdCLGlCQUFPLEVBQUUsc0NBQXNDO0FBQy9DLGtCQUFRLEVBQUUsT0FBTztBQUNqQixnQkFBTSxFQUFFLEtBQUs7QUFDYixjQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7QUFDaEIsaUJBQU8sRUFBRSxLQUFLO1NBQ2Y7QUFDRCxnQkFBUSxFQUFFLEVBQUU7QUFDWixxQkFBYSxFQUFFLEVBQUU7QUFDakIsZUFBTyxFQUFFLEVBQUU7T0FDWixDQUFDOztBQUVGLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FqWmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvem1xLWtlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IE1lc3NhZ2UsIFNvY2tldCB9IGZyb20gXCJqbXBcIjtcbmltcG9ydCB7IHY0IH0gZnJvbSBcInV1aWRcIjtcbmltcG9ydCB7IGxhdW5jaFNwZWMsIGxhdW5jaFNwZWNGcm9tQ29ubmVjdGlvbkluZm8gfSBmcm9tIFwic3Bhd250ZXJhY3RcIjtcblxuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCBLZXJuZWxUcmFuc3BvcnQgZnJvbSBcIi4va2VybmVsLXRyYW5zcG9ydFwiO1xuaW1wb3J0IHR5cGUgeyBSZXN1bHRzQ2FsbGJhY2sgfSBmcm9tIFwiLi9rZXJuZWwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBsb2csIGpzX2lkeF90b19jaGFyX2lkeCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIENvbm5lY3Rpb24gPSB7XG4gIGNvbnRyb2xfcG9ydDogbnVtYmVyLFxuICBoYl9wb3J0OiBudW1iZXIsXG4gIGlvcHViX3BvcnQ6IG51bWJlcixcbiAgaXA6IHN0cmluZyxcbiAga2V5OiBzdHJpbmcsXG4gIHNoZWxsX3BvcnQ6IG51bWJlcixcbiAgc2lnbmF0dXJlX3NjaGVtZTogc3RyaW5nLFxuICBzdGRpbl9wb3J0OiBudW1iZXIsXG4gIHRyYW5zcG9ydDogc3RyaW5nLFxuICB2ZXJzaW9uOiBudW1iZXIsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBaTVFLZXJuZWwgZXh0ZW5kcyBLZXJuZWxUcmFuc3BvcnQge1xuICBleGVjdXRpb25DYWxsYmFja3M6IE9iamVjdCA9IHt9O1xuICBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuICBjb25uZWN0aW9uRmlsZTogc3RyaW5nO1xuICBrZXJuZWxQcm9jZXNzOiBjaGlsZF9wcm9jZXNzJENoaWxkUHJvY2VzcztcbiAgb3B0aW9uczogT2JqZWN0O1xuXG4gIHNoZWxsU29ja2V0OiBTb2NrZXQ7XG4gIHN0ZGluU29ja2V0OiBTb2NrZXQ7XG4gIGlvU29ja2V0OiBTb2NrZXQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAga2VybmVsU3BlYzogS2VybmVsc3BlYyxcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXIsXG4gICAgb3B0aW9uczogT2JqZWN0LFxuICAgIG9uU3RhcnRlZDogP0Z1bmN0aW9uXG4gICkge1xuICAgIHN1cGVyKGtlcm5lbFNwZWMsIGdyYW1tYXIpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgLy8gT3RoZXJ3aXNlIHNwYXdudGVyYWN0IGRlbGV0ZXMgdGhlIGZpbGUgYW5kIGh5ZHJvZ2VuJ3MgcmVzdGFydCBrZXJuZWwgZmFpbHNcbiAgICBvcHRpb25zLmNsZWFudXBDb25uZWN0aW9uRmlsZSA9IGZhbHNlO1xuXG4gICAgbGF1bmNoU3BlYyhrZXJuZWxTcGVjLCBvcHRpb25zKS50aGVuKFxuICAgICAgKHsgY29uZmlnLCBjb25uZWN0aW9uRmlsZSwgc3Bhd24gfSkgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25maWc7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbkZpbGUgPSBjb25uZWN0aW9uRmlsZTtcbiAgICAgICAgdGhpcy5rZXJuZWxQcm9jZXNzID0gc3Bhd247XG5cbiAgICAgICAgdGhpcy5tb25pdG9yTm90aWZpY2F0aW9ucyhzcGF3bik7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9leGVjdXRlU3RhcnR1cENvZGUoKTtcblxuICAgICAgICAgIGlmIChvblN0YXJ0ZWQpIG9uU3RhcnRlZCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNvbm5lY3QoZG9uZTogP0Z1bmN0aW9uKSB7XG4gICAgY29uc3Qgc2NoZW1lID0gdGhpcy5jb25uZWN0aW9uLnNpZ25hdHVyZV9zY2hlbWUuc2xpY2UoXCJobWFjLVwiLmxlbmd0aCk7XG4gICAgY29uc3QgeyBrZXkgfSA9IHRoaXMuY29ubmVjdGlvbjtcblxuICAgIHRoaXMuc2hlbGxTb2NrZXQgPSBuZXcgU29ja2V0KFwiZGVhbGVyXCIsIHNjaGVtZSwga2V5KTtcbiAgICB0aGlzLnN0ZGluU29ja2V0ID0gbmV3IFNvY2tldChcImRlYWxlclwiLCBzY2hlbWUsIGtleSk7XG4gICAgdGhpcy5pb1NvY2tldCA9IG5ldyBTb2NrZXQoXCJzdWJcIiwgc2NoZW1lLCBrZXkpO1xuXG4gICAgY29uc3QgaWQgPSB2NCgpO1xuICAgIHRoaXMuc2hlbGxTb2NrZXQuaWRlbnRpdHkgPSBgZGVhbGVyJHtpZH1gO1xuICAgIHRoaXMuc3RkaW5Tb2NrZXQuaWRlbnRpdHkgPSBgZGVhbGVyJHtpZH1gO1xuICAgIHRoaXMuaW9Tb2NrZXQuaWRlbnRpdHkgPSBgc3ViJHtpZH1gO1xuXG4gICAgY29uc3QgYWRkcmVzcyA9IGAke3RoaXMuY29ubmVjdGlvbi50cmFuc3BvcnR9Oi8vJHt0aGlzLmNvbm5lY3Rpb24uaXB9OmA7XG4gICAgdGhpcy5zaGVsbFNvY2tldC5jb25uZWN0KGFkZHJlc3MgKyB0aGlzLmNvbm5lY3Rpb24uc2hlbGxfcG9ydCk7XG4gICAgdGhpcy5pb1NvY2tldC5jb25uZWN0KGFkZHJlc3MgKyB0aGlzLmNvbm5lY3Rpb24uaW9wdWJfcG9ydCk7XG4gICAgdGhpcy5pb1NvY2tldC5zdWJzY3JpYmUoXCJcIik7XG4gICAgdGhpcy5zdGRpblNvY2tldC5jb25uZWN0KGFkZHJlc3MgKyB0aGlzLmNvbm5lY3Rpb24uc3RkaW5fcG9ydCk7XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0Lm9uKFwibWVzc2FnZVwiLCB0aGlzLm9uU2hlbGxNZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuaW9Tb2NrZXQub24oXCJtZXNzYWdlXCIsIHRoaXMub25JT01lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zdGRpblNvY2tldC5vbihcIm1lc3NhZ2VcIiwgdGhpcy5vblN0ZGluTWVzc2FnZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMubW9uaXRvcihkb25lKTtcbiAgfVxuXG4gIG1vbml0b3JOb3RpZmljYXRpb25zKGNoaWxkUHJvY2VzczogY2hpbGRfcHJvY2VzcyRDaGlsZFByb2Nlc3MpIHtcbiAgICBjaGlsZFByb2Nlc3Muc3Rkb3V0Lm9uKFwiZGF0YVwiLCAoZGF0YTogc3RyaW5nIHwgQnVmZmVyKSA9PiB7XG4gICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4ua2VybmVsTm90aWZpY2F0aW9uc1wiKSkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyh0aGlzLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lLCB7XG4gICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nKFwiWk1RS2VybmVsOiBzdGRvdXQ6XCIsIGRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2hpbGRQcm9jZXNzLnN0ZGVyci5vbihcImRhdGFcIiwgKGRhdGE6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMua2VybmVsU3BlYy5kaXNwbGF5X25hbWUsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IGRhdGEudG9TdHJpbmcoKSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG1vbml0b3IoZG9uZTogP0Z1bmN0aW9uKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBzb2NrZXROYW1lcyA9IFtcInNoZWxsU29ja2V0XCIsIFwiaW9Tb2NrZXRcIl07XG5cbiAgICAgIGxldCB3YWl0R3JvdXAgPSBzb2NrZXROYW1lcy5sZW5ndGg7XG5cbiAgICAgIGNvbnN0IG9uQ29ubmVjdCA9ICh7IHNvY2tldE5hbWUsIHNvY2tldCB9KSA9PiB7XG4gICAgICAgIGxvZyhcIlpNUUtlcm5lbDogXCIgKyBzb2NrZXROYW1lICsgXCIgY29ubmVjdGVkXCIpO1xuICAgICAgICBzb2NrZXQudW5tb25pdG9yKCk7XG5cbiAgICAgICAgd2FpdEdyb3VwLS07XG4gICAgICAgIGlmICh3YWl0R3JvdXAgPT09IDApIHtcbiAgICAgICAgICBsb2coXCJaTVFLZXJuZWw6IGFsbCBtYWluIHNvY2tldHMgY29ubmVjdGVkXCIpO1xuICAgICAgICAgIHRoaXMuc2V0RXhlY3V0aW9uU3RhdGUoXCJpZGxlXCIpO1xuICAgICAgICAgIGlmIChkb25lKSBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IG1vbml0b3IgPSAoc29ja2V0TmFtZSwgc29ja2V0KSA9PiB7XG4gICAgICAgIGxvZyhcIlpNUUtlcm5lbDogbW9uaXRvciBcIiArIHNvY2tldE5hbWUpO1xuICAgICAgICBzb2NrZXQub24oXCJjb25uZWN0XCIsIG9uQ29ubmVjdC5iaW5kKHRoaXMsIHsgc29ja2V0TmFtZSwgc29ja2V0IH0pKTtcbiAgICAgICAgc29ja2V0Lm1vbml0b3IoKTtcbiAgICAgIH07XG5cbiAgICAgIG1vbml0b3IoXCJzaGVsbFNvY2tldFwiLCB0aGlzLnNoZWxsU29ja2V0KTtcbiAgICAgIG1vbml0b3IoXCJpb1NvY2tldFwiLCB0aGlzLmlvU29ja2V0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZyhcIlpNUUtlcm5lbDpcIiwgZXJyKTtcbiAgICB9XG4gIH1cblxuICBpbnRlcnJ1cHQoKSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJDYW5ub3QgaW50ZXJydXB0IHRoaXMga2VybmVsXCIsIHtcbiAgICAgICAgZGV0YWlsOiBcIktlcm5lbCBpbnRlcnJ1cHRpb24gaXMgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQgaW4gV2luZG93cy5cIixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2coXCJaTVFLZXJuZWw6IHNlbmRpbmcgU0lHSU5UXCIpO1xuICAgICAgdGhpcy5rZXJuZWxQcm9jZXNzLmtpbGwoXCJTSUdJTlRcIik7XG4gICAgfVxuICB9XG5cbiAgX2tpbGwoKSB7XG4gICAgbG9nKFwiWk1RS2VybmVsOiBzZW5kaW5nIFNJR0tJTExcIik7XG4gICAgdGhpcy5rZXJuZWxQcm9jZXNzLmtpbGwoXCJTSUdLSUxMXCIpO1xuICB9XG5cbiAgX2V4ZWN1dGVTdGFydHVwQ29kZSgpIHtcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IHRoaXMua2VybmVsU3BlYy5kaXNwbGF5X25hbWU7XG4gICAgbGV0IHN0YXJ0dXBDb2RlID0gQ29uZmlnLmdldEpzb24oXCJzdGFydHVwQ29kZVwiKVtkaXNwbGF5TmFtZV07XG4gICAgaWYgKHN0YXJ0dXBDb2RlKSB7XG4gICAgICBsb2coXCJLZXJuZWxNYW5hZ2VyOiBFeGVjdXRpbmcgc3RhcnR1cCBjb2RlOlwiLCBzdGFydHVwQ29kZSk7XG4gICAgICBzdGFydHVwQ29kZSArPSBcIlxcblwiO1xuICAgICAgdGhpcy5leGVjdXRlKHN0YXJ0dXBDb2RlLCAobWVzc2FnZSwgY2hhbm5lbCkgPT4ge30pO1xuICAgIH1cbiAgfVxuXG4gIHNodXRkb3duKCkge1xuICAgIHRoaXMuX3NvY2tldFNodXRkb3duKCk7XG4gIH1cblxuICByZXN0YXJ0KG9uUmVzdGFydGVkOiA/RnVuY3Rpb24pIHtcbiAgICB0aGlzLl9zb2NrZXRSZXN0YXJ0KG9uUmVzdGFydGVkKTtcbiAgfVxuXG4gIF9zb2NrZXRTaHV0ZG93bihyZXN0YXJ0OiA/Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgcmVxdWVzdElkID0gYHNodXRkb3duXyR7djQoKX1gO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVNZXNzYWdlKFwic2h1dGRvd25fcmVxdWVzdFwiLCByZXF1ZXN0SWQpO1xuXG4gICAgbWVzc2FnZS5jb250ZW50ID0geyByZXN0YXJ0IH07XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0LnNlbmQobmV3IE1lc3NhZ2UobWVzc2FnZSkpO1xuICB9XG5cbiAgX3NvY2tldFJlc3RhcnQob25SZXN0YXJ0ZWQ6ID9GdW5jdGlvbikge1xuICAgIGlmICh0aGlzLmV4ZWN1dGlvblN0YXRlID09PSBcInJlc3RhcnRpbmdcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNldEV4ZWN1dGlvblN0YXRlKFwicmVzdGFydGluZ1wiKTtcbiAgICB0aGlzLl9zb2NrZXRTaHV0ZG93bih0cnVlKTtcbiAgICB0aGlzLl9raWxsKCk7XG4gICAgY29uc3QgeyBzcGF3biB9ID0gbGF1bmNoU3BlY0Zyb21Db25uZWN0aW9uSW5mbyhcbiAgICAgIHRoaXMua2VybmVsU3BlYyxcbiAgICAgIHRoaXMuY29ubmVjdGlvbixcbiAgICAgIHRoaXMuY29ubmVjdGlvbkZpbGUsXG4gICAgICB0aGlzLm9wdGlvbnNcbiAgICApO1xuICAgIHRoaXMua2VybmVsUHJvY2VzcyA9IHNwYXduO1xuICAgIHRoaXMubW9uaXRvcigoKSA9PiB7XG4gICAgICB0aGlzLl9leGVjdXRlU3RhcnR1cENvZGUoKTtcbiAgICAgIGlmIChvblJlc3RhcnRlZCkgb25SZXN0YXJ0ZWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIG9uUmVzdWx0cyBpcyBhIGNhbGxiYWNrIHRoYXQgbWF5IGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lc1xuICAvLyBhcyByZXN1bHRzIGNvbWUgaW4gZnJvbSB0aGUga2VybmVsXG4gIGV4ZWN1dGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjaykge1xuICAgIGxvZyhcIlpNUUtlcm5lbC5leGVjdXRlOlwiLCBjb2RlKTtcbiAgICBjb25zdCByZXF1ZXN0SWQgPSBgZXhlY3V0ZV8ke3Y0KCl9YDtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVNZXNzYWdlKFwiZXhlY3V0ZV9yZXF1ZXN0XCIsIHJlcXVlc3RJZCk7XG5cbiAgICBtZXNzYWdlLmNvbnRlbnQgPSB7XG4gICAgICBjb2RlLFxuICAgICAgc2lsZW50OiBmYWxzZSxcbiAgICAgIHN0b3JlX2hpc3Rvcnk6IHRydWUsXG4gICAgICB1c2VyX2V4cHJlc3Npb25zOiB7fSxcbiAgICAgIGFsbG93X3N0ZGluOiB0cnVlLFxuICAgIH07XG5cbiAgICB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1tyZXF1ZXN0SWRdID0gb25SZXN1bHRzO1xuXG4gICAgdGhpcy5zaGVsbFNvY2tldC5zZW5kKG5ldyBNZXNzYWdlKG1lc3NhZ2UpKTtcbiAgfVxuXG4gIGNvbXBsZXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICBsb2coXCJaTVFLZXJuZWwuY29tcGxldGU6XCIsIGNvZGUpO1xuXG4gICAgY29uc3QgcmVxdWVzdElkID0gYGNvbXBsZXRlXyR7djQoKX1gO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJjb21wbGV0ZV9yZXF1ZXN0XCIsIHJlcXVlc3RJZCk7XG5cbiAgICBtZXNzYWdlLmNvbnRlbnQgPSB7XG4gICAgICBjb2RlLFxuICAgICAgdGV4dDogY29kZSxcbiAgICAgIGxpbmU6IGNvZGUsXG4gICAgICBjdXJzb3JfcG9zOiBqc19pZHhfdG9fY2hhcl9pZHgoY29kZS5sZW5ndGgsIGNvZGUpLFxuICAgIH07XG5cbiAgICB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1tyZXF1ZXN0SWRdID0gb25SZXN1bHRzO1xuXG4gICAgdGhpcy5zaGVsbFNvY2tldC5zZW5kKG5ldyBNZXNzYWdlKG1lc3NhZ2UpKTtcbiAgfVxuXG4gIGluc3BlY3QoY29kZTogc3RyaW5nLCBjdXJzb3JQb3M6IG51bWJlciwgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICBsb2coXCJaTVFLZXJuZWwuaW5zcGVjdDpcIiwgY29kZSwgY3Vyc29yUG9zKTtcblxuICAgIGNvbnN0IHJlcXVlc3RJZCA9IGBpbnNwZWN0XyR7djQoKX1gO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJpbnNwZWN0X3JlcXVlc3RcIiwgcmVxdWVzdElkKTtcblxuICAgIG1lc3NhZ2UuY29udGVudCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBjdXJzb3JfcG9zOiBjdXJzb3JQb3MsXG4gICAgICBkZXRhaWxfbGV2ZWw6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuZXhlY3V0aW9uQ2FsbGJhY2tzW3JlcXVlc3RJZF0gPSBvblJlc3VsdHM7XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0LnNlbmQobmV3IE1lc3NhZ2UobWVzc2FnZSkpO1xuICB9XG5cbiAgaW5wdXRSZXBseShpbnB1dDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVxdWVzdElkID0gYGlucHV0X3JlcGx5XyR7djQoKX1gO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJpbnB1dF9yZXBseVwiLCByZXF1ZXN0SWQpO1xuXG4gICAgbWVzc2FnZS5jb250ZW50ID0geyB2YWx1ZTogaW5wdXQgfTtcblxuICAgIHRoaXMuc3RkaW5Tb2NrZXQuc2VuZChuZXcgTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBvblNoZWxsTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgbG9nKFwic2hlbGwgbWVzc2FnZTpcIiwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRNZXNzYWdlKG1lc3NhZ2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBtc2dfaWQgfSA9IG1lc3NhZ2UucGFyZW50X2hlYWRlcjtcbiAgICBsZXQgY2FsbGJhY2s7XG4gICAgaWYgKG1zZ19pZCkge1xuICAgICAgY2FsbGJhY2sgPSB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1ttc2dfaWRdO1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sobWVzc2FnZSwgXCJzaGVsbFwiKTtcbiAgICB9XG4gIH1cblxuICBvblN0ZGluTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgbG9nKFwic3RkaW4gbWVzc2FnZTpcIiwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRNZXNzYWdlKG1lc3NhZ2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaW5wdXRfcmVxdWVzdCBtZXNzYWdlcyBhcmUgYXR0cmlidXRhYmxlIHRvIHBhcnRpY3VsYXIgZXhlY3V0aW9uIHJlcXVlc3RzLFxuICAgIC8vIGFuZCBzaG91bGQgcGFzcyB0aHJvdWdoIHRoZSBtaWRkbGV3YXJlIHN0YWNrIHRvIGFsbG93IHBsdWdpbnMgdG8gc2VlIHRoZW1cbiAgICBjb25zdCB7IG1zZ19pZCB9ID0gbWVzc2FnZS5wYXJlbnRfaGVhZGVyO1xuICAgIGxldCBjYWxsYmFjaztcbiAgICBpZiAobXNnX2lkKSB7XG4gICAgICBjYWxsYmFjayA9IHRoaXMuZXhlY3V0aW9uQ2FsbGJhY2tzW21zZ19pZF07XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhtZXNzYWdlLCBcInN0ZGluXCIpO1xuICAgIH1cbiAgfVxuXG4gIG9uSU9NZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICBsb2coXCJJTyBtZXNzYWdlOlwiLCBtZXNzYWdlKTtcblxuICAgIGlmICghdGhpcy5faXNWYWxpZE1lc3NhZ2UobWVzc2FnZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1zZ190eXBlIH0gPSBtZXNzYWdlLmhlYWRlcjtcbiAgICBpZiAobXNnX3R5cGUgPT09IFwic3RhdHVzXCIpIHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IG1lc3NhZ2UuY29udGVudC5leGVjdXRpb25fc3RhdGU7XG4gICAgICB0aGlzLnNldEV4ZWN1dGlvblN0YXRlKHN0YXR1cyk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBtc2dfaWQgfSA9IG1lc3NhZ2UucGFyZW50X2hlYWRlcjtcbiAgICBsZXQgY2FsbGJhY2s7XG4gICAgaWYgKG1zZ19pZCkge1xuICAgICAgY2FsbGJhY2sgPSB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1ttc2dfaWRdO1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sobWVzc2FnZSwgXCJpb3B1YlwiKTtcbiAgICB9XG4gIH1cblxuICBfaXNWYWxpZE1lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBudWxsXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5jb250ZW50KSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgY29udGVudFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5jb250ZW50LmV4ZWN1dGlvbl9zdGF0ZSA9PT0gXCJzdGFydGluZ1wiKSB7XG4gICAgICAvLyBLZXJuZWxzIHNlbmQgYSBzdGFydGluZyBzdGF0dXMgbWVzc2FnZSB3aXRoIGFuIGVtcHR5IHBhcmVudF9oZWFkZXJcbiAgICAgIGxvZyhcIkRyb3BwZWQgc3RhcnRpbmcgc3RhdHVzIElPIG1lc3NhZ2VcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLnBhcmVudF9oZWFkZXIpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBwYXJlbnRfaGVhZGVyXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5wYXJlbnRfaGVhZGVyLm1zZ19pZCkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIHBhcmVudF9oZWFkZXIubXNnX2lkXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5wYXJlbnRfaGVhZGVyLm1zZ190eXBlKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgcGFyZW50X2hlYWRlci5tc2dfdHlwZVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UuaGVhZGVyKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgaGVhZGVyXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5oZWFkZXIubXNnX2lkKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgaGVhZGVyLm1zZ19pZFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UuaGVhZGVyLm1zZ190eXBlKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgaGVhZGVyLm1zZ190eXBlXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBsb2coXCJaTVFLZXJuZWw6IGRlc3Ryb3k6XCIsIHRoaXMpO1xuXG4gICAgdGhpcy5zaHV0ZG93bigpO1xuXG4gICAgdGhpcy5fa2lsbCgpO1xuICAgIGZzLnVubGlua1N5bmModGhpcy5jb25uZWN0aW9uRmlsZSk7XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0LmNsb3NlKCk7XG4gICAgdGhpcy5pb1NvY2tldC5jbG9zZSgpO1xuICAgIHRoaXMuc3RkaW5Tb2NrZXQuY2xvc2UoKTtcblxuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIF9nZXRVc2VybmFtZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgcHJvY2Vzcy5lbnYuTE9HTkFNRSB8fFxuICAgICAgcHJvY2Vzcy5lbnYuVVNFUiB8fFxuICAgICAgcHJvY2Vzcy5lbnYuTE5BTUUgfHxcbiAgICAgIHByb2Nlc3MuZW52LlVTRVJOQU1FXG4gICAgKTtcbiAgfVxuXG4gIF9jcmVhdGVNZXNzYWdlKG1zZ1R5cGU6IHN0cmluZywgbXNnSWQ6IHN0cmluZyA9IHY0KCkpIHtcbiAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgaGVhZGVyOiB7XG4gICAgICAgIHVzZXJuYW1lOiB0aGlzLl9nZXRVc2VybmFtZSgpLFxuICAgICAgICBzZXNzaW9uOiBcIjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMFwiLFxuICAgICAgICBtc2dfdHlwZTogbXNnVHlwZSxcbiAgICAgICAgbXNnX2lkOiBtc2dJZCxcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgdmVyc2lvbjogXCI1LjBcIixcbiAgICAgIH0sXG4gICAgICBtZXRhZGF0YToge30sXG4gICAgICBwYXJlbnRfaGVhZGVyOiB7fSxcbiAgICAgIGNvbnRlbnQ6IHt9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxufVxuIl19