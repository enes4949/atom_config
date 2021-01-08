Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var Status = (0, _mobxReact.observer)(function (_ref) {
  var status = _ref.status;
  var style = _ref.style;

  switch (status) {
    case "running":
      return _react2["default"].createElement(
        "div",
        { className: "inline-container spinner", style: style },
        _react2["default"].createElement("div", { className: "rect1" }),
        _react2["default"].createElement("div", { className: "rect2" }),
        _react2["default"].createElement("div", { className: "rect3" }),
        _react2["default"].createElement("div", { className: "rect4" }),
        _react2["default"].createElement("div", { className: "rect5" })
      );
    case "ok":
      return _react2["default"].createElement("div", { className: "inline-container icon icon-check", style: style });
    case "empty":
      return _react2["default"].createElement("div", { className: "inline-container icon icon-zap", style: style });
    default:
      return _react2["default"].createElement("div", { className: "inline-container icon icon-x", style: style });
  }
});

exports["default"] = Status;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9zdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUVrQixPQUFPOzs7O3lCQUNBLFlBQVk7O0FBSXJDLElBQU0sTUFBTSxHQUFHLHlCQUFTLFVBQUMsSUFBaUIsRUFBWTtNQUEzQixNQUFNLEdBQVIsSUFBaUIsQ0FBZixNQUFNO01BQUUsS0FBSyxHQUFmLElBQWlCLENBQVAsS0FBSzs7QUFDdEMsVUFBUSxNQUFNO0FBQ1osU0FBSyxTQUFTO0FBQ1osYUFDRTs7VUFBSyxTQUFTLEVBQUMsMEJBQTBCLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQztRQUNyRCwwQ0FBSyxTQUFTLEVBQUMsT0FBTyxHQUFHO1FBQ3pCLDBDQUFLLFNBQVMsRUFBQyxPQUFPLEdBQUc7UUFDekIsMENBQUssU0FBUyxFQUFDLE9BQU8sR0FBRztRQUN6QiwwQ0FBSyxTQUFTLEVBQUMsT0FBTyxHQUFHO1FBQ3pCLDBDQUFLLFNBQVMsRUFBQyxPQUFPLEdBQUc7T0FDckIsQ0FDTjtBQUFBLEFBQ0osU0FBSyxJQUFJO0FBQ1AsYUFBTywwQ0FBSyxTQUFTLEVBQUMsa0NBQWtDLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLENBQUM7QUFBQSxBQUM1RSxTQUFLLE9BQU87QUFDVixhQUFPLDBDQUFLLFNBQVMsRUFBQyxnQ0FBZ0MsRUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUcsQ0FBQztBQUFBLEFBQzFFO0FBQ0UsYUFBTywwQ0FBSyxTQUFTLEVBQUMsOEJBQThCLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLENBQUM7QUFBQSxHQUN6RTtDQUNGLENBQUMsQ0FBQzs7cUJBRVksTUFBTSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuXG50eXBlIFByb3BzID0geyBzdGF0dXM6IHN0cmluZywgc3R5bGU6IE9iamVjdCB9O1xuXG5jb25zdCBTdGF0dXMgPSBvYnNlcnZlcigoeyBzdGF0dXMsIHN0eWxlIH06IFByb3BzKSA9PiB7XG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSBcInJ1bm5pbmdcIjpcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWNvbnRhaW5lciBzcGlubmVyXCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlY3QxXCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlY3QyXCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlY3QzXCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlY3Q0XCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlY3Q1XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIGNhc2UgXCJva1wiOlxuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWNvbnRhaW5lciBpY29uIGljb24tY2hlY2tcIiBzdHlsZT17c3R5bGV9IC8+O1xuICAgIGNhc2UgXCJlbXB0eVwiOlxuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWNvbnRhaW5lciBpY29uIGljb24temFwXCIgc3R5bGU9e3N0eWxlfSAvPjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWNvbnRhaW5lciBpY29uIGljb24teFwiIHN0eWxlPXtzdHlsZX0gLz47XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXM7XG4iXX0=