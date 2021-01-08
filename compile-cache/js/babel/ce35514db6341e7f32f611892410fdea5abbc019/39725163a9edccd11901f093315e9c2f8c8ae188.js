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

var _componentsOutputArea = require("./../components/output-area");

var _componentsOutputArea2 = _interopRequireDefault(_componentsOutputArea);

var OutputPane = (function () {
  function OutputPane(store) {
    _classCallCheck(this, OutputPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Output Area";
    };

    this.getURI = function () {
      return _utils.OUTPUT_AREA_URI;
    };

    this.getDefaultLocation = function () {
      return "right";
    };

    this.getAllowedLocations = function () {
      return ["left", "right", "bottom"];
    };

    this.element.classList.add("hydrogen");

    this.disposer.add(new _atom.Disposable(function () {
      if (store.kernel) store.kernel.outputStore.clear();
    }));

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsOutputArea2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(OutputPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();

      // When a user manually clicks the close icon, the pane holding the OutputArea
      // is destroyed along with the OutputArea item. We mimic this here so that we can call
      //  outputArea.destroy() and fully clean up the OutputArea without user clicking
      var pane = atom.workspace.paneForURI(_utils.OUTPUT_AREA_URI);
      if (!pane) return;
      pane.destroyItem(this);
    }
  }]);

  return OutputPane;
})();

exports["default"] = OutputPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvb3V0cHV0LWFyZWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFZ0QsTUFBTTs7cUJBRXBDLE9BQU87Ozs7cUJBRXFCLFlBQVk7O29DQUVuQyw2QkFBNkI7Ozs7SUFFL0IsVUFBVTtBQUlsQixXQUpRLFVBQVUsQ0FJakIsS0FBWSxFQUFFOzBCQUpQLFVBQVU7O1NBQzdCLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztTQUN2QyxRQUFRLEdBQUcsK0JBQXlCOztTQW1CcEMsUUFBUSxHQUFHO2FBQU0sc0JBQXNCO0tBQUE7O1NBRXZDLE1BQU0sR0FBRzs7S0FBcUI7O1NBRTlCLGtCQUFrQixHQUFHO2FBQU0sT0FBTztLQUFBOztTQUVsQyxtQkFBbUIsR0FBRzthQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7S0FBQTs7QUF0QnJELFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFdkMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ2YscUJBQWUsWUFBTTtBQUNuQixVQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEQsQ0FBQyxDQUNILENBQUM7O0FBRUYsNkJBQ0Usc0VBQVksS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLEVBQzVCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxFQUNKLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztHQUNIOztlQW5Ca0IsVUFBVTs7V0E2QnRCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7Ozs7QUFLeEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLHdCQUFpQixDQUFDO0FBQ3hELFVBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztBQUNsQixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCOzs7U0F0Q2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvb3V0cHV0LWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyByZWFjdEZhY3RvcnksIE9VVFBVVF9BUkVBX1VSSSB9IGZyb20gXCIuLy4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLi9zdG9yZVwiO1xuaW1wb3J0IE91dHB1dEFyZWEgZnJvbSBcIi4vLi4vY29tcG9uZW50cy9vdXRwdXQtYXJlYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXRQYW5lIHtcbiAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRpc3Bvc2VyID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICBjb25zdHJ1Y3RvcihzdG9yZTogc3RvcmUpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImh5ZHJvZ2VuXCIpO1xuXG4gICAgdGhpcy5kaXNwb3Nlci5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGlmIChzdG9yZS5rZXJuZWwpIHN0b3JlLmtlcm5lbC5vdXRwdXRTdG9yZS5jbGVhcigpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmVhY3RGYWN0b3J5KFxuICAgICAgPE91dHB1dEFyZWEgc3RvcmU9e3N0b3JlfSAvPixcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLmRpc3Bvc2VyXG4gICAgKTtcbiAgfVxuXG4gIGdldFRpdGxlID0gKCkgPT4gXCJIeWRyb2dlbiBPdXRwdXQgQXJlYVwiO1xuXG4gIGdldFVSSSA9ICgpID0+IE9VVFBVVF9BUkVBX1VSSTtcblxuICBnZXREZWZhdWx0TG9jYXRpb24gPSAoKSA9PiBcInJpZ2h0XCI7XG5cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucyA9ICgpID0+IFtcImxlZnRcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiXTtcblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zZXIuZGlzcG9zZSgpO1xuXG4gICAgLy8gV2hlbiBhIHVzZXIgbWFudWFsbHkgY2xpY2tzIHRoZSBjbG9zZSBpY29uLCB0aGUgcGFuZSBob2xkaW5nIHRoZSBPdXRwdXRBcmVhXG4gICAgLy8gaXMgZGVzdHJveWVkIGFsb25nIHdpdGggdGhlIE91dHB1dEFyZWEgaXRlbS4gV2UgbWltaWMgdGhpcyBoZXJlIHNvIHRoYXQgd2UgY2FuIGNhbGxcbiAgICAvLyAgb3V0cHV0QXJlYS5kZXN0cm95KCkgYW5kIGZ1bGx5IGNsZWFuIHVwIHRoZSBPdXRwdXRBcmVhIHdpdGhvdXQgdXNlciBjbGlja2luZ1xuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKE9VVFBVVF9BUkVBX1VSSSk7XG4gICAgaWYgKCFwYW5lKSByZXR1cm47XG4gICAgcGFuZS5kZXN0cm95SXRlbSh0aGlzKTtcbiAgfVxufVxuIl19