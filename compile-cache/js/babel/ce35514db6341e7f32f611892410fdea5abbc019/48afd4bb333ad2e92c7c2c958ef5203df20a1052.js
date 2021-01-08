Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _watch = require("./watch");

var _watch2 = _interopRequireDefault(_watch);

var _utils = require("../../utils");

var Watches = (0, _mobxReact.observer)(function (_ref) {
  var kernel = _ref.store.kernel;

  if (!kernel) {
    if (atom.config.get("Hydrogen.outputAreaDock")) {
      return _react2["default"].createElement(_utils.EmptyMessage, null);
    }

    atom.workspace.hide(_utils.WATCHES_URI);
    return null;
  }

  return _react2["default"].createElement(
    "div",
    { className: "sidebar watch-sidebar" },
    kernel.watchesStore.watches.map(function (watch) {
      return _react2["default"].createElement(_watch2["default"], { key: watch.editor.id, store: watch });
    }),
    _react2["default"].createElement(
      "div",
      { className: "btn-group" },
      _react2["default"].createElement(
        "button",
        {
          className: "btn btn-primary icon icon-plus",
          onClick: kernel.watchesStore.addWatch
        },
        "Add watch"
      ),
      _react2["default"].createElement(
        "button",
        {
          className: "btn btn-error icon icon-trashcan",
          onClick: kernel.watchesStore.removeWatch
        },
        "Remove watch"
      )
    )
  );
});

exports["default"] = Watches;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy93YXRjaC1zaWRlYmFyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ3hCLE9BQU87Ozs7eUJBQ0EsWUFBWTs7cUJBRW5CLFNBQVM7Ozs7cUJBQ2UsYUFBYTs7QUFLdkQsSUFBTSxPQUFPLEdBQUcseUJBQVMsVUFBQyxJQUFxQixFQUF1QjtNQUFqQyxNQUFNLEdBQWpCLElBQXFCLENBQW5CLEtBQUssQ0FBSSxNQUFNOztBQUN6QyxNQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFO0FBQzlDLGFBQU8sMkRBQWdCLENBQUM7S0FDekI7O0FBRUQsUUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG9CQUFhLENBQUM7QUFDakMsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxTQUNFOztNQUFLLFNBQVMsRUFBQyx1QkFBdUI7SUFDbkMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSzthQUNyQyx1REFBTyxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEFBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUc7S0FDOUMsQ0FBQztJQUNGOztRQUFLLFNBQVMsRUFBQyxXQUFXO01BQ3hCOzs7QUFDRSxtQkFBUyxFQUFDLGdDQUFnQztBQUMxQyxpQkFBTyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxBQUFDOzs7T0FHL0I7TUFDVDs7O0FBQ0UsbUJBQVMsRUFBQyxrQ0FBa0M7QUFDNUMsaUJBQU8sRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQUFBQzs7O09BR2xDO0tBQ0w7R0FDRixDQUNOO0NBQ0gsQ0FBQyxDQUFDOztxQkFFWSxPQUFPIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy93YXRjaC1zaWRlYmFyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5cbmltcG9ydCBXYXRjaCBmcm9tIFwiLi93YXRjaFwiO1xuaW1wb3J0IHsgV0FUQ0hFU19VUkksIEVtcHR5TWVzc2FnZSB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4vLi4vLi4va2VybmVsXCI7XG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLi8uLi9zdG9yZVwiO1xuXG5jb25zdCBXYXRjaGVzID0gb2JzZXJ2ZXIoKHsgc3RvcmU6IHsga2VybmVsIH0gfTogeyBzdG9yZTogc3RvcmUgfSkgPT4ge1xuICBpZiAoIWtlcm5lbCkge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5vdXRwdXRBcmVhRG9ja1wiKSkge1xuICAgICAgcmV0dXJuIDxFbXB0eU1lc3NhZ2UgLz47XG4gICAgfVxuXG4gICAgYXRvbS53b3Jrc3BhY2UuaGlkZShXQVRDSEVTX1VSSSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhciB3YXRjaC1zaWRlYmFyXCI+XG4gICAgICB7a2VybmVsLndhdGNoZXNTdG9yZS53YXRjaGVzLm1hcCgod2F0Y2gpID0+IChcbiAgICAgICAgPFdhdGNoIGtleT17d2F0Y2guZWRpdG9yLmlkfSBzdG9yZT17d2F0Y2h9IC8+XG4gICAgICApKX1cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgaWNvbiBpY29uLXBsdXNcIlxuICAgICAgICAgIG9uQ2xpY2s9e2tlcm5lbC53YXRjaGVzU3RvcmUuYWRkV2F0Y2h9XG4gICAgICAgID5cbiAgICAgICAgICBBZGQgd2F0Y2hcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLWVycm9yIGljb24gaWNvbi10cmFzaGNhblwiXG4gICAgICAgICAgb25DbGljaz17a2VybmVsLndhdGNoZXNTdG9yZS5yZW1vdmVXYXRjaH1cbiAgICAgICAgPlxuICAgICAgICAgIFJlbW92ZSB3YXRjaFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoZXM7XG4iXX0=