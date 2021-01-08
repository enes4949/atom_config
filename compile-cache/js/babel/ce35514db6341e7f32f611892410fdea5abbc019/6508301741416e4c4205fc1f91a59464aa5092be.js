Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.isTextOutputOnly = isTextOutputOnly;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _nteractOutputs = require("@nteract/outputs");

var _plotly = require("./plotly");

var _plotly2 = _interopRequireDefault(_plotly);

var _nteractTransformVega = require("@nteract/transform-vega");

var _markdown = require("./markdown");

var _markdown2 = _interopRequireDefault(_markdown);

// All supported media types for output go here
var supportedMediaTypes = _react2["default"].createElement(
  _nteractOutputs.RichMedia,
  null,
  _react2["default"].createElement(_nteractTransformVega.Vega5, null),
  _react2["default"].createElement(_nteractTransformVega.Vega4, null),
  _react2["default"].createElement(_nteractTransformVega.Vega3, null),
  _react2["default"].createElement(_nteractTransformVega.Vega2, null),
  _react2["default"].createElement(_plotly2["default"], null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite4, null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite3, null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite2, null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite1, null),
  _react2["default"].createElement(_nteractOutputs.Media.Json, null),
  _react2["default"].createElement(_nteractOutputs.Media.JavaScript, null),
  _react2["default"].createElement(_nteractOutputs.Media.HTML, null),
  _react2["default"].createElement(_markdown2["default"], null),
  _react2["default"].createElement(_nteractOutputs.Media.LaTeX, null),
  _react2["default"].createElement(_nteractOutputs.Media.SVG, null),
  _react2["default"].createElement(_nteractOutputs.Media.Image, { mediaType: "image/gif" }),
  _react2["default"].createElement(_nteractOutputs.Media.Image, { mediaType: "image/jpeg" }),
  _react2["default"].createElement(_nteractOutputs.Media.Image, { mediaType: "image/png" }),
  _react2["default"].createElement(_nteractOutputs.Media.Plain, null)
);

exports.supportedMediaTypes = supportedMediaTypes;

function isTextOutputOnly(data) {
  var supported = _react2["default"].Children.map(supportedMediaTypes.props.children, function (mediaComponent) {
    return mediaComponent.props.mediaType;
  });
  var bundleMediaTypes = [].concat(_toConsumableArray(Object.keys(data))).filter(function (mediaType) {
    return supported.includes(mediaType);
  });

  return bundleMediaTypes.length === 1 && bundleMediaTypes[0] === "text/plain" ? true : false;
}

var Display = (function (_React$Component) {
  _inherits(Display, _React$Component);

  function Display() {
    _classCallCheck(this, _Display);

    _get(Object.getPrototypeOf(_Display.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Display, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        _nteractOutputs.Output,
        { output: (0, _mobx.toJS)(this.props.output) },
        _react2["default"].createElement(
          _nteractOutputs.ExecuteResult,
          { expanded: true },
          supportedMediaTypes
        ),
        _react2["default"].createElement(
          _nteractOutputs.DisplayData,
          { expanded: true },
          supportedMediaTypes
        ),
        _react2["default"].createElement(_nteractOutputs.StreamText, { expanded: true }),
        _react2["default"].createElement(_nteractOutputs.KernelOutputError, { expanded: true })
      );
    }
  }]);

  var _Display = Display;
  Display = (0, _mobxReact.observer)(Display) || Display;
  return Display;
})(_react2["default"].Component);

exports["default"] = Display;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9kaXNwbGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7OztvQkFDSixNQUFNOzt5QkFDRixZQUFZOzs4QkFTOUIsa0JBQWtCOztzQkFDTixVQUFVOzs7O29DQVV0Qix5QkFBeUI7O3dCQUVYLFlBQVk7Ozs7O0FBRzFCLElBQU0sbUJBQW1CLEdBQzlCOzs7RUFDRSxtRUFBUztFQUNULG1FQUFTO0VBQ1QsbUVBQVM7RUFDVCxtRUFBUztFQUNULDJEQUFVO0VBQ1YsdUVBQWE7RUFDYix1RUFBYTtFQUNiLHVFQUFhO0VBQ2IsdUVBQWE7RUFDYixpQ0FBQyxzQkFBTSxJQUFJLE9BQUc7RUFDZCxpQ0FBQyxzQkFBTSxVQUFVLE9BQUc7RUFDcEIsaUNBQUMsc0JBQU0sSUFBSSxPQUFHO0VBQ2QsNkRBQVk7RUFDWixpQ0FBQyxzQkFBTSxLQUFLLE9BQUc7RUFDZixpQ0FBQyxzQkFBTSxHQUFHLE9BQUc7RUFDYixpQ0FBQyxzQkFBTSxLQUFLLElBQUMsU0FBUyxFQUFDLFdBQVcsR0FBRztFQUNyQyxpQ0FBQyxzQkFBTSxLQUFLLElBQUMsU0FBUyxFQUFDLFlBQVksR0FBRztFQUN0QyxpQ0FBQyxzQkFBTSxLQUFLLElBQUMsU0FBUyxFQUFDLFdBQVcsR0FBRztFQUNyQyxpQ0FBQyxzQkFBTSxLQUFLLE9BQUc7Q0FDTCxBQUNiLENBQUM7Ozs7QUFFSyxTQUFTLGdCQUFnQixDQUFDLElBQVksRUFBRTtBQUM3QyxNQUFNLFNBQVMsR0FBRyxtQkFBTSxRQUFRLENBQUMsR0FBRyxDQUNsQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUNsQyxVQUFDLGNBQWM7V0FBSyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVM7R0FBQSxDQUNuRCxDQUFDO0FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyw2QkFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFFLE1BQU0sQ0FBQyxVQUFDLFNBQVM7V0FDL0QsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7R0FBQSxDQUM5QixDQUFDOztBQUVGLFNBQU8sZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLEdBQ3hFLElBQUksR0FDSixLQUFLLENBQUM7Q0FDWDs7SUFHSyxPQUFPO1lBQVAsT0FBTzs7V0FBUCxPQUFPOzs7Ozs7ZUFBUCxPQUFPOztXQUNMLGtCQUFHO0FBQ1AsYUFDRTs7VUFBUSxNQUFNLEVBQUUsZ0JBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQUFBQztRQUN0Qzs7WUFBZSxRQUFRLE1BQUE7VUFBRSxtQkFBbUI7U0FBaUI7UUFDN0Q7O1lBQWEsUUFBUSxNQUFBO1VBQUUsbUJBQW1CO1NBQWU7UUFDekQsK0RBQVksUUFBUSxNQUFBLEdBQUc7UUFDdkIsc0VBQW1CLFFBQVEsTUFBQSxHQUFHO09BQ3ZCLENBQ1Q7S0FDSDs7O2lCQVZHLE9BQU87QUFBUCxTQUFPLDRCQUFQLE9BQU8sS0FBUCxPQUFPO1NBQVAsT0FBTztHQUFTLG1CQUFNLFNBQVM7O3FCQWF0QixPQUFPIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9kaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5pbXBvcnQge1xuICBEaXNwbGF5RGF0YSxcbiAgRXhlY3V0ZVJlc3VsdCxcbiAgU3RyZWFtVGV4dCxcbiAgS2VybmVsT3V0cHV0RXJyb3IsXG4gIE91dHB1dCxcbiAgTWVkaWEsXG4gIFJpY2hNZWRpYSxcbn0gZnJvbSBcIkBudGVyYWN0L291dHB1dHNcIjtcbmltcG9ydCBQbG90bHkgZnJvbSBcIi4vcGxvdGx5XCI7XG5pbXBvcnQge1xuICBWZWdhTGl0ZTEsXG4gIFZlZ2FMaXRlMixcbiAgVmVnYUxpdGUzLFxuICBWZWdhTGl0ZTQsXG4gIFZlZ2EyLFxuICBWZWdhMyxcbiAgVmVnYTQsXG4gIFZlZ2E1LFxufSBmcm9tIFwiQG50ZXJhY3QvdHJhbnNmb3JtLXZlZ2FcIjtcblxuaW1wb3J0IE1hcmtkb3duIGZyb20gXCIuL21hcmtkb3duXCI7XG5cbi8vIEFsbCBzdXBwb3J0ZWQgbWVkaWEgdHlwZXMgZm9yIG91dHB1dCBnbyBoZXJlXG5leHBvcnQgY29uc3Qgc3VwcG9ydGVkTWVkaWFUeXBlcyA9IChcbiAgPFJpY2hNZWRpYT5cbiAgICA8VmVnYTUgLz5cbiAgICA8VmVnYTQgLz5cbiAgICA8VmVnYTMgLz5cbiAgICA8VmVnYTIgLz5cbiAgICA8UGxvdGx5IC8+XG4gICAgPFZlZ2FMaXRlNCAvPlxuICAgIDxWZWdhTGl0ZTMgLz5cbiAgICA8VmVnYUxpdGUyIC8+XG4gICAgPFZlZ2FMaXRlMSAvPlxuICAgIDxNZWRpYS5Kc29uIC8+XG4gICAgPE1lZGlhLkphdmFTY3JpcHQgLz5cbiAgICA8TWVkaWEuSFRNTCAvPlxuICAgIDxNYXJrZG93biAvPlxuICAgIDxNZWRpYS5MYVRlWCAvPlxuICAgIDxNZWRpYS5TVkcgLz5cbiAgICA8TWVkaWEuSW1hZ2UgbWVkaWFUeXBlPVwiaW1hZ2UvZ2lmXCIgLz5cbiAgICA8TWVkaWEuSW1hZ2UgbWVkaWFUeXBlPVwiaW1hZ2UvanBlZ1wiIC8+XG4gICAgPE1lZGlhLkltYWdlIG1lZGlhVHlwZT1cImltYWdlL3BuZ1wiIC8+XG4gICAgPE1lZGlhLlBsYWluIC8+XG4gIDwvUmljaE1lZGlhPlxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGV4dE91dHB1dE9ubHkoZGF0YTogT2JqZWN0KSB7XG4gIGNvbnN0IHN1cHBvcnRlZCA9IFJlYWN0LkNoaWxkcmVuLm1hcChcbiAgICBzdXBwb3J0ZWRNZWRpYVR5cGVzLnByb3BzLmNoaWxkcmVuLFxuICAgIChtZWRpYUNvbXBvbmVudCkgPT4gbWVkaWFDb21wb25lbnQucHJvcHMubWVkaWFUeXBlXG4gICk7XG4gIGNvbnN0IGJ1bmRsZU1lZGlhVHlwZXMgPSBbLi4uT2JqZWN0LmtleXMoZGF0YSldLmZpbHRlcigobWVkaWFUeXBlKSA9PlxuICAgIHN1cHBvcnRlZC5pbmNsdWRlcyhtZWRpYVR5cGUpXG4gICk7XG5cbiAgcmV0dXJuIGJ1bmRsZU1lZGlhVHlwZXMubGVuZ3RoID09PSAxICYmIGJ1bmRsZU1lZGlhVHlwZXNbMF0gPT09IFwidGV4dC9wbGFpblwiXG4gICAgPyB0cnVlXG4gICAgOiBmYWxzZTtcbn1cblxuQG9ic2VydmVyXG5jbGFzcyBEaXNwbGF5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgb3V0cHV0OiBhbnkgfT4ge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPdXRwdXQgb3V0cHV0PXt0b0pTKHRoaXMucHJvcHMub3V0cHV0KX0+XG4gICAgICAgIDxFeGVjdXRlUmVzdWx0IGV4cGFuZGVkPntzdXBwb3J0ZWRNZWRpYVR5cGVzfTwvRXhlY3V0ZVJlc3VsdD5cbiAgICAgICAgPERpc3BsYXlEYXRhIGV4cGFuZGVkPntzdXBwb3J0ZWRNZWRpYVR5cGVzfTwvRGlzcGxheURhdGE+XG4gICAgICAgIDxTdHJlYW1UZXh0IGV4cGFuZGVkIC8+XG4gICAgICAgIDxLZXJuZWxPdXRwdXRFcnJvciBleHBhbmRlZCAvPlxuICAgICAgPC9PdXRwdXQ+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5O1xuIl19