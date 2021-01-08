Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _kernelTransport = require("./kernel-transport");

var _kernelTransport2 = _interopRequireDefault(_kernelTransport);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _utils = require("./utils");

var WSKernel = (function (_KernelTransport) {
  _inherits(WSKernel, _KernelTransport);

  function WSKernel(gatewayName, kernelSpec, grammar, session) {
    var _this = this;

    _classCallCheck(this, WSKernel);

    _get(Object.getPrototypeOf(WSKernel.prototype), "constructor", this).call(this, kernelSpec, grammar);
    this.session = session;
    this.gatewayName = gatewayName;

    this.session.statusChanged.connect(function () {
      return _this.setExecutionState(_this.session.status);
    });
    this.setExecutionState(this.session.status); // Set initial status correctly
  }

  _createClass(WSKernel, [{
    key: "interrupt",
    value: function interrupt() {
      this.session.kernel.interrupt();
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this.session.kernel.shutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      var future = this.session.kernel.restart();
      future.then(function () {
        if (onRestarted) onRestarted();
      });
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      var future = this.session.kernel.requestExecute({ code: code });

      future.onIOPub = function (message) {
        (0, _utils.log)("WSKernel: execute:", message);
        onResults(message, "iopub");
      };

      future.onReply = function (message) {
        return onResults(message, "shell");
      };
      future.onStdin = function (message) {
        return onResults(message, "stdin");
      };
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      this.session.kernel.requestComplete({
        code: code,
        cursor_pos: (0, _utils.js_idx_to_char_idx)(code.length, code)
      }).then(function (message) {
        return onResults(message, "shell");
      });
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      this.session.kernel.requestInspect({
        code: code,
        cursor_pos: cursorPos,
        detail_level: 0
      }).then(function (message) {
        return onResults(message, "shell");
      });
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      this.session.kernel.sendInputReply({ value: input });
    }
  }, {
    key: "promptRename",
    value: function promptRename() {
      var _this2 = this;

      var view = new _inputView2["default"]({
        prompt: "Name your current session",
        defaultText: this.session.path,
        allowCancel: true
      }, function (input) {
        return _this2.session.setPath(input);
      });

      view.attach();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("WSKernel: destroying jupyter-js-services Session");
      this.session.dispose();
      _get(Object.getPrototypeOf(WSKernel.prototype), "destroy", this).call(this);
    }
  }]);

  return WSKernel;
})(_kernelTransport2["default"]);

exports["default"] = WSKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvd3Mta2VybmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OytCQUU0QixvQkFBb0I7Ozs7eUJBRTFCLGNBQWM7Ozs7cUJBQ0ksU0FBUzs7SUFJNUIsUUFBUTtZQUFSLFFBQVE7O0FBR2hCLFdBSFEsUUFBUSxDQUl6QixXQUFtQixFQUNuQixVQUFzQixFQUN0QixPQUFxQixFQUNyQixPQUFnQixFQUNoQjs7OzBCQVJpQixRQUFROztBQVN6QiwrQkFUaUIsUUFBUSw2Q0FTbkIsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUMzQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO2FBQ2pDLE1BQUssaUJBQWlCLENBQUMsTUFBSyxPQUFPLENBQUMsTUFBTSxDQUFDO0tBQUEsQ0FDNUMsQ0FBQztBQUNGLFFBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzdDOztlQWpCa0IsUUFBUTs7V0FtQmxCLHFCQUFHO0FBQ1YsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDakM7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDaEM7OztXQUVNLGlCQUFDLFdBQXNCLEVBQUU7QUFDOUIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0MsWUFBTSxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ2hCLFlBQUksV0FBVyxFQUFFLFdBQVcsRUFBRSxDQUFDO09BQ2hDLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxpQkFBQyxJQUFZLEVBQUUsU0FBMEIsRUFBRTtBQUNoRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUMsQ0FBQzs7QUFFNUQsWUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLE9BQU8sRUFBYztBQUNyQyx3QkFBSSxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuQyxpQkFBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM3QixDQUFDOztBQUVGLFlBQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxPQUFPO2VBQWMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7T0FBQSxDQUFDO0FBQ25FLFlBQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxPQUFPO2VBQWMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7T0FBQSxDQUFDO0tBQ3BFOzs7V0FFTyxrQkFBQyxJQUFZLEVBQUUsU0FBMEIsRUFBRTtBQUNqRCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDaEIsZUFBZSxDQUFDO0FBQ2YsWUFBSSxFQUFKLElBQUk7QUFDSixrQkFBVSxFQUFFLCtCQUFtQixJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztPQUNsRCxDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQUMsT0FBTztlQUFjLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQzVEOzs7V0FFTSxpQkFBQyxJQUFZLEVBQUUsU0FBaUIsRUFBRSxTQUEwQixFQUFFO0FBQ25FLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUNoQixjQUFjLENBQUM7QUFDZCxZQUFJLEVBQUosSUFBSTtBQUNKLGtCQUFVLEVBQUUsU0FBUztBQUNyQixvQkFBWSxFQUFFLENBQUM7T0FDaEIsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFDLE9BQU87ZUFBYyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztPQUFBLENBQUMsQ0FBQztLQUM1RDs7O1dBRVMsb0JBQUMsS0FBYSxFQUFFO0FBQ3hCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3REOzs7V0FFVyx3QkFBRzs7O0FBQ2IsVUFBTSxJQUFJLEdBQUcsMkJBQ1g7QUFDRSxjQUFNLEVBQUUsMkJBQTJCO0FBQ25DLG1CQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO0FBQzlCLG1CQUFXLEVBQUUsSUFBSTtPQUNsQixFQUNELFVBQUMsS0FBSztlQUFhLE9BQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7T0FBQSxDQUMvQyxDQUFDOztBQUVGLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFTSxtQkFBRztBQUNSLHNCQUFJLGtEQUFrRCxDQUFDLENBQUM7QUFDeEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QixpQ0FyRmlCLFFBQVEseUNBcUZUO0tBQ2pCOzs7U0F0RmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvd3Mta2VybmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IEtlcm5lbFRyYW5zcG9ydCBmcm9tIFwiLi9rZXJuZWwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgdHlwZSB7IFJlc3VsdHNDYWxsYmFjayB9IGZyb20gXCIuL2tlcm5lbC10cmFuc3BvcnRcIjtcbmltcG9ydCBJbnB1dFZpZXcgZnJvbSBcIi4vaW5wdXQtdmlld1wiO1xuaW1wb3J0IHsgbG9nLCBqc19pZHhfdG9fY2hhcl9pZHggfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSB7IFNlc3Npb24gfSBmcm9tIFwiQGp1cHl0ZXJsYWIvc2VydmljZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV1NLZXJuZWwgZXh0ZW5kcyBLZXJuZWxUcmFuc3BvcnQge1xuICBzZXNzaW9uOiBTZXNzaW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGdhdGV3YXlOYW1lOiBzdHJpbmcsXG4gICAga2VybmVsU3BlYzogS2VybmVsc3BlYyxcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXIsXG4gICAgc2Vzc2lvbjogU2Vzc2lvblxuICApIHtcbiAgICBzdXBlcihrZXJuZWxTcGVjLCBncmFtbWFyKTtcbiAgICB0aGlzLnNlc3Npb24gPSBzZXNzaW9uO1xuICAgIHRoaXMuZ2F0ZXdheU5hbWUgPSBnYXRld2F5TmFtZTtcblxuICAgIHRoaXMuc2Vzc2lvbi5zdGF0dXNDaGFuZ2VkLmNvbm5lY3QoKCkgPT5cbiAgICAgIHRoaXMuc2V0RXhlY3V0aW9uU3RhdGUodGhpcy5zZXNzaW9uLnN0YXR1cylcbiAgICApO1xuICAgIHRoaXMuc2V0RXhlY3V0aW9uU3RhdGUodGhpcy5zZXNzaW9uLnN0YXR1cyk7IC8vIFNldCBpbml0aWFsIHN0YXR1cyBjb3JyZWN0bHlcbiAgfVxuXG4gIGludGVycnVwdCgpIHtcbiAgICB0aGlzLnNlc3Npb24ua2VybmVsLmludGVycnVwdCgpO1xuICB9XG5cbiAgc2h1dGRvd24oKSB7XG4gICAgdGhpcy5zZXNzaW9uLmtlcm5lbC5zaHV0ZG93bigpO1xuICB9XG5cbiAgcmVzdGFydChvblJlc3RhcnRlZDogP0Z1bmN0aW9uKSB7XG4gICAgY29uc3QgZnV0dXJlID0gdGhpcy5zZXNzaW9uLmtlcm5lbC5yZXN0YXJ0KCk7XG4gICAgZnV0dXJlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKG9uUmVzdGFydGVkKSBvblJlc3RhcnRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZShjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrKSB7XG4gICAgY29uc3QgZnV0dXJlID0gdGhpcy5zZXNzaW9uLmtlcm5lbC5yZXF1ZXN0RXhlY3V0ZSh7IGNvZGUgfSk7XG5cbiAgICBmdXR1cmUub25JT1B1YiA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICBsb2coXCJXU0tlcm5lbDogZXhlY3V0ZTpcIiwgbWVzc2FnZSk7XG4gICAgICBvblJlc3VsdHMobWVzc2FnZSwgXCJpb3B1YlwiKTtcbiAgICB9O1xuXG4gICAgZnV0dXJlLm9uUmVwbHkgPSAobWVzc2FnZTogTWVzc2FnZSkgPT4gb25SZXN1bHRzKG1lc3NhZ2UsIFwic2hlbGxcIik7XG4gICAgZnV0dXJlLm9uU3RkaW4gPSAobWVzc2FnZTogTWVzc2FnZSkgPT4gb25SZXN1bHRzKG1lc3NhZ2UsIFwic3RkaW5cIik7XG4gIH1cblxuICBjb21wbGV0ZShjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrKSB7XG4gICAgdGhpcy5zZXNzaW9uLmtlcm5lbFxuICAgICAgLnJlcXVlc3RDb21wbGV0ZSh7XG4gICAgICAgIGNvZGUsXG4gICAgICAgIGN1cnNvcl9wb3M6IGpzX2lkeF90b19jaGFyX2lkeChjb2RlLmxlbmd0aCwgY29kZSksXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG9uUmVzdWx0cyhtZXNzYWdlLCBcInNoZWxsXCIpKTtcbiAgfVxuXG4gIGluc3BlY3QoY29kZTogc3RyaW5nLCBjdXJzb3JQb3M6IG51bWJlciwgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICB0aGlzLnNlc3Npb24ua2VybmVsXG4gICAgICAucmVxdWVzdEluc3BlY3Qoe1xuICAgICAgICBjb2RlLFxuICAgICAgICBjdXJzb3JfcG9zOiBjdXJzb3JQb3MsXG4gICAgICAgIGRldGFpbF9sZXZlbDogMCxcbiAgICAgIH0pXG4gICAgICAudGhlbigobWVzc2FnZTogTWVzc2FnZSkgPT4gb25SZXN1bHRzKG1lc3NhZ2UsIFwic2hlbGxcIikpO1xuICB9XG5cbiAgaW5wdXRSZXBseShpbnB1dDogc3RyaW5nKSB7XG4gICAgdGhpcy5zZXNzaW9uLmtlcm5lbC5zZW5kSW5wdXRSZXBseSh7IHZhbHVlOiBpbnB1dCB9KTtcbiAgfVxuXG4gIHByb21wdFJlbmFtZSgpIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IElucHV0VmlldyhcbiAgICAgIHtcbiAgICAgICAgcHJvbXB0OiBcIk5hbWUgeW91ciBjdXJyZW50IHNlc3Npb25cIixcbiAgICAgICAgZGVmYXVsdFRleHQ6IHRoaXMuc2Vzc2lvbi5wYXRoLFxuICAgICAgICBhbGxvd0NhbmNlbDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAoaW5wdXQ6IHN0cmluZykgPT4gdGhpcy5zZXNzaW9uLnNldFBhdGgoaW5wdXQpXG4gICAgKTtcblxuICAgIHZpZXcuYXR0YWNoKCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGxvZyhcIldTS2VybmVsOiBkZXN0cm95aW5nIGp1cHl0ZXItanMtc2VydmljZXMgU2Vzc2lvblwiKTtcbiAgICB0aGlzLnNlc3Npb24uZGlzcG9zZSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19