Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _atom = require("atom");

var _watch = require("./watch");

var _watch2 = _interopRequireDefault(_watch);

var _servicesConsumedAutocomplete = require("../services/consumed/autocomplete");

var _servicesConsumedAutocomplete2 = _interopRequireDefault(_servicesConsumedAutocomplete);

var WatchesStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(WatchesStore, [{
    key: "watches",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }], null, _instanceInitializers);

  function WatchesStore(kernel) {
    _classCallCheck(this, WatchesStore);

    _defineDecoratedPropertyDescriptor(this, "watches", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "createWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "addWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "addWatchFromEditor", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "removeWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "run", _instanceInitializers);

    this.kernel = kernel;

    this.kernel.addWatchCallback(this.run);
    if (_servicesConsumedAutocomplete2["default"].isEnabeled) {
      var disposable = new _atom.CompositeDisposable();
      this.autocompleteDisposables = disposable;
      _servicesConsumedAutocomplete2["default"].register(disposable);
    }
    this.addWatch();
  }

  _createDecoratedClass(WatchesStore, [{
    key: "destroy",
    value: function destroy() {
      if (_servicesConsumedAutocomplete2["default"].isEnabeled && this.autocompleteDisposables) _servicesConsumedAutocomplete2["default"].dispose(this.autocompleteDisposables);
    }
  }, {
    key: "createWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this = this;

      return function () {
        var lastWatch = _this.watches[_this.watches.length - 1];
        if (!lastWatch || lastWatch.getCode().trim() !== "") {
          var watch = new _watch2["default"](_this.kernel);
          _this.watches.push(watch);
          if (_servicesConsumedAutocomplete2["default"].isEnabeled) _servicesConsumedAutocomplete2["default"].addAutocompleteToWatch(_this, watch);
          return watch;
        }
        return lastWatch;
      };
    },
    enumerable: true
  }, {
    key: "addWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.createWatch().focus();
      };
    },
    enumerable: true
  }, {
    key: "addWatchFromEditor",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function (editor) {
        if (!editor) return;
        var watchText = editor.getSelectedText();
        if (!watchText) {
          _this3.addWatch();
        } else {
          var watch = _this3.createWatch();
          watch.setCode(watchText);
          watch.run();
        }
      };
    },
    enumerable: true
  }, {
    key: "removeWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this4 = this;

      return function () {
        var watches = _this4.watches.map(function (v, k) {
          return {
            name: v.getCode(),
            value: k
          };
        }).filter(function (obj) {
          return obj.value !== 0 || obj.name !== "";
        });

        var watchesPicker = new _atomSelectList2["default"]({
          items: watches,
          elementForItem: function elementForItem(watch) {
            var element = document.createElement("li");
            element.textContent = watch.name || "<empty>";
            return element;
          },
          didConfirmSelection: function didConfirmSelection(watch) {
            var selectedWatch = _this4.watches[watch.value];
            // This is for cleanup to improve performance
            if (_servicesConsumedAutocomplete2["default"].isEnabeled) _servicesConsumedAutocomplete2["default"].removeAutocompleteFromWatch(_this4, selectedWatch);
            _this4.watches.splice(watch.value, 1);
            modalPanel.destroy();
            watchesPicker.destroy();
            if (_this4.watches.length === 0) _this4.addWatch();else if (previouslyFocusedElement) previouslyFocusedElement.focus();
          },
          filterKeyForItem: function filterKeyForItem(watch) {
            return watch.name;
          },
          didCancelSelection: function didCancelSelection() {
            modalPanel.destroy();
            if (previouslyFocusedElement) previouslyFocusedElement.focus();
            watchesPicker.destroy();
          },
          emptyMessage: "There are no watches to remove!"
        });
        var previouslyFocusedElement = document.activeElement;
        var modalPanel = atom.workspace.addModalPanel({
          item: watchesPicker
        });
        watchesPicker.focus();
      };
    },
    enumerable: true
  }, {
    key: "run",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this5 = this;

      return function () {
        _this5.watches.forEach(function (watch) {
          return watch.run();
        });
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return WatchesStore;
})();

exports["default"] = WatchesStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvd2F0Y2hlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRW1DLE1BQU07OzhCQUNkLGtCQUFrQjs7OztvQkFDVCxNQUFNOztxQkFFbkIsU0FBUzs7Ozs0Q0FDQyxtQ0FBbUM7Ozs7SUFLL0MsWUFBWTs7Ozt3QkFBWixZQUFZOzs7O2FBR0YsRUFBRTs7Ozs7QUFHcEIsV0FOUSxZQUFZLENBTW5CLE1BQWMsRUFBRTswQkFOVCxZQUFZOzs7Ozs7Ozs7Ozs7OztBQU83QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsUUFBSSwwQ0FBcUIsVUFBVSxFQUFFO0FBQ25DLFVBQU0sVUFBVSxHQUFHLCtCQUF5QixDQUFDO0FBQzdDLFVBQUksQ0FBQyx1QkFBdUIsR0FBRyxVQUFVLENBQUM7QUFDMUMsZ0RBQXFCLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMzQztBQUNELFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNqQjs7d0JBaEJrQixZQUFZOztXQWdHeEIsbUJBQUc7QUFDUixVQUFJLDBDQUFxQixVQUFVLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUNqRSwwQ0FBcUIsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzlEOzs7Ozs7O2FBaEZhLFlBQU07QUFDbEIsWUFBTSxTQUFTLEdBQUcsTUFBSyxPQUFPLENBQUMsTUFBSyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUNuRCxjQUFNLEtBQUssR0FBRyx1QkFBZSxNQUFLLE1B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QUM7QUFDSCxxQkFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ3ZCOzs7Ozs7Ozs7YUFHSyxZQUFNO0FBQ1YsZUFBSyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsR0FBRyxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzlDOzs7OztTQTlGa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zdG9yZS93YXRjaGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgYWN0aW9uLCBvYnNlcnZhYmxlIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCBTZWxlY3RMaXN0VmlldyBmcm9tIFwiYXRvbS1zZWxlY3QtbGlzdFwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCBXYXRjaFN0b3JlIGZyb20gXCIuL3dhdGNoXCI7XG5pbXBvcnQgQXV0b2NvbXBsZXRlQ29uc3VtZXIgZnJvbSBcIi4uL3NlcnZpY2VzL2NvbnN1bWVkL2F1dG9jb21wbGV0ZVwiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4vLi4va2VybmVsXCI7XG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuL2luZGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdGNoZXNTdG9yZSB7XG4gIGtlcm5lbDogS2VybmVsO1xuICBAb2JzZXJ2YWJsZVxuICB3YXRjaGVzOiBBcnJheTxXYXRjaFN0b3JlPiA9IFtdO1xuICBhdXRvY29tcGxldGVEaXNwb3NhYmxlczogP2F0b20kQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihrZXJuZWw6IEtlcm5lbCkge1xuICAgIHRoaXMua2VybmVsID0ga2VybmVsO1xuXG4gICAgdGhpcy5rZXJuZWwuYWRkV2F0Y2hDYWxsYmFjayh0aGlzLnJ1bik7XG4gICAgaWYgKEF1dG9jb21wbGV0ZUNvbnN1bWVyLmlzRW5hYmVsZWQpIHtcbiAgICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgICAgdGhpcy5hdXRvY29tcGxldGVEaXNwb3NhYmxlcyA9IGRpc3Bvc2FibGU7XG4gICAgICBBdXRvY29tcGxldGVDb25zdW1lci5yZWdpc3RlcihkaXNwb3NhYmxlKTtcbiAgICB9XG4gICAgdGhpcy5hZGRXYXRjaCgpO1xuICB9XG5cbiAgQGFjdGlvblxuICBjcmVhdGVXYXRjaCA9ICgpID0+IHtcbiAgICBjb25zdCBsYXN0V2F0Y2ggPSB0aGlzLndhdGNoZXNbdGhpcy53YXRjaGVzLmxlbmd0aCAtIDFdO1xuICAgIGlmICghbGFzdFdhdGNoIHx8IGxhc3RXYXRjaC5nZXRDb2RlKCkudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICBjb25zdCB3YXRjaCA9IG5ldyBXYXRjaFN0b3JlKHRoaXMua2VybmVsKTtcbiAgICAgIHRoaXMud2F0Y2hlcy5wdXNoKHdhdGNoKTtcbiAgICAgIGlmIChBdXRvY29tcGxldGVDb25zdW1lci5pc0VuYWJlbGVkKVxuICAgICAgICBBdXRvY29tcGxldGVDb25zdW1lci5hZGRBdXRvY29tcGxldGVUb1dhdGNoKHRoaXMsIHdhdGNoKTtcbiAgICAgIHJldHVybiB3YXRjaDtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RXYXRjaDtcbiAgfTtcblxuICBAYWN0aW9uXG4gIGFkZFdhdGNoID0gKCkgPT4ge1xuICAgIHRoaXMuY3JlYXRlV2F0Y2goKS5mb2N1cygpO1xuICB9O1xuXG4gIEBhY3Rpb25cbiAgYWRkV2F0Y2hGcm9tRWRpdG9yID0gKGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yKSA9PiB7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybjtcbiAgICBjb25zdCB3YXRjaFRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCk7XG4gICAgaWYgKCF3YXRjaFRleHQpIHtcbiAgICAgIHRoaXMuYWRkV2F0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgd2F0Y2ggPSB0aGlzLmNyZWF0ZVdhdGNoKCk7XG4gICAgICB3YXRjaC5zZXRDb2RlKHdhdGNoVGV4dCk7XG4gICAgICB3YXRjaC5ydW4oKTtcbiAgICB9XG4gIH07XG5cbiAgQGFjdGlvblxuICByZW1vdmVXYXRjaCA9ICgpID0+IHtcbiAgICBjb25zdCB3YXRjaGVzID0gdGhpcy53YXRjaGVzXG4gICAgICAubWFwKCh2LCBrKSA9PiAoe1xuICAgICAgICBuYW1lOiB2LmdldENvZGUoKSxcbiAgICAgICAgdmFsdWU6IGssXG4gICAgICB9KSlcbiAgICAgIC5maWx0ZXIoKG9iaikgPT4gb2JqLnZhbHVlICE9PSAwIHx8IG9iai5uYW1lICE9PSBcIlwiKTtcblxuICAgIGNvbnN0IHdhdGNoZXNQaWNrZXIgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXM6IHdhdGNoZXMsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogKHdhdGNoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSB3YXRjaC5uYW1lIHx8IFwiPGVtcHR5PlwiO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH0sXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiAod2F0Y2gpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRXYXRjaCA9IHRoaXMud2F0Y2hlc1t3YXRjaC52YWx1ZV07XG4gICAgICAgIC8vIFRoaXMgaXMgZm9yIGNsZWFudXAgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgICAgICBpZiAoQXV0b2NvbXBsZXRlQ29uc3VtZXIuaXNFbmFiZWxlZClcbiAgICAgICAgICBBdXRvY29tcGxldGVDb25zdW1lci5yZW1vdmVBdXRvY29tcGxldGVGcm9tV2F0Y2godGhpcywgc2VsZWN0ZWRXYXRjaCk7XG4gICAgICAgIHRoaXMud2F0Y2hlcy5zcGxpY2Uod2F0Y2gudmFsdWUsIDEpO1xuICAgICAgICBtb2RhbFBhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgd2F0Y2hlc1BpY2tlci5kZXN0cm95KCk7XG4gICAgICAgIGlmICh0aGlzLndhdGNoZXMubGVuZ3RoID09PSAwKSB0aGlzLmFkZFdhdGNoKCk7XG4gICAgICAgIGVsc2UgaWYgKHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9LFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogKHdhdGNoKSA9PiB3YXRjaC5uYW1lLFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIG1vZGFsUGFuZWwuZGVzdHJveSgpO1xuICAgICAgICBpZiAocHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgd2F0Y2hlc1BpY2tlci5kZXN0cm95KCk7XG4gICAgICB9LFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIlRoZXJlIGFyZSBubyB3YXRjaGVzIHRvIHJlbW92ZSFcIixcbiAgICB9KTtcbiAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGNvbnN0IG1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcbiAgICAgIGl0ZW06IHdhdGNoZXNQaWNrZXIsXG4gICAgfSk7XG4gICAgd2F0Y2hlc1BpY2tlci5mb2N1cygpO1xuICB9O1xuXG4gIEBhY3Rpb25cbiAgcnVuID0gKCkgPT4ge1xuICAgIHRoaXMud2F0Y2hlcy5mb3JFYWNoKCh3YXRjaCkgPT4gd2F0Y2gucnVuKCkpO1xuICB9O1xuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKEF1dG9jb21wbGV0ZUNvbnN1bWVyLmlzRW5hYmVsZWQgJiYgdGhpcy5hdXRvY29tcGxldGVEaXNwb3NhYmxlcylcbiAgICAgIEF1dG9jb21wbGV0ZUNvbnN1bWVyLmRpc3Bvc2UodGhpcy5hdXRvY29tcGxldGVEaXNwb3NhYmxlcyk7XG4gIH1cbn1cbiJdfQ==