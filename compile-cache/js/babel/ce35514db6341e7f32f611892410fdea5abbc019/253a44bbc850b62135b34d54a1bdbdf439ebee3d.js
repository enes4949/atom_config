Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _utils = require("./utils");

function getName(kernel) {
  var prefix = kernel.transport.gatewayName ? kernel.transport.gatewayName + ": " : "";
  return prefix + kernel.displayName + " - " + _store2["default"].getFilesForKernel(kernel).map(_tildify2["default"]).join(", ");
}

var ExistingKernelPicker = (function () {
  function ExistingKernelPicker() {
    var _this = this;

    _classCallCheck(this, ExistingKernelPicker);

    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(kernel) {
        return getName(kernel);
      },
      elementForItem: function elementForItem(kernel) {
        var element = document.createElement("li");
        element.textContent = getName(kernel);
        return element;
      },
      didConfirmSelection: function didConfirmSelection(kernel) {
        var filePath = _store2["default"].filePath;
        var editor = _store2["default"].editor;
        var grammar = _store2["default"].grammar;

        if (!filePath || !editor || !grammar) return _this.cancel();
        _store2["default"].newKernel(kernel, filePath, editor, grammar);
        _this.cancel();
      },
      didCancelSelection: function didCancelSelection() {
        return _this.cancel();
      },
      emptyMessage: "No running kernels for this language."
    });
  }

  _createClass(ExistingKernelPicker, [{
    key: "destroy",
    value: function destroy() {
      this.cancel();
      return this.selectListView.destroy();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      this.selectListView.focus();
      this.selectListView.reset();
    }
  }, {
    key: "toggle",
    value: _asyncToGenerator(function* () {
      if (this.panel != null) {
        this.cancel();
      } else if (_store2["default"].filePath && _store2["default"].grammar) {
        yield this.selectListView.update({
          items: _store2["default"].runningKernels.filter(function (kernel) {
            return (0, _utils.kernelSpecProvidesGrammar)(kernel.kernelSpec, _store2["default"].grammar);
          })
        });
        var markers = _store2["default"].markers;
        if (markers) markers.clear();
        this.attach();
      }
    })
  }]);

  return ExistingKernelPicker;
})();

exports["default"] = ExistingKernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvZXhpc3Rpbmcta2VybmVsLXBpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OEJBRTJCLGtCQUFrQjs7OztxQkFDM0IsU0FBUzs7OztzQkFDYixRQUFROzs7O3VCQUNGLFNBQVM7Ozs7cUJBRWEsU0FBUzs7QUFJbkQsU0FBUyxPQUFPLENBQUMsTUFBYyxFQUFFO0FBQy9CLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUNwQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsVUFDL0IsRUFBRSxDQUFDO0FBQ1AsU0FDRSxNQUFNLEdBQ04sTUFBTSxDQUFDLFdBQVcsR0FDbEIsS0FBSyxHQUNMLG1CQUFNLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsc0JBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3ZEO0NBQ0g7O0lBRW9CLG9CQUFvQjtBQUs1QixXQUxRLG9CQUFvQixHQUt6Qjs7OzBCQUxLLG9CQUFvQjs7QUFNckMsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsb0JBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUMvQixXQUFLLEVBQUUsRUFBRTtBQUNULHNCQUFnQixFQUFFLDBCQUFDLE1BQU07ZUFBSyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQUE7QUFDN0Msb0JBQWMsRUFBRSx3QkFBQyxNQUFNLEVBQUs7QUFDMUIsWUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxlQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxlQUFPLE9BQU8sQ0FBQztPQUNoQjtBQUNELHlCQUFtQixFQUFFLDZCQUFDLE1BQU0sRUFBSztZQUN2QixRQUFRLHNCQUFSLFFBQVE7WUFBRSxNQUFNLHNCQUFOLE1BQU07WUFBRSxPQUFPLHNCQUFQLE9BQU87O0FBQ2pDLFlBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxNQUFLLE1BQU0sRUFBRSxDQUFDO0FBQzNELDJCQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRCxjQUFLLE1BQU0sRUFBRSxDQUFDO09BQ2Y7QUFDRCx3QkFBa0IsRUFBRTtlQUFNLE1BQUssTUFBTSxFQUFFO09BQUE7QUFDdkMsa0JBQVksRUFBRSx1Q0FBdUM7S0FDdEQsQ0FBQyxDQUFDO0dBQ0o7O2VBeEJrQixvQkFBb0I7O1dBMEJoQyxtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0Qzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdEI7QUFDRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUNqQyxZQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdEMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztPQUN0QztLQUNGOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBQ3ZELFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDM0UsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCOzs7NkJBRVcsYUFBRztBQUNiLFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDdEIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2YsTUFBTSxJQUFJLG1CQUFNLFFBQVEsSUFBSSxtQkFBTSxPQUFPLEVBQUU7QUFDMUMsY0FBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUMvQixlQUFLLEVBQUUsbUJBQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU07bUJBQ3hDLHNDQUEwQixNQUFNLENBQUMsVUFBVSxFQUFFLG1CQUFNLE9BQU8sQ0FBQztXQUFBLENBQzVEO1NBQ0YsQ0FBQyxDQUFDO0FBQ0gsWUFBTSxPQUFPLEdBQUcsbUJBQU0sT0FBTyxDQUFDO0FBQzlCLFlBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjtLQUNGOzs7U0EvRGtCLG9CQUFvQjs7O3FCQUFwQixvQkFBb0IiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9leGlzdGluZy1rZXJuZWwtcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gXCJhdG9tLXNlbGVjdC1saXN0XCI7XG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB0aWxkaWZ5IGZyb20gXCJ0aWxkaWZ5XCI7XG5cbmltcG9ydCB7IGtlcm5lbFNwZWNQcm92aWRlc0dyYW1tYXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5cbmZ1bmN0aW9uIGdldE5hbWUoa2VybmVsOiBLZXJuZWwpIHtcbiAgY29uc3QgcHJlZml4ID0ga2VybmVsLnRyYW5zcG9ydC5nYXRld2F5TmFtZVxuICAgID8gYCR7a2VybmVsLnRyYW5zcG9ydC5nYXRld2F5TmFtZX06IGBcbiAgICA6IFwiXCI7XG4gIHJldHVybiAoXG4gICAgcHJlZml4ICtcbiAgICBrZXJuZWwuZGlzcGxheU5hbWUgK1xuICAgIFwiIC0gXCIgK1xuICAgIHN0b3JlLmdldEZpbGVzRm9yS2VybmVsKGtlcm5lbCkubWFwKHRpbGRpZnkpLmpvaW4oXCIsIFwiKVxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeGlzdGluZ0tlcm5lbFBpY2tlciB7XG4gIGtlcm5lbFNwZWNzOiBBcnJheTxLZXJuZWxzcGVjPjtcbiAgc2VsZWN0TGlzdFZpZXc6IFNlbGVjdExpc3RWaWV3O1xuICBwYW5lbDogP2F0b20kUGFuZWw7XG4gIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDogP0hUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zQ2xhc3NMaXN0OiBbXCJtYXJrLWFjdGl2ZVwiXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChrZXJuZWwpID0+IGdldE5hbWUoa2VybmVsKSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoa2VybmVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBnZXROYW1lKGtlcm5lbCk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IChrZXJuZWwpID0+IHtcbiAgICAgICAgY29uc3QgeyBmaWxlUGF0aCwgZWRpdG9yLCBncmFtbWFyIH0gPSBzdG9yZTtcbiAgICAgICAgaWYgKCFmaWxlUGF0aCB8fCAhZWRpdG9yIHx8ICFncmFtbWFyKSByZXR1cm4gdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgc3RvcmUubmV3S2VybmVsKGtlcm5lbCwgZmlsZVBhdGgsIGVkaXRvciwgZ3JhbW1hcik7XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICB9LFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB0aGlzLmNhbmNlbCgpLFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIHJ1bm5pbmcga2VybmVscyBmb3IgdGhpcyBsYW5ndWFnZS5cIixcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RMaXN0Vmlldy5kZXN0cm95KCk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmICh0aGlzLnBhbmVsID09IG51bGwpXG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMuc2VsZWN0TGlzdFZpZXcgfSk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5mb2N1cygpO1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcucmVzZXQoKTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgIH0gZWxzZSBpZiAoc3RvcmUuZmlsZVBhdGggJiYgc3RvcmUuZ3JhbW1hcikge1xuICAgICAgYXdhaXQgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICBpdGVtczogc3RvcmUucnVubmluZ0tlcm5lbHMuZmlsdGVyKChrZXJuZWwpID0+XG4gICAgICAgICAga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hcihrZXJuZWwua2VybmVsU3BlYywgc3RvcmUuZ3JhbW1hcilcbiAgICAgICAgKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWFya2VycyA9IHN0b3JlLm1hcmtlcnM7XG4gICAgICBpZiAobWFya2VycykgbWFya2Vycy5jbGVhcigpO1xuICAgICAgdGhpcy5hdHRhY2goKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==