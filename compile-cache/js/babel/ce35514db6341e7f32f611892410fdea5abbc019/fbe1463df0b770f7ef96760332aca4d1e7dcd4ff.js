Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _wsKernel = require("../../../ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _utils = require("../../../utils");

var basicCommands = [{ name: "Interrupt", value: "interrupt-kernel" }, { name: "Restart", value: "restart-kernel" }, { name: "Shut Down", value: "shutdown-kernel" }];

var wsKernelCommands = [{ name: "Rename session for", value: "rename-kernel" }, { name: "Disconnect from", value: "disconnect-kernel" }];

var SignalListView = (function () {
  function SignalListView(store, handleKernelCommand) {
    var _this = this;

    _classCallCheck(this, SignalListView);

    this.store = store;
    this.handleKernelCommand = handleKernelCommand;
    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.name;
      },
      elementForItem: function elementForItem(item) {
        var element = document.createElement("li");
        element.textContent = item.name;
        return element;
      },
      didConfirmSelection: function didConfirmSelection(item) {
        (0, _utils.log)("Selected command:", item);
        _this.onConfirmed(item);
        _this.cancel();
      },
      didCancelSelection: function didCancelSelection() {
        return _this.cancel();
      },
      emptyMessage: "No running kernels for this file type."
    });
  }

  _createClass(SignalListView, [{
    key: "onConfirmed",
    value: function onConfirmed(kernelCommand) {
      if (this.handleKernelCommand) {
        this.handleKernelCommand(kernelCommand, this.store);
      }
    }
  }, {
    key: "toggle",
    value: _asyncToGenerator(function* () {
      if (this.panel != null) {
        this.cancel();
      }
      if (!this.store) return;
      var kernel = this.store.kernel;
      if (!kernel) return;
      var commands = kernel.transport instanceof _wsKernel2["default"] ? [].concat(basicCommands, wsKernelCommands) : basicCommands;

      var listItems = commands.map(function (command) {
        return {
          name: command.name + " " + kernel.kernelSpec.display_name + " kernel",
          command: command.value
        };
      });

      yield this.selectListView.update({ items: listItems });
      this.attach();
    })
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      this.selectListView.focus();
      this.selectListView.reset();
    }
  }, {
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
  }]);

  return SignalListView;
})();

exports["default"] = SignalListView;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc2VydmljZXMvY29uc3VtZWQvc3RhdHVzLWJhci9zaWduYWwtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs4QkFFMkIsa0JBQWtCOzs7O3dCQUV4QixvQkFBb0I7Ozs7cUJBQ3JCLGdCQUFnQjs7QUFHcEMsSUFBTSxhQUFhLEdBQUcsQ0FDcEIsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxFQUNoRCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQzVDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsQ0FDaEQsQ0FBQzs7QUFFRixJQUFNLGdCQUFnQixHQUFHLENBQ3ZCLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFDdEQsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFFLENBQ3hELENBQUM7O0lBRW1CLGNBQWM7QUFPdEIsV0FQUSxjQUFjLENBT3JCLEtBQVksRUFBRSxtQkFBNkIsRUFBRTs7OzBCQVB0QyxjQUFjOztBQVEvQixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7QUFDL0MsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsb0JBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUMvQixXQUFLLEVBQUUsRUFBRTtBQUNULHNCQUFnQixFQUFFLDBCQUFDLElBQUk7ZUFBSyxJQUFJLENBQUMsSUFBSTtPQUFBO0FBQ3JDLG9CQUFjLEVBQUUsd0JBQUMsSUFBSSxFQUFLO0FBQ3hCLFlBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsZUFBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hDLGVBQU8sT0FBTyxDQUFDO09BQ2hCO0FBQ0QseUJBQW1CLEVBQUUsNkJBQUMsSUFBSSxFQUFLO0FBQzdCLHdCQUFJLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLGNBQUssV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLGNBQUssTUFBTSxFQUFFLENBQUM7T0FDZjtBQUNELHdCQUFrQixFQUFFO2VBQU0sTUFBSyxNQUFNLEVBQUU7T0FBQTtBQUN2QyxrQkFBWSxFQUFFLHdDQUF3QztLQUN2RCxDQUFDLENBQUM7R0FDSjs7ZUEzQmtCLGNBQWM7O1dBNkJ0QixxQkFBQyxhQUFrQyxFQUFFO0FBQzlDLFVBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO0FBQzVCLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3JEO0tBQ0Y7Ozs2QkFFVyxhQUFHO0FBQ2IsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUN0QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjtBQUNELFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU87QUFDeEIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDakMsVUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPO0FBQ3BCLFVBQU0sUUFBUSxHQUNaLE1BQU0sQ0FBQyxTQUFTLGlDQUFvQixhQUM1QixhQUFhLEVBQUssZ0JBQWdCLElBQ3RDLGFBQWEsQ0FBQzs7QUFFcEIsVUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU87ZUFBTTtBQUMzQyxjQUFJLEVBQUssT0FBTyxDQUFDLElBQUksU0FBSSxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksWUFBUztBQUNoRSxpQkFBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1NBQ3ZCO09BQUMsQ0FBQyxDQUFDOztBQUVKLFlBQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztBQUN2RCxVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBQzNFLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDNUIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM3Qjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDdEM7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUN0QixZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3RCO0FBQ0QsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7QUFDakMsWUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3RDLFlBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7T0FDdEM7S0FDRjs7O1NBOUVrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9hcmNoaWUvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3NlcnZpY2VzL2NvbnN1bWVkL3N0YXR1cy1iYXIvc2lnbmFsLWxpc3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBTZWxlY3RMaXN0VmlldyBmcm9tIFwiYXRvbS1zZWxlY3QtbGlzdFwiO1xuXG5pbXBvcnQgV1NLZXJuZWwgZnJvbSBcIi4uLy4uLy4uL3dzLWtlcm5lbFwiO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uLy4uL3N0b3JlXCI7XG5cbmNvbnN0IGJhc2ljQ29tbWFuZHMgPSBbXG4gIHsgbmFtZTogXCJJbnRlcnJ1cHRcIiwgdmFsdWU6IFwiaW50ZXJydXB0LWtlcm5lbFwiIH0sXG4gIHsgbmFtZTogXCJSZXN0YXJ0XCIsIHZhbHVlOiBcInJlc3RhcnQta2VybmVsXCIgfSxcbiAgeyBuYW1lOiBcIlNodXQgRG93blwiLCB2YWx1ZTogXCJzaHV0ZG93bi1rZXJuZWxcIiB9LFxuXTtcblxuY29uc3Qgd3NLZXJuZWxDb21tYW5kcyA9IFtcbiAgeyBuYW1lOiBcIlJlbmFtZSBzZXNzaW9uIGZvclwiLCB2YWx1ZTogXCJyZW5hbWUta2VybmVsXCIgfSxcbiAgeyBuYW1lOiBcIkRpc2Nvbm5lY3QgZnJvbVwiLCB2YWx1ZTogXCJkaXNjb25uZWN0LWtlcm5lbFwiIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduYWxMaXN0VmlldyB7XG4gIHBhbmVsOiA/YXRvbSRQYW5lbDtcbiAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50OiA/SFRNTEVsZW1lbnQ7XG4gIHNlbGVjdExpc3RWaWV3OiBTZWxlY3RMaXN0VmlldztcbiAgc3RvcmU6ID9TdG9yZTtcbiAgaGFuZGxlS2VybmVsQ29tbWFuZDogP0Z1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgaGFuZGxlS2VybmVsQ29tbWFuZDogRnVuY3Rpb24pIHtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kID0gaGFuZGxlS2VybmVsQ29tbWFuZDtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zQ2xhc3NMaXN0OiBbXCJtYXJrLWFjdGl2ZVwiXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSA9PiBpdGVtLm5hbWUsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+IHtcbiAgICAgICAgbG9nKFwiU2VsZWN0ZWQgY29tbWFuZDpcIiwgaXRlbSk7XG4gICAgICAgIHRoaXMub25Db25maXJtZWQoaXRlbSk7XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICB9LFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB0aGlzLmNhbmNlbCgpLFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIHJ1bm5pbmcga2VybmVscyBmb3IgdGhpcyBmaWxlIHR5cGUuXCIsXG4gICAgfSk7XG4gIH1cblxuICBvbkNvbmZpcm1lZChrZXJuZWxDb21tYW5kOiB7IGNvbW1hbmQ6IHN0cmluZyB9KSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZCkge1xuICAgICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kKGtlcm5lbENvbW1hbmQsIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc3RvcmUpIHJldHVybjtcbiAgICBjb25zdCBrZXJuZWwgPSB0aGlzLnN0b3JlLmtlcm5lbDtcbiAgICBpZiAoIWtlcm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbW1hbmRzID1cbiAgICAgIGtlcm5lbC50cmFuc3BvcnQgaW5zdGFuY2VvZiBXU0tlcm5lbFxuICAgICAgICA/IFsuLi5iYXNpY0NvbW1hbmRzLCAuLi53c0tlcm5lbENvbW1hbmRzXVxuICAgICAgICA6IGJhc2ljQ29tbWFuZHM7XG5cbiAgICBjb25zdCBsaXN0SXRlbXMgPSBjb21tYW5kcy5tYXAoKGNvbW1hbmQpID0+ICh7XG4gICAgICBuYW1lOiBgJHtjb21tYW5kLm5hbWV9ICR7a2VybmVsLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lfSBrZXJuZWxgLFxuICAgICAgY29tbWFuZDogY29tbWFuZC52YWx1ZSxcbiAgICB9KSk7XG5cbiAgICBhd2FpdCB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGl0ZW1zOiBsaXN0SXRlbXMgfSk7XG4gICAgdGhpcy5hdHRhY2goKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKHRoaXMucGFuZWwgPT0gbnVsbClcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcy5zZWxlY3RMaXN0VmlldyB9KTtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmZvY3VzKCk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5yZXNldCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIl19