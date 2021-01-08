Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _nteractOutputs = require("@nteract/outputs");

var _utils = require("./../utils");

var _resultViewMarkdown = require("./result-view/markdown");

var _resultViewMarkdown2 = _interopRequireDefault(_resultViewMarkdown);

function hide() {
  atom.workspace.hide(_utils.INSPECTOR_URI);
  return null;
}

var Inspector = (0, _mobxReact.observer)(function (_ref) {
  var kernel = _ref.store.kernel;

  if (!kernel) return hide();

  var bundle = kernel.inspector.bundle;

  if (!bundle["text/html"] && !bundle["text/markdown"] && !bundle["text/plain"]) {
    return hide();
  }

  return _react2["default"].createElement(
    "div",
    {
      className: "native-key-bindings",
      tabIndex: "-1",
      style: {
        fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
      }
    },
    _react2["default"].createElement(
      _nteractOutputs.RichMedia,
      { data: bundle },
      _react2["default"].createElement(_nteractOutputs.Media.HTML, null),
      _react2["default"].createElement(_resultViewMarkdown2["default"], null),
      _react2["default"].createElement(_nteractOutputs.Media.Plain, null)
    )
  );
});

exports["default"] = Inspector;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9pbnNwZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUVrQixPQUFPOzs7O3lCQUNBLFlBQVk7OzhCQUNKLGtCQUFrQjs7cUJBRXJCLFlBQVk7O2tDQUVyQix3QkFBd0I7Ozs7QUFJN0MsU0FBUyxJQUFJLEdBQUc7QUFDZCxNQUFJLENBQUMsU0FBUyxDQUFDLElBQUksc0JBQWUsQ0FBQztBQUNuQyxTQUFPLElBQUksQ0FBQztDQUNiOztBQUVELElBQU0sU0FBUyxHQUFHLHlCQUFTLFVBQUMsSUFBcUIsRUFBWTtNQUF0QixNQUFNLEdBQWpCLElBQXFCLENBQW5CLEtBQUssQ0FBSSxNQUFNOztBQUMzQyxNQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRTNCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDOztBQUV2QyxNQUNFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUNwQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFDeEIsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQ3JCO0FBQ0EsV0FBTyxJQUFJLEVBQUUsQ0FBQztHQUNmOztBQUVELFNBQ0U7OztBQUNFLGVBQVMsRUFBQyxxQkFBcUI7QUFDL0IsY0FBUSxFQUFDLElBQUk7QUFDYixXQUFLLEVBQUU7QUFDTCxnQkFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRywrQkFBK0IsSUFBSSxTQUFTO09BQ3RFLEFBQUM7O0lBRUY7O1FBQVcsSUFBSSxFQUFFLE1BQU0sQUFBQztNQUN0QixpQ0FBQyxzQkFBTSxJQUFJLE9BQUc7TUFDZCx1RUFBWTtNQUNaLGlDQUFDLHNCQUFNLEtBQUssT0FBRztLQUNMO0dBQ1IsQ0FDTjtDQUNILENBQUMsQ0FBQzs7cUJBRVksU0FBUyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvaW5zcGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IHsgUmljaE1lZGlhLCBNZWRpYSB9IGZyb20gXCJAbnRlcmFjdC9vdXRwdXRzXCI7XG5cbmltcG9ydCB7IElOU1BFQ1RPUl9VUkkgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuaW1wb3J0IE1hcmtkb3duIGZyb20gXCIuL3Jlc3VsdC12aWV3L21hcmtkb3duXCI7XG5cbnR5cGUgUHJvcHMgPSB7IHN0b3JlOiB7IGtlcm5lbDogP0tlcm5lbCB9IH07XG5cbmZ1bmN0aW9uIGhpZGUoKSB7XG4gIGF0b20ud29ya3NwYWNlLmhpZGUoSU5TUEVDVE9SX1VSSSk7XG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBJbnNwZWN0b3IgPSBvYnNlcnZlcigoeyBzdG9yZTogeyBrZXJuZWwgfSB9OiBQcm9wcykgPT4ge1xuICBpZiAoIWtlcm5lbCkgcmV0dXJuIGhpZGUoKTtcblxuICBjb25zdCBidW5kbGUgPSBrZXJuZWwuaW5zcGVjdG9yLmJ1bmRsZTtcblxuICBpZiAoXG4gICAgIWJ1bmRsZVtcInRleHQvaHRtbFwiXSAmJlxuICAgICFidW5kbGVbXCJ0ZXh0L21hcmtkb3duXCJdICYmXG4gICAgIWJ1bmRsZVtcInRleHQvcGxhaW5cIl1cbiAgKSB7XG4gICAgcmV0dXJuIGhpZGUoKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGZvbnRTaXplOiBhdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLm91dHB1dEFyZWFGb250U2l6ZWApIHx8IFwiaW5oZXJpdFwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UmljaE1lZGlhIGRhdGE9e2J1bmRsZX0+XG4gICAgICAgIDxNZWRpYS5IVE1MIC8+XG4gICAgICAgIDxNYXJrZG93biAvPlxuICAgICAgICA8TWVkaWEuUGxhaW4gLz5cbiAgICAgIDwvUmljaE1lZGlhPlxuICAgIDwvZGl2PlxuICApO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEluc3BlY3RvcjtcbiJdfQ==