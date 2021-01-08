Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require("./utils");

var KernelPicker = (function () {
  function KernelPicker(kernelSpecs) {
    var _this = this;

    _classCallCheck(this, KernelPicker);

    this.kernelSpecs = kernelSpecs;
    this.onConfirmed = null;

    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.display_name;
      },
      elementForItem: function elementForItem(item) {
        var element = document.createElement("li");
        element.textContent = item.display_name;
        return element;
      },
      didConfirmSelection: function didConfirmSelection(item) {
        (0, _utils.log)("Selected kernel:", item);
        if (_this.onConfirmed) _this.onConfirmed(item);
        _this.cancel();
      },
      didCancelSelection: function didCancelSelection() {
        return _this.cancel();
      },
      emptyMessage: "No kernels found"
    });
  }

  _createClass(KernelPicker, [{
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
      } else {
        yield this.selectListView.update({ items: this.kernelSpecs });
        this.attach();
      }
    })
  }]);

  return KernelPicker;
})();

exports["default"] = KernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLXBpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OEJBRTJCLGtCQUFrQjs7OztzQkFDL0IsUUFBUTs7OztxQkFFRixTQUFTOztJQUVSLFlBQVk7QUFNcEIsV0FOUSxZQUFZLENBTW5CLFdBQThCLEVBQUU7OzswQkFOekIsWUFBWTs7QUFPN0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxjQUFjLEdBQUcsZ0NBQW1CO0FBQ3ZDLG9CQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUM7QUFDL0IsV0FBSyxFQUFFLEVBQUU7QUFDVCxzQkFBZ0IsRUFBRSwwQkFBQyxJQUFJO2VBQUssSUFBSSxDQUFDLFlBQVk7T0FBQTtBQUM3QyxvQkFBYyxFQUFFLHdCQUFDLElBQUksRUFBSztBQUN4QixZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLGVBQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUN4QyxlQUFPLE9BQU8sQ0FBQztPQUNoQjtBQUNELHlCQUFtQixFQUFFLDZCQUFDLElBQUksRUFBSztBQUM3Qix3QkFBSSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QixZQUFJLE1BQUssV0FBVyxFQUFFLE1BQUssV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLGNBQUssTUFBTSxFQUFFLENBQUM7T0FDZjtBQUNELHdCQUFrQixFQUFFO2VBQU0sTUFBSyxNQUFNLEVBQUU7T0FBQTtBQUN2QyxrQkFBWSxFQUFFLGtCQUFrQjtLQUNqQyxDQUFDLENBQUM7R0FDSjs7ZUEzQmtCLFlBQVk7O1dBNkJ4QixtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0Qzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdEI7QUFDRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUNqQyxZQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdEMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztPQUN0QztLQUNGOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBQ3ZELFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDM0UsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCOzs7NkJBRVcsYUFBRztBQUNiLFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDdEIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2YsTUFBTTtBQUNMLGNBQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDOUQsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7S0FDRjs7O1NBNURrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC1waWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSBcImF0b20tc2VsZWN0LWxpc3RcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcblxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2VybmVsUGlja2VyIHtcbiAga2VybmVsU3BlY3M6IEFycmF5PEtlcm5lbHNwZWM+O1xuICBvbkNvbmZpcm1lZDogPyhrZXJuZWxTcGVjczogS2VybmVsc3BlYykgPT4gdm9pZDtcbiAgc2VsZWN0TGlzdFZpZXc6IFNlbGVjdExpc3RWaWV3O1xuICBwYW5lbDogP2F0b20kUGFuZWw7XG4gIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDogP0hUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihrZXJuZWxTcGVjczogQXJyYXk8S2VybmVsc3BlYz4pIHtcbiAgICB0aGlzLmtlcm5lbFNwZWNzID0ga2VybmVsU3BlY3M7XG4gICAgdGhpcy5vbkNvbmZpcm1lZCA9IG51bGw7XG5cbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zQ2xhc3NMaXN0OiBbXCJtYXJrLWFjdGl2ZVwiXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSA9PiBpdGVtLmRpc3BsYXlfbmFtZSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gaXRlbS5kaXNwbGF5X25hbWU7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IChpdGVtKSA9PiB7XG4gICAgICAgIGxvZyhcIlNlbGVjdGVkIGtlcm5lbDpcIiwgaXRlbSk7XG4gICAgICAgIGlmICh0aGlzLm9uQ29uZmlybWVkKSB0aGlzLm9uQ29uZmlybWVkKGl0ZW0pO1xuICAgICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4gdGhpcy5jYW5jZWwoKSxcbiAgICAgIGVtcHR5TWVzc2FnZTogXCJObyBrZXJuZWxzIGZvdW5kXCIsXG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcuZGVzdHJveSgpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAodGhpcy5wYW5lbCA9PSBudWxsKVxuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzLnNlbGVjdExpc3RWaWV3IH0pO1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZm9jdXMoKTtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlc2V0KCk7XG4gIH1cblxuICBhc3luYyB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogdGhpcy5rZXJuZWxTcGVjcyB9KTtcbiAgICAgIHRoaXMuYXR0YWNoKCk7XG4gICAgfVxuICB9XG59XG4iXX0=