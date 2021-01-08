Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _output = require("./output");

var _output2 = _interopRequireDefault(_output);

var _utils = require("./../utils");

var WatchStore = (function () {
  var _instanceInitializers = {};

  function WatchStore(kernel) {
    var _this = this;

    _classCallCheck(this, WatchStore);

    this.outputStore = new _output2["default"]();

    _defineDecoratedPropertyDescriptor(this, "run", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setCode", _instanceInitializers);

    this.getCode = function () {
      return _this.editor.getText();
    };

    this.focus = function () {
      _this.editor.element.focus();
    };

    this.kernel = kernel;
    this.editor = atom.workspace.buildTextEditor({
      softWrapped: true,
      lineNumberGutterVisible: false
    });
    var grammar = this.kernel.grammar;
    if (grammar) atom.grammars.assignLanguageMode(this.editor, grammar.scopeName);
    this.editor.moveToTop();
    this.editor.element.classList.add("watch-input");
  }

  _createDecoratedClass(WatchStore, [{
    key: "run",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        var code = _this2.getCode();
        (0, _utils.log)("watchview running:", code);
        if (code && code.length > 0) {
          _this2.kernel.executeWatch(code, function (result) {
            _this2.outputStore.appendOutput(result);
          });
        }
      };
    },
    enumerable: true
  }, {
    key: "setCode",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function (code) {
        _this3.editor.setText(code);
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return WatchStore;
})();

exports["default"] = WatchStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FyY2hpZS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvd2F0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUV1QixNQUFNOztzQkFFTCxVQUFVOzs7O3FCQUNkLFlBQVk7O0lBSVgsVUFBVTs7O0FBTWxCLFdBTlEsVUFBVSxDQU1qQixNQUFjLEVBQUU7OzswQkFOVCxVQUFVOztTQUc3QixXQUFXLEdBQUcseUJBQWlCOzs7Ozs7U0FnQy9CLE9BQU8sR0FBRyxZQUFNO0FBQ2QsYUFBTyxNQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM5Qjs7U0FFRCxLQUFLLEdBQUcsWUFBTTtBQUNaLFlBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM3Qjs7QUFsQ0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQztBQUMzQyxpQkFBVyxFQUFFLElBQUk7QUFDakIsNkJBQXVCLEVBQUUsS0FBSztLQUMvQixDQUFDLENBQUM7QUFDSCxRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNwQyxRQUFJLE9BQU8sRUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25FLFFBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDeEIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztHQUNsRDs7d0JBakJrQixVQUFVOzs7Ozs7YUFvQnZCLFlBQU07QUFDVixZQUFNLElBQUksR0FBRyxPQUFLLE9BQU8sRUFBRSxDQUFDO0FBQzVCLHdCQUFJLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFlBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLGlCQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ3pDLG1CQUFLLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDdkMsQ0FBQyxDQUFDO1NBQ0o7T0FDRjs7Ozs7Ozs7O2FBR1MsVUFBQyxJQUFJLEVBQWE7QUFDMUIsZUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNCOzs7OztTQWpDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvYXJjaGllLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zdG9yZS93YXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gXCJtb2J4XCI7XG5cbmltcG9ydCBPdXRwdXRTdG9yZSBmcm9tIFwiLi9vdXRwdXRcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuLy4uL3V0aWxzXCI7XG5cbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi9rZXJuZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hTdG9yZSB7XG4gIGtlcm5lbDogS2VybmVsO1xuICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcjtcbiAgb3V0cHV0U3RvcmUgPSBuZXcgT3V0cHV0U3RvcmUoKTtcbiAgYXV0b2NvbXBsZXRlRGlzcG9zYWJsZTogP2F0b20kRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihrZXJuZWw6IEtlcm5lbCkge1xuICAgIHRoaXMua2VybmVsID0ga2VybmVsO1xuICAgIHRoaXMuZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHtcbiAgICAgIHNvZnRXcmFwcGVkOiB0cnVlLFxuICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU6IGZhbHNlLFxuICAgIH0pO1xuICAgIGNvbnN0IGdyYW1tYXIgPSB0aGlzLmtlcm5lbC5ncmFtbWFyO1xuICAgIGlmIChncmFtbWFyKVxuICAgICAgYXRvbS5ncmFtbWFycy5hc3NpZ25MYW5ndWFnZU1vZGUodGhpcy5lZGl0b3IsIGdyYW1tYXIuc2NvcGVOYW1lKTtcbiAgICB0aGlzLmVkaXRvci5tb3ZlVG9Ub3AoKTtcbiAgICB0aGlzLmVkaXRvci5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ3YXRjaC1pbnB1dFwiKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgcnVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmdldENvZGUoKTtcbiAgICBsb2coXCJ3YXRjaHZpZXcgcnVubmluZzpcIiwgY29kZSk7XG4gICAgaWYgKGNvZGUgJiYgY29kZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmtlcm5lbC5leGVjdXRlV2F0Y2goY29kZSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICB0aGlzLm91dHB1dFN0b3JlLmFwcGVuZE91dHB1dChyZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIEBhY3Rpb25cbiAgc2V0Q29kZSA9IChjb2RlOiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLmVkaXRvci5zZXRUZXh0KGNvZGUpO1xuICB9O1xuXG4gIGdldENvZGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmdldFRleHQoKTtcbiAgfTtcblxuICBmb2N1cyA9ICgpID0+IHtcbiAgICB0aGlzLmVkaXRvci5lbGVtZW50LmZvY3VzKCk7XG4gIH07XG59XG4iXX0=