Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _utils = require("./utils");

var KernelTransport = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(KernelTransport, [{
    key: "executionState",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "loading";
    },
    enumerable: true
  }, {
    key: "executionCount",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return 0;
    },
    enumerable: true
  }, {
    key: "lastExecutionTime",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "No execution";
    },
    enumerable: true
  }, {
    key: "inspector",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return { bundle: {} };
    },
    enumerable: true
  }], null, _instanceInitializers);

  function KernelTransport(kernelSpec, grammar) {
    _classCallCheck(this, KernelTransport);

    _defineDecoratedPropertyDescriptor(this, "executionState", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "executionCount", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "lastExecutionTime", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "inspector", _instanceInitializers);

    this.kernelSpec = kernelSpec;
    this.grammar = grammar;

    this.language = kernelSpec.language.toLowerCase();
    this.displayName = kernelSpec.display_name;
  }

  _createDecoratedClass(KernelTransport, [{
    key: "setExecutionState",
    decorators: [_mobx.action],
    value: function setExecutionState(state) {
      this.executionState = state;
    }
  }, {
    key: "setExecutionCount",
    decorators: [_mobx.action],
    value: function setExecutionCount(count) {
      this.executionCount = count;
    }
  }, {
    key: "setLastExecutionTime",
    decorators: [_mobx.action],
    value: function setLastExecutionTime(timeString) {
      this.lastExecutionTime = timeString;
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      throw new Error("KernelTransport: interrupt method not implemented");
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      throw new Error("KernelTransport: shutdown method not implemented");
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      throw new Error("KernelTransport: restart method not implemented");
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      throw new Error("KernelTransport: execute method not implemented");
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      throw new Error("KernelTransport: complete method not implemented");
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      throw new Error("KernelTransport: inspect method not implemented");
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      throw new Error("KernelTransport: inputReply method not implemented");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("KernelTransport: Destroying base kernel");
    }
  }], null, _instanceInitializers);

  return KernelTransport;
})();

exports["default"] = KernelTransport;
module.exports = exports["default"];

// Only `WSKernel` would have `gatewayName` property and thus not initialize it here,
// still `KernelTransport` is better to have `gatewayName` property for code simplicity in the other parts of code
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLXRyYW5zcG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVtQyxNQUFNOztxQkFFckIsU0FBUzs7SUFPUixlQUFlOzs7O3dCQUFmLGVBQWU7Ozs7YUFFakIsU0FBUzs7Ozs7OzthQUVULENBQUM7Ozs7Ozs7YUFFRSxjQUFjOzs7Ozs7O2FBRXRCLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTs7Ozs7QUFXZixXQW5CUSxlQUFlLENBbUJ0QixVQUFzQixFQUFFLE9BQXFCLEVBQUU7MEJBbkJ4QyxlQUFlOzs7Ozs7Ozs7O0FBb0JoQyxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2xELFFBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztHQUM1Qzs7d0JBekJrQixlQUFlOzs7V0E0QmpCLDJCQUFDLEtBQWEsRUFBRTtBQUMvQixVQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztLQUM3Qjs7OztXQUdnQiwyQkFBQyxLQUFhLEVBQUU7QUFDL0IsVUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDN0I7Ozs7V0FHbUIsOEJBQUMsVUFBa0IsRUFBRTtBQUN2QyxVQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0tBQ3JDOzs7V0FFUSxxQkFBRztBQUNWLFlBQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztLQUN0RTs7O1dBRU8sb0JBQUc7QUFDVCxZQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7S0FDckU7OztXQUVNLGlCQUFDLFdBQXNCLEVBQUU7QUFDOUIsWUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0tBQ3BFOzs7V0FFTSxpQkFBQyxJQUFZLEVBQUUsU0FBMEIsRUFBRTtBQUNoRCxZQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7S0FDcEU7OztXQUVPLGtCQUFDLElBQVksRUFBRSxTQUEwQixFQUFFO0FBQ2pELFlBQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztLQUNyRTs7O1dBRU0saUJBQUMsSUFBWSxFQUFFLFNBQWlCLEVBQUUsU0FBMEIsRUFBRTtBQUNuRSxZQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7S0FDcEU7OztXQUVTLG9CQUFDLEtBQWEsRUFBRTtBQUN4QixZQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7S0FDdkU7OztXQUVNLG1CQUFHO0FBQ1Isc0JBQUkseUNBQXlDLENBQUMsQ0FBQztLQUNoRDs7O1NBeEVrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC10cmFuc3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBhY3Rpb24gfSBmcm9tIFwibW9ieFwiO1xuXG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgdHlwZSBSZXN1bHRzQ2FsbGJhY2sgPSAoXG4gIG1lc3NhZ2U6IGFueSxcbiAgY2hhbm5lbDogXCJzaGVsbFwiIHwgXCJpb3B1YlwiIHwgXCJzdGRpblwiXG4pID0+IHZvaWQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtlcm5lbFRyYW5zcG9ydCB7XG4gIEBvYnNlcnZhYmxlXG4gIGV4ZWN1dGlvblN0YXRlID0gXCJsb2FkaW5nXCI7XG4gIEBvYnNlcnZhYmxlXG4gIGV4ZWN1dGlvbkNvdW50ID0gMDtcbiAgQG9ic2VydmFibGVcbiAgbGFzdEV4ZWN1dGlvblRpbWUgPSBcIk5vIGV4ZWN1dGlvblwiO1xuICBAb2JzZXJ2YWJsZVxuICBpbnNwZWN0b3IgPSB7IGJ1bmRsZToge30gfTtcblxuICBrZXJuZWxTcGVjOiBLZXJuZWxzcGVjO1xuICBncmFtbWFyOiBhdG9tJEdyYW1tYXI7XG4gIGxhbmd1YWdlOiBzdHJpbmc7XG4gIGRpc3BsYXlOYW1lOiBzdHJpbmc7XG5cbiAgLy8gT25seSBgV1NLZXJuZWxgIHdvdWxkIGhhdmUgYGdhdGV3YXlOYW1lYCBwcm9wZXJ0eSBhbmQgdGh1cyBub3QgaW5pdGlhbGl6ZSBpdCBoZXJlLFxuICAvLyBzdGlsbCBgS2VybmVsVHJhbnNwb3J0YCBpcyBiZXR0ZXIgdG8gaGF2ZSBgZ2F0ZXdheU5hbWVgIHByb3BlcnR5IGZvciBjb2RlIHNpbXBsaWNpdHkgaW4gdGhlIG90aGVyIHBhcnRzIG9mIGNvZGVcbiAgZ2F0ZXdheU5hbWU6ID9zdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioa2VybmVsU3BlYzogS2VybmVsc3BlYywgZ3JhbW1hcjogYXRvbSRHcmFtbWFyKSB7XG4gICAgdGhpcy5rZXJuZWxTcGVjID0ga2VybmVsU3BlYztcbiAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuXG4gICAgdGhpcy5sYW5ndWFnZSA9IGtlcm5lbFNwZWMubGFuZ3VhZ2UudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLmRpc3BsYXlOYW1lID0ga2VybmVsU3BlYy5kaXNwbGF5X25hbWU7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldEV4ZWN1dGlvblN0YXRlKHN0YXRlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmV4ZWN1dGlvblN0YXRlID0gc3RhdGU7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldEV4ZWN1dGlvbkNvdW50KGNvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLmV4ZWN1dGlvbkNvdW50ID0gY291bnQ7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldExhc3RFeGVjdXRpb25UaW1lKHRpbWVTdHJpbmc6IHN0cmluZykge1xuICAgIHRoaXMubGFzdEV4ZWN1dGlvblRpbWUgPSB0aW1lU3RyaW5nO1xuICB9XG5cbiAgaW50ZXJydXB0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIktlcm5lbFRyYW5zcG9ydDogaW50ZXJydXB0IG1ldGhvZCBub3QgaW1wbGVtZW50ZWRcIik7XG4gIH1cblxuICBzaHV0ZG93bigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IHNodXRkb3duIG1ldGhvZCBub3QgaW1wbGVtZW50ZWRcIik7XG4gIH1cblxuICByZXN0YXJ0KG9uUmVzdGFydGVkOiA/RnVuY3Rpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IHJlc3RhcnQgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIGV4ZWN1dGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIktlcm5lbFRyYW5zcG9ydDogZXhlY3V0ZSBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIktlcm5lbFRyYW5zcG9ydDogY29tcGxldGUgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIGluc3BlY3QoY29kZTogc3RyaW5nLCBjdXJzb3JQb3M6IG51bWJlciwgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IGluc3BlY3QgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIGlucHV0UmVwbHkoaW5wdXQ6IHN0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIktlcm5lbFRyYW5zcG9ydDogaW5wdXRSZXBseSBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBsb2coXCJLZXJuZWxUcmFuc3BvcnQ6IERlc3Ryb3lpbmcgYmFzZSBrZXJuZWxcIik7XG4gIH1cbn1cbiJdfQ==