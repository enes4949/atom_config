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

var _display = require("./display");

var _display2 = _interopRequireDefault(_display);

var ScrollList = (function (_React$Component) {
  _inherits(ScrollList, _React$Component);

  function ScrollList() {
    _classCallCheck(this, _ScrollList);

    _get(Object.getPrototypeOf(_ScrollList.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ScrollList, [{
    key: "scrollToBottom",
    value: function scrollToBottom() {
      if (!this.el) return;
      var scrollHeight = this.el.scrollHeight;
      var height = this.el.clientHeight;
      var maxScrollTop = scrollHeight - height;
      this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.scrollToBottom();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollToBottom();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      if (this.props.outputs.length === 0) return null;
      return _react2["default"].createElement(
        "div",
        {
          className: "scroll-list multiline-container native-key-bindings",
          tabIndex: "-1",
          style: {
            fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
          },
          ref: function (el) {
            _this.el = el;
          },
          "hydrogen-wrapoutput": atom.config.get("Hydrogen.wrapOutput").toString()
        },
        this.props.outputs.map(function (output, index) {
          return _react2["default"].createElement(
            "div",
            { className: "scroll-list-item" },
            _react2["default"].createElement(_display2["default"], { output: output, key: index })
          );
        })
      );
    }
  }]);

  var _ScrollList = ScrollList;
  ScrollList = (0, _mobxReact.observer)(ScrollList) || ScrollList;
  return ScrollList;
})(_react2["default"].Component);

exports["default"] = ScrollList;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O3lCQUNBLFlBQVk7O3VCQUNqQixXQUFXOzs7O0lBS3pCLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7Ozs7OztlQUFWLFVBQVU7O1dBR0EsMEJBQUc7QUFDZixVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPO0FBQ3JCLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0FBQzFDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0FBQ3BDLFVBQU0sWUFBWSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUM7QUFDM0MsVUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0tBQ3pEOzs7V0FFaUIsOEJBQUc7QUFDbkIsVUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFSyxrQkFBRzs7O0FBQ1AsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2pELGFBQ0U7OztBQUNFLG1CQUFTLEVBQUMscURBQXFEO0FBQy9ELGtCQUFRLEVBQUMsSUFBSTtBQUNiLGVBQUssRUFBRTtBQUNMLG9CQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLCtCQUErQixJQUFJLFNBQVM7V0FDdEUsQUFBQztBQUNGLGFBQUcsRUFBRSxVQUFDLEVBQUUsRUFBSztBQUNYLGtCQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7V0FDZCxBQUFDO0FBQ0YsaUNBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsQUFBQzs7UUFFdEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUs7aUJBQ3BDOztjQUFLLFNBQVMsRUFBQyxrQkFBa0I7WUFDL0IseURBQVMsTUFBTSxFQUFFLE1BQU0sQUFBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEFBQUMsR0FBRztXQUNuQztTQUNQLENBQUM7T0FDRSxDQUNOO0tBQ0g7OztvQkF4Q0csVUFBVTtBQUFWLFlBQVUsNEJBQVYsVUFBVSxLQUFWLFVBQVU7U0FBVixVQUFVO0dBQVMsbUJBQU0sU0FBUzs7cUJBMkN6QixVQUFVIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IERpc3BsYXkgZnJvbSBcIi4vZGlzcGxheVwiO1xuXG50eXBlIFByb3BzID0geyBvdXRwdXRzOiBBcnJheTxPYmplY3Q+IH07XG5cbkBvYnNlcnZlclxuY2xhc3MgU2Nyb2xsTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wcz4ge1xuICBlbDogP0hUTUxFbGVtZW50O1xuXG4gIHNjcm9sbFRvQm90dG9tKCkge1xuICAgIGlmICghdGhpcy5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuZWwuc2Nyb2xsSGVpZ2h0O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuY2xpZW50SGVpZ2h0O1xuICAgIGNvbnN0IG1heFNjcm9sbFRvcCA9IHNjcm9sbEhlaWdodCAtIGhlaWdodDtcbiAgICB0aGlzLmVsLnNjcm9sbFRvcCA9IG1heFNjcm9sbFRvcCA+IDAgPyBtYXhTY3JvbGxUb3AgOiAwO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vdXRwdXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwic2Nyb2xsLWxpc3QgbXVsdGlsaW5lLWNvbnRhaW5lciBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZm9udFNpemU6IGF0b20uY29uZmlnLmdldChgSHlkcm9nZW4ub3V0cHV0QXJlYUZvbnRTaXplYCkgfHwgXCJpbmhlcml0XCIsXG4gICAgICAgIH19XG4gICAgICAgIHJlZj17KGVsKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB9fVxuICAgICAgICBoeWRyb2dlbi13cmFwb3V0cHV0PXthdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLndyYXBPdXRwdXRgKS50b1N0cmluZygpfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5vdXRwdXRzLm1hcCgob3V0cHV0LCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2Nyb2xsLWxpc3QtaXRlbVwiPlxuICAgICAgICAgICAgPERpc3BsYXkgb3V0cHV0PXtvdXRwdXR9IGtleT17aW5kZXh9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxMaXN0O1xuIl19