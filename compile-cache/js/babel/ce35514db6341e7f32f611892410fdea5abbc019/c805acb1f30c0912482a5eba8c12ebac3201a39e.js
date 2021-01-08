Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("./../utils");

var _componentsKernelMonitor = require("./../components/kernel-monitor");

var _componentsKernelMonitor2 = _interopRequireDefault(_componentsKernelMonitor);

var KernelMonitorPane = (function () {
  function KernelMonitorPane(store) {
    _classCallCheck(this, KernelMonitorPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Kernel Monitor";
    };

    this.getURI = function () {
      return _utils.KERNEL_MONITOR_URI;
    };

    this.getDefaultLocation = function () {
      return "bottom";
    };

    this.getAllowedLocations = function () {
      return ["bottom", "left", "right"];
    };

    this.element.classList.add("hydrogen");

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsKernelMonitor2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(KernelMonitorPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return KernelMonitorPane;
})();

exports["default"] = KernelMonitorPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMva2VybmVsLW1vbml0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7cUJBRXhCLE9BQU87Ozs7cUJBRXdCLFlBQVk7O3VDQUVuQyxnQ0FBZ0M7Ozs7SUFFckMsaUJBQWlCO0FBSXpCLFdBSlEsaUJBQWlCLENBSXhCLEtBQVksRUFBRTswQkFKUCxpQkFBaUI7O1NBQ3BDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztTQUN2QyxRQUFRLEdBQUcsK0JBQXlCOztTQWFwQyxRQUFRLEdBQUc7YUFBTSx5QkFBeUI7S0FBQTs7U0FFMUMsTUFBTSxHQUFHOztLQUF3Qjs7U0FFakMsa0JBQWtCLEdBQUc7YUFBTSxRQUFRO0tBQUE7O1NBRW5DLG1CQUFtQixHQUFHO2FBQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztLQUFBOztBQWhCckQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUV2Qyw2QkFDRSx5RUFBZSxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUcsRUFDL0IsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLEVBQ0osSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO0dBQ0g7O2VBYmtCLGlCQUFpQjs7V0F1QjdCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3ZCOzs7U0ExQmtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9wYW5lcy9rZXJuZWwtbW9uaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IHJlYWN0RmFjdG9yeSwgS0VSTkVMX01PTklUT1JfVVJJIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4uL3N0b3JlXCI7XG5pbXBvcnQgS2VybmVsTW9uaXRvciBmcm9tIFwiLi8uLi9jb21wb25lbnRzL2tlcm5lbC1tb25pdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtlcm5lbE1vbml0b3JQYW5lIHtcbiAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRpc3Bvc2VyID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICBjb25zdHJ1Y3RvcihzdG9yZTogc3RvcmUpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImh5ZHJvZ2VuXCIpO1xuXG4gICAgcmVhY3RGYWN0b3J5KFxuICAgICAgPEtlcm5lbE1vbml0b3Igc3RvcmU9e3N0b3JlfSAvPixcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLmRpc3Bvc2VyXG4gICAgKTtcbiAgfVxuXG4gIGdldFRpdGxlID0gKCkgPT4gXCJIeWRyb2dlbiBLZXJuZWwgTW9uaXRvclwiO1xuXG4gIGdldFVSSSA9ICgpID0+IEtFUk5FTF9NT05JVE9SX1VSSTtcblxuICBnZXREZWZhdWx0TG9jYXRpb24gPSAoKSA9PiBcImJvdHRvbVwiO1xuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnMgPSAoKSA9PiBbXCJib3R0b21cIiwgXCJsZWZ0XCIsIFwicmlnaHRcIl07XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==