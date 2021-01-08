Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _atom = require("atom");

var _statusBarComponent = require("./status-bar-component");

var _statusBarComponent2 = _interopRequireDefault(_statusBarComponent);

var _signalListView = require("./signal-list-view");

var _signalListView2 = _interopRequireDefault(_signalListView);

var _utils = require("../../../utils");

var StatusBarConsumer = (function () {
  function StatusBarConsumer() {
    _classCallCheck(this, StatusBarConsumer);
  }

  _createClass(StatusBarConsumer, [{
    key: "addStatusBar",
    value: function addStatusBar(store, statusBar, handleKernelCommand) {
      var _this = this;

      var statusBarElement = document.createElement("div");
      statusBarElement.classList.add("inline-block", "hydrogen");

      var statusBarTile = statusBar.addLeftTile({
        item: statusBarElement,
        priority: 100
      });

      var onClick = function onClick(store) {
        _this.showKernelCommands(store, handleKernelCommand);
      };

      (0, _utils.reactFactory)(_react2["default"].createElement(_statusBarComponent2["default"], { store: store, onClick: onClick }), statusBarElement);

      var disposable = new _atom.Disposable(function () {
        return statusBarTile.destroy();
      });
      store.subscriptions.add(disposable);
      return disposable;
    }
  }, {
    key: "showKernelCommands",
    value: function showKernelCommands(store, handleKernelCommand) {
      var signalListView = this.signalListView;
      if (!signalListView) {
        signalListView = new _signalListView2["default"](store, handleKernelCommand);
        this.signalListView = signalListView;
      } else {
        signalListView.store = store;
      }
      signalListView.toggle();
    }
  }]);

  return StatusBarConsumer;
})();

exports.StatusBarConsumer = StatusBarConsumer;

var statusBarConsumer = new StatusBarConsumer();
exports["default"] = statusBarConsumer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvY29uc3VtZWQvc3RhdHVzLWJhci9zdGF0dXMtYmFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7b0JBQ0UsTUFBTTs7a0NBRVgsd0JBQXdCOzs7OzhCQUNuQixvQkFBb0I7Ozs7cUJBRWxCLGdCQUFnQjs7SUFNaEMsaUJBQWlCO1dBQWpCLGlCQUFpQjswQkFBakIsaUJBQWlCOzs7ZUFBakIsaUJBQWlCOztXQUdoQixzQkFDVixLQUFZLEVBQ1osU0FBeUIsRUFDekIsbUJBQTZCLEVBQzdCOzs7QUFDQSxVQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsc0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRTNELFVBQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7QUFDMUMsWUFBSSxFQUFFLGdCQUFnQjtBQUN0QixnQkFBUSxFQUFFLEdBQUc7T0FDZCxDQUFDLENBQUM7O0FBRUgsVUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksS0FBSyxFQUFZO0FBQ2hDLGNBQUssa0JBQWtCLENBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7T0FDckQsQ0FBQzs7QUFFRiwrQkFDRSxvRUFBVyxLQUFLLEVBQUUsS0FBSyxBQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFHLEVBQzdDLGdCQUFnQixDQUNqQixDQUFDOztBQUVGLFVBQU0sVUFBVSxHQUFHLHFCQUFlO2VBQU0sYUFBYSxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQztBQUNqRSxXQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxhQUFPLFVBQVUsQ0FBQztLQUNuQjs7O1dBRWlCLDRCQUFDLEtBQVksRUFBRSxtQkFBNkIsRUFBRTtBQUM5RCxVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxjQUFjLEVBQUU7QUFDbkIsc0JBQWMsR0FBRyxnQ0FBbUIsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsWUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7T0FDdEMsTUFBTTtBQUNMLHNCQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztPQUM5QjtBQUNELG9CQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDekI7OztTQXZDVSxpQkFBaUI7Ozs7O0FBMEM5QixJQUFNLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztxQkFDbkMsaUJBQWlCIiwiZmlsZSI6Ii9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvY29uc3VtZWQvc3RhdHVzLWJhci9zdGF0dXMtYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCBTdGF0dXNCYXIgZnJvbSBcIi4vc3RhdHVzLWJhci1jb21wb25lbnRcIjtcbmltcG9ydCBTaWduYWxMaXN0VmlldyBmcm9tIFwiLi9zaWduYWwtbGlzdC12aWV3XCI7XG5cbmltcG9ydCB7IHJlYWN0RmFjdG9yeSB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uLy4uL3N0b3JlXCI7XG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4uLy4uLy4uL2tlcm5lbFwiO1xuaW1wb3J0IHR5cGUgTWFya2VyU3RvcmUgZnJvbSBcIi4uLy4uLy4uL3N0b3JlL21hcmtlcnNcIjtcblxuZXhwb3J0IGNsYXNzIFN0YXR1c0JhckNvbnN1bWVyIHtcbiAgc2lnbmFsTGlzdFZpZXc6IFNpZ25hbExpc3RWaWV3O1xuXG4gIGFkZFN0YXR1c0JhcihcbiAgICBzdG9yZTogU3RvcmUsXG4gICAgc3RhdHVzQmFyOiBhdG9tJFN0YXR1c0JhcixcbiAgICBoYW5kbGVLZXJuZWxDb21tYW5kOiBGdW5jdGlvblxuICApIHtcbiAgICBjb25zdCBzdGF0dXNCYXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBzdGF0dXNCYXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpbmxpbmUtYmxvY2tcIiwgXCJoeWRyb2dlblwiKTtcblxuICAgIGNvbnN0IHN0YXR1c0JhclRpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoe1xuICAgICAgaXRlbTogc3RhdHVzQmFyRWxlbWVudCxcbiAgICAgIHByaW9yaXR5OiAxMDAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvbkNsaWNrID0gKHN0b3JlOiBTdG9yZSkgPT4ge1xuICAgICAgdGhpcy5zaG93S2VybmVsQ29tbWFuZHMoc3RvcmUsIGhhbmRsZUtlcm5lbENvbW1hbmQpO1xuICAgIH07XG5cbiAgICByZWFjdEZhY3RvcnkoXG4gICAgICA8U3RhdHVzQmFyIHN0b3JlPXtzdG9yZX0gb25DbGljaz17b25DbGlja30gLz4sXG4gICAgICBzdGF0dXNCYXJFbGVtZW50XG4gICAgKTtcblxuICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgRGlzcG9zYWJsZSgoKSA9PiBzdGF0dXNCYXJUaWxlLmRlc3Ryb3koKSk7XG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZSk7XG4gICAgcmV0dXJuIGRpc3Bvc2FibGU7XG4gIH1cblxuICBzaG93S2VybmVsQ29tbWFuZHMoc3RvcmU6IFN0b3JlLCBoYW5kbGVLZXJuZWxDb21tYW5kOiBGdW5jdGlvbikge1xuICAgIGxldCBzaWduYWxMaXN0VmlldyA9IHRoaXMuc2lnbmFsTGlzdFZpZXc7XG4gICAgaWYgKCFzaWduYWxMaXN0Vmlldykge1xuICAgICAgc2lnbmFsTGlzdFZpZXcgPSBuZXcgU2lnbmFsTGlzdFZpZXcoc3RvcmUsIGhhbmRsZUtlcm5lbENvbW1hbmQpO1xuICAgICAgdGhpcy5zaWduYWxMaXN0VmlldyA9IHNpZ25hbExpc3RWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWduYWxMaXN0Vmlldy5zdG9yZSA9IHN0b3JlO1xuICAgIH1cbiAgICBzaWduYWxMaXN0Vmlldy50b2dnbGUoKTtcbiAgfVxufVxuXG5jb25zdCBzdGF0dXNCYXJDb25zdW1lciA9IG5ldyBTdGF0dXNCYXJDb25zdW1lcigpO1xuZXhwb3J0IGRlZmF1bHQgc3RhdHVzQmFyQ29uc3VtZXI7XG4iXX0=