Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _nteractMathjax = require("@nteract/mathjax");

var _mathjaxElectron = require("mathjax-electron");

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _anser = require("anser");

var _anser2 = _interopRequireDefault(_anser);

var _resultViewHistory = require("./result-view/history");

var _resultViewHistory2 = _interopRequireDefault(_resultViewHistory);

var _resultViewList = require("./result-view/list");

var _resultViewList2 = _interopRequireDefault(_resultViewList);

var _utils = require("./../utils");

var OutputArea = (function (_React$Component) {
  var _instanceInitializers = {};

  _inherits(OutputArea, _React$Component);

  function OutputArea() {
    var _this = this;

    _classCallCheck(this, _OutputArea);

    _get(Object.getPrototypeOf(_OutputArea.prototype), "constructor", this).apply(this, arguments);

    _defineDecoratedPropertyDescriptor(this, "showHistory", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setHistory", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setScrollList", _instanceInitializers);

    this.handleClick = function () {
      var kernel = _this.props.store.kernel;
      if (!kernel || !kernel.outputStore) return;
      var output = kernel.outputStore.outputs[kernel.outputStore.index];
      var copyOutput = _this.getOutputText(output);

      if (copyOutput) {
        atom.clipboard.write(_anser2["default"].ansiToText(copyOutput));
        atom.notifications.addSuccess("Copied to clipboard");
      } else {
        atom.notifications.addWarning("Nothing to copy");
      }
    };
  }

  _createDecoratedClass(OutputArea, [{
    key: "getOutputText",
    value: function getOutputText(output) {
      switch (output.output_type) {
        case "stream":
          return output.text;
        case "execute_result":
          return output.data["text/plain"];
        case "error":
          return output.traceback.toJS().join("\n");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var kernel = this.props.store.kernel;

      if (!kernel) {
        if (atom.config.get("Hydrogen.outputAreaDock")) {
          return _react2["default"].createElement(_utils.EmptyMessage, null);
        }

        atom.workspace.hide(_utils.OUTPUT_AREA_URI);
        return null;
      }
      return _react2["default"].createElement(
        _nteractMathjax.Provider,
        { src: _mathjaxElectron.mathJaxPath },
        _react2["default"].createElement(
          "div",
          { className: "sidebar output-area" },
          kernel.outputStore.outputs.length > 0 ? _react2["default"].createElement(
            "div",
            { className: "block" },
            _react2["default"].createElement(
              "div",
              { className: "btn-group" },
              _react2["default"].createElement("button", {
                className: "btn icon icon-clock" + (this.showHistory ? " selected" : ""),
                onClick: this.setHistory
              }),
              _react2["default"].createElement("button", {
                className: "btn icon icon-three-bars" + (!this.showHistory ? " selected" : ""),
                onClick: this.setScrollList
              })
            ),
            _react2["default"].createElement(
              "div",
              { style: { float: "right" } },
              this.showHistory ? _react2["default"].createElement(
                "button",
                {
                  className: "btn icon icon-clippy",
                  onClick: this.handleClick
                },
                "Copy"
              ) : null,
              _react2["default"].createElement(
                "button",
                {
                  className: "btn icon icon-trashcan",
                  onClick: kernel.outputStore.clear
                },
                "Clear"
              )
            )
          ) : _react2["default"].createElement(_utils.EmptyMessage, null),
          this.showHistory ? _react2["default"].createElement(_resultViewHistory2["default"], { store: kernel.outputStore }) : _react2["default"].createElement(_resultViewList2["default"], { outputs: kernel.outputStore.outputs })
        )
      );
    }
  }, {
    key: "showHistory",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return true;
    },
    enumerable: true
  }, {
    key: "setHistory",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.showHistory = true;
      };
    },
    enumerable: true
  }, {
    key: "setScrollList",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.showHistory = false;
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  var _OutputArea = OutputArea;
  OutputArea = (0, _mobxReact.observer)(OutputArea) || OutputArea;
  return OutputArea;
})(_react2["default"].Component);

exports["default"] = OutputArea;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9vdXRwdXQtYXJlYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7OzhCQUNBLGtCQUFrQjs7K0JBQ2Ysa0JBQWtCOztvQkFDWCxNQUFNOzt5QkFDaEIsWUFBWTs7cUJBQ25CLE9BQU87Ozs7aUNBRUwsdUJBQXVCOzs7OzhCQUNwQixvQkFBb0I7Ozs7cUJBQ0csWUFBWTs7SUFLcEQsVUFBVTs7O1lBQVYsVUFBVTs7V0FBVixVQUFVOzs7Ozs7Ozs7Ozs7O1NBd0JkLFdBQVcsR0FBRyxZQUFNO0FBQ2xCLFVBQU0sTUFBTSxHQUFHLE1BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDdkMsVUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUMzQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BFLFVBQU0sVUFBVSxHQUFHLE1BQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU5QyxVQUFJLFVBQVUsRUFBRTtBQUNkLFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLG1CQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7T0FDdEQsTUFBTTtBQUNMLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7T0FDbEQ7S0FDRjs7O3dCQXBDRyxVQUFVOztXQWFELHVCQUFDLE1BQWMsRUFBVztBQUNyQyxjQUFRLE1BQU0sQ0FBQyxXQUFXO0FBQ3hCLGFBQUssUUFBUTtBQUNYLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFBQSxBQUNyQixhQUFLLGdCQUFnQjtBQUNuQixpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQUEsQUFDbkMsYUFBSyxPQUFPO0FBQ1YsaUJBQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFBQSxPQUM3QztLQUNGOzs7V0FnQkssa0JBQUc7QUFDUCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQUU7QUFDOUMsaUJBQU8sMkRBQWdCLENBQUM7U0FDekI7O0FBRUQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUFpQixDQUFDO0FBQ3JDLGVBQU8sSUFBSSxDQUFDO09BQ2I7QUFDRCxhQUNFOztVQUFVLEdBQUcsOEJBQWM7UUFDekI7O1lBQUssU0FBUyxFQUFDLHFCQUFxQjtVQUNqQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUNwQzs7Y0FBSyxTQUFTLEVBQUMsT0FBTztZQUNwQjs7Z0JBQUssU0FBUyxFQUFDLFdBQVc7Y0FDeEI7QUFDRSx5QkFBUywyQkFDUCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsR0FBRyxFQUFFLENBQUEsQUFDbEM7QUFDSCx1QkFBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7Z0JBQ3pCO2NBQ0Y7QUFDRSx5QkFBUyxnQ0FDUCxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQSxBQUNuQztBQUNILHVCQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQUFBQztnQkFDNUI7YUFDRTtZQUNOOztnQkFBSyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEFBQUM7Y0FDNUIsSUFBSSxDQUFDLFdBQVcsR0FDZjs7O0FBQ0UsMkJBQVMsRUFBQyxzQkFBc0I7QUFDaEMseUJBQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDOzs7ZUFHbkIsR0FDUCxJQUFJO2NBQ1I7OztBQUNFLDJCQUFTLEVBQUMsd0JBQXdCO0FBQ2xDLHlCQUFPLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEFBQUM7OztlQUczQjthQUNMO1dBQ0YsR0FFTiwyREFBZ0IsQUFDakI7VUFDQSxJQUFJLENBQUMsV0FBVyxHQUNmLG1FQUFTLEtBQUssRUFBRSxNQUFNLENBQUMsV0FBVyxBQUFDLEdBQUcsR0FFdEMsZ0VBQVksT0FBTyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxBQUFDLEdBQUcsQUFDcEQ7U0FDRztPQUNHLENBQ1g7S0FDSDs7Ozs7YUE5RnNCLElBQUk7Ozs7Ozs7OzthQUVkLFlBQU07QUFDakIsZUFBSyxXQUFXLEdBQUcsSUFBSSxDQUFDO09BQ3pCOzs7Ozs7Ozs7YUFHZSxZQUFNO0FBQ3BCLGVBQUssV0FBVyxHQUFHLEtBQUssQ0FBQztPQUMxQjs7Ozs7b0JBWEcsVUFBVTtBQUFWLFlBQVUsNEJBQVYsVUFBVSxLQUFWLFVBQVU7U0FBVixVQUFVO0dBQVMsbUJBQU0sU0FBUzs7cUJBbUd6QixVQUFVIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9vdXRwdXQtYXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcIkBudGVyYWN0L21hdGhqYXhcIjtcbmltcG9ydCB7IG1hdGhKYXhQYXRoIH0gZnJvbSBcIm1hdGhqYXgtZWxlY3Ryb25cIjtcbmltcG9ydCB7IGFjdGlvbiwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5pbXBvcnQgQW5zZXIgZnJvbSBcImFuc2VyXCI7XG5cbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuL3Jlc3VsdC12aWV3L2hpc3RvcnlcIjtcbmltcG9ydCBTY3JvbGxMaXN0IGZyb20gXCIuL3Jlc3VsdC12aWV3L2xpc3RcIjtcbmltcG9ydCB7IE9VVFBVVF9BUkVBX1VSSSwgRW1wdHlNZXNzYWdlIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcblxuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi4vc3RvcmVcIjtcblxuQG9ic2VydmVyXG5jbGFzcyBPdXRwdXRBcmVhIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgc3RvcmU6IHN0b3JlIH0+IHtcbiAgQG9ic2VydmFibGVcbiAgc2hvd0hpc3Rvcnk6IGJvb2xlYW4gPSB0cnVlO1xuICBAYWN0aW9uXG4gIHNldEhpc3RvcnkgPSAoKSA9PiB7XG4gICAgdGhpcy5zaG93SGlzdG9yeSA9IHRydWU7XG4gIH07XG5cbiAgQGFjdGlvblxuICBzZXRTY3JvbGxMaXN0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2hvd0hpc3RvcnkgPSBmYWxzZTtcbiAgfTtcblxuICBnZXRPdXRwdXRUZXh0KG91dHB1dDogT2JqZWN0KTogP3N0cmluZyB7XG4gICAgc3dpdGNoIChvdXRwdXQub3V0cHV0X3R5cGUpIHtcbiAgICAgIGNhc2UgXCJzdHJlYW1cIjpcbiAgICAgICAgcmV0dXJuIG91dHB1dC50ZXh0O1xuICAgICAgY2FzZSBcImV4ZWN1dGVfcmVzdWx0XCI6XG4gICAgICAgIHJldHVybiBvdXRwdXQuZGF0YVtcInRleHQvcGxhaW5cIl07XG4gICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgcmV0dXJuIG91dHB1dC50cmFjZWJhY2sudG9KUygpLmpvaW4oXCJcXG5cIik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc3Qga2VybmVsID0gdGhpcy5wcm9wcy5zdG9yZS5rZXJuZWw7XG4gICAgaWYgKCFrZXJuZWwgfHwgIWtlcm5lbC5vdXRwdXRTdG9yZSkgcmV0dXJuO1xuICAgIGNvbnN0IG91dHB1dCA9IGtlcm5lbC5vdXRwdXRTdG9yZS5vdXRwdXRzW2tlcm5lbC5vdXRwdXRTdG9yZS5pbmRleF07XG4gICAgY29uc3QgY29weU91dHB1dCA9IHRoaXMuZ2V0T3V0cHV0VGV4dChvdXRwdXQpO1xuXG4gICAgaWYgKGNvcHlPdXRwdXQpIHtcbiAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKEFuc2VyLmFuc2lUb1RleHQoY29weU91dHB1dCkpO1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJDb3BpZWQgdG8gY2xpcGJvYXJkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcIk5vdGhpbmcgdG8gY29weVwiKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGtlcm5lbCA9IHRoaXMucHJvcHMuc3RvcmUua2VybmVsO1xuXG4gICAgaWYgKCFrZXJuZWwpIHtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5vdXRwdXRBcmVhRG9ja1wiKSkge1xuICAgICAgICByZXR1cm4gPEVtcHR5TWVzc2FnZSAvPjtcbiAgICAgIH1cblxuICAgICAgYXRvbS53b3Jrc3BhY2UuaGlkZShPVVRQVVRfQVJFQV9VUkkpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8UHJvdmlkZXIgc3JjPXttYXRoSmF4UGF0aH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhciBvdXRwdXQtYXJlYVwiPlxuICAgICAgICAgIHtrZXJuZWwub3V0cHV0U3RvcmUub3V0cHV0cy5sZW5ndGggPiAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGJ0biBpY29uIGljb24tY2xvY2ske1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIaXN0b3J5ID8gXCIgc2VsZWN0ZWRcIiA6IFwiXCJcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zZXRIaXN0b3J5fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYnRuIGljb24gaWNvbi10aHJlZS1iYXJzJHtcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuc2hvd0hpc3RvcnkgPyBcIiBzZWxlY3RlZFwiIDogXCJcIlxuICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNldFNjcm9sbExpc3R9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxvYXQ6IFwicmlnaHRcIiB9fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5zaG93SGlzdG9yeSA/IChcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi1jbGlwcHlcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBDb3B5XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gaWNvbiBpY29uLXRyYXNoY2FuXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2tlcm5lbC5vdXRwdXRTdG9yZS5jbGVhcn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBDbGVhclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8RW1wdHlNZXNzYWdlIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7dGhpcy5zaG93SGlzdG9yeSA/IChcbiAgICAgICAgICAgIDxIaXN0b3J5IHN0b3JlPXtrZXJuZWwub3V0cHV0U3RvcmV9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxTY3JvbGxMaXN0IG91dHB1dHM9e2tlcm5lbC5vdXRwdXRTdG9yZS5vdXRwdXRzfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Qcm92aWRlcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE91dHB1dEFyZWE7XG4iXX0=