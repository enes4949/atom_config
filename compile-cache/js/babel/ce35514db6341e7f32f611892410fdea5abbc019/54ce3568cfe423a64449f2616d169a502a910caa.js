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

var _atom = require("atom");

var _resultViewHistory = require("./../result-view/history");

var _resultViewHistory2 = _interopRequireDefault(_resultViewHistory);

var Watch = (function (_React$Component) {
  _inherits(Watch, _React$Component);

  function Watch() {
    _classCallCheck(this, Watch);

    _get(Object.getPrototypeOf(Watch.prototype), "constructor", this).apply(this, arguments);

    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(Watch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.container) return;
      var container = this.container;
      container.insertBefore(this.props.store.editor.element, container.firstChild);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscriptions.dispose();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return _react2["default"].createElement(
        "div",
        {
          className: "hydrogen watch-view",
          ref: function (c) {
            _this.container = c;
          }
        },
        _react2["default"].createElement(_resultViewHistory2["default"], { store: this.props.store.outputStore })
      );
    }
  }]);

  return Watch;
})(_react2["default"].Component);

exports["default"] = Watch;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy93YXRjaC1zaWRlYmFyL3dhdGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O29CQUNXLE1BQU07O2lDQUN0QiwwQkFBMEI7Ozs7SUFHekIsS0FBSztZQUFMLEtBQUs7O1dBQUwsS0FBSzswQkFBTCxLQUFLOzsrQkFBTCxLQUFLOztTQUV4QixhQUFhLEdBQTZCLCtCQUF5Qjs7O2VBRmhELEtBQUs7O1dBR1AsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTztBQUM1QixVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2pDLGVBQVMsQ0FBQyxZQUFZLENBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQy9CLFNBQVMsQ0FBQyxVQUFVLENBQ3JCLENBQUM7S0FDSDs7O1dBRW1CLGdDQUFHO0FBQ3JCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUI7OztXQUVLLGtCQUFHOzs7QUFDUCxhQUNFOzs7QUFDRSxtQkFBUyxFQUFDLHFCQUFxQjtBQUMvQixhQUFHLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDVixrQkFBSyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1dBQ3BCLEFBQUM7O1FBRUYsbUVBQVMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQUFBQyxHQUFHO09BQzVDLENBQ047S0FDSDs7O1NBM0JrQixLQUFLO0dBQVMsbUJBQU0sU0FBUzs7cUJBQTdCLEtBQUsiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3dhdGNoLXNpZGViYXIvd2F0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuLy4uL3Jlc3VsdC12aWV3L2hpc3RvcnlcIjtcbmltcG9ydCB0eXBlIFdhdGNoU3RvcmUgZnJvbSBcIi4vLi4vLi4vc3RvcmUvd2F0Y2hcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8eyBzdG9yZTogV2F0Y2hTdG9yZSB9PiB7XG4gIGNvbnRhaW5lcjogP0hUTUxFbGVtZW50O1xuICBzdWJzY3JpcHRpb25zOiBhdG9tJENvbXBvc2l0ZURpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSByZXR1cm47XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXI7XG4gICAgY29udGFpbmVyLmluc2VydEJlZm9yZShcbiAgICAgIHRoaXMucHJvcHMuc3RvcmUuZWRpdG9yLmVsZW1lbnQsXG4gICAgICBjb250YWluZXIuZmlyc3RDaGlsZFxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cImh5ZHJvZ2VuIHdhdGNoLXZpZXdcIlxuICAgICAgICByZWY9eyhjKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIgPSBjO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8SGlzdG9yeSBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZS5vdXRwdXRTdG9yZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==