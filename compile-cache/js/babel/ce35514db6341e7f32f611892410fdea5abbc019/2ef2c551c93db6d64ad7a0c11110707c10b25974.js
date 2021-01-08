Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _utils = require("../../../utils");

var StatusBar = (function (_React$Component) {
  _inherits(StatusBar, _React$Component);

  function StatusBar() {
    _classCallCheck(this, _StatusBar);

    _get(Object.getPrototypeOf(_StatusBar.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(StatusBar, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _props$store = this.props.store;
      var kernel = _props$store.kernel;
      var markers = _props$store.markers;
      var configMapping = _props$store.configMapping;

      if (!kernel || configMapping.get("Hydrogen.statusBarDisable")) return null;
      var view = configMapping.get("Hydrogen.statusBarKernelInfo") ?
      // branch on if exec time is not available or no execution has happened
      kernel.executionCount === 0 || kernel.lastExecutionTime === _utils.NO_EXECTIME_STRING ? _react2["default"].createElement(
        "a",
        { onClick: function () {
            return _this.props.onClick({ kernel: kernel, markers: markers });
          } },
        kernel.displayName,
        " | ",
        kernel.executionState,
        " |",
        " ",
        kernel.executionCount
      ) : _react2["default"].createElement(
        "a",
        { onClick: function () {
            return _this.props.onClick({ kernel: kernel, markers: markers });
          } },
        kernel.displayName,
        " | ",
        kernel.executionState,
        " |",
        " ",
        kernel.executionCount,
        " | ",
        kernel.lastExecutionTime
      ) : _react2["default"].createElement(
        "a",
        { onClick: function () {
            return _this.props.onClick({ kernel: kernel, markers: markers });
          } },
        kernel.displayName,
        " | ",
        kernel.executionState
      );
      return view;
    }
  }]);

  var _StatusBar = StatusBar;
  StatusBar = (0, _mobxReact.observer)(StatusBar) || StatusBar;
  return StatusBar;
})(_react2["default"].Component);

exports["default"] = StatusBar;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvY29uc3VtZWQvc3RhdHVzLWJhci9zdGF0dXMtYmFyLWNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7Ozt5QkFDQSxZQUFZOztxQkFJRixnQkFBZ0I7O0lBUTlCLFNBQVM7WUFBVCxTQUFTOztXQUFULFNBQVM7Ozs7OztlQUFULFNBQVM7O1dBQ3RCLGtCQUFHOzs7eUJBQ29DLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztVQUFuRCxNQUFNLGdCQUFOLE1BQU07VUFBRSxPQUFPLGdCQUFQLE9BQU87VUFBRSxhQUFhLGdCQUFiLGFBQWE7O0FBQ3RDLFVBQUksQ0FBQyxNQUFNLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQzNFLFVBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUM7O0FBRTVELFlBQU0sQ0FBQyxjQUFjLEtBQUssQ0FBQyxJQUMzQixNQUFNLENBQUMsaUJBQWlCLDhCQUF1QixHQUM3Qzs7VUFBRyxPQUFPLEVBQUU7bUJBQU0sTUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUM7V0FBQSxBQUFDO1FBQ3ZELE1BQU0sQ0FBQyxXQUFXOztRQUFLLE1BQU0sQ0FBQyxjQUFjOztRQUFJLEdBQUc7UUFDbkQsTUFBTSxDQUFDLGNBQWM7T0FDcEIsR0FFSjs7VUFBRyxPQUFPLEVBQUU7bUJBQU0sTUFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUM7V0FBQSxBQUFDO1FBQ3ZELE1BQU0sQ0FBQyxXQUFXOztRQUFLLE1BQU0sQ0FBQyxjQUFjOztRQUFJLEdBQUc7UUFDbkQsTUFBTSxDQUFDLGNBQWM7O1FBQUssTUFBTSxDQUFDLGlCQUFpQjtPQUNqRCxBQUNMLEdBRUQ7O1VBQUcsT0FBTyxFQUFFO21CQUFNLE1BQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDO1dBQUEsQUFBQztRQUN2RCxNQUFNLENBQUMsV0FBVzs7UUFBSyxNQUFNLENBQUMsY0FBYztPQUMzQyxBQUNMLENBQUM7QUFDRixhQUFPLElBQUksQ0FBQztLQUNiOzs7bUJBeEJrQixTQUFTO0FBQVQsV0FBUyw0QkFBVCxTQUFTLEtBQVQsU0FBUztTQUFULFNBQVM7R0FBUyxtQkFBTSxTQUFTOztxQkFBakMsU0FBUyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3NlcnZpY2VzL2NvbnN1bWVkL3N0YXR1cy1iYXIvc3RhdHVzLWJhci1jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5cbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi4vLi4vLi4va2VybmVsXCI7XG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uLy4uL3N0b3JlXCI7XG5pbXBvcnQgeyBOT19FWEVDVElNRV9TVFJJTkcgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcblxudHlwZSBQcm9wcyA9IHtcbiAgc3RvcmU6IFN0b3JlLFxuICBvbkNsaWNrOiBGdW5jdGlvbixcbn07XG5cbkBvYnNlcnZlclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzPiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGtlcm5lbCwgbWFya2VycywgY29uZmlnTWFwcGluZyB9ID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICBpZiAoIWtlcm5lbCB8fCBjb25maWdNYXBwaW5nLmdldChcIkh5ZHJvZ2VuLnN0YXR1c0JhckRpc2FibGVcIikpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHZpZXcgPSBjb25maWdNYXBwaW5nLmdldChcIkh5ZHJvZ2VuLnN0YXR1c0Jhcktlcm5lbEluZm9cIikgPyAoXG4gICAgICAvLyBicmFuY2ggb24gaWYgZXhlYyB0aW1lIGlzIG5vdCBhdmFpbGFibGUgb3Igbm8gZXhlY3V0aW9uIGhhcyBoYXBwZW5lZFxuICAgICAga2VybmVsLmV4ZWN1dGlvbkNvdW50ID09PSAwIHx8XG4gICAgICBrZXJuZWwubGFzdEV4ZWN1dGlvblRpbWUgPT09IE5PX0VYRUNUSU1FX1NUUklORyA/IChcbiAgICAgICAgPGEgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkNsaWNrKHsga2VybmVsLCBtYXJrZXJzIH0pfT5cbiAgICAgICAgICB7a2VybmVsLmRpc3BsYXlOYW1lfSB8IHtrZXJuZWwuZXhlY3V0aW9uU3RhdGV9IHx7XCIgXCJ9XG4gICAgICAgICAge2tlcm5lbC5leGVjdXRpb25Db3VudH1cbiAgICAgICAgPC9hPlxuICAgICAgKSA6IChcbiAgICAgICAgPGEgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkNsaWNrKHsga2VybmVsLCBtYXJrZXJzIH0pfT5cbiAgICAgICAgICB7a2VybmVsLmRpc3BsYXlOYW1lfSB8IHtrZXJuZWwuZXhlY3V0aW9uU3RhdGV9IHx7XCIgXCJ9XG4gICAgICAgICAge2tlcm5lbC5leGVjdXRpb25Db3VudH0gfCB7a2VybmVsLmxhc3RFeGVjdXRpb25UaW1lfVxuICAgICAgICA8L2E+XG4gICAgICApXG4gICAgKSA6IChcbiAgICAgIDxhIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25DbGljayh7IGtlcm5lbCwgbWFya2VycyB9KX0+XG4gICAgICAgIHtrZXJuZWwuZGlzcGxheU5hbWV9IHwge2tlcm5lbC5leGVjdXRpb25TdGF0ZX1cbiAgICAgIDwvYT5cbiAgICApO1xuICAgIHJldHVybiB2aWV3O1xuICB9XG59XG4iXX0=